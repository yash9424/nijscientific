import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600", // Using a molecule or general science image
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
    name: "Scientific Educational Devices",
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

export function ProductCategories() {
  return (
    <section className="py-16 bg-white dark:bg-deep-twilight-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-french-blue-600 dark:text-french-blue-400 tracking-wide uppercase">Browse Our</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Product Categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group relative block h-64 overflow-hidden rounded-xl bg-gray-900">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <div className="inline-flex items-center text-sm font-medium text-bright-teal-blue-300 group-hover:text-white transition-colors">
                  Browse Category <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
