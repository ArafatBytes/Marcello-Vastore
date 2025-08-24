import { PageLayout } from '@/components/layout/PageLayout';

export default function TermsConditions() {
  return (
    <PageLayout title="Terms & Conditions">
      <div className="space-y-6">
        <p>
          Welcome to Marcello Vastore. These terms and conditions outline the rules and regulations for the use of our website and services.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Intellectual Property</h2>
        <p>
          The content, layout, design, and graphics on this website are protected by intellectual property laws. You may not reproduce, distribute, or use any content without our express written permission.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Orders and Payment</h2>
        <p>
          All orders are subject to availability and confirmation of the order price. We reserve the right to refuse or cancel any order for any reason at any time.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
        <p>
          Marcello Vastore shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our website or services.
        </p>
      </div>
    </PageLayout>
  );
}
