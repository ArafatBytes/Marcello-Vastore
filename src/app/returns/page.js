import { PageLayout } from '@/components/layout/PageLayout';

export default function ReturnsExchanges() {
  return (
    <PageLayout title="Returns & Exchanges">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Easy Returns & Exchanges</h2>
            <p className="text-blue-700">
              Not completely satisfied with your purchase? We offer free returns within 14 days of delivery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>14-day return policy from the date of delivery</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Items must be unworn, undamaged, and in original packaging with tags attached</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free returns for all orders</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">How to Return</h2>
              <ol className="space-y-4 list-decimal pl-5">
                <li>Log in to your account and go to &apos;My Orders&apos;</li>
                <li>Select the item(s) you wish to return</li>
                <li>Print the return label and attach it to your package</li>
                <li>Drop off the package at your nearest shipping location</li>
              </ol>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Refund Information</h2>
            <p className="text-gray-600 mb-4">
              Once we receive your return, we will process your refund within 5-7 business days. The refund will be issued to your original payment method.
            </p>
            <p className="text-sm text-gray-500">
              Please note that shipping fees are non-refundable, and international returns may be subject to customs fees.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600">
              If you have any questions about returns or exchanges, please contact our customer service team at 
              <a href="mailto:returns@marcellovastore.com" className="text-black hover:underline ml-1">
                returns@marcellovastore.com
              </a>
              {' '}or call us at +1 (123) 456-7890.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
