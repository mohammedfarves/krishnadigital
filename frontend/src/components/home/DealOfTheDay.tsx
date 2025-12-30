import { Clock, Zap } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

const dealProducts = [
  {
    id: 1,
    name: 'Samsung 55" Crystal 4K UHD Smart TV',
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
    originalPrice: 24999,
    salePrice: 16499,
    discount: 34,
    rating: 4.4,
    reviews: 5621,
    badge: "Lightning Deal",
    emi: "₹789/mo",
  },
  // {
  //   id: 4,
  //   name: "Voltas 1.5 Ton 5 Star Inverter Split AC",
  //   originalPrice: 52999,
  //   salePrice: 33999,
  //   discount: 36,
  //   rating: 4.2,
  //   reviews: 3456,
  //   badge: "Great Indian Sale",
  //   emi: "₹1,629/mo",
  // },
];

export function DealOfTheDay() {
  return (
    <section className="mt-10 px-4 md:px-0">
      {/* GRADIENT CONTAINER */}
      <div
        className="
          rounded-3xl p-5 md:p-6
          bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
          shadow-2xl
          mobile-fade-up
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10 rounded-full
                bg-gradient-to-br from-yellow-400 to-yellow-300
                flex items-center justify-center
                shadow-lg
              "
            >
              <Zap className="w-5 h-5 text-black" />
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">
                Deal of the Day
              </h2>
              <div
                className="
                  mt-1 inline-flex items-center gap-1
                  text-xs font-medium
                  bg-red-500/20 text-red-300
                  px-2 py-0.5 rounded-full
                "
              >
                <Clock className="w-3 h-3" />
                Ends in 05:23:45
              </div>
            </div>
          </div>

          <a
            href="#"
            className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition"
          >
            View all →
          </a>
        </div>

        {/* PRODUCTS */}
        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {dealProducts.map((product, index) => (
            <div
              key={product.id}
              className="tap-scale mobile-fade-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <ProductCard product={product} variant="deal" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
