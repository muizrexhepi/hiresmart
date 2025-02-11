import { Shield, UserCheck, Clock, BadgeCheck } from "lucide-react";

export function TrustSafety() {
  return (
    <section className="py-16 bg-[#023020] text-white">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-serif mb-4">Trust & Safety</h2>
          <p className="text-gray-300">
            We prioritize your security and peace of mind when buying and
            selling
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: "Secure Transactions",
              description:
                "Protected payment methods and secure messaging system",
            },
            {
              icon: UserCheck,
              title: "Verified Users",
              description:
                "User verification system to ensure trusted community",
            },
            {
              icon: Clock,
              title: "24/7 Support",
              description: "Round-the-clock customer support for your needs",
            },
            {
              icon: BadgeCheck,
              title: "Quality Control",
              description:
                "Regular monitoring of listings for quality assurance",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <Icon className="w-10 h-10 mx-auto mb-4 text-green-400" />
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
