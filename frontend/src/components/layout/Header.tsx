import { useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  Search,
  Home,
  Sofa,
  Package,
  Tv,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { label: "Home Appliances", icon: Home, href: "/products?category=home-appliances" },
  { label: "Furniture", icon: Sofa, href: "/products?category=furnitures" },
  { label: "Plastic", icon: Package, href: "/products?category=plastic" },
  { label: "Electronics", icon: Tv, href: "/products?category=electronics" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ================= TOP BAR ================= */}
      <div className="container flex items-center justify-between py-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu />
          </button>

          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-bold">Krishna</span>
            <span className="text-krishna-gold text-xl font-bold">Store</span>
          </Link>
        </div>

        {/* Center Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="flex w-full bg-gray-100 rounded-full px-4 py-2 items-center">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              placeholder="Search appliances, electronics..."
              className="bg-transparent ml-3 outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link to="/wishlist" className="hidden md:block p-2 hover:bg-gray-100 rounded-lg">
            <Heart />
          </Link>

          <Link to="/account" className="hidden md:block p-2 hover:bg-gray-100 rounded-lg">
            <User />
          </Link>

          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg">
            <ShoppingCart />
            <span className="absolute -top-1 -right-1 bg-krishna-gold text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Link>
        </div>
      </div>

      {/* ================= DESKTOP CATEGORY BAR ================= */}
      <div className="hidden md:block border-t">
        <div className="container flex gap-4 py-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.href}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-krishna-gold hover:text-black transition text-sm font-medium"
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-white z-50 p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold">Menu</span>
                <button onClick={() => setOpen(false)}>
                  <X />
                </button>
              </div>

              {/* User Card */}
              <div className="bg-gray-100 rounded-xl p-4 mb-5">
                <p className="font-semibold">Hello, Guest</p>
                <Link
                  to="/account"
                  className="text-sm text-krishna-gold"
                  onClick={() => setOpen(false)}
                >
                  Sign in / Create Account
                </Link>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.label}
                    to={cat.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
                  >
                    <cat.icon className="w-5 h-5 text-krishna-gold" />
                    <span className="font-medium">{cat.label}</span>
                  </Link>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-around border-t pt-4">
                <Link to="/wishlist">
                  <Heart />
                </Link>
                <Link to="/cart">
                  <ShoppingCart />
                </Link>
                <Link to="/account">
                  <User />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
