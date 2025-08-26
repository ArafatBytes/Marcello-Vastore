'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Eye, EyeOff, Info, ClipboardList, Lock, Heart, CreditCard } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main className="bg-[#fafafa] min-h-screen flex items-center justify-center px-4 py-4">
      <div className="bg-white max-w-4xl w-full rounded-md shadow-sm border border-[#ede9df] flex flex-row px-4">
        {/* Sign-In Section */}
        <div className="flex-1 p-10 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Truck className="w-5 h-5 text-[#222]" />
            <Link href="#" className="underline text-[15px] text-[#222] font-medium hover:text-black">Check Order Status</Link>
          </div>
          <h2 className="text-[26px] font-bold text-[#222] mb-4">SIGN-IN</h2>
          <p className="text-[15px] text-[#222] mb-6">Sign-in with your email address and password</p>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-[14px] text-[#222] font-medium">Email Address <span className="text-[#888] font-normal">*</span></label>
              <input id="email" type="email" required placeholder="Email Address *" className="border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222]" />
            </div>
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="text-[14px] text-[#222] font-medium">Password <span className="text-[#888] font-normal">*</span></label>
              <input id="password" type={showPassword ? 'text' : 'password'} required placeholder="Password *" className="border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] pr-10" />
              <button type="button" className="absolute right-3 top-9 text-[#888]" tabIndex={-1} onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center mt-2 mb-2">
              <input type="checkbox" id="remember" className="accent-[#222] w-4 h-4 mr-2" />
              <label htmlFor="remember" className="text-[14px] text-[#222] mr-2">Remember Me</label>
              <span className="relative group ml-1">
                <Info className="w-4 h-4 text-[#888] cursor-pointer" />
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-[#222] text-white text-xs rounded px-3 py-2 shadow-lg z-50 opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-normal">
                  If checked, you’ll stay signed in on this device. Do not use on public computers.
                </span>
              </span>
              <div className="flex-1" />
              <Link href="#" className="text-[14px] text-[#222] underline ml-2">Forgot Password?</Link>
            </div>
            <button type="submit" className="w-full mt-2 bg-[#222] text-white rounded py-3 font-bold text-[16px] tracking-wider shadow-sm hover:bg-[#444] transition-colors">SIGN-IN</button>
          </form>
        </div>
        {/* Custom vertical divider */}
        <div className="self-stretch flex flex-col justify-center">
          <div className="mx-0 my-10 w-px bg-[#ede9df] h-[calc(100%-80px)]" />
        </div>
        {/* Create Account Section */}
        <div className="flex-1 p-10 flex flex-col" style={{marginTop: '56px'}}>
          <h2 className="text-[26px] font-bold text-[#222] mb-4">CREATE AN ACCOUNT</h2>
          <p className="text-[15px] text-[#222] mb-6">Register at Marcello Vastore to enjoy the benefits of your account:</p>
          <ul className="flex flex-col gap-4 mb-8">
            <li className="flex items-start gap-3 text-[15px] text-[#222]"><ClipboardList className="w-5 h-5 mt-0.5 text-[#222]" /><span><span className="font-bold">Discover latest news and exclusive offers.</span></span></li>
            <li className="flex items-start gap-3 text-[15px] text-[#222]"><Lock className="w-5 h-5 mt-0.5 text-[#222]" /><span><span className="font-bold">View your order history and saved addresses.</span></span></li>
            <li className="flex items-start gap-3 text-[15px] text-[#222]"><Heart className="w-5 h-5 mt-0.5 text-[#222]" /><span className="font-bold">Save items to your Wishlist.</span></li>
            <li className="flex items-start gap-3 text-[15px] text-[#222]"><CreditCard className="w-5 h-5 mt-0.5 text-[#222]" /><span className="font-bold">Checkout faster.</span></li>
          </ul>
          <Link href="/register">
          <button className="w-full border-2 border-[#222] text-[#222] rounded py-3 font-bold text-[16px] tracking-wider shadow-sm hover:bg-[#fafafa] transition-colors">CREATE ACCOUNT</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
