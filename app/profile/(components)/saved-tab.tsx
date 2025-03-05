import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";

export function SavedTab() {
  const savedItems = [
    {
      id: 1,
      title: "iPhone 14 Pro",
      price: "€899",
      location: "Skopje, Center",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "Apartment",
      price: "€125,000",
      location: "Skopje, Center",
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Saved Items</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Items you've saved for later
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {savedItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="font-semibold text-lg mt-1">{item.price}</p>
                  <p className="text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {item.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-600 hover:bg-red-50"
                  >
                    Remove
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
