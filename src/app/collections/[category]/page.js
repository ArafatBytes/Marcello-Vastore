"use client";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CategoryLayout } from "@/components/category/CategoryLayout";
import React from "react";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Map URL paths to API parameters
const CATEGORY_MAPPING = {
  // Atlier 1 Collections
  "atlier-1-shirts": {
    collection: "Atlier 1",
    category: "Shirts",
    title: "Shirts",
    description:
      "Explore our exclusive collection of shirts. Handcrafted with premium materials and attention to detail.",
  },
  "atlier-1-pants-shorts": {
    collection: "Atlier 1",
    category: "Pants & Shorts",
    title: "Pants & Shorts",
    description:
      "Discover our premium collection of pants and shorts. Perfect for any occasion.",
  },
  "atlier-1-co-ord-capsule": {
    collection: "Atlier 1",
    category: "Co-Ord Capsule",
    title: "Co-Ord Capsule",
    description:
      "Explore our coordinated capsule collection. Perfectly matched sets for a complete look.",
  },
  "atlier-1-lustralis-estate": {
    collection: "Atlier 1",
    category: "Lustralis Estate",
    title: "Lustralis Estate",
    description:
      "Exclusive Lustralis Estate collection. Premium quality for the discerning customer.",
  },

  // Atlier 2 Collections
  "atlier-2-dresses": {
    collection: "Atlier 2",
    category: "Dresses",
    title: "Dresses",
    description:
      "Discover our elegant collection of dresses. Perfect for any occasion, from casual to formal.",
  },
  "atlier-2-tops": {
    collection: "Atlier 2",
    category: "Tops",
    title: "Tops",
    description:
      "Explore our stylish collection of tops. Versatile pieces to complete any outfit.",
  },
  "atlier-2-skirts": {
    collection: "Atlier 2",
    category: "Skirts",
    title: "Skirts",
    description:
      "Find your perfect skirt in our curated collection. From mini to maxi, we have it all.",
  },
  "atlier-2-co-ord-capsule": {
    collection: "Atlier 2",
    category: "Co-Ord Capsule",
    title: "Co-Ord Capsule",
    description:
      "Discover our coordinated capsule collection. Perfectly matched sets for a complete look.",
  },
  "atlier-2-riviera-vastore": {
    collection: "Atlier 2",
    category: "Riviera Vastore",
    title: "Riviera Vastore",
    description:
      "Exclusive Riviera Vastore collection. Premium quality with a touch of elegance.",
  },
};

export default function CategoryPage({ params }) {
  const { category } = params;
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Get category data from mapping or use fallback
  const categoryData = CATEGORY_MAPPING[category] || {
    title: category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: `Explore our exclusive collection of ${category.replace(
      /-/g,
      " "
    )}.`,
    collection: "Atlier 1",
    category: category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  };

  // Fetch products when category changes
  React.useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { collection, category: cat } = CATEGORY_MAPPING[category] || {
          collection: "Atlier 1",
          category: category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        };

        const url = `/api/products?collection=${encodeURIComponent(
          collection
        )}&category=${encodeURIComponent(cat)}`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!signal.aborted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching products:", err);
          setError("Failed to load products. Please try again later.");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [category]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : loading ? (
          <CategoryLayout
            title={categoryData.title}
            description={categoryData.description}
            products={[]}
            loading={true}
          />
        ) : (
          <CategoryLayout
            title={categoryData.title}
            description={categoryData.description}
            products={products}
          />
        )}
      </main>
    </div>
  );
}
