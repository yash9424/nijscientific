"use client"

import { Mail, MapPin, Phone, Send, User, MinusCircle } from "lucide-react"
import { useState } from "react"
import { useInquiry } from "@/context/InquiryContext"
import Image from "next/image"
import { Reveal } from "@/components/ui/Reveal"

export default function ContactPage() {
  const { inquiryItems, removeFromInquiry } = useInquiry()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill all fields")
      return
    }

    const phone = "919409015580"

    const itemsText =
      inquiryItems.length === 0
        ? "No products selected."
        : inquiryItems
            .map(
              (item, index) =>
                `${index + 1}. ${item.name} (ID: ${item._id})`
            )
            .join("\n")

    const text = encodeURIComponent(
      `New inquiry from website\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Subject: ${formData.subject}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `Products:\n${itemsText}`
    )

    const url = `https://wa.me/${phone}?text=${text}`
    window.open(url, "_blank")

    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Address for Google Maps
  const address = "Nij Scientific, Plot No.13, Shed No.5&6, N/hNo.27, B/h.SkodaShowroom, near KisanPetrolPump, Rajkot, Gujarat 360022"
  const encodedAddress = encodeURIComponent(address)

  const contactCards = [
    { icon: Phone, title: "Call Us", lines: [{ t: "+91 94090 15580", href: "tel:+919409015580" }, { t: "+91 98244 15753", href: "tel:+919824415753" }] },
    { icon: Mail, title: "Email", lines: [{ t: "nij_l@yahoo.in", href: "mailto:nij_l@yahoo.in" }] },
    { icon: MapPin, title: "Visit Us", lines: [{ t: address, href: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}` }] },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-deep-twilight text-white">
        <div className="aurora pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" /><div className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-1/3 bg-bright-teal-blue" />
        <div className="container-x relative py-20 text-center md:py-24">
          <span className="eyebrow !text-sky-aqua animate-fade-up">Get in touch</span>
          <h1 className="mt-4 text-4xl font-bold text-white animate-fade-up md:text-6xl">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-slate-300 animate-fade-up [animation-delay:120ms]">
            Have questions or need assistance? Reach out to our team for support with your laboratory equipment needs.
          </p>
        </div>
      </section>

      <div className="container-x">
        {/* Contact cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {contactCards.map(({ icon: Icon, title, lines }, i) => (
            <Reveal key={title} delay={i * 100} className="card group p-6 transition hover:-translate-y-1">
              <span className="icon-chip transition group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">{title}</h3>
              <div className="mt-2 space-y-1">
                {lines.map((l) => (
                  <a
                    key={l.t}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block text-sm leading-6 text-slate-500 transition hover:text-bright-teal-blue dark:text-slate-400 dark:hover:text-sky-aqua"
                  >
                    {l.t}
                  </a>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          {/* Contact Form Section */}
          <div className="lg:col-span-3">
            <div className="glow-border rounded-xl">
              <div className="card !rounded-xl p-6 sm:p-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send us a message</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your message opens in WhatsApp with your selected products included.</p>
                <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="label">
                      <User className="h-4 w-4" /> Your Name
                    </label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="input" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">
                      <Mail className="h-4 w-4" /> Email Address
                    </label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="input" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="subject" className="label">
                      <Send className="h-4 w-4" /> Subject
                    </label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What would you like to discuss?" className="input" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="label">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." className="input resize-none" required rows={5} />
                  </div>
                  <button type="submit" className="btn-primary sm:col-span-2 !py-4">
                    <Send className="h-4 w-4" /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2">
            {/* Inquiry List Section */}
            {inquiryItems.length > 0 && (
              <div className="card p-6">
                <h3 className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  Inquiry Items
                  <span className="rounded-full bg-gradient-to-r from-french-blue to-bright-teal-blue px-3 py-0.5 text-xs font-bold text-white">
                    {inquiryItems.length}
                  </span>
                </h3>
                <div className="mt-4 space-y-3">
                  {inquiryItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 rounded-xl border border-slate-200/80 p-2 pr-3 dark:border-white/10">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                        <Image src={item.mainImage} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
                      <button
                        onClick={() => removeFromInquiry(item._id)}
                        title="Remove from inquiry"
                        className="text-slate-400 transition hover:text-red-500"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Section */}
            <div className="card h-[420px] overflow-hidden !rounded-xl p-2">
              <iframe
                title="Nij Scientific location"
                width="100%"
                height="100%"
                className="rounded-lg"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
