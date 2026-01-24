import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "4-Digit Analytical Balances",
    description: "High analytical balances are high-precision instruments measuring mass with ±0.0001g accuracy.",
    image: "https://images.unsplash.com/photo-1623005367342-a63e90060934?auto=format&fit=crop&q=80&w=600",
    tag: "New"
  },
  {
    id: 2,
    name: "Vortex Mixers",
    description: "Vortex mixers are laboratory instruments that mix small volumes of liquids in tubes, vials, or beakers.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600",
    tag: "New"
  },
  {
    id: 3,
    name: "Volumetric Flask",
    description: "A volumetric flask is a laboratory glassware used to prepare solutions with precise volumes.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600",
    tag: "New"
  },
]

export function NewProducts() {
  return (
    <section className="py-16 bg-gray-50" id="products">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-french-blue-600 tracking-wide uppercase">Latest Additions</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">New Products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.tag && (
                  <span className="absolute top-4 right-4 bg-turquoise-surf-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>
                <Link href="#" className="inline-flex items-center text-bright-teal-blue-600 hover:text-bright-teal-blue-700 font-medium text-sm">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
