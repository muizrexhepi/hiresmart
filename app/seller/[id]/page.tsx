"use client";

import { useState, useEffect } from "react";
import { Listing, Seller } from "@/lib/types";
import { SellerListings } from "../(components)/seller-listings";
import { getUserListings } from "@/app/actions/listings";
import { getUserById } from "@/app/actions/users";
import { useAuth } from "@/components/providers/auth-provider";
import { RateSeller } from "../(components)/seller-rating";
import { SellerProfileHeader } from "../(components)/seller-profile-header";

export default function SellerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
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
        console.log({ sellerData });
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
    if (seller?.phone) {
      // If the seller has a phone number, prompt to call or message
      const choice = window.confirm(
        "Would you like to call this seller? Click OK to call or Cancel to message."
      );
      if (choice) {
        // Call the seller
        window.location.href = `tel:${seller.phone}`;
      } else {
        // Send SMS if on mobile
        if (/Android|iPhone/i.test(navigator.userAgent)) {
          window.location.href = `sms:${seller.phone}`;
        } else {
          // Fallback for desktop - just show the number
          alert(`Seller's phone number: ${seller.phone}`);
        }
      }
    } else {
      // If no phone number, show a message
      alert("This seller hasn't provided a contact number yet.");
    }
  };

  const handleFollow = () => {
    console.log("Follow/unfollow seller");
    // Implement your follow logic here
  };

  const handleShare = () => {
    console.log("Share seller profile");
    // Implement your share logic here
  };

  // Handle rating updates
  const handleRatingSubmit = async (newRating: number) => {
    if (seller) {
      // Update seller rating in local state to reflect change immediately
      // This is a simplification - the actual average is calculated server-side
      setSeller({
        ...seller,
        rating: newRating,
      });
    }
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
      if (seller.memberSince && seller.memberSince.includes("T")) {
        // If it's an ISO date string
        return new Date(seller.memberSince).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }
      return seller.memberSince || "Unknown";
    } catch (e) {
      return seller.memberSince || "Unknown";
    }
  })();

  // Create a complete seller object for the SellerProfileHeader
  const completeSellerProfile = {
    id: seller.id,
    name: seller.name,
    image: seller.image,
    rating: seller.rating || 0,
    totalListings: seller.totalListings || 0,
    memberSince: formattedMemberSince,
    verified: seller.verified || false,
    responseRate: seller.responseRate || "N/A",
    responseTime: seller.responseTime || "N/A",
    phone: seller.phone || "",
    location: seller.location || "",
    bio: seller.bio || "",
    totalRatings: seller.totalRatings || 0,
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

        {/* Only show rating component if user is logged in and isn't viewing their own profile */}
        {user && user.$id !== seller.id && (
          <RateSeller
            sellerId={seller.id}
            onRatingSubmit={handleRatingSubmit}
          />
        )}

        <SellerListings listings={listings} sellerId={seller.id} />
      </div>
    </div>
  );
}
