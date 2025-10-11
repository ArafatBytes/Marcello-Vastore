import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

// Helper function to parse form data
async function parseFormData(request) {
  const formData = await request.formData();
  const body = {};
  
  // Handle main image (could be 'image' or 'mainImage')
  const mainImageFile = formData.get("mainImage") || formData.get("image");
  
  // Handle additional images (multiple formats)
  const additionalImageFiles = [];
  
  // Get all additional images with different naming patterns
  const allAdditionalImages = formData.getAll("additionalImages");
  additionalImageFiles.push(...allAdditionalImages);
  
  // Also check for numbered additional images (additionalImage_0, additionalImage_1, etc.)
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("additionalImage_") && value instanceof File) {
      additionalImageFiles.push(value);
    }
  }

  // Convert FormData entries to object
  for (const [key, value] of formData.entries()) {
    if (key !== "image" && key !== "mainImage" && key !== "additionalImages" && !key.startsWith("additionalImage_")) {
      if (key === "existingAdditionalImages" || key === "existingMainImage") {
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

  return { ...body, imageFile: mainImageFile, additionalImages: additionalImageFiles };
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
      details,
      sizes,
      colors,
      sizeFit,
      additionalImages,
      existingMainImage,
      existingAdditionalImages,
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
    if (details) update.details = details;
    if (sizeFit) update.sizeFit = sizeFit;
    update.sizes = Array.isArray(sizes) ? sizes : [];
    update.colors = Array.isArray(colors) ? colors : [];

    // Handle main image
    let mainImageUrl = existingProduct.image;
    
    if (imageFile && imageFile.size > 0) {
      // New image file uploaded
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
        }
      }
    } else if (existingMainImage) {
      // Keep existing main image
      update.image = existingMainImage;
    }

    // Handle additional images array
    let additionalImageUrls = [];

    // Add existing additional images if provided
    if (existingAdditionalImages) {
      try {
        const existingImages = JSON.parse(existingAdditionalImages);
        if (Array.isArray(existingImages)) {
          additionalImageUrls.push(...existingImages);
        }
      } catch (error) {
        console.error("Error parsing existing additional images:", error);
        // Fallback to existing additional images from database
        additionalImageUrls = existingProduct.additionalImages || [];
      }
    } else if (!additionalImages?.length) {
      // If no new images and no existing images specified, keep current additional images
      additionalImageUrls = existingProduct.additionalImages || [];
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
            additionalImageUrls.push(imgUrl);
          } catch (error) {
            console.error("Error uploading additional image:", error);
          }
        }
      }
    }

    // Set the updated additional images array
    update.additionalImages = additionalImageUrls;

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

    // Delete main image from Cloudinary if it exists
    if (product.image) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await deleteImage(publicId);
      } catch (error) {
        console.error("Error deleting main image from Cloudinary:", error);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete additional images from Cloudinary if they exist
    if (product.additionalImages && Array.isArray(product.additionalImages)) {
      for (const imageUrl of product.additionalImages) {
        try {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await deleteImage(publicId);
        } catch (error) {
          console.error("Error deleting additional image from Cloudinary:", error);
          // Continue with deletion even if some images fail to delete
        }
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
      details,
      sizes,
      colors,
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
    const additionalImageUrls = [];
    if (Array.isArray(additionalImages) && additionalImages.length > 0) {
      for (const file of additionalImages) {
        if (file && file instanceof Blob) {
          const imgBuffer = await file.arrayBuffer();
          const imgBase64 = Buffer.from(imgBuffer).toString("base64");
          const imgDataUri = `data:${file.type};base64,${imgBase64}`;
          const imgUrl = await uploadImage(imgDataUri);
          additionalImageUrls.push(imgUrl);
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
      additionalImages: additionalImageUrls,
      reference: reference || "",
      description: description || "",
      details: details || "",
      sizeFit: sizeFit || "",
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: Array.isArray(colors) ? colors : [],
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
