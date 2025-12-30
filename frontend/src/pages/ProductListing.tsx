import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronDown, ChevronUp, X, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

// Category-wise products with icon names instead of emojis
const productsByCategory = {
  "home-appliances": [
    { id: 1, name: "Samsung Double Door Refrigerator 670L", icon: "refrigerator", originalPrice: 89990, salePrice: 64990, discount: 28, rating: 4.5, reviews: 12453, badge: "Bestseller", emi: "₹3,041/mo" },
    { id: 2, name: "LG 8kg Front Load Washing Machine", icon: "washing-machine", originalPrice: 45990, salePrice: 34990, discount: 24, rating: 4.4, reviews: 8234, emi: "₹1,636/mo" },
    { id: 3, name: "Whirlpool 1.5 Ton Inverter Split AC", icon: "air-vent", originalPrice: 52990, salePrice: 38990, discount: 26, rating: 4.3, reviews: 6543, badge: "Top Rated", emi: "₹1,822/mo" },
    { id: 4, name: "Prestige Induction Cooktop 2000W", icon: "flame", originalPrice: 4499, salePrice: 2699, discount: 40, rating: 4.2, reviews: 15678 },
    { id: 5, name: "Philips Air Fryer 4.5L", icon: "flame", originalPrice: 14995, salePrice: 8999, discount: 40, rating: 4.5, reviews: 9876, badge: "Deal" },
    { id: 6, name: "Bajaj Water Heater 25L", icon: "droplets", originalPrice: 8990, salePrice: 5990, discount: 33, rating: 4.1, reviews: 4532 },
    { id: 7, name: "Crompton Ceiling Fan 1400mm", icon: "fan", originalPrice: 2999, salePrice: 1899, discount: 37, rating: 4.4, reviews: 7654 },
    { id: 8, name: "Butterfly Mixer Grinder 750W", icon: "blender", originalPrice: 5499, salePrice: 3299, discount: 40, rating: 4.3, reviews: 8765 },
  ],
  "furnitures": [
    { id: 9, name: "Wooden King Size Bed with Storage", icon: "bed", originalPrice: 45990, salePrice: 32990, discount: 28, rating: 4.6, reviews: 3456, badge: "Bestseller", emi: "₹1,542/mo" },
    { id: 10, name: "L-Shape Fabric Sofa Set 6 Seater", icon: "sofa", originalPrice: 65990, salePrice: 48990, discount: 26, rating: 4.5, reviews: 2345, emi: "₹2,290/mo" },
    { id: 11, name: "Dining Table Set 6 Seater Solid Wood", icon: "chair", originalPrice: 38990, salePrice: 28990, discount: 26, rating: 4.4, reviews: 1876, badge: "Top Rated" },
    { id: 12, name: "Office Chair Ergonomic High Back", icon: "chair", originalPrice: 12990, salePrice: 7990, discount: 38, rating: 4.3, reviews: 5432 },
    { id: 13, name: "Wardrobe 4 Door with Mirror", icon: "door", originalPrice: 35990, salePrice: 26990, discount: 25, rating: 4.2, reviews: 2134, emi: "₹1,262/mo" },
    { id: 14, name: "Study Table with Bookshelf", icon: "bookshelf", originalPrice: 15990, salePrice: 10990, discount: 31, rating: 4.4, reviews: 3456 },
    { id: 15, name: "TV Unit Modern Design 6ft", icon: "tv", originalPrice: 18990, salePrice: 12990, discount: 32, rating: 4.3, reviews: 2876 },
    { id: 16, name: "Shoe Rack 4 Tier Wooden", icon: "package", originalPrice: 4990, salePrice: 2990, discount: 40, rating: 4.1, reviews: 4321 },
  ],
  "plastic": [
    { id: 17, name: "Airtight Container Set 24 Pieces", icon: "package", originalPrice: 1999, salePrice: 999, discount: 50, rating: 4.4, reviews: 8765, badge: "Bestseller" },
    { id: 18, name: "Multipurpose Storage Box Large", icon: "package", originalPrice: 899, salePrice: 549, discount: 39, rating: 4.3, reviews: 5432 },
    { id: 19, name: "Kitchen Organizer 3 Tier", icon: "package", originalPrice: 1299, salePrice: 799, discount: 38, rating: 4.2, reviews: 3456, badge: "Deal" },
    { id: 20, name: "Bathroom Accessories Set 6 Pieces", icon: "droplets", originalPrice: 799, salePrice: 449, discount: 44, rating: 4.1, reviews: 2345 },
    { id: 21, name: "Dustbin with Lid 40L", icon: "package", originalPrice: 699, salePrice: 399, discount: 43, rating: 4.0, reviews: 1876 },
    { id: 22, name: "Water Bottle Set 1L (Pack of 6)", icon: "droplets", originalPrice: 599, salePrice: 349, discount: 42, rating: 4.3, reviews: 6543 },
    { id: 23, name: "Laundry Basket 50L", icon: "package", originalPrice: 899, salePrice: 549, discount: 39, rating: 4.2, reviews: 2134 },
    { id: 24, name: "Vegetable Storage Basket Set", icon: "package", originalPrice: 1099, salePrice: 649, discount: 41, rating: 4.4, reviews: 3876 },
  ],
  "electronics": [
    { id: 25, name: "Samsung 55\" Crystal 4K Smart TV", icon: "tv", originalPrice: 74990, salePrice: 49990, discount: 33, rating: 4.6, reviews: 15678, badge: "Bestseller", emi: "₹2,337/mo" },
    { id: 26, name: "Sony 43\" Bravia 4K Google TV", icon: "tv", originalPrice: 54990, salePrice: 39990, discount: 27, rating: 4.5, reviews: 8765, emi: "₹1,870/mo" },
    { id: 27, name: "LG 32\" HD Ready Smart TV", icon: "tv", originalPrice: 24990, salePrice: 16990, discount: 32, rating: 4.3, reviews: 6543, badge: "Deal" },
    { id: 28, name: "JBL Soundbar 2.1 300W", icon: "speaker", originalPrice: 24990, salePrice: 14990, discount: 40, rating: 4.4, reviews: 4532, emi: "₹700/mo" },
    { id: 29, name: "boAt Rockerz 550 Headphones", icon: "headphones", originalPrice: 4990, salePrice: 1799, discount: 64, rating: 4.2, reviews: 25678, badge: "Top Rated" },
    { id: 30, name: "Fire TV Stick 4K Max", icon: "wifi", originalPrice: 6499, salePrice: 3999, discount: 38, rating: 4.5, reviews: 12345 },
    { id: 31, name: "Logitech Wireless Keyboard Mouse Combo", icon: "keyboard", originalPrice: 2995, salePrice: 1795, discount: 40, rating: 4.3, reviews: 8765 },
    { id: 32, name: "TP-Link WiFi Router Dual Band", icon: "wifi", originalPrice: 3499, salePrice: 1999, discount: 43, rating: 4.4, reviews: 5432 },
  ],
};

