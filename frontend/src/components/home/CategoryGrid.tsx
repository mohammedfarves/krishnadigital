import { Home, Sofa, Package, Tv } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { 
    name: "Home Appliances", 
    icon: Home, 
    bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
    iconColor: "text-blue-600",
    deals: "Up to 55% off",
    href: "/products?category=home-appliances"
  },
  { 
    name: "Furnitures", 
    icon: Sofa, 
    bgColor: "bg-gradient-to-br from-amber-100 to-amber-200",
    iconColor: "text-amber-600",
    deals: "Up to 40% off",
    href: "/products?category=furnitures"
  },
  { 
    name: "Plastic", 
    icon: Package, 
    bgColor: "bg-gradient-to-br from-green-100 to-green-200",
    iconColor: "text-green-600",
    deals: "From ₹99",
    href: "/products?category=plastic"
  },
  { 
    name: "Electronics", 
    icon: Tv, 
    bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
    iconColor: "text-purple-600",
    deals: "Up to 60% off",
    href: "/products?category=electronics"
  },
];

export function CategoryGrid() {
  return (
    <section className="container px-3 sm:px-4 -mt-12 sm:-mt-16 relative z-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category, index) => (
          <Link
            key={category.name}
            to={category.href}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className="group bg-card rounded-xl p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 ${category.bgColor} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <category.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${category.iconColor}`} />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
              {category.name}
            </h3>
            <span className="text-xs sm:text-sm text-krishna-green font-medium">{category.deals}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
