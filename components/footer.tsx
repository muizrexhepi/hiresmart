import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">About</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/trust"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/forum"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Forum
                </Link>
              </li>
              <li>
                <div className="flex flex-wrap gap-4 mt-2">
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Facebook
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Instagram
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} MakPlace. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <select className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm text-gray-600">
                <option>English</option>
                <option>Macedonian</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
