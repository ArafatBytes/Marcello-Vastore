import { PageLayout } from '@/components/layout/PageLayout';

export default function ShippingReturns() {
  return (
    <PageLayout title="Shipping & Returns">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Shipping Policy</h2>
        <p>
          We offer worldwide shipping. Orders are typically processed within 1-2 business days. Shipping times vary depending on your location:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Standard Shipping: 5-7 business days</li>
          <li>Express Shipping: 2-3 business days</li>
          <li>International Shipping: 7-14 business days</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Returns & Exchanges</h2>
        <p>
          We accept returns within 14 days of delivery. Items must be unworn, undamaged, and in their original packaging with tags attached.
        </p>
        <p>
          To initiate a return, please contact our customer service team with your order number and reason for return. Once approved, you&apos;ll receive instructions for returning your items.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Refunds</h2>
        <p>
          Refunds will be processed within 5-7 business days after we receive and inspect the returned items. The refund will be issued to the original payment method.
        </p>
      </div>
    </PageLayout>
  );
}
