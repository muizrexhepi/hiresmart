"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import type { Listing, ListingStatus } from "@/lib/types";
import { deleteListing, getUserListings } from "../actions/listings";
import SavedUserListings from "./(components)/saved-user-listings";

export default function ProfilePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Fetch user listings
  useEffect(() => {
    const fetchListings = async () => {
      if (user?.$id) {
        setIsLoading(true);
        try {
          const userListings = await getUserListings(user.$id);
          setListings(userListings);
        } catch (error) {
          console.error("Error fetching listings:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isMounted && user) {
      fetchListings();
    }
  }, [user, isMounted]);

  // Use useEffect to ensure we're only running this client-side
  useEffect(() => {
    setIsMounted(true);

    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // Don't render until client-side
  if (!isMounted) {
    return null;
  }

  // If no user is logged in, don't render the page
  if (!user) {
    return null;
  }

  const userData = {
    name: user?.name || "User",
    avatar: user?.prefs?.avatar || "/placeholder.svg?height=100&width=100",
    memberSince: user?.registration
      ? new Date(user.registration).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.prefs?.location ?? "Not specified", // Avoids undefined errors
  };

  // Filter listings based on active tab and search query
  const filteredListings = listings.filter((listing) => {
    const matchesTab = activeTab === "all" || listing.status === activeTab;
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Count listings by status
  const counts = {
    all: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    pending: listings.filter((l) => l.status === "pending").length,
    sold: listings.filter((l) => l.status === "sold").length,
  };

  // Handle delete listing
  const handleDeleteClick = (id: string) => {
    setListingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (listingToDelete) {
      setIsLoading(true);
      try {
        const success = await deleteListing(listingToDelete);
        if (success) {
          setListings(
            listings.filter((listing) => listing.$id !== listingToDelete)
          );
        }
      } catch (error) {
        console.error("Error deleting listing:", error);
      } finally {
        setIsLoading(false);
        setDeleteDialogOpen(false);
        setListingToDelete(null);
      }
    }
  };

  // Get status badge
  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "sold":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <XCircle className="h-3 w-3 mr-1" /> Sold
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
              <AvatarImage src={userData.avatar} alt={user.name} />
              <AvatarFallback>
                {userData.name
                  ? userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {userData.name}
              </h1>
              {userData.memberSince && (
                <div className="flex items-center text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Member since {userData.memberSince}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {userData.email && <div>{userData.email}</div>}
                {userData.phone && <div>{userData.phone}</div>}
                {userData.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {userData?.location}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-auto mt-4 md:mt-0">
              <Link href="/profile/edit">
                <Button variant="outline" className="w-full md:w-auto">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900">My Listings</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Link href="/listing/new">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" /> Add New Listing
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="active">Active ({counts.active})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({counts.pending})
              </TabsTrigger>
              <TabsTrigger value="sold">Sold ({counts.sold})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <LoadingState />
              ) : (
                <ListingsGrid
                  listings={filteredListings}
                  onDelete={handleDeleteClick}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              {isLoading ? (
                <LoadingState />
              ) : (
                <ListingsGrid
                  listings={filteredListings}
                  onDelete={handleDeleteClick}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              {isLoading ? (
                <LoadingState />
              ) : (
                <ListingsGrid
                  listings={filteredListings}
                  onDelete={handleDeleteClick}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </TabsContent>

            <TabsContent value="sold" className="mt-6">
              {isLoading ? (
                <LoadingState />
              ) : (
                <ListingsGrid
                  listings={filteredListings}
                  onDelete={handleDeleteClick}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Saved Listings Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Saved Listings</h2>
          </div>
          <SavedUserListings />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden h-full">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardContent className="p-4">
            <div className="w-3/4 h-5 bg-gray-200 animate-pulse mb-2" />
            <div className="w-1/2 h-6 bg-gray-200 animate-pulse mb-4" />
            <div className="w-full h-4 bg-gray-200 animate-pulse mb-2" />
            <div className="w-1/3 h-3 bg-gray-200 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Listings Grid Component
interface ListingsGridProps {
  listings: Listing[];
  onDelete: (id: string) => void;
  getStatusBadge: (status: ListingStatus) => React.ReactNode;
}

function ListingsGrid({
  listings,
  onDelete,
  getStatusBadge,
}: ListingsGridProps) {
  // Empty state
  console.log({ listings });
  if (listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8 text-center"
      >
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No listings found
        </h3>
        <p className="text-gray-500 mb-4">
          You don&apos;t have any listings that match your criteria.
        </p>
        <Link href="/listing/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add New Listing
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {listings.map((listing) => (
          <motion.div
            key={listing.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img
                  src={listing.images?.[0] || "/assets/icons/placeholder.svg"}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(listing.status)}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {listing.title}
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/listing/${listing.$id}/edit`}>
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDelete(listing.$id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-lg font-bold text-gray-900 mb-2">
                  {listing.price !== null && listing.price !== undefined
                    ? `$${Number(listing.price).toLocaleString()}`
                    : "Contact for price"}
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing?.location ? listing.location : "Not specified"}
                  </div>
                  {listing.category && <div>• {listing.category}</div>}
                </div>

                <div className="text-xs text-gray-400">
                  Listed on {new Date(listing.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
