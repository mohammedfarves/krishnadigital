import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

const showcaseProducts = [
  {
    id: 13,
    name: 'Sony Bravia 65" 4K Google TV',
    icon: "tv",
    originalPrice: 129999,
    salePrice: 89999,
    discount: 31,
    rating: 4.6,
    reviews: 4532,
    emi: "₹4,309/mo",
  },
  {
    id: 14,
    name: "Haier 320L Refrigerator",
    icon: "refrigerator",
    originalPrice: 42999,
    salePrice: 32999,
    discount: 23,
    rating: 4.4,
    reviews: 2345,
  },
  {
    id: 15,
    name: "LG 7kg Front Load Washing Machine",
    icon: "washing-machine",
    originalPrice: 38999,
    salePrice: 27999,
    discount: 28,
    rating: 4.5,
    reviews: 6123,
  },
];

export function ProductShowcase() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* Auto-slide hint once */
  useEffect(() => {
    if (sessionStorage.getItem("top-picks-hint")) return;

    setTimeout(() => {
      sliderRef.current?.scrollTo({
        left: 280,
        behavior: "smooth",
      });
      sessionStorage.setItem("top-picks-hint", "true");
    }, 900);
  }, []);

  const onScroll = () => {
    if (!sliderRef.current) return;
    setActive(Math.round(sliderRef.current.scrollLeft / 280));
  };

  return (
    <section className="container mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Top Picks For You</h2>

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
          flex gap-5
          overflow-x-auto
          snap-x snap-mandatory
          pb-6
          px-[calc(50%-140px)]
          scrollbar-hide
        "
      >
        {showcaseProducts.map((product, i) => {
          const isActive = i === active;

          return (
            <motion.div
              key={product.id}
              className="snap-center min-w-[280px]"
              animate={{
                scale: isActive ? 1 : 0.93,
                opacity: isActive ? 1 : 0.5,
                y: isActive ? -4 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div
                className={`
                  rounded-2xl transition-all duration-500
                  ${
                    isActive
                      ? "shadow-[0_16px_35px_-14px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,193,7,0.22)]"
                      : "shadow-sm"
                  }
                `}
              >
                <ProductCard product={product} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DOTS */}
      <div className="md:hidden flex justify-center gap-2 mt-2">
        {showcaseProducts.map((_, i) => (
          <motion.span
            key={i}
            animate={{
              width: active === i ? 22 : 7,
              opacity: active === i ? 1 : 0.4,
            }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full bg-accent"
          />
        ))}
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {showcaseProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
