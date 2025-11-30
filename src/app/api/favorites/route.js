import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

// GET: Retrieve user's favorites from database
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const favorites = db.collection("favorites");

    const userFavorites = await favorites.findOne({ userId });

    if (!userFavorites) {
      // Return empty favorites if none exists
      return NextResponse.json({
        favorites: {
          items: [],
          totalItems: 0,
        },
      });
    }

    return NextResponse.json({ favorites: userFavorites.favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST: Save user's favorites to database
export async function POST(request) {
  try {
    const { userId, favorites } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const favoritesCollection = db.collection("favorites");

    // Upsert the favorites (update if exists, create if doesn't)
    await favoritesCollection.updateOne(
      { userId },
      {
        $set: {
          userId,
          favorites,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving favorites:", error);
    return NextResponse.json(
      { error: "Failed to save favorites" },
      { status: 500 }
    );
  }
}

// DELETE: Clear user's favorites from database
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const favoritesCollection = db.collection("favorites");

    await favoritesCollection.deleteOne({ userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing favorites:", error);
    return NextResponse.json(
      { error: "Failed to clear favorites" },
      { status: 500 }
    );
  }
}
