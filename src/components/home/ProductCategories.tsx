"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { EmblaCarouselType, EmblaEventType } from "embla-carousel"

interface Category {
  _id: string;
  name: string;
  image: string;
  caption: string;
  createdAt: string;
}

export function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loopCategories, setLoopCategories] = useState<Category[]>([])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: false, startIndex: categories.length > 0 ? categories.length : 0 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )
  const [slideStyles, setSlideStyles] = useState<{ scale: number; opacity: number; zIndex: number; translateX: string }[]>([])

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      // Duplicate categories for smoother infinite loop with plenty of items
      const loop = [
        ...categories, 
        ...categories.map(c => ({ ...c, _id: c._id + "_dup1" })),
        ...categories.map(c => ({ ...c, _id: c._id + "_dup2" })),
        ...categories.map(c => ({ ...c, _id: c._id + "_dup3" }))
      ];
      setLoopCategories(loop);
      
      if (emblaApi) {
        emblaApi.reInit({ startIndex: categories.length });
      }
    }
  }, [categories, emblaApi]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setCategories(data.data);
      } else {
        // Fallback to empty or specific message, but for now we rely on API
        console.log("No categories found or API error");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

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
        
        const scale = Math.max(0.7, 1.3 - (absSlideDiff * 0.3)) // Center 1.3, Neighbor ~1.0, Outer ~0.7
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

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-deep-twilight-100 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-french-blue" />
      </section>
    );
  }

  if (categories.length === 0) {
     // If no categories, you might want to hide the section or show a placeholder.
     // For now, hiding it to avoid broken UI.
     return null;
  }

  return (
    <section className="py-16 bg-white dark:bg-deep-twilight-100 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-french-blue-600 dark:text-french-blue-400 tracking-wide uppercase">Browse Our</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Product Categories</p>
        </div>

        <div className="relative">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4 py-20">
              {loopCategories.map((category, index) => {
                const style = slideStyles[index] || { scale: 0.8, opacity: 0.5, zIndex: 0, translateX: '0%' }
                
                return (
                  <div 
                    key={category._id} 
                    className="flex-[0_0_75%] sm:flex-[0_0_50%] md:flex-[0_0_30%] lg:flex-[0_0_20%] min-w-0 pl-4 relative"
                    style={{
                      transform: `translateX(${style.translateX}) scale(${style.scale})`,
                      opacity: style.opacity,
                      zIndex: style.zIndex,
                      transition: 'transform 0.15s ease-out, opacity 0.15s ease-out' 
                    }}
                  >
                    <Link href="#" className="group relative block aspect-[3/4] overflow-hidden rounded-[2rem] bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent dark:from-black/90 dark:via-black/20 dark:to-transparent opacity-90" />
                      
                      <div className="absolute bottom-0 left-0 p-6 w-full text-center transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                        {category.caption && (
                             <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                               {category.caption}
                             </p>
                        )}
                        <div className="inline-flex items-center justify-center text-sm font-medium text-french-blue-600 dark:text-bright-teal-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Products <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
          
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
