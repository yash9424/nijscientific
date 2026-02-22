"use client"

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
  _id: string;
  name: string;
  rating: number;
  content: string;
  createdAt: string;
}

export function ClientReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [reviews, setReviews] = useState<Review[]>([])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    fetch('/api/reviews?limit=20')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.data)
        }
      })
      .catch(err => console.error('Failed to load reviews', err))
  }, [])

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-deep-twilight-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Client Reviews</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {reviews.map((review) => (
                <div className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 pl-4" key={review._id}>
                  <div className="bg-white dark:bg-deep-twilight-200 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-deep-twilight-300 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-light-cyan-200 dark:bg-light-cyan-900 flex items-center justify-center text-french-blue-600 dark:text-french-blue-300 font-bold text-lg">
                        {review.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-turquoise-surf-500 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">"{review.content}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <button 
              className="p-2 rounded-full bg-white dark:bg-deep-twilight-200 border border-gray-200 dark:border-deep-twilight-300 hover:bg-gray-50 dark:hover:bg-deep-twilight-300 transition-colors shadow-sm"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              className="p-2 rounded-full bg-white dark:bg-deep-twilight-200 border border-gray-200 dark:border-deep-twilight-300 hover:bg-gray-50 dark:hover:bg-deep-twilight-300 transition-colors shadow-sm"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
