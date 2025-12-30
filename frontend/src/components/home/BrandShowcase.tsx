const brands = [
  { name: "Samsung", logo: "🔵" },
  { name: "LG", logo: "🔴" },
  { name: "Sony", logo: "⚫" },
  { name: "Whirlpool", logo: "🟢" },
  { name: "Voltas", logo: "🔷" },
  { name: "Daikin", logo: "🟦" },
  { name: "Panasonic", logo: "🟠" },
  { name: "Philips", logo: "🔶" },
  { name: "Bajaj", logo: "🟡" },
  { name: "Prestige", logo: "🟤" },
];

export function BrandShowcase() {
  return (
    <section className="container mt-8">
      <div className="bg-card rounded-lg p-4 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-4 text-center">
          Shop by Brand
        </h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {brands.map((brand) => (
            <a
              key={brand.name}
              href="#"
              className="flex flex-col items-center gap-2 p-3 hover:bg-muted rounded-lg transition-colors group"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {brand.logo}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {brand.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
