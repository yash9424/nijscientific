"use client"

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: "Bharat Rohit",
    role: "Client",
    date: "December 3, 2024",
    content: "Nij Scientific's educational devices have been a game-changer for our students. Highly recommended!",
    rating: 5,
    avatar: "BR" // Placeholder initials
  },
  {
    id: 2,
    name: "Vivek Kumar",
    role: "Client",
    date: "January 15, 2025",
    content: "Excellent quality glassware and prompt delivery. Their customer service is top-notch.",
    rating: 5,
    avatar: "VK"
  },
  {
    id: 3,
    name: "Anjali Patel",
    role: "Lab Manager",
    date: "February 10, 2025",
    content: "We've been sourcing our chemicals from here for years. Consistent quality and fair pricing.",
    rating: 5,
    avatar: "AP"
  },
]

export function ClientReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Client Reviews</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {reviews.map((review) => (
                <div className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 pl-4" key={review.id}>
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-light-cyan-200 flex items-center justify-center text-french-blue-600 font-bold text-lg">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <p className="text-xs text-gray-500">{review.role}</p>
                      </div>
                      <div className="ml-auto text-xs text-gray-400">
                        {review.date}
                      </div>
                    </div>
                    <div className="flex text-turquoise-surf-500 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{review.content}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <button 
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
