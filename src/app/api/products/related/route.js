import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

// GET: Retrieve related products based on collection and category
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const collection = searchParams.get("collection");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "4", 10);

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const productsCollection = db.collection("products");

    // Build query to find related products
    // Priority: 1. Same collection AND category, 2. Same collection, 3. Same category
    const queries = [];

    // Query 1: Same collection AND category (highest priority)
    if (collection && category) {
      queries.push({
        _id: { $ne: new ObjectId(productId) },
        collection: collection,
        category: category,
      });
    }

    // Query 2: Same collection only
    if (collection) {
      queries.push({
        _id: { $ne: new ObjectId(productId) },
        collection: collection,
      });
    }

    // Query 3: Same category only
    if (category) {
      queries.push({
        _id: { $ne: new ObjectId(productId) },
        category: category,
      });
    }

    // Query 4: Fallback to any products
    queries.push({
      _id: { $ne: new ObjectId(productId) },
    });

    let relatedProducts = [];

    // Try each query in order of priority until we get enough products
    for (const query of queries) {
      if (relatedProducts.length >= limit) break;

      const products = await productsCollection
        .find(query)
        .limit(limit * 2) // Fetch more for randomization
        .toArray();

      // Add products that aren't already in the list
      for (const product of products) {
        if (
          !relatedProducts.find(
            (p) => p._id.toString() === product._id.toString()
          )
        ) {
          relatedProducts.push(product);
          if (relatedProducts.length >= limit * 2) break;
        }
      }
    }

    // Randomly shuffle the products for variety
    relatedProducts = relatedProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    // Format products for response
    const formattedProducts = relatedProducts.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.image || product.mainImage || product.images?.[0],
      collection: product.collection,
      category: product.category,
      reference: product.reference,
    }));

    return NextResponse.json({
      products: formattedProducts,
      count: formattedProducts.length,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
