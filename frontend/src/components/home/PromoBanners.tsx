import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const banners = [
  {
    title: "TV Upgrade Sale",
    subtitle: "From ₹12,999",
    cta: "Shop Now",
    gradient: "from-yellow-400 via-yellow-300 to-yellow-500",
    text: "text-black",
  },
  {
    title: "Summer Cooling",
    subtitle: "ACs & Fans on Sale",
    cta: "Explore",
    gradient: "from-gray-900 via-gray-800 to-gray-900",
    text: "text-white",
  },
];

export function PromoBanners() {
  return (
    <section className="container mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banners.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`
              relative overflow-hidden
              rounded-2xl p-6
              bg-gradient-to-br ${b.gradient}
              shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]
            `}
          >
            {/* Glow overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className={`relative z-10 ${b.text}`}>
              <h3 className="text-xl font-bold mb-1">
                {b.title}
              </h3>
              <p className="text-sm opacity-90 mb-4">
                {b.subtitle}
              </p>

              <button
                className="
                  inline-flex items-center gap-2
                  bg-black/80 text-white
                  px-4 py-2 rounded-full text-sm font-medium
                  hover:bg-black transition
                "
              >
                {b.cta}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Decorative blur */}
            <div
              className="
                absolute -bottom-10 -right-10
                w-40 h-40 rounded-full
                bg-white/20 blur-3xl
              "
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
