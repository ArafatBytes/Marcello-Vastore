import { PageLayout } from '@/components/layout/PageLayout';

export default function SizeGuide() {
  return (
    <PageLayout title="Size Guide">
      <div className="space-y-8">
        <p>
          Use this guide to help you find your perfect fit. Please note that sizes may vary between different brands and styles.
        </p>
        
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Women&apos;s Clothing</h2>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Bust</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Waist</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <tr key={size} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{size}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{size === 'XS' ? '31-32"' : size === 'S' ? '33-34"' : size === 'M' ? '35-36"' : size === 'L' ? '37-38"' : '39-40"'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{size === 'XS' ? '24-25"' : size === 'S' ? '26-27"' : size === 'M' ? '28-29"' : size === 'L' ? '30-31"' : '32-33"'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{size === 'XS' ? '34-35"' : size === 'S' ? '36-37"' : size === 'M' ? '38-39"' : size === 'L' ? '40-41"' : '42-43"'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">How to Measure</h2>
          <ul className="list-decimal pl-5 space-y-2">
            <li><strong>Bust:</strong> Measure around the fullest part of your bust, keeping the tape measure horizontal.</li>
            <li><strong>Waist:</strong> Measure around the narrowest part of your natural waist.</li>
            <li><strong>Hips:</strong> Stand with your feet together and measure around the fullest part of your hips.</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> All measurements are in inches. If you&apos;re between sizes, we recommend sizing up for a more comfortable fit.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
