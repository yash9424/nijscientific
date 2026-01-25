"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { EmblaCarouselType, EmblaEventType } from "embla-carousel"

const categories = [
  {
    id: 1,
    name: "Glassware",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600",
    href: "#",
  },
  {
    id: 2,
    name: "All Products",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600",
    href: "#",
  },
  {
    id: 3,
    name: "Lab Equipment",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
    href: "#",
  },
  {
    id: 4,
    name: "Scientific Devices",
    image: "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?auto=format&fit=crop&q=80&w=600",
    href: "#",
  },
  {
    id: 5,
    name: "Plasticware",
    image: "https://images.unsplash.com/photo-1615486511484-92e1c31863db?auto=format&fit=crop&q=80&w=600",
    href: "#",
  },
  {
    id: 6,
    name: "Chemicals",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=600",
    href: "#",
  }
]

// Duplicate categories for smoother infinite loop with plenty of items
const loopCategories = [
  ...categories, 
  ...categories.map(c => ({ ...c, id: c.id + 100 })),
  ...categories.map(c => ({ ...c, id: c.id + 200 })),
  ...categories.map(c => ({ ...c, id: c.id + 300 }))
]

export function ProductCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: false, startIndex: categories.length },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )
  const [slideStyles, setSlideStyles] = useState<{ scale: number; opacity: number; zIndex: number; translateX: string }[]>([])

  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = emblaApi.internalEngine().scrollBody
    const scrollSnapList = emblaApi.scrollSnapList()
    
    let styles: { scale: number; opacity: number; zIndex: number; translateX: string }[] = []

    scrollSnapList.forEach((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[index]

      slidesInSnap.forEach((slideIndex) => {
        // Calculate styles for all slides to ensure smooth transitions even for those just entering view
        
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        // Calculate distance in "slide units" (approximate)
        // Since scrollProgress is 0-1 for full track, and there are N slides
        // distance in slides = diff * slideCount
        const slideCount = scrollSnapList.length
        const slideDiff = diffToTarget * slideCount
        const absSlideDiff = Math.abs(slideDiff)

        // User wants:
        // 1. Center card BIG
        // 2. Neighbors smaller
        // 3. Overlap (Center on top of neighbors, neighbors on top of outer)
        
        const scale = Math.max(0.8, 1.3 - (absSlideDiff * 0.3)) // Center 1.3, Neighbor ~1.0, Outer ~0.7
        const opacity = Math.max(0.5, 1 - (absSlideDiff * 0.2))
        const zIndex = 50 - Math.round(absSlideDiff * 10)
        
        // Pull items towards center to create overlap
        // Left items (negative diff) move Right (positive translate)
        // Right items (positive diff) move Left (negative translate)
        const translateXPercentage = slideDiff * -25 
        
        styles[slideIndex] = {
            scale,
            opacity,
            zIndex,
            translateX: `${translateXPercentage}%`
        }
      })
    })
    setSlideStyles(styles)
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onScroll(emblaApi)
    emblaApi.on("reInit", onScroll)
    emblaApi.on("scroll", onScroll)
    
    return () => {
      emblaApi.off("reInit", onScroll)
      emblaApi.off("scroll", onScroll)
    }
  }, [emblaApi, onScroll])

  return (
    <section className="py-16 bg-white dark:bg-deep-twilight-100 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-french-blue-600 dark:text-french-blue-400 tracking-wide uppercase">Browse Our</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Product Categories</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4 py-10">
              {loopCategories.map((category, index) => {
                const style = slideStyles[index] || { scale: 0.8, opacity: 0.5, zIndex: 0, translateX: '0%' }
                
                return (
                  <div 
                    key={category.id} 
                    className="flex-[0_0_75%] sm:flex-[0_0_50%] md:flex-[0_0_30%] lg:flex-[0_0_20%] min-w-0 pl-4 relative"
                    style={{
                      transform: `translateX(${style.translateX}) scale(${style.scale})`,
                      opacity: style.opacity,
                      zIndex: style.zIndex,
                      transition: 'transform 0.15s ease-out, opacity 0.15s ease-out' 
                    }}
                  >
                    <Link href={category.href} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                      
                      <div className="absolute bottom-0 left-0 p-6 w-full text-center transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{category.name}</h3>
                        <div className="inline-flex items-center justify-center text-sm font-medium text-bright-teal-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Products <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Manual Controls - Overlay or below? Below is cleaner for this style */}
          <div className="flex justify-center gap-4 mt-8">
            <button 
              className="p-3 rounded-full bg-gray-100 dark:bg-deep-twilight-200 text-gray-800 dark:text-white hover:bg-bright-teal-blue hover:text-white transition-colors"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous slide"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </button>
            <button 
              className="p-3 rounded-full bg-gray-100 dark:bg-deep-twilight-200 text-gray-800 dark:text-white hover:bg-bright-teal-blue hover:text-white transition-colors"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next slide"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
