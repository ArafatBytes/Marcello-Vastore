"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const TABS = [
  { key: "order", label: "ORDER HISTORY" },
  { key: "profile", label: "PROFILE INFORMATION" },
  { key: "address", label: "ADDRESS BOOK" },
  { key: "payments", label: "PAYMENTS" },
  { key: "reservations", label: "E-RESERVATIONS" },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check login (JWT in localStorage or window.jwt)
    const jwt = typeof window !== 'undefined' ? (localStorage.getItem("jwt") || sessionStorage.getItem("jwt")) : null;
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
    window.jwt = null;
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  }

  return (
    <div className="bg-white min-h-[calc(100vh-10rem)] mt-10 py-10 flex justify-center">
      <div className="flex w-full max-w-6xl gap-8">
        {/* Sidebar */}
        <aside className="w-64 bg-[#f5f5f7] rounded-md shadow-md py-6 px-2 flex flex-col gap-2" style={{background: 'rgba(245,245,247,0.95)'}}> 
          <span className="text-xl font-semibold tracking-widest mb-6 ml-1 text-[#222]">ACCOUNT</span>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`text-left px-2 py-2 my-1 rounded-xl text-[15px] font-medium tracking-wide transition-all duration-300 ${activeTab === tab.key ? "bg-white/30 font-bold text-[#222] shadow-lg ring-2 ring-[#e0e0e0] backdrop-blur-xl" : "text-[#888] hover:text-[#222]"}`}
              style={activeTab === tab.key ? { boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', borderRadius: '18px' } : {}}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          <button className="mt-8 text-xs text-[#888] underline hover:text-[#222]" onClick={handleSignOut}>SIGN-OUT</button>
        </aside>
        {/* Main Card */}
        <section className="flex-1 bg-[#f5f5f7] rounded-md shadow-md p-8 min-h-[320px] flex items-center justify-center transition-all duration-500" style={{ minHeight: 320, height: 'auto', background: 'rgba(245,245,247,0.95)' }}>
          <AnimatePresence mode="wait">
            {activeTab === "profile" && user && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <h2 className="text-lg font-semibold mb-6 text-[#222]">PROFILE INFORMATION</h2>
                <div className="flex gap-10">
                  <div className="flex-1 flex flex-col gap-3">
                    <div><span className="font-medium text-[#888]">Name</span><br /><span className="text-[#222]">{user.name}</span></div>
                    <div><span className="font-medium text-[#888]">E-mail</span><br /><span className="text-[#222]">{user.email}</span></div>
                    <div><span className="font-medium text-[#888]">Telephone number</span><br /><span className="text-[#222]">{user.phone}</span></div>
                    <div><span className="font-medium text-[#888]">Password</span><br /><span className="text-[#222]">********</span></div>
                    <div className="text-xs text-[#888] mt-4">
                      {user.newsletter
                        ? 'You are subscribed to the Marcello Vastore newsletter.'
                        : 'You are not subscribed to the Marcello Vastore newsletter.'}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-3 border-l pl-8">
                    <div className="mb-4">
                      <span className="font-medium text-[#888]">Billing address</span><br />
                      <span className="text-[#222]">
                        {user.billingName}<br />
                        {typeof user.billingAddress === 'string' ? user.billingAddress : (user.billingAddress?.address || '')}<br />
                        {user.phone}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="font-medium text-[#888]">Shipping address</span><br />
                      <span className="text-[#222]">
                        {user.shippingName}<br />
                        {typeof user.shippingAddress === 'string' ? user.shippingAddress : (user.shippingAddress?.address || '')}<br />
                        {user.phone}
                      </span>
                    </div>
                    <div className="text-xs text-[#888] mt-2">Billing name and address must match the credit card you will be using.</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
