"use client";
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { recentlyViewed } = useRecentlyViewed();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const jwt = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
      setIsLoggedIn(!!jwt);
    };

    checkLoginStatus();

    // Listen for auth state changes
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("custom-login", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("custom-login", checkLoginStatus);
    };
  }, []);

  const handleRemoveFavorite = (item) => {
    toggleFavorite(item);
  };

  return (
    <PageLayout title="">
      <div className="max-w-3xl mx-auto pt-10 pb-16 px-4 relative">
        <h1 className="text-xl font-semibold mb-8">Favorites</h1>

        <div className="mb-14">
          {/* Show empty state message only when no favorites */}
          {favorites.totalItems === 0 && (
            <p className="text-gray-400 mb-8">Your wishlist is empty</p>
          )}

          {/* Display favorites items in a grid when there are items */}
          {favorites.totalItems > 0 && (
            <div className="grid grid-cols-4 gap-1.5 mb-8">
              {favorites.items.map((item) => (
                <div key={item._id} className="relative group">
                  <Link href={`/product/${item._id}`}>
                    <div className="aspect-[3/4.5] bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={220}
                        height={330}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </Link>
                  {/* Remove button on hover */}
                  <button
                    onClick={() => handleRemoveFavorite(item)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                  {/* Product info */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show login/register buttons when not logged in */}
          {!isLoggedIn && (
            <>
              <p className="text-xs text-gray-400 mb-4">
                If you want to view your wishlist later
              </p>
              <div className="flex flex-col gap-4 mb-8">
                <Link
                  href="/login"
                  className="block w-full text-center bg-black text-white py-3 text-base tracking-widest font-medium uppercase mb-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center bg-black text-white py-3 text-base tracking-widest font-medium uppercase"
                >
                  Create an Account
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Recently viewed section */}
        <div className="mt-10">
          <h2 className="text-base font-normal mb-6">Recently viewed</h2>
          {recentlyViewed.length > 0 ? (
            <div className="grid grid-cols-4 gap-1.5">
              {recentlyViewed.map((item) => (
                <Link key={item._id} href={`/product/${item._id}`}>
                  <div className="group">
                    <div className="aspect-[3/4.5] bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={220}
                        height={330}
                        className="object-cover w-full h-full group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                    {/* Product info */}
                    <div className="mt-2">
                      <p className="text-sm text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              You haven&apos;t visited any product yet. Check out our products.
              Hurry up!
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
