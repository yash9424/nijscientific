"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Loader2, ArrowLeft, Plus, Check, Minus } from "lucide-react"
import Link from "next/link"
import { useInquiry } from "@/context/InquiryContext"
import { toast } from "sonner"

interface Review {
  _id: string;
  product: string;
  name: string;
  rating: number;
  content: string;
  createdAt: string;
}

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
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    content: "",
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      fetchReviews(params.id as string)
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

  const fetchReviews = async (id: string) => {
    try {
      setReviewsLoading(true)
      const res = await fetch(`/api/reviews?productId=${id}`)
      const data = await res.json()
      if (data.success) {
        setReviews(data.data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    if (!reviewForm.name.trim() || !reviewForm.content.trim()) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setSubmittingReview(true)
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          name: reviewForm.name.trim(),
          rating: reviewForm.rating,
          content: reviewForm.content.trim(),
        }),
      })

      const data = await res.json()
      if (!data.success) {
        toast.error(data.error || "Failed to submit review")
        return
      }

      toast.success("Review submitted")
      setReviewForm({
        name: "",
        rating: 5,
        content: "",
      })
      fetchReviews(product._id)
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review")
    } finally {
      setSubmittingReview(false)
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

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
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

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12">
          <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Write a review
            </h2>
            <form className="space-y-4" onSubmit={handleSubmitReview}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your name
                </label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-deep-twilight-300 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm ${
                        reviewForm.rating >= star
                          ? "bg-french-blue text-white border-french-blue"
                          : "bg-white dark:bg-deep-twilight-300 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {reviewForm.rating} of 5
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Review
                </label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, content: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-deep-twilight-300 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua min-h-[100px]"
                  placeholder="Share your experience with this product"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-french-blue hover:bg-french-blue/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
              >
                {submittingReview && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Submit review
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Reviews
              </h2>
            </div>
            {reviewsLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this product.
              </p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-gray-100 dark:border-gray-700 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {review.name}
                      </p>
                      <span className="text-xs text-french-blue dark:text-sky-aqua font-semibold">
                        {review.rating} / 5
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