const allProducts = Object.values(productsByCategory).flat();
const brands = ["Samsung", "LG", "Whirlpool", "Sony", "Philips", "Bajaj", "Crompton", "boAt", "JBL", "Prestige"];
const priceRanges = ["Under ₹1,000", "₹1,000 - ₹5,000", "₹5,000 - ₹15,000", "₹15,000 - ₹50,000", "Above ₹50,000"];
const ratings = ["4★ & above", "3★ & above", "2★ & above"];

const categoryTitles: { [key: string]: string } = {
  "home-appliances": "Home Appliances",
  "furnitures": "Furnitures",
  "plastic": "Plastic Products",
  "electronics": "Electronics",
};

export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedFilters, setExpandedFilters] = useState({ brand: true, price: true, rating: true, discount: false });

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-out-cubic", once: true, offset: 50 });
  }, []);

  const products = category && productsByCategory[category as keyof typeof productsByCategory]
    ? productsByCategory[category as keyof typeof productsByCategory]
    : allProducts;

  const categoryTitle = category ? categoryTitles[category] || "Products" : "All Products";

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange("");
    setSelectedRating("");
  };

  const FilterSection = ({ title, expanded, onToggle, children }: { title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode }) => (
    <div className="border-b border-border py-3">
      <button onClick={onToggle} className="flex items-center justify-between w-full text-left">
        <span className="font-medium text-foreground text-sm">{title}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {expanded && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );

  const FiltersContent = () => (
    <div className="space-y-1">
      <FilterSection title="Brand" expanded={expandedFilters.brand} onToggle={() => setExpandedFilters(prev => ({ ...prev, brand: !prev.brand }))}>
        {brands.map(brand => (
          <label key={brand} className="flex items-center gap-2 cursor-pointer py-1">
            <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
            <span className="text-sm text-foreground">{brand}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Price" expanded={expandedFilters.price} onToggle={() => setExpandedFilters(prev => ({ ...prev, price: !prev.price }))}>
        {priceRanges.map(range => (
          <label key={range} className="flex items-center gap-2 cursor-pointer py-1">
            <input type="radio" name="priceRange" checked={selectedPriceRange === range} onChange={() => setSelectedPriceRange(range)} className="w-4 h-4 border-border text-accent focus:ring-accent" />
            <span className="text-sm text-foreground">{range}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Customer Rating" expanded={expandedFilters.rating} onToggle={() => setExpandedFilters(prev => ({ ...prev, rating: !prev.rating }))}>
        {ratings.map(rating => (
          <label key={rating} className="flex items-center gap-2 cursor-pointer py-1">
            <input type="radio" name="rating" checked={selectedRating === rating} onChange={() => setSelectedRating(rating)} className="w-4 h-4 border-border text-accent focus:ring-accent" />
            <span className="text-sm text-foreground">{rating}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );

  const hasActiveFilters = selectedBrands.length > 0 || selectedPriceRange || selectedRating;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden pb-20 md:pb-0">
      <Header />
      
      <div className="bg-card border-b border-border">
        <div className="container py-2 px-3 md:px-4">
          <nav className="text-xs md:text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent">Home</Link>
            <span className="mx-1.5 md:mx-2">›</span>
            <span className="text-foreground font-medium">{categoryTitle}</span>
          </nav>
        </div>
      </div>

      <div className="container py-3 md:py-6 px-3 md:px-4">
        <div className="flex flex-col gap-3 mb-4 md:mb-6" data-aos="fade-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-foreground">{categoryTitle}</h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{products.length} results</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded ${viewMode === "grid" ? "bg-accent text-primary" : "bg-muted text-muted-foreground"}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-accent text-primary" : "bg-muted text-muted-foreground"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 md:hidden">
            <button onClick={() => setShowMobileFilters(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-card border border-border rounded-lg text-sm font-medium">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="bg-accent text-primary text-xs px-1.5 py-0.5 rounded-full">{selectedBrands.length + (selectedPriceRange ? 1 : 0) + (selectedRating ? 1 : 0)}</span>}
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-1 py-2.5 px-3 bg-card border border-border rounded-lg text-sm font-medium">
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Avg. Rating</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4" data-aos="fade-up">
            {selectedBrands.map(brand => (
              <span key={brand} className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                {brand}
                <button onClick={() => toggleBrand(brand)}><X className="w-3 h-3" /></button>
              </span>
            ))}
            {selectedPriceRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                {selectedPriceRange}
                <button onClick={() => setSelectedPriceRange("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearAllFilters} className="text-xs text-krishna-blue-link hover:underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden md:block w-56 lg:w-64 shrink-0">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-24" data-aos="fade-right">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-foreground">Filters</h2>
                {hasActiveFilters && <button onClick={clearAllFilters} className="text-xs text-krishna-blue-link hover:underline">Clear all</button>}
              </div>
              <FiltersContent />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className={`grid gap-3 md:gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
              {products.map((product, index) => (
                <Link key={product.id} to={`/product/${product.id}`} className="block" data-aos="fade-up" data-aos-delay={Math.min(index * 50, 200)}>
                  <ProductCard product={product} variant={viewMode === "list" ? "default" : "compact"} />
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <>
          <div className="md:hidden fixed inset-0 bg-foreground/50 z-50" onClick={() => setShowMobileFilters(false)} />
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto animate-slide-in-left">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-foreground">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              <FiltersContent />
              <button onClick={() => setShowMobileFilters(false)} className="w-full mt-4 py-3 bg-accent text-primary font-medium rounded-lg">Apply Filters</button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
