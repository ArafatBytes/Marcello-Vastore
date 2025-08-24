import { PageLayout } from '@/components/layout/PageLayout';

export default function AboutPage() {
  return (
    <PageLayout title="About Us">
      <p className="mb-8">
        Muse+Vues is a designer brand blending classic prep and quiet luxury—timeless pieces rooted in culture, crafted with care.
      </p>
      
      <div className="space-y-4 text-gray-600">
        <p>Registered Address: Unicorn Plaza (Level 3), 40/2, Shop no. 2, Gulshan 2, Dhaka 1212</p>
        <p>Trade Licence Number: TRAD/DNCC/010488/2024</p>
      </div>
    </PageLayout>
  );
}
