import { Home, Sofa, Package, Tv } from "lucide-react";

const categories = [
  { label: "Home Appliances", icon: Home },
  { label: "Furnitures", icon: Sofa },
  { label: "Plastic", icon: Package },
  { label: "Electronics", icon: Tv },
];

export function CategoryGrid() {
  return (
    <section className="relative z-10 mt-6">
      <div className="container">
        <div
          className="
            grid grid-cols-2 gap-4
            bg-white rounded-3xl
            p-4
            shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]
          "
        >
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="
                flex flex-col items-center justify-center
                bg-gray-50 rounded-2xl
                py-5
                shadow-sm
                active:scale-95
                transition
              "
            >
              <div
                className="
                  w-12 h-12 rounded-full
                  bg-yellow-400
                  flex items-center justify-center
                  mb-2
                "
              >
                <cat.icon className="w-6 h-6 text-black" />
              </div>

              <span className="text-sm font-semibold text-gray-900 text-center">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

