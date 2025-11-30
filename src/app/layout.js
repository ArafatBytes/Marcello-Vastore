import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Marcello Vastore",
  description: "Premium fashion for the modern individual",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased bg-white`}
      >
        <CartProvider>
          <FavoritesProvider>
            <RecentlyViewedProvider>
              <Toaster position="top-center" />
              <Navbar />
              <main className="pt-16 min-h-screen">{children}</main>
              <Footer />
            </RecentlyViewedProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
