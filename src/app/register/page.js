'use client';
import React, { useState } from 'react';
import { Info, User, Mail, Phone, Lock, MapPin, Home, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneInput } from '@/components/ui/phone-input';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingSame, setBillingSame] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  // Add missing phone state
  const [phone, setPhone] = useState('');

  // Add missing password states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password validation logic
  function validatePassword(pw) {
    if (!pw || pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[a-zA-Z]/.test(pw)) return 'Password must contain a letter.';
    if (!/[0-9]/.test(pw)) return 'Password must contain a number.';
    return '';
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  }
  function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError(validatePassword(password));
    }
  }

  // Sync billing address with shipping if checkbox checked
  React.useEffect(() => {
    if (billingSame) setBillingAddress(shippingAddress);
  }, [billingSame, shippingAddress]);

  return (
    <main className="bg-[#fafafa] min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        className="bg-white max-w-lg w-full rounded-md shadow-md border border-[#ede9df] p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 className="text-[28px] font-bold text-[#222] mb-2 text-center tracking-tight">Create Your Account</h2>
        <p className="text-[15px] text-[#444] mb-8 text-center">Sign up to Marcello Vastore for a personalized shopping experience.</p>
        <form className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-[14px] text-[#222] font-medium">Full Name <span className="text-[#888] font-normal">*</span></label>
            <div className="relative flex items-center">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-5 h-5" />
              <input id="name" type="text" required placeholder="Full Name *" className="pl-10 border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] w-full" />
            </div>
          </div>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[14px] text-[#222] font-medium">Email <span className="text-[#888] font-normal">*</span></label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-5 h-5" />
              <input id="email" type="email" required placeholder="Email *" className="pl-10 border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] w-full" />
            </div>
          </div>
          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-[14px] text-[#222] font-medium">Phone Number <span className="text-[#888] font-normal">*</span></label>
            <div className="w-full">
              <PhoneInput className="w-full" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
          {/* Passwords */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="password" className="text-[14px] text-[#222] font-medium">Password <span className="text-[#888] font-normal">*</span></label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password *"
                  className="pl-10 border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] w-full"
                  minLength={8}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]" tabIndex={-1} onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`text-xs mt-1 ${passwordError ? 'text-red-500' : 'text-green-600'}`}
                  >
                    {passwordError ? passwordError : 'Password is valid.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="confirmPassword" className="text-[14px] text-[#222] font-medium">Confirm Password <span className="text-[#888] font-normal">*</span></label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm Password *"
                  className="pl-10 border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] w-full"
                  minLength={8}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]" tabIndex={-1} onClick={() => setShowConfirmPassword(v => !v)} aria-label="Toggle password visibility">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`text-xs mt-1 ${confirmPassword !== password ? 'text-red-500' : !passwordError && confirmPassword ? 'text-green-600' : ''}`}
                  >
                    {confirmPassword !== password ? 'Passwords do not match.' : (!passwordError && confirmPassword ? 'Passwords match.' : '')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Shipping Address */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shipping" className="text-[14px] text-[#222] font-medium">Shipping Address <span className="text-[#888] font-normal">*</span></label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3 top-4 text-[#888] w-5 h-5" />
              <textarea id="shipping" required placeholder="Shipping Address *" className="pl-10 border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] resize-none min-h-[56px] w-full" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} />
            </div>
          </div>
          {/* Billing Address */}
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" id="billingSame" checked={billingSame} onChange={e => setBillingSame(e.target.checked)} className="accent-[#222] w-4 h-4" />
            <label htmlFor="billingSame" className="text-[14px] text-[#222]">Billing address same as shipping address</label>
          </div>
          <motion.div
            className="flex flex-col gap-1"
            initial={false}
            animate={billingSame ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <label htmlFor="billing" className="text-[14px] text-[#222] font-medium">Billing Address <span className="text-[#888] font-normal">*</span></label>
            <div className="relative flex items-center">
              <Home className="absolute left-3 top-4 text-[#888] w-5 h-5" />
              <textarea id="billing" required placeholder="Billing Address *" className="pl-10 border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222] resize-none min-h-[56px] w-full" value={billingAddress} onChange={e => setBillingAddress(e.target.value)} disabled={billingSame} />
            </div>
          </motion.div>
          {/* Newsletter */}
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" id="newsletter" checked={subscribed} onChange={e => setSubscribed(e.target.checked)} className="accent-[#222] w-4 h-4" />
            <label htmlFor="newsletter" className="text-[14px] text-[#222]">Subscribe to Marcello Vastore newsletter</label>
            <span className="relative group">
              <Info className="w-4 h-4 text-[#888] cursor-pointer" />
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#222] text-white text-xs rounded px-3 py-2 shadow-lg z-50 opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-normal">
                Receive updates, offers, and news from Marcello Vastore. You can unsubscribe at any time.
              </span>
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-2 bg-[#222] text-white rounded py-3 font-bold text-[16px] tracking-wider shadow-sm hover:bg-[#444] transition-colors"
          >
            SIGN UP
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
