"use client";

import { useState, useEffect } from "react";
import { ListingHeader } from "../../(components)/listing-header";
import { ImageCarousel } from "../../(components)/image-carousel";
import { DescriptionBox } from "../../(components)/description-box";
import { AdditionalDetails } from "../../(components)/additional-details";
import { PriceContactBox } from "../../(components)/price-contact-box";
import { RelatedListings } from "../../(components)/related-listings";
import { FloatingActionButtons } from "../../(components)/floating-action-button";
import type { Listing, Seller } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { getListingById, getListingsByCategory } from "@/app/actions/listings";
import { getUserById } from "@/app/actions/users";

export default function ListingDetailsPage({
  params,
}: {
  params: { id: string; slug?: string };
}) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [relatedListings, setRelatedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);

  const fetchSellerDetails = async (userId: string) => {
    try {
      console.log({ userId });
      const userData = await getUserById(userId);
      if (userData) {
        setSeller(userData);
      }
      console.log({ userData });
    } catch (err) {
      console.error("Error fetching seller details:", err);
    }
  };

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);

        const fetchedListing = await getListingById(params.id);

        if (!fetchedListing) {
          throw new Error("Listing not found");
        }

        setListing(fetchedListing);
        if (fetchedListing.userId) {
          fetchSellerDetails(fetchedListing.userId);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load listing details. Please try again.");
        setLoading(false);
      }
    };

    const fetchRelatedListings = async () => {
      try {
        if (listing?.category) {
          const relatedItems = await getListingsByCategory(listing.category);

          const filteredListings = relatedItems.filter(
            (item) => item.$id !== params.id
          );
          console.log({ filteredListings });
          setRelatedListings(filteredListings.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching related listings:", err);
      }
    };

    fetchListingDetails();

    if (listing && listing.category) {
      fetchRelatedListings();
    }
  }, [params.id]);

  const additionalDetails = listing
    ? [
        { label: "Condition", value: listing.condition },
        { label: "Brand", value: listing.brand },
        { label: "Model", value: listing.model },
        { label: "Year", value: listing.year },
        { label: "Warranty", value: listing.warranty, fullWidth: true },
      ].filter((detail) => detail.value)
    : [];

  // Action handlers
  const handleMessage = () => {
    console.log("Message seller", listing?.seller?.id || listing?.userId);
    // Implement your messaging logic here
  };

  const handleCall = () => {
    console.log("Call seller", listing?.seller?.id || listing?.userId);
    // Implement your call logic here
  };

  const handleSave = () => {
    console.log("Save listing", listing?.$id);
    // Implement your save logic here
  };

  const handleShare = () => {
    if (typeof navigator.share === "function" && listing) {
      navigator
        .share({
          title: listing.title,
          text: `Check out this listing: ${listing.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      console.log("Share listing", listing?.$id);
      // Copy to clipboard or show a share modal
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold text-red-700">Error</h2>
          </div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
            <h2 className="text-lg font-semibold text-amber-700">
              Listing Not Found
            </h2>
          </div>
          <p className="text-amber-600">
            The listing you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Format the date for display
  const formattedDate = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString()
    : "Unknown date";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24">
        {/* Header */}
        <ListingHeader
          title={listing.title}
          category={listing.category}
          subcategory={listing.subcategory}
          location={listing.location}
          date={formattedDate}
          featured={listing.featured}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="w-full lg:w-2/3">
            {/* Image carousel */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <ImageCarousel images={listing.images} title={listing.title} />
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <DescriptionBox
                description={listing.description || "No description provided."}
              />
            </div>

            {/* Additional details */}
            {additionalDetails.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <AdditionalDetails details={additionalDetails} />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3">
            {/* Price and contact */}
            <div className="">
              <PriceContactBox
                price={listing.price || 0}
                seller={seller || undefined} // Remove the non-null assertion
                onMessage={handleMessage}
                onCall={handleCall}
                onSave={handleSave}
                onShare={handleShare}
              />
            </div>
          </div>
        </div>

        {/* Related listings */}
        {relatedListings.length > 0 && (
          <div className="mt-12">
            <RelatedListings listings={relatedListings} />
          </div>
        )}
      </div>

      {/* Floating action buttons (mobile only) */}
      <FloatingActionButtons
        price={listing.price || 0}
        onMessage={handleMessage}
        onCall={handleCall}
        onSave={handleSave}
        onShare={handleShare}
      />
    </div>
  );
}
