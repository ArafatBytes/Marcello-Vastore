"use client";
import { useState, useEffect } from "react";
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { toast } from "react-hot-toast";

// Helper function to determine if a color is light
function isColorLight(hex) {
  // Handle invalid input
  if (!hex || typeof hex !== "string") {
    return true; // Default to light for invalid colors
  }

  try {
    // Remove hash if present and ensure valid hex
    hex = hex.replace(/^#/, "");

    // Ensure we have a valid 6-digit hex
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return true; // Default to light for invalid format
    }

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if color is light
    return luminance > 0.5;
  } catch (error) {
    console.error("Error processing color:", error);
    return true; // Default to light in case of error
  }
}
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Minus, Plus, Check } from "lucide-react";

// Helper function to generate collection URL
function generateCollectionUrl(collection, category) {
  if (!collection || !category) return "/";

  // Convert "Atlier 1" to "atlier-1" and "Pants & Shorts" to "pants-shorts"
  const collectionSlug = collection.toLowerCase().replace(/\s+/g, "-");
  const categorySlug = category
    .toLowerCase()
    .replace(/\s*&\s*/g, "-") // Replace & with -
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Remove duplicate hyphens

  return `/collections/${collectionSlug}-${categorySlug}`;
}

export default function ProductDetails({ product }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // Initialize with main image if available
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState("");
  const [buttonState, setButtonState] = useState("normal"); // normal, adding, added
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToRecentlyViewed, recentlyViewed } = useRecentlyViewed();

  // Check if product is in favorites
  const isWishlisted = isFavorite(product._id);

  // Reset state when product changes (for navigation between products)
  useEffect(() => {
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
    setCurrentImage(0);
    setError("");
    setButtonState("normal");
    // Scroll to top when product changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product._id]);

  // Add product to recently viewed when component mounts or product changes
  useEffect(() => {
    if (product && product._id) {
      addToRecentlyViewed(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id, addToRecentlyViewed]);

  // Fetch related products based on collection and category
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product._id) return;

      setLoadingRelated(true);
      try {
        const params = new URLSearchParams({
          productId: product._id,
          limit: "4",
        });

        if (product.collection) {
          params.append("collection", product.collection);
        }
        if (product.category) {
          params.append("category", product.category);
        }

        const response = await fetch(`/api/products/related?${params}`);
        if (response.ok) {
          const data = await response.json();
          setRelatedProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product._id, product.collection, product.category]);

  // Ensure main image is always first
  const allImages = React.useMemo(() => {
    if (!product.images || product.images.length === 0) {
      return ["/placeholder-product.jpg"];
    }
    return product.images;
  }, [product.images]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    // Clear any previous errors
    setError("");

    // Validate size and color selection
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    if (!selectedColor) {
      setError("Please select a color");
      return;
    }

    setButtonState("adding");

    try {
      // Add to cart
      addToCart(product, selectedSize, selectedColor, quantity);

      // Show success feedback
      setError("");
      setButtonState("added");

      // Trigger cart animation
      triggerCartAnimation();

      // Reset quantity to 1 after adding to cart
      setQuantity(1);

      // Reset button after 1 second
      setTimeout(() => {
        setButtonState("normal");
      }, 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add item to cart. Please try again.");
      setButtonState("normal");
    }
  };

  // Function to trigger cart animation
  const triggerCartAnimation = () => {
    // Create a temporary element that animates to the cart
    const productImage = document.querySelector(".product-main-image");
    const cartIcon = document.querySelector(".cart-icon");

    if (productImage && cartIcon) {
      const tempElement = document.createElement("div");
      tempElement.className = "cart-animation-item";
      tempElement.style.cssText = `
        position: fixed;
        width: 60px;
        height: 60px;
        background-image: url('${allImages[currentImage]}');
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        z-index: 9999;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `;

      // Get positions
      const productRect = productImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      // Set initial position
      tempElement.style.left = productRect.left + "px";
      tempElement.style.top = productRect.top + "px";

      document.body.appendChild(tempElement);

      // Animate to cart
      setTimeout(() => {
        tempElement.style.left = cartRect.left + "px";
        tempElement.style.top = cartRect.top + "px";
        tempElement.style.transform = "scale(0.3)";
        tempElement.style.opacity = "0.8";
      }, 50);

      // Remove element after animation
      setTimeout(() => {
        document.body.removeChild(tempElement);
      }, 900);
    }
  };

  // Get recently viewed products from context (excluding current product)
  const filteredRecentlyViewed = recentlyViewed.filter(
    (item) => item._id !== product._id
  );

  return (
    <div className="w-full">
      <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="relative aspect-square mb-4">
              <Image
                src={allImages[currentImage]}
                alt={product.name}
                fill
                className="object-cover product-main-image"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-square ${
                    currentImage === index ? "ring-2 ring-black" : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-light mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">Ref. {product.reference}</p>
              </div>
              <button
                onClick={() => {
                  const isCurrentlyFavorited = isWishlisted;
                  toggleFavorite(product);
                  toast.success(
                    isCurrentlyFavorited
                      ? "Removed from favorites"
                      : "Added to favorites"
                  );
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">4.0 (1)</span>
            </div>

            <div className="mb-8">
              <p className="text-2xl font-medium mb-6">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Size Selector */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">SIZE</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-8">
                <p className="text-sm font-medium mb-3">COLOR</p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedColor?.name === color.name
                          ? "ring-2 ring-offset-2 ring-black"
                          : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <Check
                          className={`w-5 h-5 ${
                            isColorLight(color.hex)
                              ? "text-black"
                              : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={buttonState !== "normal"}
                  className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {buttonState === "adding" && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {buttonState === "added" && <Check className="w-4 h-4" />}
                  {buttonState === "adding"
                    ? "ADDING..."
                    : buttonState === "added"
                    ? "ADDED"
                    : "ADD TO BAG"}
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6">
                <div className="mb-6">
                  <h3 className="font-medium mb-2">PRODUCT DETAILS</h3>
                  <p className="text-gray-700">{product.details}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">SIZE & FIT</h3>
                  <p className="text-gray-700">{product.sizeFit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      {filteredRecentlyViewed.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-xl font-medium mb-6">RECENTLY VIEWED</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredRecentlyViewed.map((item) => (
                <Link
                  key={item._id}
                  href={`/product/${item._id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4.5] mb-2 overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* You May Also Like Section - Related Products */}
      {(relatedProducts.length > 0 || loadingRelated) && (
        <div className="bg-gray-50 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-2xl font-light mb-2">YOU MAY ALSO LIKE</h2>
                <p className="text-gray-600 max-w-md">
                  Discover more products that match your style
                </p>
              </div>
              <Link
                href={generateCollectionUrl(
                  product.collection,
                  product.category
                )}
                className="border border-black px-6 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors"
              >
                VIEW MORE
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {loadingRelated
                ? // Loading skeleton
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="relative aspect-[3/4.5] mb-3 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
                : relatedProducts.map((item) => (
                    <Link
                      key={item._id}
                      href={`/product/${item._id}`}
                      className="group"
                    >
                      <div className="relative aspect-[3/4.5] mb-3 overflow-hidden bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
