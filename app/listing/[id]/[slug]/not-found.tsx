import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Listing Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        The listing you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
    </div>
  );
}
