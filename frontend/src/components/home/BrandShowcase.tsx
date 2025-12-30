import { motion } from "framer-motion";

const brands = [
  { name: "Samsung", logo: "/brands/samsung.png" },
  { name: "LG", logo: "/brands/lg.png" },
  { name: "Sony", logo: "/brands/sony.png" },
  { name: "Whirlpool", logo: "/brands/whirlpool.png" },
  { name: "Voltas", logo: "/brands/voltas.png" },
  { name: "Daikin", logo: "/brands/daikin.png" },
  { name: "Panasonic", logo: "/brands/panasonic.png" },
  { name: "Philips", logo: "/brands/philips.png" },
  { name: "Bajaj", logo: "/brands/bajaj.png" },
  { name: "Prestige", logo: "/brands/prestige.png" },
];

export function BrandShowcase() {
  return (
    <section className="container mt-12">
      <h2 className="text-xl font-bold mb-5 text-center">
        Shop by Brand
      </h2>

      <div className="relative overflow-hidden rounded-2xl bg-white py-6 shadow">
        {/* Gradient fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Marquee */}
        <motion.div
          className="flex gap-12 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
          }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="
                min-w-[180px]
                h-[90px]
                flex items-center justify-center
                rounded-xl
                bg-gray-50
                hover:scale-105
                transition-transform
              "
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-10 object-contain opacity-90"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
