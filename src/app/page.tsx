import { Hero } from "@/components/home/Hero";
import { HomeProducts } from "@/components/home/HomeProducts";
import { ProductCategories } from "@/components/home/ProductCategories";
import { ClientReviews } from "@/components/home/ClientReviews";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeProducts />
      <ProductCategories />
      <ClientReviews />
    </>
  );
}
