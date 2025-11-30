"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const RecentlyViewedContext = createContext();

const MAX_RECENTLY_VIEWED = 8; // Maximum number of products to store

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load recently viewed from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("recently-viewed");
        if (saved) {
          const parsed = JSON.parse(saved);
          setRecentlyViewed(parsed);
        }
      } catch (error) {
        console.error("Error loading recently viewed:", error);
      }
    }
  }, []);

  // Save to sessionStorage whenever recentlyViewed changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "recently-viewed",
          JSON.stringify(recentlyViewed)
        );
      } catch (error) {
        console.error("Error saving recently viewed:", error);
      }
    }
  }, [recentlyViewed]);

  // Add a product to recently viewed - wrapped in useCallback to prevent infinite loops
  const addToRecentlyViewed = useCallback((product) => {
    if (!product || !product._id) return;

    setRecentlyViewed((prev) => {
      // Create a simplified product object for storage
      const viewedProduct = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || product.mainImage || product.images?.[0],
        reference: product.reference,
      };

      // Remove if already exists (to move it to the front)
      const filtered = prev.filter((item) => item._id !== product._id);

      // Add to the front and limit to MAX_RECENTLY_VIEWED
      return [viewedProduct, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []); // Empty dependency array since it only uses setRecentlyViewed (which is stable)

  // Clear all recently viewed - wrapped in useCallback
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("recently-viewed");
    }
  }, []);

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error(
      "useRecentlyViewed must be used within RecentlyViewedProvider"
    );
  }
  return context;
}
