"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Wrench, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselSlide {
  image: string
  title: string
  description: string
}

const slides: CarouselSlide[] = [
  {
    image: "/images/auth-carousel-1.png",
    title: "Professional Repair Shop",
    description: "Manage your mobile repair business with enterprise-grade tools",
  },
  {
    image: "/images/auth-carousel-2.png",
    title: "Expert Technicians",
    description: "Track repairs, manage inventory, and delight customers",
  },
  {
    image: "/images/auth-carousel-3.png",
    title: "Smart Dashboard",
    description: "Real-time analytics and insights to grow your business",
  },
]

export function AuthCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className="hidden lg:flex lg:w-1/2 relative h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/20 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/20 via-transparent to-transparent rounded-full blur-3xl" />
      


      {/* Carousel Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              index === currentSlide 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            )}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
        {/* Slide info */}
        <div className="mb-8">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-500",
                index === currentSlide 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-4 absolute"
              )}
            >
              {index === currentSlide && (
                <>
                  <h2 className="text-4xl font-bold text-white mb-3">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-white/80 max-w-md">
                    {slide.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {/* Dots */}
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentSlide 
                    ? "w-8 bg-white" 
                    : "w-2 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
