import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const auth = request.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = auth.split(" ")[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email: payload.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Return only safe fields
    return NextResponse.json({
      user: {
        name:
          (user.firstName || "") + (user.lastName ? " " + user.lastName : ""),
        email: user.email,
        phone: user.phone,
        billingName: user.billingName || user.name,
        billingAddress: user.billingAddress || user.shippingAddress,
        shippingName: user.shippingName || user.name,
        shippingAddress: user.shippingAddress || "",
        newsletter:
          typeof user.newsletter === "boolean" ? user.newsletter : false,
      },
    });
  } catch (error) {
    console.error("Account API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
