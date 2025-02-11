import { Button } from "@/components/ui/button";
import { Apple, Play } from "lucide-react";
import Image from "next/image";

export function DownloadApp() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="rounded-2xl bg-white border shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-serif text-[#023020] mb-4">
                Download Our Mobile App
              </h2>
              <p className="text-gray-600 mb-8">
                Get the best marketplace experience on your mobile device. Buy
                and sell on the go!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#023020] hover:bg-[#034530] text-white gap-2">
                  <Apple className="w-5 h-5" />
                  App Store
                </Button>
                <Button className="bg-[#023020] hover:bg-[#034530] text-white gap-2">
                  <Play className="w-5 h-5" />
                  Google Play
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] bg-gray-50">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Mobile App"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
