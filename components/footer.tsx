import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#023020] text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-black tracking-tight text-[#023020]">
                TvojPazar.mk
              </span>
            </Link>
            <p className="text-sm text-gray-300">
              Your trusted marketplace for buying and selling in Macedonia.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-green-400">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="hover:text-green-400">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="hover:text-green-400">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="hover:text-green-400">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-green-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-green-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-green-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-green-400">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400">
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">
              Stay updated with our latest offers and news.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="w-full bg-white text-[#023020] hover:bg-white/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-6 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} TvojPazar.mk. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
