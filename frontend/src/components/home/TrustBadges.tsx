import { Truck, Shield, RotateCcw, Headset } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders above ₹999",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% safe & encrypted",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description: "We’re here to help",
  },
];

export function TrustBadges() {
  return (
    <section className="container mt-10">
      <div
        className="
          grid grid-cols-2 sm:grid-cols-4
          gap-4
          bg-gradient-to-br from-white via-yellow-50 to-white
          rounded-2xl
          p-5
          shadow-[0_20px_50px_-20px_rgba(255,193,7,0.4)]
        "
      >
        {badges.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.04 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            viewport={{ once: true }}
            className="
              group
              bg-white
              rounded-xl
              p-4
              text-center
              border border-yellow-200/40
              shadow-sm
              hover:shadow-[0_15px_35px_-15px_rgba(255,193,7,0.6)]
              transition-all
            "
          >
            {/* Icon */}
            <div
              className="
                mx-auto mb-3
                w-14 h-14
                rounded-full
                bg-gradient-to-br from-yellow-300 to-yellow-400
                flex items-center justify-center
                shadow-md
                group-hover:scale-110
                transition-transform
              "
            >
              <b.icon className="w-6 h-6 text-black" />
            </div>

            {/* Text */}
            <h4 className="text-sm font-semibold text-gray-900">
              {b.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {b.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
