import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

// Helper function to parse form data
async function parseFormData(request) {
  const formData = await request.formData();
  const body = {};
  const imageFile = formData.get("image");
  const additionalImageFiles = formData.getAll("additionalImages");

  // Convert FormData entries to object
  for (const [key, value] of formData.entries()) {
    if (key !== "image" && key !== "additionalImages") {
      if (key === "existingAdditionalImages") {
        body[key] = value; // Keep as string to parse later
      } else {
        try {
          // Try to parse JSON strings
          body[key] = JSON.parse(value);
        } catch {
          // If parsing fails, use the original value
          body[key] = value;
        }
      }
    }
  }

  return { ...body, imageFile, additionalImages: additionalImageFiles };
}

// PATCH: Edit a product (admin only)
export async function PATCH(request) {
  try {
    const formData = await parseFormData(request);
    const {
      _id,
      name,
      price,
      imageFile,
      reference,
      description,
      sizes,
      colors,
      productDetails,
      sizeFit,
      additionalImages,
    } = formData;

    if (!_id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const products = db.collection("products");

    // Get existing product to handle image deletion if needed
    const existingProduct = await products.findOne({
      _id: new (await import("mongodb")).ObjectId(_id),
    });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const update = { updatedAt: new Date() };
    if (name) update.name = name;
    if (price) update.price = parseFloat(price);
    if (reference) update.reference = reference;
    if (description) update.description = description;
    update.sizes = Array.isArray(sizes) ? sizes : [];
    update.colors = Array.isArray(colors) ? colors : [];
    if (productDetails) update.productDetails = productDetails;
    if (sizeFit) update.sizeFit = sizeFit;

    // Handle new main image upload if provided
    let mainImageUrl = existingProduct.image;
    if (imageFile && imageFile.size > 0) {
      // Convert file to base64 for Cloudinary
      const buffer = await imageFile.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString("base64");
      const dataUri = `data:${imageFile.type};base64,${base64Data}`;

      // Upload new image to Cloudinary
      mainImageUrl = await uploadImage(dataUri);
      update.image = mainImageUrl;

      // Delete old image from Cloudinary if it exists and it's different
      if (existingProduct.image && existingProduct.image !== mainImageUrl) {
        try {
          const publicId = existingProduct.image.split("/").pop().split(".")[0];
          await deleteImage(publicId);
        } catch (error) {
          console.error("Error deleting old image from Cloudinary:", error);
          // Continue even if deletion fails
        }
      }
    }

    // Handle additional images array
    const imageUrls = [];

    // Add existing additional images if provided
    try {
      if (formData.existingAdditionalImages) {
        const existingImages = JSON.parse(formData.existingAdditionalImages);
        if (Array.isArray(existingImages)) {
          imageUrls.push(...existingImages);
        }
      }
    } catch (error) {
      console.error("Error parsing existing additional images:", error);
    }

    // Process new additional images if provided
    if (Array.isArray(additionalImages)) {
      for (const file of additionalImages) {
        if (file && file instanceof Blob && file.size > 0) {
          try {
            const imgBuffer = await file.arrayBuffer();
            const imgBase64 = Buffer.from(imgBuffer).toString("base64");
            const imgDataUri = `data:${file.type};base64,${imgBase64}`;
            const imgUrl = await uploadImage(imgDataUri);
            imageUrls.push(imgUrl);
          } catch (error) {
            console.error("Error uploading additional image:", error);
          }
        }
      }
    }

    // Set the updated images array
    update.images = imageUrls;

    const result = await products.updateOne(
      { _id: new (await import("mongodb")).ObjectId(_id) },
      { $set: update }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove a product (admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("id");

    if (!_id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const products = db.collection("products");

    // Get product to delete its image from Cloudinary
    const product = await products.findOne({
      _id: new (await import("mongodb")).ObjectId(_id),
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (product.image) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await deleteImage(publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete product from database
    const result = await products.deleteOne({
      _id: new (await import("mongodb")).ObjectId(_id),
    });

    if (!result.deletedCount) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Add a new product (admin only)
export async function POST(request) {
  try {
    const formData = await parseFormData(request);
    const {
      name,
      price,
      collection: collectionName,
      category,
      imageFile,
      reference,
      description,
      sizes,
      colors,
      productDetails,
      sizeFit,
      additionalImages,
    } = formData;

    if (!name || !price || !collectionName || !category || !imageFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert main image file to base64 for Cloudinary
    const buffer = await imageFile.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64Data}`;

    // Upload main image to Cloudinary
    const mainImageUrl = await uploadImage(dataUri);

    // Upload additional images if provided
    const imageUrls = [mainImageUrl];
    if (Array.isArray(additionalImages) && additionalImages.length > 0) {
      for (const file of additionalImages) {
        if (file && file instanceof Blob) {
          const imgBuffer = await file.arrayBuffer();
          const imgBase64 = Buffer.from(imgBuffer).toString("base64");
          const imgDataUri = `data:${file.type};base64,${imgBase64}`;
          const imgUrl = await uploadImage(imgDataUri);
          imageUrls.push(imgUrl);
        }
      }
    }

    const client = await clientPromise;
    const db = client.db();
    const products = db.collection("products");

    const productDoc = {
      name,
      price: parseFloat(price),
      image: mainImageUrl,
      images: imageUrls,
      reference: reference || "",
      description: description || "",
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: Array.isArray(colors) ? colors : [],
      productDetails: productDetails || "",
      sizeFit: sizeFit || "",
      collection: collectionName,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await products.insertOne(productDoc);

    return NextResponse.json({
      success: true,
      product: {
        _id: result.insertedId,
        ...productDoc,
      },
    });
  } catch (err) {
    console.error("Product POST error:", err);
    return NextResponse.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}

// GET: List all products (optionally by collection/category)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");
    const category = searchParams.get("category");
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection("products");
    const filter = {};
    if (collection) filter.collection = collection;
    if (category) filter.category = category;
    const docs = await products.find(filter).toArray();
    return NextResponse.json({ products: docs });
  } catch (err) {
    console.error("Product GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
