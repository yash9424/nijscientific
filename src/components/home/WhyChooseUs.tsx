import Link from "next/link"
import { BadgeDollarSign, Clock, Microscope, Headset, CheckCircle2, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/ui/Reveal"

// Content taken from the About page
const reasons = [
  { icon: BadgeDollarSign, title: "Value for Money", text: "The best combination of cost, quality, and sustainability." },
  { icon: Clock, title: "On-Time Delivery", text: "We ensure all orders are delivered as promised because we value your time." },
  { icon: Microscope, title: "High-Quality Products", text: "Products meet industry standards and customer expectations." },
  { icon: Headset, title: "Excellent Support", text: "Our team is always available to assist with any queries." },
]

const points = [
  "ISO-certified company with a registered trademark",
  "Manufacturing of scientific glassware & instruments",
  "Expansive warehouse stocked for scientific and industrial markets",
  "Every product thoroughly checked and securely packed",
]

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="eyebrow">Why choose us</span>
          <h2 className="section-title">Your trusted laboratory partner since 2018</h2>
          <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">
            NIJ SCIENTIFIC has been a leading national source of laboratory and scientific products, instruments, equipment, and supplies. Customers can rely
            on our team of highly trained technical Specialists to assist them in selecting a product tailored to their specific needs.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-deep-twilight dark:text-slate-200">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bright-teal-blue dark:text-sky-aqua" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/about" className="btn-primary">
              About Us <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Contact Us
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <Reveal
              key={title}
              delay={i * 80}
              className={`card p-7 transition hover:border-bright-teal-blue hover:shadow-lg ${i % 2 === 1 ? "sm:translate-y-8" : ""}`}
            >
              <span className="icon-chip !h-14 !w-14">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-deep-twilight dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
