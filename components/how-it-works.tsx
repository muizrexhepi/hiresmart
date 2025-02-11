import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Upload, ShoppingBag } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Find What You Need",
      description:
        "Browse through thousands of listings across various categories",
    },
    {
      icon: Upload,
      title: "Post Your Items",
      description:
        "List your items for sale in minutes with our easy-to-use interface",
    },
    {
      icon: ShoppingBag,
      title: "Buy & Sell Safely",
      description: "Connect with buyers and sellers in your area securely",
    },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-serif mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            Your trusted marketplace for buying and selling in Macedonia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="text-center border-none shadow-none bg-transparent"
              >
                <CardHeader>
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#023020] text-white flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
