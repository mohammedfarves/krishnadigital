import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

const bestSellers = [
  {
    id: 5,
    name: "Bajaj Ceiling Fan",
    icon: "fan",
    originalPrice: 2499,
    salePrice: 1299,
    discount: 48,
    rating: 4.1,
    reviews: 23456,
  },
  {
    id: 6,
    name: "Philips LED Bulb 12W",
    icon: "lightbulb",
    originalPrice: 499,
    salePrice: 299,
    discount: 40,
    rating: 4.3,
    reviews: 18765,
  },
  {
    id: 7,
    name: "Prestige Mixer Grinder",
    icon: "blender",
    originalPrice: 4599,
    salePrice: 2999,
    discount: 35,
    rating: 4.2,
    reviews: 14234,
  },
];

export function BestSellers() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* 👉 Auto swipe hint (only once) */
  useEffect(() => {
    if (sessionStorage.getItem("best-seller-hint")) return;

    setTimeout(() => {
      sliderRef.current?.scrollTo({
        left: 300,
        behavior: "smooth",
      });
      sessionStorage.setItem("best-seller-hint", "true");
    }, 900);
  }, []);

  const onScroll = () => {
    if (!sliderRef.current) return;
    setActive(Math.round(sliderRef.current.scrollLeft / 300));
  };

  return (
    <section className="container mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Best Sellers</h2>

        {/* Swipe hint */}
        <motion.div
          className="md:hidden flex items-center gap-1 text-accent text-sm"
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          Swipe <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>

      {/* MOBILE SLIDER */}
      <div
        ref={sliderRef}
        onScroll={onScroll}
        className="
          md:hidden
          flex gap-6
          overflow-x-auto
          snap-x snap-mandatory
          pb-6
          px-[calc(50%-150px)]
          scrollbar-hide
        "
      >
        {bestSellers.map((product, i) => {
          const isActive = i === active;

          return (
            <motion.div
              key={product.id}
              className="snap-center min-w-[300px]"
              animate={{
                scale: isActive ? 1 : 0.92,
                opacity: isActive ? 1 : 0.55,
                y: isActive ? -4 : 0,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div
                className={`
                  rounded-2xl
                  transition-all duration-300
                  ${
                    isActive
                      ? "shadow-[0_18px_35px_-10px_rgba(0,0,0,0.18)] ring-1 ring-yellow-400/30"
                      : "shadow-sm"
                  }
                `}
              >
                <ProductCard product={product} variant="compact" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DOT INDICATORS */}
      <div className="md:hidden flex justify-center gap-2 mt-2">
        {bestSellers.map((_, i) => (
          <motion.span
            key={i}
            animate={{
              width: active === i ? 24 : 8,
              opacity: active === i ? 1 : 0.4,
            }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full bg-accent"
          />
        ))}
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
}
