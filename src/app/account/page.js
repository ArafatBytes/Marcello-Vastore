"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const TABS = [
  { key: "order", label: "ORDER HISTORY" },
  { key: "profile", label: "PROFILE INFORMATION" },
  { key: "address", label: "ADDRESS BOOK" },
  { key: "payments", label: "PAYMENTS" },
  { key: "reservations", label: "E-RESERVATIONS" },
];

function EditProfileForm({ user, onCancel, onSave }) {
  // Fix: Use firstName and lastName from user or split from user.name
  const initialFirstName =
    user.firstName || (user.name ? user.name.split(" ")[0] : "");
  const initialLastName =
    user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : "");
  const [form, setForm] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: user.email || "",
    phone: user.phone || "",
    billingAddress:
      typeof user.billingAddress === "string"
        ? user.billingAddress
        : user.billingAddress?.address || "",
    shippingAddress:
      typeof user.shippingAddress === "string"
        ? user.shippingAddress
        : user.shippingAddress?.address || "",
    newsletter: !!user.newsletter,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  function validate(fields) {
    const errors = {};
    if (!fields.firstName.trim()) errors.firstName = "First name is required.";
    if (!fields.lastName.trim()) errors.lastName = "Last name is required.";
    if (!fields.email.trim()) errors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(fields.email))
      errors.email = "Invalid email format.";
    if (!fields.phone.trim()) errors.phone = "Phone is required.";
    else if (!/^[\d\-+() ]{7,20}$/.test(fields.phone))
      errors.phone = "Invalid phone format.";
    if (!fields.billingAddress.trim())
      errors.billingAddress = "Billing address is required.";
    if (!fields.shippingAddress.trim())
      errors.shippingAddress = "Shipping address is required.";
    if (showPasswordFields) {
      if (!fields.currentPassword)
        errors.currentPassword = "Current password required.";
      if (!fields.newPassword) errors.newPassword = "New password required.";
      else if (fields.newPassword.length < 8)
        errors.newPassword = "Password must be at least 8 characters.";
      else if (!/[0-9]/.test(fields.newPassword))
        errors.newPassword = "Password must contain at least one digit.";
      if (fields.newPassword !== fields.confirmNewPassword)
        errors.confirmNewPassword = "Passwords do not match.";
    }
    return errors;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setFieldErrors((fe) => ({ ...fe, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const jwt =
        typeof window !== "undefined"
          ? localStorage.getItem("jwt") || sessionStorage.getItem("jwt")
          : null;
      // Only send password fields if changing password
      const updateBody = { ...form };
      if (!showPasswordFields) {
        delete updateBody.currentPassword;
        delete updateBody.newPassword;
        delete updateBody.confirmNewPassword;
      }
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      toast.success("Profile updated successfully!");
      onSave({ ...user, ...form, name: form.firstName + " " + form.lastName });
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full"
      style={{ maxWidth: 640 }}
    >
      <div className="flex gap-8">
        <div className="flex-1 flex flex-col gap-3">
          <label className="text-sm font-medium text-[#888]">
            First Name
            <input
              className={`mt-1 w-full rounded border px-2 py-1 ${
                fieldErrors.firstName ? "border-red-400" : ""
              }`}
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            {fieldErrors.firstName && (
              <span className="text-xs text-red-500">
                {fieldErrors.firstName}
              </span>
            )}
          </label>
          <label className="text-sm font-medium text-[#888]">
            Last Name
            <input
              className={`mt-1 w-full rounded border px-2 py-1 ${
                fieldErrors.lastName ? "border-red-400" : ""
              }`}
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            {fieldErrors.lastName && (
              <span className="text-xs text-red-500">
                {fieldErrors.lastName}
              </span>
            )}
          </label>
          <label className="text-sm font-medium text-[#888]">
            E-mail
            <input
              className={`mt-1 w-full rounded border px-2 py-1 ${
                fieldErrors.email ? "border-red-400" : ""
              }`}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && (
              <span className="text-xs text-red-500">{fieldErrors.email}</span>
            )}
          </label>
          <label className="text-sm font-medium text-[#888]">
            Telephone number
            <input
              className={`mt-1 w-full rounded border px-2 py-1 ${
                fieldErrors.phone ? "border-red-400" : ""
              }`}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            {fieldErrors.phone && (
              <span className="text-xs text-red-500">{fieldErrors.phone}</span>
            )}
          </label>
          <label className="flex items-center gap-2 mt-2 text-xs">
            <input
              type="checkbox"
              name="newsletter"
              checked={form.newsletter}
              onChange={handleChange}
            />
            Subscribe to Marcello Vastore newsletter
          </label>
        </div>
        <div className="flex-1 flex flex-col gap-3 border-l pl-8">
          <label className="text-sm font-medium text-[#888]">
            Billing Address
            <input
              className={`mt-1 w-full rounded border px-2 py-1 ${
                fieldErrors.billingAddress ? "border-red-400" : ""
              }`}
              name="billingAddress"
              value={form.billingAddress}
              onChange={handleChange}
              required
            />
            {fieldErrors.billingAddress && (
              <span className="text-xs text-red-500">
                {fieldErrors.billingAddress}
              </span>
            )}
          </label>
          <label className="text-sm font-medium text-[#888]">
            Shipping Address
            <input
              className={`mt-1 w-full rounded border px-2 py-1 ${
                fieldErrors.shippingAddress ? "border-red-400" : ""
              }`}
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              required
            />
            {fieldErrors.shippingAddress && (
              <span className="text-xs text-red-500">
                {fieldErrors.shippingAddress}
              </span>
            )}
          </label>
          <div className="mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition-all"
              onClick={() => setShowPasswordFields((v) => !v)}
            >
              {showPasswordFields
                ? "Cancel Password Change"
                : "Change Password"}
            </button>
            <AnimatePresence>
              {showPasswordFields && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden flex flex-col gap-2 mt-4"
                >
                  <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    error={fieldErrors.currentPassword}
                  />
                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    error={fieldErrors.newPassword}
                  />
                  <PasswordField
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    value={form.confirmNewPassword}
                    onChange={handleChange}
                    error={fieldErrors.confirmNewPassword}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#111] hover:bg-[#222] text-white font-semibold"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </motion.form>
  );
}

function PasswordField({ label, name, value, onChange, error }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="text-sm font-medium text-[#888] w-full">
      {label}
      <div className="relative mt-1 w-full">
        <input
          type={visible ? "text" : "password"}
          className={`w-full rounded border px-2 py-1 pr-10 ${
            error ? "border-red-400" : ""
          }`}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={name}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 002.25 12c0 .621.113 1.223.323 1.777M6.32 6.319A10.45 10.45 0 0112 5.25c6.75 0 9.75 6.75 9.75 6.75a10.48 10.48 0 01-4.293 5.226M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3l18 18"
              />
            </svg>
          )}
        </button>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

