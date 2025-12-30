import { Clock, Zap, Tv, Refrigerator, WashingMachine, AirVent } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

const dealProducts = [
  {
    id: 1,
    name: "Samsung 55\" Crystal 4K UHD Smart TV",
    icon: "tv",
    originalPrice: 74999,
    salePrice: 42999,
    discount: 43,
    rating: 4.5,
    reviews: 12453,
    badge: "Lightning Deal",
    emi: "₹2,049/mo",
  },
  {
    id: 2,
    name: "LG 260L 3 Star Frost Free Double Door Refrigerator",
    icon: "refrigerator",
    originalPrice: 32999,
    salePrice: 24999,
    discount: 24,
    rating: 4.3,
    reviews: 8234,
    badge: "Deal of the Day",
    emi: "₹1,199/mo",
  },
  {
    id: 3,
    name: "Whirlpool 7.5 Kg 5 Star Fully Automatic Washing Machine",
    icon: "washing-machine",
    originalPrice: 24999,
    salePrice: 16499,
    discount: 34,
    rating: 4.4,
    reviews: 5621,
    badge: "Lightning Deal",
    emi: "₹789/mo",
  },
  {
    id: 4,
    name: "Voltas 1.5 Ton 5 Star Inverter Split AC",
    icon: "air-vent",
    originalPrice: 52999,
    salePrice: 33999,
    discount: 36,
    rating: 4.2,
    reviews: 3456,
    badge: "Great Indian Sale",
    emi: "₹1,629/mo",
  },
];

export function DealOfTheDay() {
  return (
    <section className="container mt-8">
      <div className="bg-card rounded-lg p-4 shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent fill-accent" />
              Deal of the Day
            </h2>
            <div className="hidden sm:flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Ends in 05:23:45</span>
            </div>
          </div>
          <a href="#" className="text-krishna-blue-link hover:text-accent text-sm font-medium">
            View all deals →
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="deal" />
          ))}
        </div>
      </div>
    </section>
  );
}
