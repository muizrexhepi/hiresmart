import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";

export function ServicesTab() {
  const listings = [
    {
      id: 1,
      title: "iPhone 14 Pro",
      price: "€899",
      location: "Skopje, Center",
      status: "Active",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "Apartment",
      price: "€125,000",
      location: "Skopje, Center",
      status: "Pending",
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-semibold">My Services</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your active and pending listings
          </p>
        </div>
        <Button>Add New Service</Button>
      </div>

      <div className="grid gap-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{listing.title}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        listing.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                  <p className="font-semibold text-lg mt-1">{listing.price}</p>
                  <p className="text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {listing.location}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
