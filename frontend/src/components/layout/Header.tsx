import { useState } from "react";
import { Search, MapPin, ShoppingCart, User, ChevronDown, Menu, Heart, X, Home, Sofa, Package, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchModal, SearchItem } from "@/components/ui/search-modal";
import { Link } from "react-router-dom";

const categories = [
  "All Categories",
  "Home Appliances",
  "Furnitures",
  "Plastic",
  "Electronics",
];

const mainCategories = [
  { label: "Home Appliances", icon: Home, href: "/products?category=home-appliances" },
  { label: "Furnitures", icon: Sofa, href: "/products?category=furnitures" },
  { label: "Plastic", icon: Package, href: "/products?category=plastic" },
  { label: "Electronics", icon: Tv, href: "/products?category=electronics" },
];

const navItems = [
  { label: "Today's Deals", highlight: true, href: "/products?deals=true" },
  { label: "New Arrivals", href: "/products?new=true" },
  { label: "Best Sellers", href: "/products?bestsellers=true" },
  { label: "Customer Service", href: "/help" },
];

const searchData: SearchItem[] = [
  { id: "1", title: "Smart LED TV 55 inch", description: "4K Ultra HD Smart Television", category: "Electronics", icon: Tv, href: "/products?category=electronics" },
  { id: "2", title: "Double Door Refrigerator", description: "500L Frost Free with Inverter", category: "Home Appliances", icon: Home, href: "/products?category=home-appliances" },
  { id: "3", title: "Wooden Dining Table", description: "6 Seater Solid Wood Table", category: "Furnitures", icon: Sofa, href: "/products?category=furnitures" },
  { id: "4", title: "Plastic Storage Containers", description: "Set of 12 Airtight Containers", category: "Plastic", icon: Package, href: "/products?category=plastic" },
  { id: "5", title: "Front Load Washing Machine", description: "8kg Fully Automatic", category: "Home Appliances", icon: Home, href: "/products?category=home-appliances" },
  { id: "6", title: "Air Conditioner 1.5 Ton", description: "Inverter Split AC 5 Star", category: "Electronics", icon: Tv, href: "/products?category=electronics" },
  { id: "7", title: "Modular Sofa Set", description: "L-Shape Fabric Sofa", category: "Furnitures", icon: Sofa, href: "/products?category=furnitures" },
  { id: "8", title: "Kitchen Organizer", description: "Plastic Multi-Purpose Rack", category: "Plastic", icon: Package, href: "/products?category=plastic" },
];

export function Header() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Header - Dark Navy */}
      <div className="bg-primary">
        <div className="container flex items-center gap-2 sm:gap-4 py-2 px-3 sm:px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 text-primary-foreground shrink-0">
            <span className="text-lg sm:text-2xl font-bold tracking-tight">Krishna</span>
            <span className="text-accent text-lg sm:text-2xl font-bold">Store</span>
          </Link>

          {/* Delivery Location - Hidden on mobile */}
          <button className="hidden lg:flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm shrink-0 border border-transparent hover:border-primary-foreground/30 rounded p-1 transition-colors">
            <MapPin className="w-4 h-4" />
            <div className="text-left">
              <p className="text-xs text-primary-foreground/60">Deliver to</p>
              <p className="font-medium text-sm">Mumbai 400001</p>
            </div>
          </button>

          {/* Desktop Search Bar - Opens Modal */}
          <div className="hidden sm:flex flex-1 max-w-3xl">
            <SearchModal data={searchData}>
              <button className="relative flex w-full">
                <div className="hidden md:flex items-center bg-muted text-foreground text-sm px-3 py-2 rounded-l-md border-r border-border">
                  <span className="text-sm">{selectedCategory}</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </div>
                <div className="flex-1 flex items-center px-4 py-2 text-muted-foreground bg-card md:rounded-none rounded-l-md text-left">
                  <span className="text-sm">Search products...</span>
                </div>
                <div className="bg-accent hover:bg-accent/90 px-4 py-2 rounded-r-md transition-colors shrink-0 flex items-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
              </button>
            </SearchModal>
          </div>

          {/* Mobile Search Button */}
          <div className="flex-1 sm:hidden">
            <SearchModal data={searchData}>
              <button className="w-full flex items-center gap-2 bg-card text-muted-foreground px-3 py-2 rounded-md text-sm">
                <Search className="w-4 h-4" />
                <span>Search...</span>
              </button>
            </SearchModal>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Account - Desktop */}
            <Link to="/account" className="hidden md:flex flex-col items-start text-primary-foreground hover:text-accent border border-transparent hover:border-primary-foreground/30 rounded p-1 transition-colors">
              <span className="text-xs text-primary-foreground/70">Hello, Sign in</span>
              <span className="text-sm font-medium flex items-center gap-1">
                Account <ChevronDown className="w-3 h-3" />
              </span>
            </Link>

            {/* Orders - Desktop */}
            <Link to="/account" className="hidden lg:flex flex-col items-start text-primary-foreground hover:text-accent border border-transparent hover:border-primary-foreground/30 rounded p-1 transition-colors">
              <span className="text-xs text-primary-foreground/70">Returns</span>
              <span className="text-sm font-medium">& Orders</span>
            </Link>

            {/* Wishlist - Desktop */}
            <button className="hidden md:flex items-center text-primary-foreground hover:text-accent p-2 border border-transparent hover:border-primary-foreground/30 rounded transition-colors">
              <Heart className="w-6 h-6" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="flex items-center text-primary-foreground hover:text-accent p-1 border border-transparent hover:border-primary-foreground/30 rounded transition-colors">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="absolute -top-1 -right-1 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <span className="hidden lg:block text-sm font-medium ml-1">Cart</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-primary-foreground p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Main Categories Bar - Desktop */}
        <div className="hidden md:block bg-secondary">
          <div className="container px-4">
            <nav className="flex items-center gap-6 py-2">
              {mainCategories.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.href}
                  className="flex items-center gap-2 text-primary-foreground hover:text-accent text-sm font-medium transition-colors"
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </Link>
              ))}
              <div className="h-4 w-px bg-primary-foreground/30" />
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm whitespace-nowrap transition-colors ${
                    item.highlight ? "text-accent font-medium" : "text-primary-foreground hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Categories Bar */}
        <div className="md:hidden bg-secondary overflow-hidden">
          <div className="flex gap-1 py-2 px-3 overflow-x-auto scrollbar-hide">
            {mainCategories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.href}
                className="flex items-center gap-1.5 text-primary-foreground bg-primary/40 hover:bg-primary/60 text-xs font-medium px-3 py-1.5 rounded-full transition-colors shrink-0"
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-foreground/50 z-40 top-[108px]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[108px] left-0 right-0 bg-card border-b border-border shadow-dropdown z-50 animate-fade-in max-h-[calc(100vh-108px)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* User Section */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Hello, Guest</p>
                <Link to="/account" className="text-sm text-accent" onClick={() => setIsMenuOpen(false)}>
                  Sign in / Create Account
                </Link>
              </div>
            </div>

            {/* Location */}
            <button className="flex items-center gap-3 w-full p-3 bg-muted rounded-lg text-left">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Deliver to</p>
                <p className="font-medium text-foreground">Mumbai 400001</p>
              </div>
            </button>

            {/* Categories */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">Shop by Category</p>
              {mainCategories.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.href}
                  className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <cat.icon className="w-5 h-5 text-accent" />
                  <span className="font-medium text-foreground">{cat.label}</span>
                </Link>
              ))}
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`block p-3 rounded-lg transition-colors ${
                    item.highlight 
                      ? "text-accent font-medium bg-accent/10" 
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
