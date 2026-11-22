"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, ClipboardList, Phone, Mail, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInquiry } from "@/context/InquiryContext"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { inquiryItems } = useInquiry()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setMobileMenuOpen(false), [pathname])

  if (pathname.startsWith("/admin") || pathname === "/login") return null

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const iconBtn =
    "relative grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-deep-twilight transition hover:border-bright-teal-blue hover:text-bright-teal-blue dark:border-white/15 dark:text-slate-200 dark:hover:text-sky-aqua"

  return (
    <header className="sticky top-0 z-50">
      {/* Top contact bar */}
      <div className="hidden bg-deep-twilight text-[13px] text-slate-300 md:block">
        <div className="container-x flex h-10 items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+919409015580" className="inline-flex items-center gap-2 transition hover:text-white">
              <Phone className="h-3.5 w-3.5 text-sky-aqua" /> +91 94090 15580
            </a>
            <a href="mailto:nij_l@yahoo.in" className="inline-flex items-center gap-2 transition hover:text-white">
              <Mail className="h-3.5 w-3.5 text-sky-aqua" /> nij_l@yahoo.in
            </a>
          </div>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-sky-aqua" /> Rajkot, Gujarat · First Scientific Mall in Saurashtra/Kutch
          </span>
        </div>
      </div>

      <div className={cn("bg-white transition-shadow dark:bg-deep-twilight-100", scrolled ? "shadow-md" : "border-b border-slate-200 dark:border-white/10")}>
        <nav className="container-x flex h-[72px] items-center justify-between" aria-label="Global">
          <Link href="/" className="flex items-center gap-3">
            <span className="sr-only">Nij Scientific</span>
            <span className="grid h-10 w-10 place-items-center rounded-md bg-deep-twilight font-display text-lg font-bold text-white dark:bg-bright-teal-blue">
              N
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold tracking-tight text-deep-twilight dark:text-white">NIJ SCIENTIFIC</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-bright-teal-blue dark:text-sky-aqua">
                Laboratory Solutions
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative py-6 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:bg-bright-teal-blue after:transition-transform",
                  isActive(item.href)
                    ? "text-deep-twilight after:scale-x-100 dark:text-white"
                    : "text-slate-500 after:scale-x-0 hover:text-deep-twilight hover:after:scale-x-100 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/contact" className={iconBtn} aria-label="Inquiry list">
              <ClipboardList className="h-[18px] w-[18px]" />
              {mounted && inquiryItems.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-bright-teal-blue px-1 text-[11px] font-bold text-white">
                  {inquiryItems.length}
                </span>
              )}
            </Link>
            <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
              {mounted && theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <Link href="/contact" className="btn-primary ml-2 hidden lg:inline-flex">
              Request a Quote
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-deep-twilight lg:hidden dark:text-slate-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 lg:hidden dark:border-white/10">
            <div className="container-x space-y-1 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block rounded-md px-4 py-3 text-base font-semibold",
                    isActive(item.href)
                      ? "bg-bright-teal-blue/10 text-bright-teal-blue dark:text-sky-aqua"
                      : "text-deep-twilight hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/contact" className="btn-primary mt-3 w-full">
                Request a Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
