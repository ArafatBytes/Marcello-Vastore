"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const ADMIN_TABS = [
  { key: "products", label: "Product Updates" },
  { key: "orders", label: "User Shopping History" },
  { key: "payments", label: "Payment History" },
  { key: "users", label: "Users Management" },
];

const COLLECTIONS = [
  {
    name: "Atlier 1",
    categories: [
      "Shirts",
      "Pants & Shorts",
      "Co-Ord Capsule",
      "Lustralis Estate",
    ],
  },
  {
    name: "Atlier 2",
    categories: [
      "Dresses",
      "Tops",
      "Skirts",
      "Co-Ord Capsule",
      "Riviera Vastore",
    ],
  },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [activeCollection, setActiveCollection] = useState(COLLECTIONS[0].name);
  const [activeCategory, setActiveCategory] = useState(
    COLLECTIONS[0].categories[0]
  );
  const [ready, setReady] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCollection = window.localStorage.getItem("adminCollection");
      const savedCategory = window.localStorage.getItem("adminCategory");
      if (
        savedCollection &&
        COLLECTIONS.some((c) => c.name === savedCollection)
      ) {
        setActiveCollection(savedCollection);
        const cats = COLLECTIONS.find(
          (c) => c.name === savedCollection
        ).categories;
        if (savedCategory && cats.includes(savedCategory)) {
          setActiveCategory(savedCategory);
        } else {
          setActiveCategory(cats[0]);
        }
      }
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (ready && typeof window !== "undefined") {
      window.localStorage.setItem("adminCollection", activeCollection);
      window.localStorage.setItem("adminCategory", activeCategory);
    }
  }, [activeCollection, activeCategory, ready]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      <Navbar />
      <main className="flex flex-1 flex-col md:flex-row gap-6 p-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
          <div className="flex md:flex-col gap-2">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-2 rounded-xl font-semibold text-left transition-all ${
                  activeTab === tab.key
                    ? "bg-white/70 shadow text-[#111]"
                    : "bg-white/30 text-gray-500 hover:bg-white/50"
                } backdrop-blur-xl border border-white/30`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </aside>
        {/* Main Content */}
        <section className="flex-1 bg-white/70 rounded-xl shadow-lg p-8 min-h-[500px] backdrop-blur-xl border border-white/30">
          <AnimatePresence mode="wait">
            {activeTab === "products" && ready && (
              <motion.div
                key="products"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-bold mb-6">Product Updates</h2>
                <div className="flex gap-6">
                  {/* Collection Tabs */}
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    {COLLECTIONS.map((col) => (
                      <button
                        key={col.name}
                        className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                          activeCollection === col.name
                            ? "bg-blue-600 text-white"
                            : "bg-white/50 text-gray-600 hover:bg-blue-100"
                        }`}
                        onClick={() => {
                          setActiveCollection(col.name);
                          setActiveCategory(
                            COLLECTIONS.find((c) => c.name === col.name)
                              .categories[0]
                          );
                        }}
                      >
                        {col.name}
                      </button>
                    ))}
                  </div>
                  {/* Category Tabs */}
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    {COLLECTIONS.find(
                      (c) => c.name === activeCollection
                    ).categories.map((cat) => (
                      <button
                        key={cat}
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                          activeCategory === cat
                            ? "bg-blue-100 text-blue-900"
                            : "bg-white/50 text-gray-700 hover:bg-blue-50"
                        }`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {/* Product List Functional */}
                  <ProductManager
                    collection={activeCollection}
                    category={activeCategory}
                  />
                </div>
              </motion.div>
            )}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-bold mb-6">
                  User Shopping History
                </h2>
                <div className="bg-white rounded-xl shadow p-6 text-gray-400 text-center">
                  (Shopping history table goes here)
                </div>
              </motion.div>
            )}
            {activeTab === "payments" && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-bold mb-6">Payment History</h2>
                <div className="bg-white rounded-xl shadow p-6 text-gray-400 text-center">
                  (Payment history table goes here)
                </div>
              </motion.div>
            )}
            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-bold mb-6">Users Management</h2>
                <div className="bg-white rounded-xl shadow p-6 text-gray-400 text-center">
                  (User management table goes here)
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

// --- ProductManager Component ---
function ProductManager({ collection, category }) {
  const router = useRouter();
  const [products, setProducts] = React.useState([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [error, setError] = React.useState("");

  // Enhanced form state with all necessary fields
  const [form, setForm] = React.useState({
    name: "",
    price: "",
    reference: "",
    description: "",
    details: "",
    sizeFit: "",
    sizes: [],
    colors: [],
    mainImage: null,
    additionalImages: [],
  });

  // Separate state for file handling
  const [imageFiles, setImageFiles] = React.useState({
    main: null,
    additional: [],
  });

  // Store the AbortController instance
  const abortControllerRef = React.useRef(null);

  React.useEffect(() => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/products?collection=${encodeURIComponent(
            collection
          )}&category=${encodeURIComponent(category)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();

        // Only update state if the request wasn't aborted
        if (!controller.signal.aborted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        // Don't set error if the fetch was aborted
        if (err.name !== "AbortError") {
          setError("Failed to load products. Please try again.");
          console.error("Fetch error:", err);
        }
      } finally {
        // Only update loading state if this is still the current request
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Cleanup function to abort fetch on unmount or when dependencies change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [collection, category]);

  // Reset form to initial state
  function resetForm() {
    setForm({
      name: "",
      price: "",
      reference: "",
      description: "",
      details: "",
      sizeFit: "",
      sizes: [],
      colors: [],
      mainImage: null,
      additionalImages: [],
    });
    setImageFiles({
      main: null,
      additional: [],
    });
  }

  // Handle text input changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handle main image upload
  function handleMainImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, mainImage: ev.target.result }));
        setImageFiles((prev) => ({ ...prev, main: file }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle additional images upload
  function handleAdditionalImagesChange(e) {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const newPreviewImages = [];
    const newFiles = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviewImages.push(ev.target.result);
        newFiles.push(file);

        if (newPreviewImages.length === files.length) {
          // Add new preview images to the form (these are base64 for preview only)
          setForm((prev) => ({
            ...prev,
            additionalImages: [...prev.additionalImages, ...newPreviewImages],
          }));
          // Add new files to imageFiles for upload
          setImageFiles((prev) => ({
            ...prev,
            additional: [...prev.additional, ...newFiles],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Remove additional image
  function removeAdditionalImage(index) {
    const imageToRemove = form.additionalImages[index];

    // Check if this is a new image (base64) or existing image (URL)
    const isNewImage = imageToRemove && imageToRemove.startsWith("data:");

    if (isNewImage) {
      // For new images, we need to find and remove the corresponding file
      // Count how many existing images come before this index
      let existingImagesCount = 0;
      for (let i = 0; i < index; i++) {
        if (!form.additionalImages[i].startsWith("data:")) {
          existingImagesCount++;
        }
      }

      // The file index is the current index minus the existing images count
      const fileIndex = index - existingImagesCount;

      setImageFiles((prev) => ({
        ...prev,
        additional: prev.additional.filter((_, i) => i !== fileIndex),
      }));
    }

    // Remove the image from the preview array
    setForm((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  }

  // Handle sizes management with checkboxes
  function handleSizeToggle(size) {
    setForm((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];

      // Sort sizes in proper order
      const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
      const sortedSizes = newSizes.sort((a, b) => {
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
      });

      return {
        ...prev,
        sizes: sortedSizes,
      };
    });
  }

  // Color picker state
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [selectedHue, setSelectedHue] = React.useState(0);
  const [selectedSaturation, setSelectedSaturation] = React.useState(100);
  const [selectedLightness, setSelectedLightness] = React.useState(50);

  // Convert HSL to HEX
  function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  // Get color name based on HSL values
  function getColorName(h, s, l) {
    if (s < 10) {
      if (l < 20) return "Black";
      if (l > 90) return "White";
      if (l < 40) return "Dark Gray";
      if (l > 70) return "Light Gray";
      return "Gray";
    }

    const hueNames = [
      { min: 0, max: 15, name: "Red" },
      { min: 15, max: 45, name: "Orange" },
      { min: 45, max: 75, name: "Yellow" },
      { min: 75, max: 150, name: "Green" },
      { min: 150, max: 210, name: "Cyan" },
      { min: 210, max: 270, name: "Blue" },
      { min: 270, max: 330, name: "Purple" },
      { min: 330, max: 360, name: "Red" },
    ];

    const hueName =
      hueNames.find((range) => h >= range.min && h < range.max)?.name || "Red";

    if (l < 30) return `Dark ${hueName}`;
    if (l > 80) return `Light ${hueName}`;
    if (s < 50) return `Pale ${hueName}`;
    return hueName;
  }

  // Handle color selection from picker
  function handleColorPickerSelect() {
    const hex = hslToHex(selectedHue, selectedSaturation, selectedLightness);
    const name = getColorName(
      selectedHue,
      selectedSaturation,
      selectedLightness
    );

    // Check if color already exists
    const colorExists = form.colors.some(
      (color) => color.hex.toLowerCase() === hex.toLowerCase()
    );

    if (!colorExists) {
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, { name, hex }],
      }));
    }

    setShowColorPicker(false);
  }

  function removeColor(index) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  }

  // Quick color palette for common colors
  const quickColors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#008000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Purple", hex: "#800080" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Brown", hex: "#8B4513" },
    { name: "Gray", hex: "#808080" },
    { name: "Navy", hex: "#000080" },
  ];

  function openAddModal() {
    setEditing(null);
    resetForm();
    setShowModal(true);
    setError("");
  }

  function openEditModal(product) {
    setEditing(product);
    setForm({
      name: product.name || "",
      price: product.price || "",
      reference: product.reference || "",
      description: product.description || "",
      details: product.details || "",
      sizeFit: product.sizeFit || "",
      sizes: product.sizes || [],
      colors: product.colors || [],
      mainImage: product.image || null,
      additionalImages: product.additionalImages || [], // These are existing Cloudinary URLs
    });
    setImageFiles({
      main: null,
      additional: [], // This will hold only new files to upload
    });
    setShowModal(true);
    setError("");
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    resetForm();
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // Add text fields
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("reference", form.reference);
      formData.append("description", form.description);
      formData.append("details", form.details);
      formData.append("sizeFit", form.sizeFit);
      formData.append("collection", collection);
      formData.append("category", category);
      formData.append("sizes", JSON.stringify(form.sizes));
      formData.append("colors", JSON.stringify(form.colors));

      // Handle main image
      if (imageFiles.main) {
        formData.append("mainImage", imageFiles.main);
      } else if (editing && form.mainImage) {
        formData.append("existingMainImage", form.mainImage);
      } else if (!editing) {
        throw new Error("Main image is required for new products");
      }

      // Handle additional images - separate existing from new
      if (editing) {
        // Filter existing images (Cloudinary URLs) from new images (base64)
        const existingImages = form.additionalImages.filter(
          (img) => typeof img === "string" && !img.startsWith("data:")
        );
        formData.append(
          "existingAdditionalImages",
          JSON.stringify(existingImages)
        );
      }

      // Add new additional image files
      imageFiles.additional.forEach((file, index) => {
        formData.append(`additionalImage_${index}`, file);
      });

      let url = "/api/products";
      let method = "POST";

      if (editing) {
        formData.append("_id", editing._id);
        method = "PATCH";
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (editing ? "Failed to update product" : "Failed to create product")
        );
      }

      // Refresh products list
      const productsRes = await fetch(
        `/api/products?collection=${encodeURIComponent(
          collection
        )}&category=${encodeURIComponent(category)}`
      );
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
      closeModal();
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(product) {
    setShowDeleteModal(product);
  }

  async function confirmDelete(product) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/products?id=${product._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setShowDeleteModal(null);

      // Refresh products list
      const productsRes = await fetch(
        `/api/products?collection=${encodeURIComponent(
          collection
        )}&category=${encodeURIComponent(category)}`
      );
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-4">
        {collection} / {category}
      </h3>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mb-4"
            viewBox="0 0 50 50"
          >
            <circle
              className="opacity-30"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
            />
            <circle
              className="opacity-80"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              strokeDasharray="100"
              strokeDashoffset="75"
            />
          </svg>
          <span className="text-blue-700 font-semibold text-lg animate-pulse">
            Loading products...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <div
              key={p._id || i}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100"
            >
              <div className="h-32 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={128}
                    height={128}
                    className="object-contain h-full w-full"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="font-bold">{p.name}</div>
              <div className="text-sm text-gray-500">Price: ${p.price}</div>
              <div className="flex gap-2 mt-2">
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                  onClick={() => openEditModal(p)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                  onClick={() => handleDelete(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="mt-6 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
        onClick={openAddModal}
      >
        Add New Product
      </button>
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-5xl relative mx-4">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
              <h4 className="text-xl font-bold mb-4">
                {editing ? "Edit Product" : "Add Product"}
              </h4>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto p-4"
              >
                {/* Basic Information */}
                <label className="font-medium">
                  Product Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter product name"
                  />
                </label>

                <label className="font-medium">
                  Reference Number
                  <input
                    name="reference"
                    value={form.reference}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., REF-001"
                  />
                </label>

                <label className="font-medium">
                  Price *
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="0.00"
                  />
                </label>

                {/* Description */}
                <label className="font-medium col-span-1 md:col-span-2">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                    placeholder="Enter product description"
                  />
                </label>

                {/* Product Details */}
                <label className="font-medium col-span-1 md:col-span-2">
                  Product Details
                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                    placeholder="Enter fabric composition, care instructions, etc."
                  />
                </label>

                {/* Size & Fit */}
                <label className="font-medium col-span-1 md:col-span-2">
                  Size & Fit Information
                  <textarea
                    name="sizeFit"
                    value={form.sizeFit}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                    placeholder="Enter size and fit details, measurements, etc."
                  />
                </label>

                {/* Sizes */}
                <div className="font-medium col-span-1 md:col-span-3">
                  <span className="block mb-3">Available Sizes</span>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                    {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                      <label
                        key={size}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.sizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {size}
                        </span>
                      </label>
                    ))}
                  </div>
                  {form.sizes.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-600">Selected: </span>
                      <span className="text-sm font-medium text-blue-600">
                        {form.sizes.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div className="font-medium col-span-1 md:col-span-3">
                  <span className="block mb-3">Available Colors</span>

                  {/* Color Selection Options */}
                  <div className="mb-4 space-y-4">
                    {/* Quick Colors */}
                    <div>
                      <span className="text-sm text-gray-600 mb-2 block">
                        Quick colors:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {quickColors.map((color) => (
                          <button
                            key={color.hex}
                            type="button"
                            onClick={() => {
                              const colorExists = form.colors.some(
                                (c) => c.hex === color.hex
                              );
                              if (!colorExists) {
                                setForm((prev) => ({
                                  ...prev,
                                  colors: [...prev.colors, color],
                                }));
                              }
                            }}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {form.colors.some((c) => c.hex === color.hex) && (
                              <span className="flex items-center justify-center h-full text-white text-xs font-bold drop-shadow-lg">
                                ✓
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Color Picker Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                      >
                        🎨 Custom Color Picker
                      </button>
                    </div>

                    {/* Color Wheel Picker */}
                    {showColorPicker && (
                      <div className="p-4 bg-white border rounded-lg shadow-lg">
                        <div className="space-y-4">
                          {/* Hue Slider */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hue: {selectedHue}°
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={selectedHue}
                              onChange={(e) =>
                                setSelectedHue(parseInt(e.target.value))
                              }
                              className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, 
                                  hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                                  hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`,
                              }}
                            />
                          </div>

                          {/* Saturation Slider */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Saturation: {selectedSaturation}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={selectedSaturation}
                              onChange={(e) =>
                                setSelectedSaturation(parseInt(e.target.value))
                              }
                              className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, 
                                  hsl(${selectedHue}, 0%, ${selectedLightness}%), 
                                  hsl(${selectedHue}, 100%, ${selectedLightness}%))`,
                              }}
                            />
                          </div>

                          {/* Lightness Slider */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lightness: {selectedLightness}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={selectedLightness}
                              onChange={(e) =>
                                setSelectedLightness(parseInt(e.target.value))
                              }
                              className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, 
                                  hsl(${selectedHue}, ${selectedSaturation}%, 0%), 
                                  hsl(${selectedHue}, ${selectedSaturation}%, 50%), 
                                  hsl(${selectedHue}, ${selectedSaturation}%, 100%))`,
                              }}
                            />
                          </div>

                          {/* Color Preview */}
                          <div className="flex items-center gap-4">
                            <div
                              className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-inner"
                              style={{
                                backgroundColor: hslToHex(
                                  selectedHue,
                                  selectedSaturation,
                                  selectedLightness
                                ),
                              }}
                            ></div>
                            <div>
                              <div className="text-sm font-medium">
                                {getColorName(
                                  selectedHue,
                                  selectedSaturation,
                                  selectedLightness
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {hslToHex(
                                  selectedHue,
                                  selectedSaturation,
                                  selectedLightness
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleColorPickerSelect}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Add Color
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowColorPicker(false)}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Colors Display */}
                  {form.colors.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600 mb-2 block">
                        Selected colors:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {form.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-white rounded-lg px-3 py-2 border shadow-sm"
                          >
                            <div
                              className="w-4 h-4 rounded-full border mr-2"
                              style={{ backgroundColor: color.hex }}
                            ></div>
                            <span className="text-sm font-medium">
                              {color.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeColor(index)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Image */}
                <label className="font-medium col-span-1 md:col-span-2">
                  Main Product Image *
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {form.mainImage && (
                    <div className="mt-2">
                      <Image
                        src={form.mainImage}
                        alt="Main product preview"
                        width={120}
                        height={120}
                        className="h-30 w-30 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </label>

                {/* Additional Images */}
                <label className="font-medium col-span-1 md:col-span-3">
                  Additional Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {form.additionalImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {form.additionalImages.map((img, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <Image
                            src={img}
                            alt={`Additional ${index + 1}`}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg border-2 border-white"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>

                {/* Error Display */}
                {error && (
                  <div className="col-span-1 md:col-span-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="col-span-1 md:col-span-3 flex gap-4 pt-4 border-t">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-colors"
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editing
                      ? "Update Product"
                      : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm relative flex flex-col items-center">
              <div className="font-bold text-lg mb-2">Delete Product?</div>
              <div className="mb-4 text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{showDeleteModal.name}</span>?
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteModal)}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
