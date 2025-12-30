import { ProductCard } from "@/components/product/ProductCard";

const showcaseProducts = [
  {
    id: 13,
    name: "Sony Bravia 65\" 4K Google TV",
    icon: "tv",
    originalPrice: 129999,
    salePrice: 89999,
    discount: 31,
    rating: 4.6,
    reviews: 4532,
    badge: "Top Rated",
    emi: "₹4,309/mo",
  },
  {
    id: 14,
    name: "Haier 320L Triple Door Refrigerator",
    icon: "refrigerator",
    originalPrice: 42999,
    salePrice: 32999,
    discount: 23,
    rating: 4.4,
    reviews: 2345,
    emi: "₹1,579/mo",
  },
  {
    id: 15,
    name: "IFB 8 Kg Front Load Washing Machine",
    icon: "washing-machine",
    originalPrice: 38999,
    salePrice: 28999,
    discount: 26,
    rating: 4.5,
    reviews: 3456,
    badge: "Premium",
    emi: "₹1,387/mo",
  },
  {
    id: 16,
    name: "Daikin 1.5 Ton 5 Star Inverter Split AC",
    Image: "tv.png",
    originalPrice: 64999,
    salePrice: 47999,
    discount: 26,
    rating: 4.7,
    reviews: 5678,
    badge: "Best Seller",
    emi: "₹2,299/mo",
  },
  {
    id: 17,
    name: "Bosch 2L Mixer Grinder 1000W",
    icon: "blender",
    originalPrice: 12999,
    salePrice: 8999,
    discount: 31,
    rating: 4.3,
    reviews: 7890,
    emi: "₹430/mo",
  },
  {
    id: 18,
    name: "Kent Pearl RO+UV Water Purifier",
    icon: "droplets",
    originalPrice: 21999,
    salePrice: 15999,
    discount: 27,
    rating: 4.2,
    reviews: 6543,
    emi: "₹765/mo",
  },
  {
    id: 19,
    name: "Elica 60cm Auto Clean Chimney",
    icon: "wind",
    originalPrice: 18999,
    salePrice: 12999,
    discount: 32,
    rating: 4.1,
    reviews: 2134,
    emi: "₹622/mo",
  },
  {
    id: 20,
    name: "Panasonic 23L Convection Microwave",
    icon: "microwave",
    originalPrice: 15999,
    salePrice: 11999,
    discount: 25,
    rating: 4.4,
    reviews: 3210,
    emi: "₹574/mo",
  },
];

export function ProductShowcase() {
  return (
    <section className="container mt-8">
      <div className="bg-card rounded-lg p-4 shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Top Picks For You
          </h2>
          <a href="#" className="text-krishna-blue-link hover:text-accent text-sm font-medium">
            See all →
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {showcaseProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
