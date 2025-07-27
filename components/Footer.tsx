import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold text-primary mb-4">OrinMart</h2>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Facebook />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Twitter />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Instagram />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Linkedin />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">INFORMATION</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">HELP</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">SOCIAL MEDIA</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2024 OrinMart. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <img src="/payment-methods/visa.svg" alt="Visa" className="h-8" />
            <img src="/payment-methods/mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="/payment-methods/paypal.svg" alt="Paypal" className="h-8" />
            <img src="/payment-methods/amex.svg" alt="American Express" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
}