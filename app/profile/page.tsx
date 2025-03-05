"use client";

import { useState } from "react";
import Image from "next/image";
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

// Types
type ListingStatus = "active" | "pending" | "sold";

interface Listing {
  id: string;
  title: string;
  price: number | null;
  location: string;
  status: ListingStatus;
  image: string;
  category: string;
  createdAt: string;
}

// Mock user data
const userData = {
  name: "Alex Johnson",
  avatar: "/placeholder.svg?height=100&width=100",
  memberSince: "March 2022",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
};

// Mock listings data
const mockListings: Listing[] = [
  {
    id: "1",
    title: "2019 Toyota Camry - Excellent Condition",
    price: 18500,
    location: "Brooklyn, NY",
    status: "active",
    image: "/placeholder.svg?height=200&width=300&text=Toyota+Camry",
    category: "Vehicles",
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    title: "iPhone 13 Pro - Like New",
    price: 750,
    location: "Manhattan, NY",
    status: "pending",
    image: "/placeholder.svg?height=200&width=300&text=iPhone",
    category: "Electronics",
    createdAt: "2023-11-02",
  },
  {
    id: "3",
    title: "Professional Photography Services",
    price: 150,
    location: "Queens, NY",
    status: "active",
    image: "/placeholder.svg?height=200&width=300&text=Photography",
    category: "Services",
    createdAt: "2023-11-10",
  },
  {
    id: "4",
    title: "Vintage Leather Sofa",
    price: 450,
    location: "Bronx, NY",
    status: "sold",
    image: "/placeholder.svg?height=200&width=300&text=Sofa",
    category: "Furniture",
    createdAt: "2023-09-28",
  },
  {
    id: "5",
    title: "Mountain Bike - Professional",
    price: 1200,
    location: "Staten Island, NY",
    status: "active",
    image: "/placeholder.svg?height=200&width=300&text=Bike",
    category: "Sports",
    createdAt: "2023-10-05",
  },
  {
    id: "6",
    title: "Web Development Services",
    price: null,
    location: "Remote",
    status: "active",
    image: "/placeholder.svg?height=200&width=300&text=Web+Dev",
    category: "Services",
    createdAt: "2023-11-15",
  },
];

export default function ProfilePage() {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Filter listings based on active tab and search query
  const filteredListings = listings.filter((listing) => {
    const matchesTab = activeTab === "all" || listing.status === activeTab;
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase());
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

  const confirmDelete = () => {
    if (listingToDelete) {
      setListings(listings.filter((listing) => listing.id !== listingToDelete));
      setDeleteDialogOpen(false);
      setListingToDelete(null);
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
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {userData.name}
              </h1>
              <div className="flex items-center text-gray-500 mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Member since {userData.memberSince}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>{userData.email}</div>
                <div>{userData.phone}</div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {userData.location}
                </div>
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
              <ListingsGrid
                listings={filteredListings}
                onDelete={handleDeleteClick}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              <ListingsGrid
                listings={filteredListings}
                onDelete={handleDeleteClick}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <ListingsGrid
                listings={filteredListings}
                onDelete={handleDeleteClick}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="sold" className="mt-6">
              <ListingsGrid
                listings={filteredListings}
                onDelete={handleDeleteClick}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>
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
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  className="object-cover"
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
                      <Link href={`/listing/${listing.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDelete(listing.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-lg font-bold text-gray-900 mb-2">
                  {listing.price !== null
                    ? `$${listing.price.toLocaleString()}`
                    : "Contact for price"}
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.location}
                  </div>
                  <div>• {listing.category}</div>
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
