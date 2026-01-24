"use client"

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'

const slides = [
  {
    title: "Analytical Balances",
    description: "Precision analytical balances for accurate measurements",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2070", // Lab equipment / cells
  },
  {
    title: "Laboratory Glassware",
    description: "High-quality borosilicate glassware for all your needs",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2025",
  },
  {
    title: "Scientific Instruments",
    description: "Advanced instruments for research and education",
    image: "https://images.unsplash.com/photo-1581093458791-9f302e6d8df9?auto=format&fit=crop&q=80&w=2070",
  },
]

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative bg-black text-white">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div className="relative flex-[0_0_100%] min-w-0 h-[500px] md:h-[600px]" key={index}>
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-16 max-w-7xl mx-auto">
                <span className="inline-block px-3 py-1 bg-turquoise-surf-600 text-white text-xs font-semibold rounded-full mb-4">
                  New Arrival
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors"
        onClick={scrollNext}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}
