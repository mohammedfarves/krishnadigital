import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Mega Electronics Sale",
    subtitle: "Up to 60% Off on TVs & Appliances",
    cta: "Shop Now",
    gradient: "from-yellow-400 via-yellow-300 to-yellow-200",
    dark: false,
  },
  {
    title: "Summer Cooling Fest",
    subtitle: "ACs starting from ₹15,999",
    cta: "Explore Deals",
    gradient: "from-gray-900 via-gray-800 to-black",
    dark: true,
  },
  {
    title: "Kitchen Essentials",
    subtitle: "Flat 40% Off on Appliances",
    cta: "View Collection",
    gradient: "from-amber-400 via-yellow-300 to-yellow-200",
    dark: false,
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((p) => (p + 1) % slides.length),
      4200
    );
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden rounded-b-3xl">
      <div className="relative h-[220px] sm:h-[300px] md:h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
          >
            {/* Overlay */}
            <div
              className={`absolute inset-0 ${
                slide.dark ? "bg-black/40" : "bg-white/10"
              }`}
            />

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container px-5">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-xl"
                >
                  <h1
                    className={`text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight ${
                      slide.dark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {slide.title}
                  </h1>

                  <p
                    className={`mt-2 text-sm sm:text-lg ${
                      slide.dark ? "text-white/80" : "text-gray-800"
                    }`}
                  >
                    {slide.subtitle}
                  </p>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="
                      mt-5 inline-flex items-center
                      px-6 py-3 rounded-full
                      bg-black text-yellow-400
                      font-semibold text-sm sm:text-base
                      shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)]
                    "
                  >
                    {slide.cta}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows (hidden on small mobile) */}
        <button
          onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
          className="
            hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2
            bg-white/80 p-2 rounded-full shadow
          "
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => setIndex((index + 1) % slides.length)}
          className="
            hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2
            bg-white/80 p-2 rounded-full shadow
          "
        >
          <ChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === index ? 18 : 6,
                opacity: i === index ? 1 : 0.5,
              }}
              className="h-2 rounded-full bg-black"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
