import { PageLayout } from '@/components/layout/PageLayout';

export default function TrackOrder() {
  return (
    <PageLayout title="Track Your Order">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">Track Your Order</h2>
          
          <p className="text-gray-600 mb-8">
            Enter your order number and email address to track the status of your order.
          </p>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="e.g., MV123456"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
            >
              Track Order
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 text-sm">
              If you&apos;re having trouble tracking your order, please contact our customer service team at 
              <a href="mailto:support@marcellovastore.com" className="text-black hover:underline ml-1">
                support@marcellovastore.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