function ProfileInfo({ user, onEdit }) {
  if (!user) return null;
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#222]">
          PROFILE INFORMATION
        </h2>
        <button
          className="p-2 rounded-full hover:bg-white/50 transition-colors"
          aria-label="Edit profile"
          onClick={onEdit}
          style={{ marginRight: "-0.5rem" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-500 hover:text-[#222]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 14.362-14.303ZM19.5 7.5l-2-2"
            />
          </svg>
        </button>
      </div>
      <div className="flex gap-10">
        <div className="flex-1 flex flex-col gap-3">
          <div>
            <span className="font-medium text-[#888]">Name</span>
            <br />
            <span className="text-[#222]">{user.name}</span>
          </div>
          <div>
            <span className="font-medium text-[#888]">E-mail</span>
            <br />
            <span className="text-[#222]">{user.email}</span>
          </div>
          <div>
            <span className="font-medium text-[#888]">Telephone number</span>
            <br />
            <span className="text-[#222]">{user.phone}</span>
          </div>
          <div>
            <span className="font-medium text-[#888]">Password</span>
            <br />
            <span className="text-[#222]">********</span>
          </div>
          <div className="text-xs text-[#888] mt-4">
            {user.newsletter
              ? "You are subscribed to the Marcello Vastore newsletter."
              : "You are not subscribed to the Marcello Vastore newsletter."}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 border-l pl-8">
          <div className="mb-4">
            <span className="font-medium text-[#888]">Billing address</span>
            <br />
            <span className="text-[#222]">
              {user.billingName}
              <br />
              {typeof user.billingAddress === "string"
                ? user.billingAddress
                : user.billingAddress?.address || ""}
              <br />
            </span>
          </div>
          <div>
            <span className="font-medium text-[#888]">Shipping address</span>
            <br />
            <span className="text-[#222]">
              {user.shippingName}
              <br />
              {typeof user.shippingAddress === "string"
                ? user.shippingAddress
                : user.shippingAddress?.address || ""}
              <br />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [editing, setEditing] = useState(false);
  function handleProfileSave(updatedUser) {
    setUser(updatedUser);
    setEditing(false);
  }
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { handleLogout: handleCartLogout } = useCart();
  const { handleLogout: handleFavoritesLogout } = useFavorites();

  useEffect(() => {
    // Check login (JWT in localStorage or window.jwt)
    const jwt =
      typeof window !== "undefined"
        ? localStorage.getItem("jwt") || sessionStorage.getItem("jwt")
        : null;
    if (!jwt) {
      router.push("/login");
      return;
    }
    // Fetch user info from API
    fetch("/api/account", {
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.push("/login");
      });
  }, [router]);

  function handleSignOut() {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
    window.jwt = null;

    // Handle cart and favorites logout
    handleCartLogout();
    handleFavoritesLogout();

    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  }

  return (
    <div className="bg-white min-h-[calc(100vh-10rem)] mt-10 py-10 flex justify-center">
      <div className="flex w-full max-w-6xl gap-8">
        {/* Sidebar */}
        <aside
          className="w-64 bg-[#f5f5f7] rounded-md shadow-md py-6 px-2 flex flex-col gap-2 justify-between"
          style={{ background: "rgba(245,245,247,0.95)", minHeight: "500px" }}
        >
          <div>
            <span className="text-xl font-semibold tracking-widest mb-6 ml-1 text-[#222]">
              ACCOUNT
            </span>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`block w-full text-left px-2 py-2 my-1 rounded-xl text-[15px] font-medium tracking-wide transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-white/30 font-bold text-[#222] shadow-lg ring-2 ring-[#e0e0e0] backdrop-blur-xl"
                    : "text-[#888] hover:text-[#222]"
                }`}
                style={
                  activeTab === tab.key
                    ? {
                        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
                        background: "rgba(255,255,255,0.25)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "18px",
                      }
                    : {}
                }
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{
              scale: 1.09,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
            }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="w-full mt-4 mb-2 py-2 px-0 rounded-xl text-sm font-semibold text-red-700 bg-white/30 shadow-lg ring-2 ring-[#e0e0e0] backdrop-blur-xl border border-white/30 transition-all duration-100 hover:bg-white/50 hover:text-red-900"
            style={{
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
              background: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              borderRadius: "18px",
            }}
            onClick={handleSignOut}
          >
            SIGN-OUT
          </motion.button>
        </aside>
        {/* Main Card */}
        <section
          className="flex-1 bg-[#f5f5f7] rounded-md shadow-md p-8 min-h-[320px] flex items-center justify-center transition-all duration-500"
          style={{
            minHeight: 320,
            height: "auto",
            background: "rgba(245,245,247,0.95)",
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "profile" && user && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {editing ? (
                  <EditProfileForm
                    user={user}
                    onCancel={() => setEditing(false)}
                    onSave={handleProfileSave}
                  />
                ) : (
                  <ProfileInfo user={user} onEdit={() => setEditing(true)} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
