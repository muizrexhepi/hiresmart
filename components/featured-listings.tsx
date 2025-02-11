import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FeaturedListings() {
  // This would normally come from your API/database
  const featuredListings = [
    {
      id: 1,
      title: "iPhone 14 Pro",
      price: "€899",
      location: "Скопје, Центар",
      category: "Electronics",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Голем Стан во Центар",
      price: "€125,000",
      location: "Скопје, Центар",
      category: "Real Estate",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Mercedes-Benz C-Class",
      price: "€35,000",
      location: "Битола",
      category: "Vehicles",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Gaming Laptop Asus",
      price: "€1,200",
      location: "Тетово",
      category: "Electronics",
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif">Featured Listings</h2>
          <Button variant="ghost" className="gap-2">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium line-clamp-1">{listing.title}</h3>
                  <span className="text-green-600 font-semibold whitespace-nowrap">
                    {listing.price}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link
                  href={`/listing/${listing.id}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  View details
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
