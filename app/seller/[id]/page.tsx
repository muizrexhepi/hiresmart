"use client";

import { useState, useEffect } from "react";
import { Listing } from "@/lib/types";
import { SellerProfileHeader } from "../(components)/seller-profile-header";
import { SellerListings } from "../(components)/seller-listings";
import { getUserListings } from "@/app/actions/listings";

export default function SellerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [seller, setSeller] = useState<{
    id: string;
    name: string;
    image: string;
    location: string;
    bio: string;
    rating: number;
    totalListings: number;
    memberSince: string;
    verified: boolean;
    responseRate: string;
    responseTime: string;
  } | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        // In a real implementation, you would fetch seller data from your API
        // For now, we'll use mock data
        const mockSeller = {
          id: params.id,
          name: "Alex Johnson",
          image: "/placeholder.svg?height=200&width=200",
          location: "skopje",
          bio: "Professional photographer and tech enthusiast with over 10 years of experience. I sell high-quality electronics and photography equipment that I've personally tested. Feel free to contact me with any questions about my listings!",
          rating: 4.8,
          totalListings: 12,
          memberSince: "March 2020",
          verified: true,
          responseRate: "98%",
          responseTime: "Within 2 hours",
        };

        setSeller(mockSeller);

        // Fetch the user's listings
        const userListings = await getUserListings(params.id);
        setListings(userListings);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [params.id]);

  // Action handlers
  const handleContact = () => {
    console.log("Contact seller");
    // Implement your contact logic here
  };

  const handleFollow = () => {
    console.log("Follow/unfollow seller");
    // Implement your follow logic here
  };

  const handleShare = () => {
    console.log("Share seller profile");
    // Implement your share logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-2">Seller not found</p>
          <p className="text-sm text-gray-400">
            The seller you're looking for might not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        <SellerProfileHeader
          seller={seller}
          onContact={handleContact}
          onFollow={handleFollow}
          onShare={handleShare}
        />

        <SellerListings listings={listings} sellerId={seller.id} />
      </div>
    </div>
  );
}
