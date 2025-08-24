import { PageLayout } from '@/components/layout/PageLayout';

export default function PrivacyPolicy() {
  return (
    <PageLayout title="Privacy Policy">
      <div className="space-y-6">
        <p>
          At Marcello Vastore, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or make a purchase from us.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p>
          We collect information that you provide to us directly, such as when you create an account, place an order, or contact us. This may include your name, email address, shipping address, payment information, and phone number.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p>
          We use the information we collect to process your orders, communicate with you, improve our products and services, and comply with legal obligations.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information. Please contact us if you would like to exercise any of these rights.
        </p>
      </div>
    </PageLayout>
  );
}
