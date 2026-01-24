"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Data
const categories = [
  "All Categories",
  "Glassware",
  "Plasticware",
  "Lab Equipment",
  "Educational Devices",
  "Safety Equipment"
]

const products = [
  {
    id: 1,
    name: "4-Digit Analytical Balances",
    description: "4-digit analytical balances are high-precision instruments measuring...",
    image: "https://images.unsplash.com/photo-1623005367342-a63e90060934?auto=format&fit=crop&q=80&w=600",
    category: "Lab Equipment"
  },
  {
    id: 2,
    name: "Vortex Mixers",
    description: "Vortex mixers are laboratory instruments that mix small volume...",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600",
    category: "Lab Equipment"
  },
  {
    id: 3,
    name: "Volumetric Flask",
    description: "A volumetric flask is a laboratory glassware used to prepare solutio...",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600",
    category: "Glassware"
  },
  {
    id: 4,
    name: "Volumetric flask stand",
    description: "A volumetric flask stand is a laboratory tool designed to...",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600", // Generic glassware stand/lab image
    category: "Lab Equipment"
  },
  {
    id: 5,
    name: "Wet & Dry hygrometer",
    description: "A wet and dry hygrometer, also known as a psychrometer, is a...",
    image: "https://images.unsplash.com/photo-1632832962383-0599c2776c5f?auto=format&fit=crop&q=80&w=600", // Thermometer/hygrometer placeholder
    category: "Lab Equipment"
  },
  {
    id: 6,
    name: "Water Bath",
    description: "A water bath is a laboratory equipment that maintains a...",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600", // Lab generic
    category: "Lab Equipment"
  },
  {
    id: 7,
    name: "Vial Kits",
    description: "Vial kits are pre-packaged sets containing vials, caps, inserts, and...",
    image: "https://images.unsplash.com/photo-1581093458791-9f302e6d8df9?auto=format&fit=crop&q=80&w=600", // Vials
    category: "Glassware"
  },
  {
    id: 8,
    name: "Rubber Bulb",
    description: "Rubber bulbs are laboratory tools used to create a vacuum or contro...",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600", // Pipette/bulb context
    category: "Lab Equipment"
  },
  {
    id: 9,
    name: "PTFE (Teflon) blade",
    description: "A PTFE (Teflon) blade is a versatile tool used for mixing and stirring...",
    image: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?auto=format&fit=crop&q=80&w=600", // Stirrer/mixer context
    category: "Lab Equipment"
  },
  {
    id: 10,
    name: "Magnetic Stirrer Bar",
    description: "A magnetic stirrer bar, also known as a stir bar or flea, is a laboratory...",
    image: "https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=600", // Stirrer context
    category: "Lab Equipment"
  },
  {
    id: 11,
    name: "Liquid Funnel",
    description: "A liquid funnel is a laboratory tool designed to facilitate the safe and...",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=600", // Funnel/glassware
    category: "Glassware"
  },
  {
    id: 12,
    name: "Hardness Tester for Tablets",
    description: "Hardness testing is a crucial quality control process in the...",
    image: "https://images.unsplash.com/photo-1584036561566-b93a945c3cac?auto=format&fit=crop&q=80&w=600", // Pharma/testing
    category: "Lab Equipment"
  }
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pagination Logic (Mock)
  const itemsPerPage = 12 // Showing all for now as per design, but prepared for pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Section */}
      <div className="bg-white pt-12 pb-8 px-4 text-center border-b">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our extensive collection of high-quality laboratory equipment and supplies for your research and educational needs.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-bright-teal-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-french-blue-600 text-white rounded-md">
               <Search className="h-4 w-4" /> Search
            </button>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500 shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                      selectedCategory === category
                        ? "bg-french-blue-600 text-white border-french-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">{product.description}</p>
                {/* Optional: Add "View Details" or "Add to Quote" button here if needed later */}
              </div>
            </div>
          ))}
        </div>

        {/* No Results State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All Categories"); }}
              className="mt-4 text-french-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 flex justify-between items-center border-t pt-6">
            <button 
              className="flex items-center gap-1 px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="text-sm text-gray-500">
              Page {currentPage}
            </div>
            <button 
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
