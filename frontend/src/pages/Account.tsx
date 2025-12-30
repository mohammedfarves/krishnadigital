import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { User, Package, MapPin, Heart, CreditCard, Settings, LogOut, ChevronRight, ShoppingBag, Truck, Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const orders = [
  { id: "ORD123456", date: "20 Dec 2024", status: "Delivered", total: 42990, items: [{ name: "Samsung 55\" Smart TV", image: "📺" }] },
  { id: "ORD123455", date: "15 Dec 2024", status: "In Transit", total: 21490, items: [{ name: "Whirlpool Washing Machine", image: "🧺" }] },
  { id: "ORD123454", date: "10 Dec 2024", status: "Processing", total: 7999, items: [{ name: "Philips Air Fryer", image: "🍟" }] },
];

const wishlistItems = [
  { id: 1, name: "LG 260L Refrigerator", image: "🧊", price: 24990 },
  { id: 2, name: "Daikin 1.5 Ton Split AC", image: "❄️", price: 38990 },
];

const savedAddresses = [
  { id: 1, name: "Rajesh Kumar", address: "42, Krishna Apartments, MG Road, Mumbai - 400001", isDefault: true },
  { id: 2, name: "Office", address: "Tech Park, Sector 5, Pune - 411001", isDefault: false },
];

type Tab = "orders" | "wishlist" | "addresses" | "profile";

export default function Account() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "text-krishna-green bg-krishna-green/10";
      case "In Transit": return "text-krishna-blue-link bg-krishna-blue-link/10";
      case "Processing": return "text-accent bg-accent/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <Check className="w-4 h-4" />;
      case "In Transit": return <Truck className="w-4 h-4" />;
      case "Processing": return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const menuItems = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-4 md:py-6 px-3 md:px-4">
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-24">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Rajesh Kumar</p>
                  <p className="text-sm text-muted-foreground">rajesh@email.com</p>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Mobile Tab Bar */}
          <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-3 px-3">
            <div className="flex gap-2 pb-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeTab === item.id
                      ? "bg-accent text-primary font-medium"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">My Orders</h2>
                </div>

                {orders.map((order) => (
                  <div key={order.id} className="bg-card rounded-lg border border-border p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">Ordered on {order.date}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center text-2xl">
                        {order.items[0].image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-1">{order.items[0].name}</p>
                        <p className="text-sm font-medium text-foreground mt-1">{formatPrice(order.total)}</p>
                      </div>
                      <Link to={`/order/${order.id}`} className="text-krishna-blue-link text-sm hover:underline flex items-center gap-1">
                        View <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No orders yet</p>
                    <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                    <Link to="/" className="inline-block bg-accent text-primary font-medium px-6 py-2 rounded-lg">
                      Shop Now
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">My Wishlist</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="bg-card rounded-lg border border-border p-4 flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-3xl">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium line-clamp-1">{item.name}</p>
                        <p className="text-lg font-bold text-foreground mt-1">{formatPrice(item.price)}</p>
                        <div className="flex gap-2 mt-2">
                          <button className="text-xs bg-accent text-primary px-3 py-1 rounded">Add to Cart</button>
                          <button className="text-xs text-destructive hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Saved Addresses</h2>
                  <button className="text-sm text-krishna-blue-link hover:underline">+ Add New</button>
                </div>

                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-sm text-krishna-blue-link hover:underline">Edit</button>
                        <button className="text-sm text-destructive hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-card rounded-lg border border-border p-4 md:p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Profile Settings</h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Rajesh Kumar"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue="rajesh@email.com"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                    <input
                      type="tel"
                      defaultValue="9876543210"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <button className="w-full py-2.5 bg-accent hover:bg-krishna-orange-hover text-primary font-medium rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-medium text-foreground mb-3">Danger Zone</h3>
                  <button className="text-sm text-destructive hover:underline">Delete Account</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
