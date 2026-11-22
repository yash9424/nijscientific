import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube, Twitter, ArrowUpRight } from "lucide-react"
import Link from "next/link"

const socials = [
  { href: "https://www.facebook.com/share/1LufUSzZv2/", icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/nij_scientific?igsh=dzJydWFzaXZjZGlp", icon: Instagram, label: "Instagram" },
  {
    href: "https://www.linkedin.com/in/nij-scientific-00a6883aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "https://youtube.com/@nijscientific?si=nSCYbyB4cKpNwN4l", icon: Youtube, label: "YouTube" },
  { href: "#", icon: Twitter, label: "Twitter - Coming Soon" },
]

const links = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-deep-twilight text-slate-300">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 mask-fade" />
      <div className="absolute inset-x-0 top-0 h-1.5 bg-bright-teal-blue" />

      <div className="container-x relative">
        {/* CTA band */}
        <div className="-mb-px flex flex-col items-start justify-between gap-6 border-b border-white/10 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Equip your lab with <span className="text-gradient">confidence.</span>
            </h2>
            <p className="mt-3 max-w-xl text-slate-400">
              Your trusted source for high-quality laboratory equipment, glassware, and scientific supplies for research, education, and industry.
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">
            Send an Inquiry <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="font-display text-2xl font-bold text-white">
              NIJ <span className="text-sky-aqua">SCIENTIFIC</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              First Scientific Mall in Saurashtra/Kutch — laboratory instruments, glassware & supplies since 2018.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target={href === "#" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  title={label}
                  className="grid h-10 w-10 place-items-center rounded-md border border-white/15 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:border-sky-aqua hover:text-sky-aqua"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Explore</h3>
            <ul className="mt-5 space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 transition hover:text-sky-aqua">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Contact Us</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-sky-aqua" />
                <a href="mailto:nij_l@yahoo.in" className="text-slate-400 transition hover:text-sky-aqua">
                  nij_l@yahoo.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-sky-aqua" />
                <span className="text-slate-400">
                  <a href="tel:+919409015580" className="transition hover:text-sky-aqua">+91 94090 15580</a>
                  <span className="mx-2 text-slate-600">/</span>
                  <a href="tel:+919824415753" className="transition hover:text-sky-aqua">+91 98244 15753</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-aqua" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Nij+Scientific,+Plot+No.13,+Shed+No.5%266,+N%2FhNo.27,+B%2Fh.SkodaShowroom,+near+KisanPetrolPump,+Rajkot,+Gujarat+360022"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-6 text-slate-400 transition hover:text-sky-aqua"
                >
                  Nij Scientific, Plot No.13, Shed No.5&6, N/hNo.27, B/h.SkodaShowroom, near KisanPetrolPump, Rajkot, Gujarat 360022
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-6 text-xs text-slate-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Nij Scientific. All rights reserved.</p>
          <p>Transforming scientific research with quality products.</p>
        </div>
      </div>
    </footer>
  )
}
