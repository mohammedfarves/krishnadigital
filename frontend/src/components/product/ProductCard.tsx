import { Star, Heart, ShoppingCart, Package } from "lucide-react";
import { motion } from "framer-motion";

export interface Product {
  id: number;
  name: string;
  image?: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="
        relative rounded-3xl bg-white
        p-4 shadow-md hover:shadow-xl transition
      "
    >
      {/* Wishlist */}
      <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
        <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
      </button>

      {/* IMAGE */}
      <div className="aspect-square rounded-2xl bg-gray-50 flex items-center justify-center mb-4 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <Package className="w-14 h-14 text-gray-400" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[40px]">
        {product.name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full">
          <span className="text-xs font-semibold text-green-700">
            {product.rating}
          </span>
          <Star className="w-3 h-3 text-green-600 fill-green-600" />
        </div>
        <span className="text-xs text-gray-500">
          ({product.reviews.toLocaleString()})
        </span>
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="flex gap-2 items-center">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.salePrice)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>
        <span className="text-xs text-green-600 font-semibold">
          {product.discount}% off
        </span>
      </div>

      {/* CTA */}
      <button
        className="
          w-full flex items-center justify-center gap-2
          py-2.5 rounded-full
          bg-gradient-to-r from-yellow-400 to-yellow-300
          text-black font-semibold text-sm
          shadow hover:shadow-lg
        "
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </motion.div>
  );
}
