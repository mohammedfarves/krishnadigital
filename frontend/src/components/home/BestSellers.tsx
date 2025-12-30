import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "@/components/product/ProductCard";

const bestSellers = [
  {
    id: 5,
    name: "Bajaj 1200mm Ceiling Fan",
    icon: "fan",
    originalPrice: 2499,
    salePrice: 1299,
    discount: 48,
    rating: 4.1,
    reviews: 23456,
    emi: null,
  },
  {
    id: 6,
    name: "Philips 9W LED Bulb (Pack of 4)",
    icon: "lightbulb",
    originalPrice: 599,
    salePrice: 349,
    discount: 42,
    rating: 4.4,
    reviews: 45678,
    emi: null,
  },
  {
    id: 7,
    name: "Prestige Induction Cooktop",
    icon: "flame",
    originalPrice: 3499,
    salePrice: 2199,
    discount: 37,
    rating: 4.3,
    reviews: 12345,
    emi: null,
  },
  {
    id: 8,
    name: "Morphy Richards OTG 25L",
    icon: "microwave",
    originalPrice: 8999,
    salePrice: 5999,
    discount: 33,
    rating: 4.2,
    reviews: 6789,
    emi: "₹287/mo",
  },
  {
    id: 9,
    name: "Butterfly Mixer Grinder 750W",
    icon: "blender",
    originalPrice: 4999,
    salePrice: 2999,
    discount: 40,
    rating: 4.0,
    reviews: 9876,
    emi: null,
  },
  {
    id: 10,
    name: "Havells Instant Water Heater 3L",
    icon: "droplets",
    originalPrice: 4599,
    salePrice: 3199,
    discount: 30,
    rating: 4.3,
    reviews: 5432,
    emi: null,
  },
  {
    id: 11,
    name: "Usha Steam Iron",
    icon: "shirt",
    originalPrice: 1999,
    salePrice: 1199,
    discount: 40,
    rating: 4.1,
    reviews: 7654,
    emi: null,
  },
  {
    id: 12,
    name: "Eureka Forbes Vacuum Cleaner",
    icon: "vacuum",
    originalPrice: 7999,
    salePrice: 5499,
    discount: 31,
    rating: 4.2,
    reviews: 3210,
    emi: "₹263/mo",
  },
];

export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="container mt-8">
      <div className="bg-card rounded-lg p-4 shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Best Sellers
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        >
          {bestSellers.map((product) => (
            <div key={product.id} className="min-w-[180px] md:min-w-[200px]">
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
