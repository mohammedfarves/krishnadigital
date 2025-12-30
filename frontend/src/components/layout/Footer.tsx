import { ChevronUp } from "lucide-react";

const footerLinks = {
  "Get to Know Us": [
    "About Krishna Store",
    "Careers",
    "Press Releases",
    "Krishna Store Science",
  ],
  "Connect with Us": [
    "Facebook",
    "Twitter",
    "Instagram",
    "YouTube",
  ],
  "Make Money with Us": [
    "Sell on Krishna Store",
    "Become an Affiliate",
    "Advertise Your Products",
  ],
  "Let Us Help You": [
    "Your Account",
    "Returns Centre",
    "Purchase Protection",
    "Help",
  ],
};

const categories = [
  "TVs", "Refrigerators", "Washing Machines", "Air Conditioners",
  "Microwaves", "Water Purifiers", "Chimneys", "Geysers",
  "Fans", "Mixers & Grinders", "Vacuum Cleaners",
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-16 text-sm">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-gray-900 hover:bg-gray-800 text-gray-200 py-3 transition"
      >
        <span className="flex items-center justify-center gap-1">
          <ChevronUp className="w-4 h-4 text-yellow-400" />
          Back to top
        </span>
      </button>

      {/* Main Footer */}
      <div className="bg-[#1f1f1f] text-gray-300">
        <div className="container py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-white font-semibold mb-4 tracking-wide">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="hover:text-yellow-400 transition-colors"
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

        {/* Brand Row */}
        <div className="border-t border-white/10">
          <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-lg font-bold">
              <span className="text-white">Krishna</span>
              <span className="text-yellow-400">Store</span>
            </div>

            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <span>🇮🇳 India</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#171717] text-gray-400">
        <div className="container py-8">
          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-3">
              Popular Categories
            </h4>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href="#"
                  className="hover:text-yellow-400 transition"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="border-t border-white/10 pt-4 flex flex-wrap justify-center gap-4 text-xs">
            <a href="#" className="hover:text-white">Conditions of Use</a>
            <a href="#" className="hover:text-white">Privacy Notice</a>
            <a href="#" className="hover:text-white">Interest-Based Ads</a>
            <span>© 2024 Krishna Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
