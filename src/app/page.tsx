import { Hero } from "@/components/home/Hero";
import { NewProducts } from "@/components/home/NewProducts";
import { ProductCategories } from "@/components/home/ProductCategories";
import { ClientReviews } from "@/components/home/ClientReviews";

export default function Home() {
  return (
    <>
      <Hero />
      <NewProducts />
      <ProductCategories />
      <ClientReviews />
    </>
  );
}
