"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      if (productsData.success) {
        setProducts(productsData.data);
      }
      
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  // Pagination Logic
  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-deep-twilight-100">
        <Loader2 className="w-8 h-8 animate-spin text-french-blue" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-deep-twilight-100 min-h-screen pb-12">
      {/* Header Section */}
      <div className="bg-white dark:bg-deep-twilight-200 pt-12 pb-8 px-4 text-center border-b dark:border-deep-twilight-300">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Shop</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Browse our extensive collection of high-quality laboratory equipment and supplies for your research and educational needs.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-deep-twilight-200 p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border dark:border-deep-twilight-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bright-teal-blue-500 bg-white dark:bg-deep-twilight-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" />
                <button
                  onClick={() => setSelectedCategory("All Categories")}
                  className={cn(
                    "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                    selectedCategory === "All Categories"
                      ? "bg-french-blue text-white border-french-blue"
                      : "bg-white dark:bg-deep-twilight-300 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-deep-twilight-400 hover:bg-gray-50 dark:hover:bg-deep-twilight-400"
                  )}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={cn(
                      "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                      selectedCategory === category.name
                        ? "bg-french-blue text-white border-french-blue"
                        : "bg-white dark:bg-deep-twilight-300 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-deep-twilight-400 hover:bg-gray-50 dark:hover:bg-deep-twilight-400"
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {paginatedProducts.map((product) => (
            <Link 
              href={`/products/${product._id}`} 
              key={product._id} 
              className="bg-white dark:bg-deep-twilight-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group block"
            >
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image
                  src={product.mainImage || '/placeholder.png'} // Fallback if needed
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">{product.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All Categories"); }}
              className="mt-4 text-french-blue dark:text-french-blue-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 flex justify-between items-center border-t pt-6">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="flex items-center gap-1 px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="flex items-center gap-1 px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
