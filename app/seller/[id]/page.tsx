"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import {
  SellerListings,
  type SellerListing,
} from "@/app/seller/(components)/seller-listings";
import { SellerProfileHeader } from "../(components)/seller-profile-header";
import { SellerReviews } from "../(components)/seller-reviews";

// Mock seller data
const mockSeller = {
  id: "user123",
  name: "Alex Johnson",
  image: "/placeholder.svg?height=200&width=200",
  location: "skopje",
  bio: "Professional photographer and tech enthusiast with over 10 years of experience. I sell high-quality electronics and photography equipment that I've personally tested. Feel free to contact me with any questions about my listings!",
  rating: 4.8,
  reviewCount: 32,
  memberSince: "March 2020",
  verified: true,
  responseRate: "98%",
  responseTime: "Within 2 hours",
  totalListings: 12,
  socialLinks: [
    {
      platform: "Instagram",
      url: "https://instagram.com/alexjohnson",
      icon: <Instagram className="h-5 w-5" />,
    },
    {
      platform: "Facebook",
      url: "https://facebook.com/alexjohnson",
      icon: <Facebook className="h-5 w-5" />,
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/alexjohnson",
      icon: <Twitter className="h-5 w-5" />,
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/alexjohnson",
      icon: <Linkedin className="h-5 w-5" />,
    },
  ],
};

// Mock listings data
const mockListings: SellerListing[] = [
  {
    id: "3",
    title: "iPhone 13 Pro - Like New",
    price: 750,
    location: "skopje",
    category: "electronics",
    subcategory: "phones",
    image: "/placeholder.svg?height=200&width=300&text=iPhone+13",
    date: "1 day ago",
  },
  {
    id: "8",
    title: "Canon EOS R5 Camera with 24-70mm Lens",
    price: 3200,
    location: "skopje",
    category: "electronics",
    subcategory: "cameras",
    image: "/placeholder.svg?height=200&width=300&text=Canon+Camera",
    date: "3 days ago",
  },
  {
    id: "9",
    title: "DJI Mavic Air 2 Drone - Barely Used",
    price: 800,
    location: "skopje",
    category: "electronics",
    subcategory: "cameras",
    image: "/placeholder.svg?height=200&width=300&text=DJI+Drone",
    date: "1 week ago",
  },
  {
    id: "10",
    title: 'MacBook Pro 16" 2021 - M1 Pro',
    price: 1800,
    location: "skopje",
    category: "electronics",
    subcategory: "laptops",
    image: "/placeholder.svg?height=200&width=300&text=MacBook",
    date: "2 weeks ago",
  },
  {
    id: "11",
    title: "Sony WH-1000XM4 Headphones",
    price: 280,
    location: "skopje",
    category: "electronics",
    subcategory: "audio",
    image: "/placeholder.svg?height=200&width=300&text=Sony+Headphones",
    date: "3 weeks ago",
  },
  {
    id: "12",
    title: 'iPad Pro 12.9" 2021 with Apple Pencil',
    price: 950,
    location: "skopje",
    category: "electronics",
    subcategory: "tablets",
    image: "/placeholder.svg?height=200&width=300&text=iPad+Pro",
    date: "1 month ago",
  },
];

// Mock reviews data
const mockReviews = [
  {
    id: "rev1",
    user: {
      name: "Sarah Miller",
      image: "/placeholder.svg?height=50&width=50&text=SM",
    },
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Alex was great to work with! The iPhone was exactly as described and in perfect condition. Fast shipping and great communication throughout the process.",
  },
  {
    id: "rev2",
    user: {
      name: "Michael Chen",
      image: "/placeholder.svg?height=50&width=50&text=MC",
    },
    rating: 5,
    date: "1 month ago",
    comment:
      "Excellent seller! The MacBook Pro was in pristine condition and Alex was very responsive to all my questions. Would definitely buy from again.",
  },
  {
    id: "rev3",
    user: {
      name: "Jessica Taylor",
      image: "/placeholder.svg?height=50&width=50&text=JT",
    },
    rating: 4,
    date: "2 months ago",
    comment:
      "Good experience overall. The camera was as described, though shipping took a bit longer than expected. Alex was communicative throughout the process.",
  },
  {
    id: "rev4",
    user: {
      name: "David Wilson",
      image: "/placeholder.svg?height=50&width=50&text=DW",
    },
    rating: 5,
    date: "3 months ago",
    comment:
      "Great seller! The drone was in perfect condition and Alex even included some extra accessories. Very happy with my purchase.",
  },
  {
    id: "rev5",
    user: {
      name: "Emma Rodriguez",
      image: "/placeholder.svg?height=50&width=50&text=ER",
    },
    rating: 5,
    date: "4 months ago",
    comment:
      "Alex is a fantastic seller. The iPad was exactly as described and arrived quickly. Very professional and responsive.",
  },
];

export default function SellerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [seller, setSeller] = useState(mockSeller);
  const [listings, setListings] = useState<SellerListing[]>(mockListings);
  const [reviews, setReviews] = useState(mockReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        <SellerProfileHeader
          seller={seller}
          onContact={handleContact}
          onFollow={handleFollow}
          onShare={handleShare}
        />

        <SellerReviews
          reviews={reviews}
          averageRating={seller.rating}
          totalReviews={seller.reviewCount}
        />

        <SellerListings listings={listings} sellerId={seller.id} />
      </div>
    </div>
  );
}
