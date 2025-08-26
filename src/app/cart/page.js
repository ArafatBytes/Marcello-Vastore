// Cart page UI inspired by the provided image
import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck, RefreshCw, Shield, ArrowLeftRight, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function CartPage() {
  return (
    <main className="bg-white min-h-screen flex flex-col items-center px-0 py-0">
      {/* Progress Bar */}
      <div className="w-full max-w-[1240px] mx-auto mt-16 mb-10 px-8">
        <div className="relative w-full flex flex-col">
          {/* Step labels */}
          <div className="flex flex-row justify-between items-end w-full mb-1 px-8">
            <span className="text-[11px] font-bold tracking-wide text-[#222] uppercase text-center w-1/3">CART</span>
            <span className="text-[11px] font-bold tracking-wide text-[#222] opacity-70 uppercase text-center w-1/3">CHECKOUT</span>
            <span className="text-[11px] font-bold tracking-wide text-[#222] opacity-70 uppercase text-center w-1/3">CONFIRMATION</span>
          </div>
          {/* Progress bar and circles */}
          <div className="relative w-full flex items-center px-8" style={{height:'20px'}}>
            {/* Unfilled bar */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#ede9df] z-0" style={{left:'32px', right:'32px'}} />
            {/* Filled segment (active step) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#222] z-10" style={{left:'32px', width:'calc(33.33% - 2px)'}} />
            {/* Circles */}
            <div className="flex flex-row w-full relative z-20">
              {/* Step 1: Cart (active) */}
              <div className="flex w-1/3 justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-[#222] bg-[#222] flex items-center justify-center" />
              </div>
              {/* Step 2: Checkout */}
              <div className="flex w-1/3 justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-[#222] bg-[#fff] flex items-center justify-center" />
              </div>
              {/* Step 3: Confirmation */}
              <div className="flex w-1/3 justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-[#222] bg-[#fff] flex items-center justify-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row justify-center items-start gap-10 max-w-[1240px] mx-auto px-8">
        {/* Main Cart Area */}
        <div className="flex flex-col items-start" style={{width:'760px'}}>
          <div className="bg-gray-100 rounded-md flex flex-col items-center justify-center w-full min-h-[470px] py-20 px-16 shadow-sm border border-[#ede9df]" style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.03)'}}>
            <ShoppingBag className="h-12 w-12 text-[#222] mb-6" />
            <div className="text-[#444] text-base font-normal mb-4">Your cart is empty</div>
            <Link href="/collections" className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm">
              CONTINUE SHOPPING
            </Link>
          </div>
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
