import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve user's cart from database
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const carts = db.collection("carts");

    const userCart = await carts.findOne({ userId });

    if (!userCart) {
      // Return empty cart if none exists
      return NextResponse.json({
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      });
    }

    return NextResponse.json({ cart: userCart.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST: Save user's cart to database
export async function POST(request) {
  try {
    const { userId, cart } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const carts = db.collection("carts");

    // Upsert the cart (update if exists, create if doesn't)
    await carts.updateOne(
      { userId },
      {
        $set: {
          userId,
          cart,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json(
      { error: "Failed to save cart" },
      { status: 500 }
    );
  }
}

// DELETE: Clear user's cart from database
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const carts = db.collection("carts");

    await carts.deleteOne({ userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
