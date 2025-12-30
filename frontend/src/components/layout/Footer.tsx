import { ChevronUp } from "lucide-react";

const footerLinks = {
  "Get to Know Us": ["About Krishna Store", "Careers", "Press Releases", "Krishna Store Science"],
  "Connect with Us": ["Facebook", "Twitter", "Instagram", "YouTube"],
  "Make Money with Us": ["Sell on Krishna Store", "Sell under Krishna Store Accelerator", "Become an Affiliate", "Advertise Your Products"],
  "Let Us Help You": ["Your Account", "Returns Centre", "100% Purchase Protection", "Krishna Store App Download", "Help"],
};

const categories = [
  "TVs", "Refrigerators", "Washing Machines", "Air Conditioners", "Microwaves", 
  "Water Purifiers", "Chimneys", "Dishwashers", "Geysers", "Air Coolers",
  "Fans", "Vacuum Cleaners", "Irons", "Mixers & Grinders", "Food Processors"
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-8">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-secondary hover:bg-secondary/90 text-primary-foreground py-3 text-sm font-medium transition-colors"
      >
        <span className="flex items-center justify-center gap-1">
          <ChevronUp className="w-4 h-4" />
          Back to top
        </span>
      </button>

      {/* Main Footer Links */}
      <div className="bg-primary">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-primary-foreground font-bold mb-3">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20">
          <div className="container py-6 flex flex-col md:flex-row items-center justify-center gap-4">
            <a href="/" className="flex items-center gap-1 text-primary-foreground">
              <span className="text-xl font-bold">Krishna</span>
              <span className="text-accent text-xl font-bold">Store</span>
            </a>
            <div className="flex items-center gap-4 text-primary-foreground/70 text-sm">
              <span>🇮🇳 India</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Categories & Legal */}
      <div className="bg-secondary">
        <div className="container py-6">
          {/* Category Links */}
          <div className="mb-6">
            <h4 className="text-primary-foreground/80 text-xs font-medium mb-2">Popular Categories</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href="#"
                  className="text-primary-foreground/60 hover:text-primary-foreground text-xs transition-colors"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-primary-foreground/60 border-t border-primary-foreground/10 pt-4">
            <a href="#" className="hover:text-primary-foreground">Conditions of Use</a>
            <a href="#" className="hover:text-primary-foreground">Privacy Notice</a>
            <a href="#" className="hover:text-primary-foreground">Interest-Based Ads</a>
            <span>© 2024 Krishna Store. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
