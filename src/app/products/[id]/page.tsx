"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Loader2, ArrowLeft, Plus, Check, Minus } from "lucide-react"
import Link from "next/link"
import { useInquiry } from "@/context/InquiryContext"
import { toast } from "sonner"

interface Product {
  _id: string;
  name: string;
  description: string;
  mainImage: string;
  images: string[];
  category: { _id: string; name: string };
  hasTable: boolean;
  tableColumns: string[];
  tableRows: string[][];
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const { addToInquiry, removeFromInquiry, isInInquiry } = useInquiry()

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      if (data.success) {
        setProduct(data.data)
        setSelectedImage(data.data.mainImage)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-deep-twilight-100">
        <Loader2 className="w-8 h-8 animate-spin text-french-blue" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-deep-twilight-100 gap-4">
        <p className="text-xl text-gray-600 dark:text-gray-300">Product not found</p>
        <Link 
          href="/products"
          className="px-4 py-2 bg-french-blue text-white rounded-lg hover:bg-french-blue/90 transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-deep-twilight-100 min-h-screen pb-12">
      {/* Header / Breadcrumb */}
      <div className="bg-white dark:bg-deep-twilight-200 border-b dark:border-deep-twilight-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-french-blue dark:hover:text-sky-aqua transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-deep-twilight-200 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
              <Image
                src={selectedImage || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
              />
            </div>

            {/* Additional Images Gallery */}
            {(product.images && product.images.length > 0) && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {/* Include Main Image in gallery as well to switch back */}
                <button
                  onClick={() => setSelectedImage(product.mainImage)}
                  className={`flex-shrink-0 relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === product.mainImage
                      ? "border-french-blue"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Image
                    src={product.mainImage}
                    alt="Main view"
                    fill
                    className="object-cover"
                  />
                </button>
                
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === img
                        ? "border-french-blue"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`View ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="space-y-8">
            <div>
              <div className="inline-block px-3 py-1 bg-french-blue/10 dark:bg-sky-aqua/10 text-french-blue dark:text-sky-aqua rounded-full text-sm font-medium mb-4">
                {product.category?.name || 'Category'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    if (isInInquiry(product._id)) {
                      removeFromInquiry(product._id);
                      toast.info("Removed from Inquiry", {
                        description: "Product has been removed from your inquiry list."
                      });
                    } else {
                      addToInquiry({
                        _id: product._id,
                        name: product.name,
                        mainImage: product.mainImage
                      });
                      toast.success("Added to Inquiry", {
                        description: "Your inquiry product has been added to the contact us page. Please fill the form and submit to send this to admin side.",
                        duration: 5000,
                      });
                    }
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isInInquiry(product._id)
                      ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-french-blue text-white hover:bg-french-blue/90"
                  }`}
                >
                  {isInInquiry(product._id) ? (
                    <>
                      <Minus className="w-4 h-4" /> Remove from Inquiry
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add to Inquiry
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Specifications Table - Moved back to Right Column */}
            {product.hasTable && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="bg-gray-50 dark:bg-deep-twilight-300 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Specifications</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-white dark:bg-deep-twilight-200">
                      <tr>
                        {product.tableColumns.map((col, idx) => (
                          <th key={idx} className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap border border-gray-200 dark:border-gray-700">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-deep-twilight-200">
                      {product.tableRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-deep-twilight-300/50 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-6 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border border-gray-200 dark:border-gray-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
