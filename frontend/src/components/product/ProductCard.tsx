import { Star, Heart, ShoppingCart, Tv, Refrigerator, WashingMachine, AirVent, Fan, Lightbulb, Flame, Microwave, Droplets, Shirt, Wind, Sofa, BedDouble, Armchair, DoorOpen, BookOpen, Package, Headphones, Speaker, Wifi, Keyboard } from "lucide-react";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  tv: Tv,
  refrigerator: Refrigerator,
  "washing-machine": WashingMachine,
  "air-vent": AirVent,
  fan: Fan,
  lightbulb: Lightbulb,
  flame: Flame,
  microwave: Microwave,
  droplets: Droplets,
  shirt: Shirt,
  wind: Wind,
  vacuum: Wind,
  blender: Flame,
  sofa: Sofa,
  bed: BedDouble,
  chair: Armchair,
  door: DoorOpen,
  bookshelf: BookOpen,
  package: Package,
  headphones: Headphones,
  speaker: Speaker,
  wifi: Wifi,
  keyboard: Keyboard,
};

interface Product {
  id: number;
  name: string;
  icon?: string;
  image?: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  rating: number;
  reviews: number;
  badge?: string;
  emi?: string | null;
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "deal" | "compact";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.floor(rating)
                ? "text-accent fill-accent"
                : star <= rating
                ? "text-accent fill-accent/50"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderProductIcon = (iconName?: string) => {
    const IconComponent = iconName ? iconMap[iconName] : Package;
    const FinalIcon = IconComponent || Package;
    return <FinalIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground" />;
  };

  if (variant === "compact") {
    return (
      <div className="group bg-card rounded-lg p-3 border border-border hover:shadow-card-hover transition-all duration-200">
        {/* Image */}
        <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          {renderProductIcon(product.icon)}
        </div>

        {/* Title */}
        <h3 className="text-sm text-foreground line-clamp-2 mb-1 min-h-[40px]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          {renderStars(product.rating)}
          <span className="text-xs text-muted-foreground">
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.salePrice)}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="text-xs text-krishna-green font-medium">
            {product.discount}% off
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card rounded-lg p-3 border border-border hover:shadow-card-hover transition-all duration-200 relative">
      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 z-10 p-1.5 bg-card/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
        <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive" />
      </button>

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-2 left-2 z-10">
          <span className="krishna-deal-badge">{product.badge}</span>
        </div>
      )}

      {/* Image */}
      <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
        {renderProductIcon(product.icon)}
      </div>

      {/* Title */}
      <h3 className="text-sm text-foreground line-clamp-2 mb-2 min-h-[40px] group-hover:text-krishna-blue-link transition-colors">
        {product.name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        <div className="flex items-center bg-krishna-green/10 px-1.5 py-0.5 rounded text-xs">
          <span className="font-medium text-krishna-green">{product.rating}</span>
          <Star className="w-3 h-3 text-krishna-green fill-krishna-green ml-0.5" />
        </div>
        <span className="text-xs text-muted-foreground">
          ({product.reviews.toLocaleString()})
        </span>
      </div>

      {/* Price */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-bold text-foreground">
            {formatPrice(product.salePrice)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-krishna-green font-medium">
            {product.discount}% off
          </span>
          {product.emi && (
            <span className="text-xs text-muted-foreground">
              EMI from {product.emi}
            </span>
          )}
        </div>
      </div>

      {/* Free Delivery */}
      <p className="text-xs text-muted-foreground mb-3">
        Free delivery by <span className="font-medium text-foreground">Tomorrow</span>
      </p>

      {/* Add to Cart Button */}
      <button className="w-full bg-accent hover:bg-krishna-orange-hover text-primary font-medium py-2 rounded-full text-sm transition-colors flex items-center justify-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
}
