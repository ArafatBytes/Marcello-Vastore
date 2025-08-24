import { PageLayout } from '@/components/layout/PageLayout';

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-7 business days within the country. International shipping may take 7-14 business days depending on the destination.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship worldwide. International shipping rates and delivery times vary by destination.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 14 days of delivery. Items must be unworn, undamaged, and in their original packaging with tags attached.'
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a confirmation email with tracking information. You can also track your order by logging into your account.'
  },
  {
    question: 'Do you offer exchanges?',
    answer: 'Yes, we offer exchanges for a different size or color, subject to availability. Please contact our customer service team to initiate an exchange.'
  }
];

export default function FAQ() {
  return (
    <PageLayout title="Frequently Asked Questions">
      <div className="space-y-6">
        <p className="text-gray-600">
          Can&apos;t find what you&apos;re looking for? Contact our customer service team for further assistance.
        </p>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-gray-50 p-6 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Our customer service team is here to help. Contact us at support@marcellovastore.com or call us at +1 (123) 456-7890.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
