"use client"

import React, { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Reveal } from "@/components/ui/Reveal"

interface Review {
  _id: string
  name: string
  rating: number
  content: string
  createdAt: string
}

export function ClientReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false }),
  ])
  const [reviews, setReviews] = useState<Review[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    fetch("/api/reviews?limit=20")
      .then((res) => res.json())
      .then((data) => data.success && setReviews(data.data))
      .catch((err) => console.error("Failed to load reviews", err))
  }, [])

  if (reviews.length === 0) return null

  return (
    <section className="bg-slate-50 py-20 lg:py-24 dark:bg-deep-twilight-200/40">
      <div className="container-x">
        <div className="relative">
          
          
          

          <Reveal className="relative mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">Testimonials</span>
              <h2 className="section-title">
                What our clients say
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                aria-label="Previous review"
                className="grid h-12 w-12 place-items-center rounded-md border border-slate-300 bg-white text-deep-twilight transition hover:bg-deep-twilight hover:text-white dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next review"
                className="grid h-12 w-12 place-items-center rounded-md border border-slate-300 bg-white text-deep-twilight transition hover:bg-deep-twilight hover:text-white dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </Reveal>

          <div className="relative overflow-hidden" ref={emblaRef}>
            <div className="-ml-5 flex">
              {reviews.map((review) => (
                <div className="min-w-0 flex-[0_0_100%] pl-5 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]" key={review._id}>
                  <div className="card flex h-full flex-col border-t-4 !border-t-bright-teal-blue p-7">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "opacity-25"}`} />
                        ))}
                      </div>
                      <Quote className="h-8 w-8 text-slate-200 dark:text-white/10" />
                    </div>
                    <p className="mt-5 flex-grow leading-relaxed text-slate-600 dark:text-slate-300">&ldquo;{review.content}&rdquo;</p>
                    <div className="mt-7 flex items-center gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-deep-twilight font-bold text-white dark:bg-bright-teal-blue">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-deep-twilight dark:text-white">{review.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
