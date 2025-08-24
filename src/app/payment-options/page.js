import { PageLayout } from '@/components/layout/PageLayout';
import { CreditCard, Lock, Shield, RefreshCw } from 'lucide-react';

const paymentMethods = [
  {
    name: 'Credit & Debit Cards',
    description: 'We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover.',
    icon: CreditCard,
    details: [
      'Secure payment processing',
      'Supports 3D Secure authentication',
      'No additional fees'
    ]
  },
  {
    name: 'PayPal',
    description: 'Checkout quickly and securely using your PayPal account.',
    icon: Lock,
    details: [
      'Fast checkout',
      'Buyer protection',
      'No need to enter card details'
    ]
  },
  {
    name: 'Bank Transfer',
    description: 'Make a direct bank transfer. Your order will be processed once payment is received.',
    icon: RefreshCw,
    details: [
      'Bank details provided at checkout',
      'Processing may take 1-2 business days',
      'Please include your order number as reference'
    ]
  }
];

export default function PaymentOptions() {
  return (
    <PageLayout title="Payment Options">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Secure Payment Methods</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer multiple secure payment options to make your shopping experience convenient and safe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-black p-2 rounded-full text-white mr-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-medium">{method.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <ul className="space-y-2">
                    {method.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start">
              <div className="bg-black p-2 rounded-full text-white mr-4 mt-0.5 flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Secure Checkout</h3>
                <p className="text-gray-600 text-sm">
                  Your payment information is processed securely. We do not store credit card details on our servers. All transactions are encrypted using SSL technology.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>For any questions about payment methods, please contact our customer service.</p>
            <p className="mt-2">
              Email: <a href="mailto:payments@marcellovastore.com" className="text-black hover:underline">payments@marcellovastore.com</a>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
