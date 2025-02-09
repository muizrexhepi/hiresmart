import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative py-12">
      <section className="bg-[#023020] min-h-[600px] relative overflow-hidden rounded-3xl">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
              Scale your professional <br />
              workforce with{" "}
              <span className="italic font-medium">freelancers</span>
            </h1>

            <div className="relative max-w-2xl mx-auto">
              <div className="flex">
                <Input
                  type="search"
                  placeholder="Search for any service..."
                  className="w-full h-14 pl-6 pr-12 text-lg rounded-l-lg rounded-r-none border-0"
                />
                <Button className="h-14 px-8 rounded-l-none bg-primary hover:bg-primary/90">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-16">
              <p className="text-gray-400 mb-6">Trusted by:</p>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {["Meta", "Google", "Netflix", "P&G", "PayPal", "Payoneer"].map(
                  (brand) => (
                    <span key={brand} className="text-gray-400 font-semibold">
                      {brand}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Images */}
        <div className="absolute top-1/4 left-16 w-48 h-48 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=192&width=192"
            alt="Freelancer"
            width={192}
            height={192}
            className="object-cover"
          />
        </div>
        <div className="absolute top-1/4 right-16 w-48 h-48 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=192&width=192"
            alt="Freelancer"
            width={192}
            height={192}
            className="object-cover"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {[
              { title: "Programming & Tech", icon: "💻" },
              { title: "Graphics & Design", icon: "🎨" },
              { title: "Digital Marketing", icon: "📱" },
              { title: "Writing & Translation", icon: "✍️" },
              { title: "Video & Animation", icon: "🎥" },
              { title: "AI Services", icon: "🤖" },
              { title: "Music & Audio", icon: "🎵" },
              { title: "Consulting", icon: "💡" },
            ].map((category) => (
              <button
                key={category.title}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm text-center font-medium">
                  {category.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
