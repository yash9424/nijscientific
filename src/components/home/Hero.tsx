"use client"

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'

interface HeroSlide {
  _id: string;
  tag: string;
  headline: string;
  subheadline: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  order: number;
}

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/hero')
      const data = await res.json()
      if (data.success && data.data.length > 0) {
        setSlides(data.data)
      } else {
        // Fallback to default slides if no dynamic slides are found
        setSlides([
          {
            _id: 'default-1',
            tag: 'New Arrival',
            headline: "Analytical Balances",
            subheadline: "Precision analytical balances for accurate measurements",
            mediaUrl: "https://placehold.co/2070x600/png?text=Analytical+Balances",
            mediaType: 'image',
            order: 0
          },
          {
            _id: 'default-2',
            tag: '',
            headline: "Laboratory Glassware",
            subheadline: "High-quality borosilicate glassware for all your needs",
            mediaUrl: "https://placehold.co/2025x600/png?text=Laboratory+Glassware",
            mediaType: 'image',
            order: 1
          },
          {
            _id: 'default-3',
            tag: '',
            headline: "Scientific Instruments",
            subheadline: "Advanced instruments for research and education",
            mediaUrl: "https://placehold.co/2070x600/png?text=Scientific+Instruments",
            mediaType: 'image',
            order: 2
          },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch hero slides:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (loading) {
    return <div className="h-[500px] md:h-[600px] bg-black animate-pulse" />
  }

  return (
    <div className="relative bg-black text-white group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div className="relative flex-[0_0_100%] min-w-0 h-[500px] md:h-[600px]" key={slide._id}>
              {/* Background Media */}
              <div className="absolute inset-0">
                {slide.mediaType === 'video' ? (
                  <video
                    src={slide.mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.mediaUrl})` }}
                  />
                )}
                <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-16 max-w-7xl mx-auto">
                {slide.tag && (
                  <span className="inline-block px-3 py-1 bg-turquoise-surf-600 text-white text-xs font-semibold rounded-full mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {slide.tag}
                  </span>
                )}
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                  {slide.headline}
                </h1>
                {slide.subheadline && (
                  <p className="text-lg md:text-xl text-gray-200 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    {slide.subheadline}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        onClick={scrollNext}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}
