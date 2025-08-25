import { PageLayout } from '@/components/layout/PageLayout';
import Image from 'next/image';
import Link from 'next/link';

const recentlyViewed = [
  {
    src: '/images/products/black-dress.jpg',
    alt: 'Black Dress',
  },
  {
    src: '/images/products/white-dress.jpg',
    alt: 'White Dress',
  },
  {
    src: '/images/products/white-set.jpg',
    alt: 'White Set',
  },
  {
    src: '/images/products/grey-sweater.jpg',
    alt: 'Grey Sweater',
  },
];

export default function FavoritesPage() {
  return (
    <PageLayout title="">
      <div className="max-w-3xl mx-auto pt-10 pb-16 px-4 relative">
        <h1 className="text-xl font-semibold mb-8">Favorites</h1>
        <div className="mb-14">
          <p className="text-gray-400 mb-8">Your wishlist is empty</p>
          <p className="text-xs text-gray-400 mb-4">If you want to view your wishlist later</p>
          <div className="flex flex-col gap-4">
            <Link href="/login" className="block w-full text-center bg-black text-white py-3 text-base tracking-widest font-medium uppercase mb-2">Login</Link>
            <Link href="/register" className="block w-full text-center bg-black text-white py-3 text-base tracking-widest font-medium uppercase">Create an Account</Link>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-base font-normal mb-6">Recently viewed</h2>
          <div className="grid grid-cols-4 gap-1.5">
            {recentlyViewed.map((item, i) => (
              <div key={i} className="aspect-[3/4.5] bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                <Image src={item.src} alt={item.alt} width={220} height={330} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
