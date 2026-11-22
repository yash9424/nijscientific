"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/ui/Reveal"
import { ProductCard, type ProductCardData } from "./ProductCard"

export function HomeProducts() {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products?active=true")
      .then((res) => res.json())
      .then((data) => setProducts(data.success && data.data ? data.data.slice(0, 10) : [])) // latest 10
      .catch((err) => {
        console.error("Error fetching products:", err)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative overflow-hidden py-24 lg:py-32" id="products">
      <div className="pointer-events-none absolute inset-0 grid-bg mask-fade opacity-70" />
      <div className="container-x relative">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow">Discover Quality</span>
          <h2 className="section-title">
            Our <span className="text-gradient">Products</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-slate-200 dark:bg-white/5" />
              ))
            : products.map((product, index) => (
                <Reveal key={product._id} delay={(index % 5) * 90}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/products" className="btn-primary group">
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
