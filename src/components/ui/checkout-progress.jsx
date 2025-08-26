"use client";
import { motion } from 'framer-motion';

const steps = ["Cart", "Checkout", "Confirmation"];

export default function CheckoutProgress({ step = 0 }) {
  return (
    <div className="w-full max-w-[1240px] mx-auto mt-16 mb-10 px-8">
      <div className="flex flex-col">
        <div className="flex justify-between mb-2">
          {steps.map((label, i) => (
            <span
              key={label}
              className={`w-1/3 text-center text-xs font-bold uppercase ${i === step ? 'text-[#222]' : 'text-[#888]'}`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="relative flex items-center px-8" style={{height:'20px'}}>
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-[#ede9df]" />
          <motion.div
            className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-[#222] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: step === 0 ? 0.16 : 
                      step === 1 ? 0.5 : 
                      1 // 0% for step 0, 50% for step 1, 100% for step 2
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ 
              width: 'calc(100% - 64px)', // 100% - (left + right padding)
              zIndex: 2 
            }}
          />
          <div className="flex w-full relative z-10">
            {[0,1,2].map(i => (
              <div key={i} className="flex w-1/3 justify-center">
                <div className={`w-4 h-4 rounded-full border-2 ${i <= step ? 'bg-[#222] border-[#222]' : 'bg-[#fff] border-[#222]'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
