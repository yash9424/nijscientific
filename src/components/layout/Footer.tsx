import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-deep-twilight text-white pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-sky-aqua mb-4 inline-block">
               <span className="text-white">Nij</span> Scientific
            </Link>
            <p className="text-gray-400 text-sm leading-6 max-w-sm">
              Your trusted source for high-quality laboratory equipment, glassware, and scientific supplies for research, education, and industry.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="#" className="text-gray-400 hover:text-sky-aqua-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-sky-aqua-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-sky-aqua-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-sky-aqua-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links (Optional - inferred) */}
          {/* <div className="col-span-1">
            <h3 className="text-sm font-semibold leading-6 text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="#products" className="text-sm text-gray-400 hover:text-white">Products</Link></li>
              <li><Link href="#about" className="text-sm text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="#contact" className="text-sm text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div> */}

          {/* Contact Info */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold leading-6 text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-sky-aqua-500" />
                <span>nij_l@yahoo.in</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-sky-aqua-500" />
                <span>+91 94090 15580</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-sky-aqua-500" />
                <span>+91 98244 15753</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 shrink-0 mt-1 text-sky-aqua-500" />
                <span>
                  Nij Scientific, Plot No.13, Shed No.5&6, N/hNo.27, B/h.SkodaShowroom, near KisanPetrolPump, Rajkot, Gujarat 360022
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Nij Scientific. All rights reserved. Transforming scientific research with quality products.
          </p>
        </div>
      </div>
    </footer>
  )
}
