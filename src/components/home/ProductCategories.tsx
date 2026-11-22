"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/ui/Reveal"

interface Category {
  _id: string
  name: string
  image: string
  caption: string
  createdAt: string
}

export function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/categories?active=true")
      .then((res) => res.json())
      .then((data) => data.success && setCategories(data.data))
      .catch((err) => console.error("Failed to fetch categories:", err))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && categories.length === 0) return null

  return (
    <section className="bg-slate-50 py-20 lg:py-24 dark:bg-deep-twilight-200/40">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Product categories</span>
            <h2 className="section-title">Browse by category</h2>
          </div>
          <Link href="/products" className="btn-ghost">
            All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-slate-200 dark:bg-white/5" />)
            : categories.map((category, i) => (
                <Reveal key={category._id} delay={(i % 4) * 80}>
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className="group card flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-bright-teal-blue hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-white/5">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col border-t-4 border-bright-teal-blue p-5">
                      <h3 className="text-lg font-bold text-deep-twilight dark:text-white">{category.name}</h3>
                      {category.caption && <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">{category.caption}</p>}
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bright-teal-blue dark:text-sky-aqua">
                        View Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  )
}
