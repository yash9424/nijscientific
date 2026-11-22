"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Plus, Minus, Star, ShieldCheck, Truck, Headset, MessageSquareText, Send } from "lucide-react"
import { cn } from "@/lib/utils"
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
      <div className="container-x grid min-h-[70vh] gap-10 py-12 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-slate-200 dark:bg-white/5" />
        <div className="space-y-4 pt-6">
          <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-white/5" />
          <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/5" />
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/5" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Product not found</p>
        <Link href="/products" className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
      </div>
    )
  }

  const inInquiry = isInInquiry(product._id)
  const gallery = [product.mainImage, ...(product.images || [])]
  const avgRating = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0

  const toggleInquiry = () => {
    if (inInquiry) {
      removeFromInquiry(product._id)
      toast.info("Removed from Inquiry", {
        description: "Product has been removed from your inquiry list.",
      })
    } else {
      addToInquiry({ _id: product._id, name: product.name, mainImage: product.mainImage })
      toast.success("Added to Inquiry", {
        description:
          "Your inquiry product has been added to the contact us page. Please fill the form and submit to send this to admin side.",
        duration: 5000,
      })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <div className="aurora pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] grid-bg mask-fade" />

      {/* Breadcrumb */}
      <div className="container-x relative pt-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/products" className="inline-flex items-center gap-2 font-medium transition hover:text-bright-teal-blue dark:hover:text-sky-aqua">
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </Link>
          {product.category?.name && (
            <>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <Link
                href={`/products?category=${encodeURIComponent(product.category.name)}`}
                className="transition hover:text-bright-teal-blue dark:hover:text-sky-aqua"
              >
                {product.category.name}
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="container-x relative mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: Images */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="glow-border relative aspect-square overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
            <Image
              key={selectedImage}
              src={selectedImage || "/placeholder.png"}
              alt={product.name}
              fill
              priority
              className="object-contain p-4 animate-fade-up"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {product.images && product.images.length > 0 && (
            <div className="scrollbar-hide mt-4 flex gap-3 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all md:h-24 md:w-24 dark:bg-white/5",
                    selectedImage === img
                      ? "border-bright-teal-blue ring-4 ring-bright-teal-blue/20 dark:border-sky-aqua"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={idx === 0 ? "Main view" : `View ${idx}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div>
          <span className="eyebrow">{product.category?.name || "Category"}</span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl dark:text-white">{product.name}</h1>

          {reviews.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn("h-4 w-4", s <= Math.round(avgRating) ? "fill-current" : "opacity-25")} />
                ))}
              </div>
              {avgRating.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? "s" : ""}
            </div>
          )}

          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={toggleInquiry}
              className={cn(
                inInquiry
                  ? "inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                  : "btn-primary"
              )}
            >
              {inInquiry ? (
                <>
                  <Minus className="h-4 w-4" /> Remove from Inquiry
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add to Inquiry
                </>
              )}
            </button>
            {inInquiry && (
              <Link href="/contact" className="btn-ghost">
                <Send className="h-4 w-4" /> Go to Inquiry
              </Link>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, t: "Quality Checked" },
              { icon: Truck, t: "On-Time Delivery" },
              { icon: Headset, t: "Expert Support" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="rounded-xl border border-slate-200/80 bg-white/60 p-4 text-center backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                <span className="icon-chip mx-auto">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">{t}</p>
              </div>
            ))}
          </div>

          {/* Specifications Table */}
          {product.hasTable && (
            <div className="card mt-10 overflow-hidden !rounded-xl">
              <div className="border-b border-slate-200/80 bg-gradient-to-r from-french-blue/5 to-turquoise-surf/5 px-6 py-4 dark:border-white/10">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Specifications</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5">
                    <tr>
                      {product.tableColumns.map((col, idx) => (
                        <th key={idx} className="whitespace-nowrap px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {product.tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className="transition hover:bg-bright-teal-blue/[0.04]">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="whitespace-nowrap px-6 py-3.5 text-slate-700 dark:text-slate-300">
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

      {/* Reviews */}
      <div className="container-x mt-24 grid gap-8 lg:grid-cols-5">
        <div className="card p-6 md:p-8 lg:col-span-2 lg:self-start">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
            <MessageSquareText className="h-5 w-5 text-bright-teal-blue dark:text-sky-aqua" /> Write a review
          </h2>
          <form className="mt-6 space-y-5" onSubmit={handleSubmitReview}>
            <div>
              <label className="label">Your name</label>
              <input
                type="text"
                value={reviewForm.name}
                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                className="input"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="label">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="p-1 transition hover:scale-110"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={cn(
                        "h-7 w-7",
                        reviewForm.rating >= star ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{reviewForm.rating} of 5</span>
              </div>
            </div>
            <div>
              <label className="label">Review</label>
              <textarea
                value={reviewForm.content}
                onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                className="input min-h-[120px] resize-none"
                placeholder="Share your experience with this product"
                required
              />
            </div>
            <button type="submit" disabled={submittingReview} className="btn-primary w-full">
              {submittingReview && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit review
            </button>
          </form>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reviews {reviews.length > 0 && <span className="text-slate-400">({reviews.length})</span>}
          </h2>
          {reviewsLoading ? (
            <div className="mt-6 flex items-center gap-2 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-white/15 dark:text-slate-400">
              No reviews yet. Be the first to review this product.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="card !rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-french-blue to-turquoise-surf text-sm font-bold text-white">
                        {review.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{review.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("h-4 w-4", s <= review.rating ? "fill-current" : "opacity-25")} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
