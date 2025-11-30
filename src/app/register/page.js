"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Info,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "react-hot-toast";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";
export const dynamicParams = true;

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingSame, setBillingSame] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  // Navigation and cart context
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncCartOnLogin } = useCart();
  const { syncFavoritesOnLogin } = useFavorites();

  // Check if user came from checkout
  const fromCheckout = searchParams?.get("from") === "checkout";

  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [billingError, setBillingError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Validators
  function validateName(val) {
    if (!val.trim()) return "Full name is required.";
    if (val.trim().split(" ").length < 2)
      return "Please enter your first and last name.";
    if (!/^([A-Za-z]+\s)+[A-Za-z]+$/.test(val.trim()))
      return "Name should only contain letters and spaces.";
    return "";
  }
  function validateEmail(val) {
    if (!val.trim()) return "Email is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val.trim()))
      return "Invalid email address.";
    return "";
  }
  function validatePhone(val) {
    if (!val.trim()) return "Phone number is required.";
    try {
      if (!isValidPhoneNumber(val)) return "Invalid phone number.";
    } catch {
      return "Invalid phone number.";
    }
    return "";
  }
  function validateShipping(val) {
    if (!val.trim()) return "Shipping address is required.";
    if (val.trim().length < 8) return "Shipping address is too short.";
    return "";
  }
  function validateBilling(val) {
    if (!val.trim()) return "Billing address is required.";
    if (val.trim().length < 8) return "Billing address is too short.";
    return "";
  }
  function validatePassword(pw) {
    if (!pw || pw.length < 8) return "Password must be at least 8 characters.";
    if (!/[a-zA-Z]/.test(pw)) return "Password must contain a letter.";
    if (!/[0-9]/.test(pw)) return "Password must contain a number.";
    return "";
  }
  function handleNameChange(e) {
    setName(e.target.value);
    setNameError(validateName(e.target.value));
  }
  function handleEmailChange(e) {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  }
  function handlePhoneChange(e) {
    setPhone(e.target.value);
    setPhoneError(validatePhone(e.target.value));
  }
  function handleShippingChange(e) {
    setShippingAddress(e.target.value);
    setShippingError(validateShipping(e.target.value));
  }
  function handleBillingChange(e) {
    setBillingAddress(e.target.value);
    setBillingError(validateBilling(e.target.value));
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  }
  function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
      setPasswordError(validatePassword(password));
    }
  }

  // Sync billing address with shipping if checkbox checked
  React.useEffect(() => {
    if (billingSame) setBillingAddress(shippingAddress);
  }, [billingSame, shippingAddress]);

  // Register form submit handler
  async function handleRegister(e) {
    e.preventDefault();
    // Validate all fields
    const errors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      shipping: validateShipping(shippingAddress),
      billing: billingSame
        ? validateShipping(shippingAddress)
        : validateBilling(billingAddress),
      password: validatePassword(password),
      confirmPassword:
        confirmPassword !== password ? "Passwords do not match." : "",
    };
    setNameError(errors.name);
    setEmailError(errors.email);
    setPhoneError(errors.phone);
    setShippingError(errors.shipping);
    setBillingError(errors.billing);
    setPasswordError(errors.password);
    setConfirmPasswordError(errors.confirmPassword);
    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      toast.error("Please correct the errors in the form.");
      return;
    }
    setIsSubmitting(true);
    try {
      const [firstName, ...lastArr] = name.split(" ");
      const lastName = lastArr.join(" ");
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phone,
          newsletter: subscribed,
          billingAddress: {
            address: billingSame ? shippingAddress : billingAddress,
          },
          shippingAddress: { address: shippingAddress },
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // Store the JWT token (similar to login)
        localStorage.setItem("jwt", data.token);

        // Trigger auth events
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("custom-login"));

        // Sync cart and favorites with database
        await syncCartOnLogin();
        await syncFavoritesOnLogin();

        toast.success("Registration successful!");

        // Handle redirect based on where user came from
        if (fromCheckout) {
          // Redirect back to cart with checkout parameter
          router.push("/cart?from=checkout");
        } else {
          // Normal redirect to home
          router.push("/");
        }
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="bg-[#fafafa] min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        className="bg-white max-w-lg w-full rounded-md shadow-md border border-[#ede9df] p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-[28px] font-bold text-[#222] mb-2 text-center tracking-tight">
          Create Your Account
        </h2>
        {fromCheckout ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-[15px] text-blue-800 font-medium text-center">
              Create an account to continue with checkout
            </p>
            <p className="text-[13px] text-blue-600 mt-1 text-center">
              You&apos;ll be redirected back to your cart after registration.
            </p>
          </div>
        ) : (
          <p className="text-[15px] text-[#444] mb-8 text-center">
            Sign up to Marcello Vastore for a personalized shopping experience.
          </p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="text-[14px] text-[#222] font-medium"
            >
              Full Name <span className="text-[#888] font-normal">*</span>
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-5 h-5" />
              <input
                id="name"
                type="text"
                required
                placeholder="Full Name *"
                className={`pl-10 border ${
                  nameError ? "border-red-400" : "border-[#ede9df]"
                } rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] w-full`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
              />
            </div>
            {nameError && (
              <span className="text-xs text-red-500 mt-1">{nameError}</span>
            )}
          </div>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-[14px] text-[#222] font-medium"
            >
              Email <span className="text-[#888] font-normal">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-5 h-5" />
              <input
                id="email"
                type="email"
                required
                placeholder="Email *"
                className={`pl-10 border ${
                  emailError ? "border-red-400" : "border-[#ede9df]"
                } rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] w-full`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
            </div>
            {emailError && (
              <span className="text-xs text-red-500 mt-1">{emailError}</span>
            )}
          </div>
          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="phone"
              className="text-[14px] text-[#222] font-medium"
            >
              Phone Number <span className="text-[#888] font-normal">*</span>
            </label>
            <div className="w-full">
              <PhoneInput
                className={`w-full ${phoneError ? "border-red-400" : ""}`}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError("");
                }}
              />
            </div>
            {phoneError && (
              <span className="text-xs text-red-500 mt-1">{phoneError}</span>
            )}
          </div>
          {/* Passwords */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label
                htmlFor="password"
                className="text-[14px] text-[#222] font-medium"
              >
                Password <span className="text-[#888] font-normal">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password *"
                  className={`pl-10 border ${
                    passwordError ? "border-red-400" : "border-[#ede9df]"
                  } rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] w-full`}
                  minLength={8}
                  value={password}
                  onChange={(e) => {
                    handlePasswordChange(e);
                    setPasswordError("");
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <span className="text-xs text-red-500 mt-1">
                  {passwordError}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label
                htmlFor="confirmPassword"
                className="text-[14px] text-[#222] font-medium"
              >
                Confirm Password{" "}
                <span className="text-[#888] font-normal">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password *"
                  className={`pl-10 border ${
                    confirmPasswordError ? "border-red-400" : "border-[#ede9df]"
                  } rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] w-full`}
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => {
                    handleConfirmPasswordChange(e);
                    setConfirmPasswordError("");
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <span className="text-xs text-red-500 mt-1">
                  {confirmPasswordError}
                </span>
              )}
            </div>
          </div>
          {/* Shipping Address */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="shipping"
              className="text-[14px] text-[#222] font-medium"
            >
              Shipping Address{" "}
              <span className="text-[#888] font-normal">*</span>
            </label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3 top-4 text-[#888] w-5 h-5" />
              <textarea
                id="shipping"
                required
                placeholder="Shipping Address *"
                className={`pl-10 border ${
                  shippingError ? "border-red-400" : "border-[#ede9df]"
                } rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] resize-none min-h-[56px] w-full`}
                value={shippingAddress}
                onChange={(e) => {
                  setShippingAddress(e.target.value);
                  setShippingError("");
                }}
              />
            </div>
            {shippingError && (
              <span className="text-xs text-red-500 mt-1">{shippingError}</span>
            )}
          </div>
          {/* Billing Address */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="billingSame"
              checked={billingSame}
              onChange={(e) => setBillingSame(e.target.checked)}
              className="accent-[#222] w-4 h-4"
            />
            <label htmlFor="billingSame" className="text-[14px] text-[#222]">
              Billing address same as shipping address
            </label>
          </div>
          <motion.div
            className="flex flex-col gap-1"
            initial={false}
            animate={
              billingSame
                ? { height: 0, opacity: 0 }
                : { height: "auto", opacity: 1 }
            }
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <label
              htmlFor="billing"
              className="text-[14px] text-[#222] font-medium"
            >
              Billing Address <span className="text-[#888] font-normal">*</span>
            </label>
            <div className="relative flex items-center">
              <Home className="absolute left-3 top-4 text-[#888] w-5 h-5" />
              <textarea
                id="billing"
                required
                placeholder="Billing Address *"
                className={`pl-10 border ${
                  billingError ? "border-red-400" : "border-[#ede9df]"
                } rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] resize-none min-h-[56px] w-full`}
                value={billingAddress}
                onChange={(e) => {
                  setBillingAddress(e.target.value);
                  setBillingError("");
                }}
                disabled={billingSame}
              />
            </div>
            {billingError && (
              <span className="text-xs text-red-500 mt-1">{billingError}</span>
            )}
          </motion.div>
          {/* Newsletter */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="newsletter"
              checked={subscribed}
              onChange={(e) => setSubscribed(e.target.checked)}
              className="accent-[#222] w-4 h-4"
            />
            <label htmlFor="newsletter" className="text-[14px] text-[#222]">
              Subscribe to Marcello Vastore newsletter
            </label>
            <span className="relative group">
              <Info className="w-4 h-4 text-[#888] cursor-pointer" />
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#222] text-white text-xs rounded px-3 py-2 shadow-lg z-50 opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-normal">
                Receive updates, offers, and news from Marcello Vastore. You can
                unsubscribe at any time.
              </span>
            </span>
          </div>
          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            type="submit"
            className="w-full mt-2 bg-[#222] text-white rounded py-3 font-bold text-[16px] tracking-wider shadow-sm hover:bg-[#444] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "SIGN UP"}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-[#fafafa] min-h-screen flex items-center justify-center px-4 py-8">
          <div className="bg-white max-w-lg w-full rounded-md shadow-md border border-[#ede9df] p-10">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </main>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
