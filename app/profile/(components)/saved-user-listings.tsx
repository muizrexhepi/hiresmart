"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Trash2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Listing, SavedListing } from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getUserSavedListings } from "@/app/actions/saved";
import { getListingById } from "@/app/actions/listings";
import { useRouter } from "next/navigation";

// Saved User Listings Component
export default function SavedUserListings() {
  const [savedListings, setSavedListings] = useState<
    (SavedListing & { listing?: Listing })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingToRemove, setListingToRemove] = useState<string | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchSavedListings = async () => {
      if (!user?.$id) return;

      setIsLoading(true);
      try {
        // Get saved listings IDs
        const savedItems = await getUserSavedListings(user.$id);

        // Fetch full listing details for each saved item
        const listingsWithDetails = await Promise.all(
          savedItems.map(async (savedItem) => {
            const listingDetails = await getListingById(savedItem.listingId);
            return {
              ...savedItem,
              listing: listingDetails || undefined,
            };
          })
        );

        // Filter out any listings that couldn't be found (they may have been deleted)
        const validListings = listingsWithDetails.filter(
          (item) => item.listing !== undefined
        );

        setSavedListings(validListings);
      } catch (error) {
        console.error("Error fetching saved listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedListings();
  }, [user]);

  // Handle remove from saved
  const handleRemoveClick = (savedId: string) => {
    setListingToRemove(savedId);
    setRemoveDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!listingToRemove) return;

    try {
      // Toggle will remove the saved listing
      await toggleSavedListing(
        savedListings.find((s) => s.id === listingToRemove)?.listingId || "",
        user?.$id || ""
      );

      // Update state
      setSavedListings(
        savedListings.filter((listing) => listing.id !== listingToRemove)
      );
    } catch (error) {
      console.error("Error removing saved listing:", error);
    } finally {
      setRemoveDialogOpen(false);
      setListingToRemove(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
        );
      case "sold":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Sold</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (savedListings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center border rounded-lg">
        <div className="p-3 rounded-full bg-slate-100">
          <Heart className="w-8 h-8 text-slate-400" />
        </div>

        <h3 className="text-xl font-semibold">No saved listings</h3>

        <p className="text-sm text-slate-500">
          You haven&apos;t saved any listings yet. Browse listings and click the
          heart icon to save items.
        </p>

        <Link href="/search/all/all">
          <Button>Browse Listings</Button>
        </Link>
      </div>
    );
  }

  const handleClick = (listingId: string) => {
    router.push(`/listing/${listingId}/${listingId}}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {savedListings.map((savedItem) => (
          <Card
            key={savedItem.id}
            className="overflow-hidden"
            onClick={() => handleClick(savedItem.listingId)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  {savedItem.listing &&
                    getStatusBadge(savedItem.listing.status)}
                </div>

                {savedItem.listing?.images && savedItem.listing.images[0] ? (
                  <div className="relative w-full h-44">
                    <img
                      src={savedItem.listing.images[0]}
                      alt={savedItem.listing.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-44 bg-slate-100">
                    <span className="text-slate-400">No image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="mb-2 text-lg font-medium line-clamp-1">
                  {savedItem.listing?.title}
                </h3>

                <div className="mb-2 text-lg font-semibold text-primary">
                  {savedItem.listing?.price !== null &&
                  savedItem.listing?.price !== undefined
                    ? `$${Number(savedItem.listing.price).toLocaleString()}`
                    : "Contact for price"}
                </div>

                <div className="flex flex-col gap-1 mb-3 text-sm text-slate-500">
                  {savedItem.listing?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {savedItem.listing.location}
                    </div>
                  )}

                  {savedItem.listing?.category && (
                    <div className="flex items-center gap-1">
                      • {savedItem.listing.category}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Saved on{" "}
                    {new Date(savedItem.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleRemoveClick(savedItem.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove saved listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this listing from your saved items. You can
              always save it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Loading state component
function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="w-full h-44 bg-slate-200 animate-pulse"></div>
            <div className="p-4">
              <div className="w-3/4 h-6 mb-2 bg-slate-200 animate-pulse"></div>
              <div className="w-1/3 h-6 mb-3 bg-slate-200 animate-pulse"></div>
              <div className="w-full h-4 mb-2 bg-slate-200 animate-pulse"></div>
              <div className="w-2/3 h-4 mb-4 bg-slate-200 animate-pulse"></div>
              <div className="flex justify-end">
                <div className="w-24 h-8 bg-slate-200 animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper function to toggle saved status - include this if it's not imported
async function toggleSavedListing(
  listingId: string,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/saved-listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listingId, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle saved status");
    }

    const result = await response.json();
    return result.saved;
  } catch (error) {
    console.error("Error toggling saved listing:", error);
    throw error;
  }
}
