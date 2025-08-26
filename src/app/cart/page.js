'use client';
// Cart page UI inspired by the provided image
import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck, ArrowLeftRight, Lock } from 'lucide-react';
import CheckoutProgress from '@/components/ui/checkout-progress';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

export default function CartPage() {
  const [step, setStep] = React.useState(0); // 0 = cart, 1 = checkout, 2 = confirmation

  return (
    <main className="bg-white min-h-screen flex flex-col items-center px-0 py-0">
      {/* Progress Bar */}
      <CheckoutProgress step={step} />
      <div className="w-full flex flex-row justify-center items-start gap-10 max-w-[1240px] mx-auto px-8">
        {/* Main Step Area */}
        <div className="flex flex-col items-start" style={{width:'760px'}}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-100 rounded-md flex flex-col items-center w-full min-h-[470px] p-8 shadow-sm border border-[#ede9df] relative"
                style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.03)'}}
              >
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <ShoppingBag className="h-12 w-12 text-[#222] mb-6" />
                  <div className="text-[#444] text-base font-normal mb-4">Your cart is empty</div>
                  <Link href="/collections" className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm">
                    CONTINUE SHOPPING
                  </Link>
                </div>
                <div className="w-full flex justify-end mt-8">
                  <button
                    className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm"
                    onClick={() => setStep(1)}
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-100 rounded-md flex flex-col w-full min-h-[470px] p-8 shadow-sm border border-[#ede9df] relative"
                style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.03)'}}
              >
                <div className="flex-1">
                  <div className="text-[#222] text-xl font-bold mb-4">Checkout</div>
                  <div className="text-[#444] text-base font-normal mb-4">Please review your order and enter your shipping details before proceeding to payment.</div>
                  {/* Place your form or summary here */}
                </div>
                <div className="w-full flex justify-between mt-8">
                  <button
                    className="px-8 py-2 bg-[#ede9df] text-[#222] rounded font-bold hover:bg-[#e5e5df] transition-colors text-base tracking-widest shadow-sm"
                    onClick={() => setStep(0)}
                  >
                    Back
                  </button>
                  <button
                    className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm"
                    onClick={() => setStep(2)}
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-100 rounded-md flex flex-col w-full min-h-[470px] p-8 shadow-sm border border-[#ede9df] relative"
                style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.03)'}}
              >
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-[#222] text-xl font-bold mb-4 text-center">Confirmation</div>
                  <div className="text-[#444] text-base font-normal mb-4 text-center max-w-md">Your order is almost complete! Click below to proceed to secure payment.</div>
                  {/* Place your order summary here */}
                </div>
                <div className="w-full flex justify-between mt-8">
                  <button
                    className="px-8 py-2 bg-[#ede9df] text-[#222] rounded font-bold hover:bg-[#e5e5df] transition-colors text-base tracking-widest shadow-sm"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm"
                    onClick={() => window.location.href = '/api/stripe/checkout'}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Side Info Area */}
        <div className="flex flex-col gap-0" style={{width:'370px'}}>
          {/* The Orange Box */}
          <div className="bg-gray-100 rounded-md p-6 flex flex-col shadow-sm border border-[#ede9df]" style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.03)'}}>
            <div className="font-bold text-[#222] text-[17px] mb-2 tracking-wide" style={{textTransform:'none'}}>THE ORANGE BOX</div>
            <div className="border-b border-[#e5e5df] my-2 w-full" />
            <div className="flex flex-row items-start gap-5 mt-1">
              <div className="w-24 h-24 aspect-square flex-shrink-0 bg-gray-300 rounded flex items-center justify-center text-gray-400 text-xs select-none">Image</div>
              <p className="text-[15px] text-[#444] leading-snug pt-1">All orders are delivered in an orange box tied with a Bolduc ribbon, with the exception of <a href="#" className="underline">certain items</a></p>
            </div>
          </div>
          {/* Divider */}
          <div className="h-[1px] my-2 w-full" />
          {/* Customer Service */}
          <div className="bg-gray-100 rounded-md p-6 flex flex-col shadow-sm border border-[#ede9df]" style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.03)'}}>
            <div className="font-bold text-[#222] text-[17px] mb-2 tracking-wide" style={{textTransform:'none'}}>CUSTOMER SERVICE</div>
            <div className="border-b border-[#e5e5df] my-3 w-full" />
            <div className="text-[15px] text-[#444] mb-3">
              Monday to Friday 9am - 9pm EST, Saturday 10am - 9pm EST : <a href="tel:8004414488" className="underline">800-441-4488</a>
            </div>
            <div className="border-b border-[#e5e5df] mb-3 w-full" />
            <div className="flex flex-row justify-between items-start w-full pt-2">
              <div className="flex flex-col items-center text-[14px] text-[#444] w-1/3">
                <Truck className="h-7 w-7 mb-1 text-[#222]" strokeWidth={1.3} />
                <span className="mt-0.5 text-center leading-tight">Free standard<br/>delivery</span>
              </div>
              <div className="flex flex-col items-center text-[14px] text-[#444] w-1/3">
                <ArrowLeftRight className="h-7 w-7 mb-1 text-[#222]" strokeWidth={1.3} />
                <span className="mt-0.5 text-center leading-tight">Returns &<br/>exchanges</span>
              </div>
              <div className="flex flex-col items-center text-[14px] text-[#444] w-1/3">
                <Lock className="h-7 w-7 mb-1 text-[#222]" strokeWidth={1.3} />
                <span className="mt-0.5 text-center leading-tight">Shop securely</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
