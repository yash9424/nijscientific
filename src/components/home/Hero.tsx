"use client"

import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroSlide {
  _id: string
  tag: string
  headline: string
  subheadline: string
  mediaUrl: string
  mediaType: "image" | "video"
  order: number
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    _id: "default-1",
    tag: "New Arrival",
    headline: "Analytical Balances",
    subheadline: "Precision analytical balances for accurate measurements",
    mediaUrl: "https://placehold.co/2070x600/png?text=Analytical+Balances",
    mediaType: "image",
    order: 0,
  },
  {
    _id: "default-2",
    tag: "",
    headline: "Laboratory Glassware",
    subheadline: "High-quality borosilicate glassware for all your needs",
    mediaUrl: "https://placehold.co/2025x600/png?text=Laboratory+Glassware",
    mediaType: "image",
    order: 1,
  },
  {
    _id: "default-3",
    tag: "",
    headline: "Scientific Instruments",
    subheadline: "Advanced instruments for research and education",
    mediaUrl: "https://placehold.co/2070x600/png?text=Scientific+Instruments",
    mediaType: "image",
    order: 2,
  },
]

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })])

  useEffect(() => {
    fetch("/api/hero?active=true")
      .then((res) => res.json())
      .then((data) => setSlides(data.success && data.data.length > 0 ? data.data : FALLBACK_SLIDES))
      .catch(() => setSlides(FALLBACK_SLIDES))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="relative">
      <div className="group relative overflow-hidden bg-deep-twilight-100 text-white">
        {loading ? (
          <div className="h-[560px] animate-pulse bg-gradient-to-br from-deep-twilight-200 to-french-blue-300 lg:h-auto lg:min-h-[520px] lg:aspect-[1920/750]" />
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, i) => (
                <div className="relative h-[560px] min-w-0 flex-[0_0_100%] lg:h-auto lg:min-h-[520px] lg:aspect-[1920/750]" key={slide._id}>
                  <div className="absolute inset-0">
                    {slide.mediaType === "video" ? (
                      <video src={slide.mediaUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                    ) : (
                      <div
                        className={cn(
                          "h-full w-full bg-cover bg-center transition-transform duration-[7000ms] ease-out",
                          selected === i ? "scale-110" : "scale-100"
                        )}
                        style={{ backgroundImage: `url(${slide.mediaUrl})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-deep-twilight-100/95 via-deep-twilight-100/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-twilight-100/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-bright-teal-blue" />
                    <div className="aurora absolute inset-0 opacity-70 mix-blend-screen" />
                  </div>

                  <div className="container-x relative flex h-full flex-col justify-center">
                    <div key={selected === i ? "on" : "off"} className={cn("max-w-2xl", selected === i && "animate-fade-up")}>
                      {slide.tag && (
                        <span className="mb-6 inline-flex items-center gap-2 rounded-sm bg-bright-teal-blue px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                                                    {slide.tag}
                        </span>
                      )}
                      <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl">{slide.headline}</h1>
                      {slide.subheadline && (
                        <p className="mt-6 max-w-xl text-lg text-slate-300 md:text-xl">{slide.subheadline}</p>
                      )}
                      <div className="mt-10 flex flex-wrap gap-3">
                        <Link href="/products" className="btn-primary">
                          Explore Products <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          href="/contact"
                          className="btn-ghost !border-white !text-white hover:!bg-white hover:!text-deep-twilight"
                        >
                          Contact Us
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        {!loading && slides.length > 1 && (
          <div className="container-x pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-between md:bottom-10">
            <div className="pointer-events-auto flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s._id}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    selected === i ? "w-10 bg-bright-teal-blue-600" : "w-4 bg-white/30 hover:bg-white/60"
                  )}
                />
              ))}
              <span className="ml-3 font-mono text-xs text-white/60">
                {String(selected + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
            <div className="pointer-events-auto flex gap-2">
              <button
                onClick={scrollPrev}
                aria-label="Previous slide"
                className="grid h-11 w-11 place-items-center rounded-md border border-white/30 bg-white/10 transition hover:bg-bright-teal-blue hover:border-bright-teal-blue"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next slide"
                className="grid h-11 w-11 place-items-center rounded-md border border-white/30 bg-white/10 transition hover:bg-bright-teal-blue hover:border-bright-teal-blue"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
