"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, PackageSearch, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/home/ProductCard"

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  mainImage: string;
  category: Category | string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [currentPage, setCurrentPage] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Get category from URL query parameter after component mounts
    if (mounted && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      if (categoryParam) {
        setSelectedCategory(decodeURIComponent(categoryParam));
      }
    }
  }, [mounted]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products?active=true'),
        fetch('/api/categories?active=true')
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      if (productsData.success && productsData.data) {
        setProducts(productsData.data);
      } else {
        console.error('Products API error:', productsData.error);
        setProducts([]);
      }
      
      if (categoriesData.success && categoriesData.data) {
        setCategories(categoriesData.data);
      } else {
        console.error('Categories API error:', categoriesData.error);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const categoryName = typeof product.category === 'object' ? product.category.name : '';
    const matchesCategory = selectedCategory === "All Categories" || categoryName === selectedCategory;
    
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  // Pagination Logic
  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const chip = (active: boolean) =>
    cn(
      "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
      active
        ? "border-bright-teal-blue bg-bright-teal-blue text-white"
        : "border-slate-200 bg-white text-slate-600 hover:border-bright-teal-blue hover:text-bright-teal-blue dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-sky-aqua dark:hover:text-sky-aqua"
    )

  return (
    <div className="min-h-screen pb-24">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-deep-twilight text-white">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" /><div className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-1/3 bg-bright-teal-blue" />
        
        <div className="container-x relative py-16 text-center md:py-20">
          <span className="eyebrow !text-sky-aqua animate-fade-up">Catalogue</span>
          <h1 className="mt-4 text-4xl font-bold text-white animate-fade-up md:text-6xl">
            <span className="text-gradient">Shop</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-slate-300 animate-fade-up [animation-delay:120ms]">
            Browse our extensive collection of high-quality laboratory equipment and supplies for your research and educational needs.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-10 max-w-xl animate-fade-up [animation-delay:200ms]">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input !rounded-full !py-4 !pl-14 !pr-12 shadow-lg shadow-french-blue/5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="sticky top-[72px] z-30 border-b border-slate-200/70 bg-background/85 backdrop-blur-xl dark:border-white/10">
        <div className="container-x flex items-center gap-3 py-3">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="scrollbar-hide flex gap-2 overflow-x-auto py-1">
            <button onClick={() => setSelectedCategory("All Categories")} className={chip(selectedCategory === "All Categories")}>
              All Categories
            </button>
            {categories.map((category) => (
              <button key={category._id} onClick={() => setSelectedCategory(category.name)} className={chip(selectedCategory === category.name)}>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x pt-10">
        {!loading && (
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredProducts.length}</span> products
            {selectedCategory !== "All Categories" && (
              <>
                {" "}in <span className="font-semibold text-bright-teal-blue dark:text-sky-aqua">{selectedCategory}</span>
              </>
            )}
          </p>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-slate-200 dark:bg-white/5" />
              ))
            : paginatedProducts.map((product, i) => (
                <div key={product._id} className="animate-fade-up" style={{ animationDelay: `${(i % 8) * 50}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {/* No Results State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="card mx-auto max-w-md p-12 text-center">
            <PackageSearch className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <p className="mt-4 text-slate-600 dark:text-slate-400">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All Categories")
              }}
              className="btn-ghost mt-6"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-ghost !px-4 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "h-10 w-10 rounded-full text-sm font-semibold transition",
                    currentPage === i + 1
                      ? "bg-deep-twilight text-white dark:bg-bright-teal-blue"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-ghost !px-4 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
