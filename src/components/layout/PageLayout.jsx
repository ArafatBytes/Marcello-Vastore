import { Navbar } from '@/components/ui/navbar';

export function PageLayout({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Page Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 justify-center text-center">{title}</h1>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg text-gray-600">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
