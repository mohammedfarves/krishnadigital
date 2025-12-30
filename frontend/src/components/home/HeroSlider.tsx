import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Mega Electronics Sale",
    subtitle: "Up to 60% Off on TVs & Appliances",
    cta: "Shop Now",
    bgGradient: "from-blue-900 via-blue-800 to-blue-900",
    image: "📺",
  },
  {
    id: 2,
    title: "Summer Cooling Fest",
    subtitle: "ACs & Coolers starting ₹15,999",
    cta: "Explore Deals",
    bgGradient: "from-cyan-800 via-teal-700 to-cyan-800",
    image: "❄️",
  },
  {
    id: 3,
    title: "Kitchen Essentials",
    subtitle: "Flat 40% Off on Kitchen Appliances",
    cta: "View Collection",
    bgGradient: "from-orange-800 via-red-700 to-orange-800",
    image: "🍳",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-r ${slide.bgGradient} ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="container h-full flex items-center">
            <div className="max-w-xl text-primary-foreground animate-fade-in">
              <div className="text-6xl mb-4">{slide.image}</div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 mb-4">
                {slide.subtitle}
              </p>
              <button className="bg-accent hover:bg-krishna-orange-hover text-primary font-bold py-2 px-6 rounded-full transition-colors text-sm sm:text-base">
                {slide.cta}
              </button>
            </div>
          </div>

          {/* Gradient Fade at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card p-2 rounded-full shadow-lg transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card p-2 rounded-full shadow-lg transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-accent" : "bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
