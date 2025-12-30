const banners = [
  {
    title: "TV Upgrade Sale",
    subtitle: "Smart TVs from ₹12,999",
    bgColor: "bg-gradient-to-br from-indigo-600 to-purple-700",
    icon: "📺",
  },
  {
    title: "Beat the Heat",
    subtitle: "ACs & Coolers on Sale",
    bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
    icon: "❄️",
  },
  {
    title: "Kitchen Makeover",
    subtitle: "Up to 60% Off",
    bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
    icon: "🍳",
  },
  {
    title: "Laundry Days",
    subtitle: "Washing Machines Deal",
    bgColor: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
    icon: "🧺",
  },
];

export function PromoBanners() {
  return (
    <section className="container mt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {banners.map((banner) => (
          <a
            key={banner.title}
            href="#"
            className={`${banner.bgColor} rounded-lg p-4 md:p-6 text-primary-foreground transition-transform hover:scale-[1.02] shadow-card hover:shadow-card-hover`}
          >
            <div className="text-3xl md:text-4xl mb-2">{banner.icon}</div>
            <h3 className="font-bold text-lg md:text-xl">{banner.title}</h3>
            <p className="text-sm text-primary-foreground/80">{banner.subtitle}</p>
            <span className="inline-block mt-2 text-sm font-medium underline underline-offset-2">
              Shop now →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
