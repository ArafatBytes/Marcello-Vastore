'use client';
// Cart page UI inspired by the provided image
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, Truck, ArrowLeftRight, Lock, Minus, Plus, X, AlertTriangle, Tag } from 'lucide-react';
import CheckoutProgress from '@/components/ui/checkout-progress';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { isLoggedIn, getCurrentUser } from '@/utils/auth';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const [step, setStep] = React.useState(0); // 0 = cart, 1 = checkout, 2 = confirmation
  const [userInfo, setUserInfo] = React.useState(null);
  const [couponCode, setCouponCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if user came from checkout redirect
  const fromCheckout = searchParams.get('from') === 'checkout';
  
  // Load user information when component mounts or step changes to checkout
  React.useEffect(() => {
    if (step === 1 && isLoggedIn()) {
      loadUserInfo();
    }
  }, [step]);
  
  // Handle checkout redirect on mount
  React.useEffect(() => {
    if (fromCheckout && isLoggedIn()) {
      setStep(1); // Go directly to checkout phase
      // Clean up URL
      router.replace('/cart', { scroll: false });
    }
  }, [fromCheckout, router]);
  
  const loadUserInfo = async () => {
    try {
      const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
      const response = await fetch('/api/account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
      toast.error('Failed to load user information');
    }
  };
  
  const handleCheckout = () => {
    if (!isLoggedIn()) {
      // Redirect to login with checkout parameter
      router.push('/login?from=checkout');
      return;
    }
    
    // User is logged in, proceed to checkout
    setStep(1);
  };
  
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    setIsApplyingCoupon(true);
    try {
      // TODO: Implement coupon validation API
      // For now, simulate validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coupon validation - you'll implement this later
      if (couponCode.toLowerCase() === 'save10') {
        setDiscount(cart.totalPrice * 0.1);
        toast.success('Coupon applied! 10% discount');
      } else if (couponCode.toLowerCase() === 'save20') {
        setDiscount(cart.totalPrice * 0.2);
        toast.success('Coupon applied! 20% discount');
      } else {
        toast.error('Invalid coupon code');
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  
  const finalTotal = cart.totalPrice - discount;

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
                className="bg-gray-100 rounded-md flex flex-col w-full min-h-[470px] p-8 shadow-sm border border-[#ede9df] relative"
                style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.03)'}}
              >
                {cart.items.length === 0 ? (
                  // Empty cart display
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <ShoppingBag className="h-12 w-12 text-[#222] mb-6" />
                    <div className="text-[#444] text-base font-normal mb-4">Your cart is empty</div>
                    <Link href="/collections" className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm">
                      CONTINUE SHOPPING
                    </Link>
                  </div>
                ) : (
                  // Cart with items
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-[#222] text-xl font-bold">Shopping Cart</h2>
                      <span className="text-[#444] text-sm">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {cart.items.map((item) => (
                        <div key={item.key} className="bg-white rounded-lg p-4 shadow-sm border border-[#e5e5df] flex items-center gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <h3 className="font-medium text-[#222] mb-1">{item.name}</h3>
                            <p className="text-sm text-[#666] mb-2">Ref. {item.reference}</p>
                            <div className="flex items-center gap-4 text-sm text-[#666]">
                              <span>Size: {item.size}</span>
                              <div className="flex items-center gap-1">
                                <span>Color:</span>
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.color.hex }}
                                ></div>
                                <span>{item.color.name}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <p className="font-medium text-[#222]">${(item.price * item.quantity).toFixed(2)}</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-[#666]">${item.price.toFixed(2)} each</p>
                            )}
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.key)}
                            className="p-1 hover:bg-red-50 rounded text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Cart Summary */}
                    <div className="border-t border-[#e5e5df] pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#666]">Subtotal ({cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''})</span>
                        <span className="font-bold text-[#222] text-lg">${cart.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {cart.items.length > 0 && (
                  <div className="w-full flex justify-between mt-8">
                    <Link href="/collections" className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm">
                      CONTINUE SHOPPING
                    </Link>
                    <button
                      className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm"
                      onClick={handleCheckout}
                    >
                      CHECKOUT
                    </button>
                  </div>
                )}
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
                  <div className="text-[#222] text-xl font-bold mb-6">Checkout</div>
                  
                  {/* User Information Section */}
                  {userInfo && (
                    <div className="mb-8">
                      <h3 className="text-[#222] text-lg font-semibold mb-4">Your Information</h3>
                      
                      {/* Warning Message */}
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-orange-800">
                          <p className="font-medium mb-1">Need to update your information?</p>
                          <p>You can modify your shipping and billing addresses in the <Link href="/account" className="underline font-medium">Account Center</Link>.</p>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-lg p-4 border border-[#e5e5df]">
                          <h4 className="font-semibold text-[#222] mb-3">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Name:</span> {userInfo.name}</p>
                            <p><span className="font-medium">Email:</span> {userInfo.email}</p>
                            {userInfo.phone && <p><span className="font-medium">Phone:</span> {userInfo.phone}</p>}
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-[#e5e5df]">
                          <h4 className="font-semibold text-[#222] mb-3">Shipping Address</h4>
                          <div className="text-sm">
                            {userInfo.shippingAddress ? (
                              <p className="whitespace-pre-line">{userInfo.shippingAddress}</p>
                            ) : (
                              <p className="text-[#666] italic">No shipping address on file</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Billing Address */}
                      <div className="bg-white rounded-lg p-4 border border-[#e5e5df] mb-6">
                        <h4 className="font-semibold text-[#222] mb-3">Billing Address</h4>
                        <div className="text-sm">
                          {userInfo.billingAddress ? (
                            <p className="whitespace-pre-line">{userInfo.billingAddress}</p>
                          ) : (
                            <p className="text-[#666] italic">Same as shipping address</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Order Summary */}
                  <div className="mb-8">
                    <h3 className="text-[#222] text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="bg-white rounded-lg p-6 border border-[#e5e5df]">
                      {/* Items */}
                      <div className="space-y-4 mb-6">
                        {cart.items.map((item) => (
                          <div key={item.key} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                            <div className="w-16 h-16 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-[#222] text-sm">{item.name}</h4>
                              <p className="text-xs text-[#666]">Size: {item.size} | Color: {item.color.name}</p>
                              <p className="text-xs text-[#666]">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-[#222] text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Totals */}
                      <div className="space-y-2 pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#666]">Subtotal ({cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''})</span>
                          <span className="text-[#222]">${cart.totalPrice.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-[#222] pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coupon Section */}
                  <div className="mb-6">
                    <h3 className="text-[#222] text-lg font-semibold mb-4">Apply Coupon <span className="text-sm font-normal text-[#666]">(Optional)</span></h3>
                    <div className="bg-white rounded-lg p-6 border border-[#e5e5df]">
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666]" />
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#e5e5df] rounded-md focus:outline-none focus:border-[#222] text-sm"
                          />
                        </div>
                        <button
                          onClick={applyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="px-6 py-2 bg-[#222] text-white rounded-md font-medium hover:bg-[#444] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                          {isApplyingCoupon ? 'Applying...' : 'Calculate'}
                        </button>
                      </div>
                      {discount > 0 && (
                        <div className="mt-3 text-sm text-green-600 font-medium">
                          ✓ Coupon applied successfully! You saved ${discount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="w-full flex justify-between mt-8">
                  <button
                    className="px-8 py-2 bg-[#ede9df] text-[#222] rounded font-bold hover:bg-[#e5e5df] transition-colors text-base tracking-widest shadow-sm"
                    onClick={() => setStep(0)}
                  >
                    BACK TO CART
                  </button>
                  <button
                    className="px-8 py-2 bg-[#222] text-white rounded font-bold hover:bg-[#444] transition-colors text-base tracking-widest shadow-sm"
                    onClick={() => setStep(2)}
                  >
                    PROCEED TO PAYMENT
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
