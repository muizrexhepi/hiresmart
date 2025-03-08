"use client";

import { useState, useEffect } from "react";
import { Listing, Seller } from "@/lib/types";
import { SellerProfileHeader } from "../(components)/seller-profile-header";
import { SellerListings } from "../(components)/seller-listings";
import { getUserListings } from "@/app/actions/listings";
import { getUserById } from "@/app/actions/users";

export default function SellerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);

        // Fetch the actual seller data using the getUserById function
        const sellerData = await getUserById(params.id);

        if (!sellerData) {
          setError("Seller not found");
          setLoading(false);
          return;
        }

        setSeller(sellerData);

        // Fetch the user's listings
        const userListings = await getUserListings(params.id);
        setListings(userListings);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setError("Failed to load seller information");
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

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-2">{error || "Seller not found"}</p>
          <p className="text-sm text-gray-400">
            The seller you&lsquo;re looking for might not exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  // Format the memberSince date if it's in ISO format
  const formattedMemberSince = (() => {
    try {
      if (seller.memberSince.includes("T")) {
        // If it's an ISO date string
        return new Date(seller.memberSince).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }
      return seller.memberSince;
    } catch (e) {
      return seller.memberSince;
    }
  })();

  // Create a complete seller object for the SellerProfileHeader
  const completeSellerProfile = {
    id: seller.id,
    name: seller.name,
    image: seller.image,
    rating: seller.rating,
    totalListings: seller.totalListings,
    memberSince: formattedMemberSince,
    verified: seller.verified,
    responseRate: seller.responseRate,
    responseTime: seller.responseTime,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        <SellerProfileHeader
          seller={completeSellerProfile}
          onContact={handleContact}
          onFollow={handleFollow}
          onShare={handleShare}
        />

        <SellerListings listings={listings} sellerId={seller.id} />
      </div>
    </div>
  );
}
