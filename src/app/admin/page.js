"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

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
  const [editing, setEditing] = React.useState(null); // product or null
  const [form, setForm] = React.useState({
    name: "",
    price: "",
    image: "",
    reference: "",
    description: "",
    sizes: [""],
    colors: [""],
    productDetails: "",
    sizeFit: "",
    additionalImages: [],
  });
  const [imageFile, setImageFile] = React.useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = React.useState([]);
  const [error, setError] = React.useState("");
  const adminSecret =
    typeof window !== "undefined"
      ? window.env?.ADMIN_SECRET ||
        window.localStorage.getItem("adminSecret") ||
        ""
      : "";

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

  function handleSizeToggle(size) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  }

  function handleColorToggle(color) {
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(color)
        ? f.colors.filter((c) => c !== color)
        : [...f.colors, color],
    }));
  }

  function handleInputChange(e) {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((f) => ({ ...f, image: ev.target.result }));
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    } else if (name === "additionalImages" && files) {
      const newFiles = Array.from(files);
      const readers = newFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setForm((f) => ({
          ...f,
          additionalImages: [...f.additionalImages, ...results],
        }));
        setAdditionalImageFiles((prev) => [...prev, ...newFiles]);
      });
    } else if (name === "sizes" || name === "colors") {
      const arrayValue = value
        ? value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [""];
      setForm((f) => ({ ...f, [name]: arrayValue }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleRemoveAdditionalImage(index) {
    setForm((f) => ({
      ...f,
      additionalImages: f.additionalImages.filter((_, i) => i !== index),
    }));
    setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function openAddModal() {
    setEditing(null);
    setForm({
      name: "",
      price: "",
      image: "",
      reference: "",
      description: "",
      sizes: [""],
      colors: [""],
      productDetails: "",
      sizeFit: "",
      additionalImages: [],
    });
    setShowModal(true);
    setError("");
  }
  function openEditModal(product) {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      reference: product.reference || "",
      description: product.description || "",
      sizes: product.sizes || [],
      colors: product.colors || [],
      productDetails: product.productDetails || "",
      sizeFit: product.sizeFit || "",
      additionalImages: product.images?.slice(1) || [], // Skip first image as it's the main image
    });
    setShowModal(true);
    setError("");
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm({
      name: "",
      price: "",
      image: "",
      reference: "",
      description: "",
      sizes: [],
      colors: [],
      productDetails: "",
      sizeFit: "",
      additionalImages: [],
    });
    setError("");
    setImageFile(null);
    setAdditionalImageFiles([]);
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
      formData.append("collection", collection);
      formData.append("category", category);
      formData.append("reference", form.reference);
      formData.append("description", form.description);
      formData.append("sizes", JSON.stringify(form.sizes));
      formData.append("colors", JSON.stringify(form.colors));
      formData.append("productDetails", form.productDetails);
      formData.append("sizeFit", form.sizeFit);

      // Add main image file if it's a new file
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (editing && form.image) {
        // If editing and no new image, keep the existing image URL
        formData.append("image", form.image);
      } else if (!editing) {
        // Only require image for new products
        throw new Error("Image is required for new products");
      }

      // Handle additional images
      if (editing && form.additionalImages.length > 0) {
        // For existing images that are URLs
        const existingImages = form.additionalImages.filter(
          (img) => typeof img === "string"
        );
        if (existingImages.length > 0) {
          formData.append(
            "existingAdditionalImages",
            JSON.stringify(existingImages)
          );
        }
      }

      // Add new additional image files
      additionalImageFiles.forEach((file) => {
        formData.append("additionalImages", file);
      });

      let url = "/api/products";
      let method = "POST";

      if (editing) {
        // For editing, we need to send the _id in the form data
        formData.append("_id", editing._id);
        method = "PATCH";
      }

      const response = await fetch(url, {
        method,
        body: formData,
        // Don't set Content-Type header - let the browser set it with the correct boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (editing ? "Failed to update product" : "Failed to create product")
        );
      }

      // Refresh products
      const productsRes = await fetch(
        `/api/products?collection=${encodeURIComponent(
          collection
        )}&category=${encodeURIComponent(category)}`
      );
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
      closeModal();

      // Reset the form and image files
      setForm({
        name: "",
        price: "",
        image: "",
        reference: "",
        description: "",
        sizes: [""],
        colors: [""],
        productDetails: "",
        sizeFit: "",
        additionalImages: [],
      });
      setImageFile(null);
      setAdditionalImageFiles([]);
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
      router.refresh && router.refresh();
      if (typeof window !== "undefined") window.location.reload();
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
                <label className="font-medium">
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-2 py-1 border rounded"
                    required
                  />
                </label>
                <label className="font-medium">
                  Reference
                  <input
                    name="reference"
                    value={form.reference}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-2 py-1 border rounded"
                  />
                </label>
                <label className="font-medium">
                  Price
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-2 py-1 border rounded"
                    required
                  />
                </label>
                <label className="font-medium">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-2 py-1 border rounded h-24"
                  />
                </label>
                <div className="font-medium">
                  Sizes
                  <div className="mt-1 flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                          ${
                            form.sizes.includes(size)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="font-medium">
                  Colors
                  <div className="mt-1 flex flex-wrap gap-2">
                    {[
                      { name: "Black", hex: "#000000" },
                      { name: "White", hex: "#FFFFFF" },
                      { name: "Gray", hex: "#808080" },
                      { name: "Red", hex: "#FF0000" },
                      { name: "Blue", hex: "#0000FF" },
                      { name: "Green", hex: "#008000" },
                      { name: "Yellow", hex: "#FFFF00" },
                      { name: "Purple", hex: "#800080" },
                      { name: "Brown", hex: "#8B4513" },
                      { name: "Navy", hex: "#000080" },
                    ].map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorToggle(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                          ${
                            form.colors.includes(color.name)
                              ? "border-blue-600 scale-110"
                              : "border-gray-300"
                          }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {form.colors.includes(color.name) && (
                          <span className="flex items-center justify-center h-full text-white text-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="font-medium ">
                  Product Details
                  <textarea
                    name="productDetails"
                    value={form.productDetails}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-2 py-1 border rounded h-24"
                    placeholder="Enter fabric composition, care instructions, etc."
                  />
                </label>
                <label className="font-medium">
                  Size & Fit Information
                  <textarea
                    name="sizeFit"
                    value={form.sizeFit}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-2 py-1 border rounded h-24"
                    placeholder="Enter size and fit details, measurements, etc."
                  />
                </label>
                <label className="font-medium ">
                  Main Image
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full mt-1"
                  />
                  {form.image && (
                    <Image
                      src={form.image}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="mt-2 h-24 object-contain rounded"
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </label>
                <label className="font-medium ">
                  Additional Images
                  <input
                    name="additionalImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleInputChange}
                    className="w-full mt-1"
                  />
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {form.additionalImages.map((img, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={img}
                          alt={`Additional ${index + 1}`}
                          width={96}
                          height={96}
                          className="h-24 object-contain rounded"
                          style={{ objectFit: "contain" }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </label>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editing
                      ? "Save Changes"
                      : "Add Product"}
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
