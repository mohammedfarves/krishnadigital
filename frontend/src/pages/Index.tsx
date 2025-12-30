import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DealOfTheDay } from "@/components/home/DealOfTheDay";
import { BestSellers } from "@/components/home/BestSellers";
import { PromoBanners } from "@/components/home/PromoBanners";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { TrustBadges } from "@/components/home/TrustBadges";
import { BrandShowcase } from "@/components/home/BrandShowcase";

const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      <main>
        <HeroSlider />
        <CategoryGrid />
        
        <div data-aos="fade-up">
          <DealOfTheDay />
        </div>
        
        <div data-aos="fade-up" data-aos-delay="100">
          <BestSellers />
        </div>
        
        <div data-aos="fade-up" data-aos-delay="100">
          <PromoBanners />
        </div>
        
        <div data-aos="fade-up" data-aos-delay="100">
          <ProductShowcase />
        </div>
        
        <div data-aos="fade-up" data-aos-delay="100">
          <BrandShowcase />
        </div>
        
        <div data-aos="fade-up" data-aos-delay="100">
          <TrustBadges />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
