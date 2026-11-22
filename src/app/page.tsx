import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FieldsMarquee } from "@/components/home/FieldsMarquee";
import { HomeProducts } from "@/components/home/HomeProducts";
import { ProductCategories } from "@/components/home/ProductCategories";
import { ClientReviews } from "@/components/home/ClientReviews";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductCategories />
      <WhyChooseUs />
      <HomeProducts />
      <FieldsMarquee />
      <ClientReviews />
    </>
  );
}
