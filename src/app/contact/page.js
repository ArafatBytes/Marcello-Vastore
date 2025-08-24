import { PageLayout } from '@/components/layout/PageLayout';

export default function Contact() {
  return (
    <PageLayout title="Contact Us">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions about our products or need assistance with an order? Fill out the form and our team will get back to you as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@marcellovastore.com</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+1 (123) 456-7890</p>
              <p className="text-sm text-gray-500 mt-1">Monday - Friday, 9am - 6pm EST</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">123 Fashion Street</p>
              <p className="text-gray-600">New York, NY 10001</p>
              <p className="text-gray-600">United States</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
