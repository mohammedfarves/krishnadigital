import { Truck, Shield, Headphones, RefreshCw, CreditCard, Award } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders above ₹999",
  },
  {
    icon: Shield,
    title: "Genuine Products",
    description: "100% Authentic",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "10-day return policy",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Multiple options",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated helpline",
  },
  {
    icon: Award,
    title: "Brand Warranty",
    description: "Manufacturer warranty",
  },
];

export function TrustBadges() {
  return (
    <section className="container mt-8">
      <div className="bg-card rounded-lg p-6 shadow-card">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {badges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-accent/20 transition-colors">
                <badge.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-medium text-foreground text-sm">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
