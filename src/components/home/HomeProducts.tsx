import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "4-Digit Analytical Balances",
    description: "High analytical balances are high-precision instruments measuring mass with ±0.0001g accuracy.",
    image: "https://images.unsplash.com/photo-1623005367342-a63e90060934?auto=format&fit=crop&q=80&w=600",
    category: "Lab Equipment"
  },
  {
    id: 2,
    name: "Vortex Mixers",
    description: "Vortex mixers are laboratory instruments that mix small volumes of liquids in tubes, vials, or beakers.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600",
    category: "Lab Equipment"
  },
  {
    id: 3,
    name: "Volumetric Flask",
    description: "A volumetric flask is a laboratory glassware used to prepare solutions with precise volumes.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600",
    category: "Glassware"
  },
  {
    id: 4,
    name: "Volumetric flask stand",
    description: "A volumetric flask stand is a laboratory tool designed to hold volumetric flasks securely.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600",
    category: "Lab Equipment"
  },
  {
    id: 5,
    name: "Wet & Dry hygrometer",
    description: "A wet and dry hygrometer, also known as a psychrometer, is a simple yet effective instrument.",
    image: "https://images.unsplash.com/photo-1632832962383-0599c2776c5f?auto=format&fit=crop&q=80&w=600",
    category: "Lab Equipment"
  },
  {
    id: 6,
    name: "Water Bath",
    description: "A water bath is a laboratory equipment that maintains a constant temperature for samples.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600",
    category: "Lab Equipment"
  }
]

export function HomeProducts() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-deep-twilight-100" id="products">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-french-blue-600 dark:text-french-blue-400 tracking-wide uppercase">Discover Quality</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Our Products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-deep-twilight-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
              <div className="relative h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 right-4 bg-french-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                <Link href="/products" className="inline-flex items-center text-bright-teal-blue-600 dark:text-bright-teal-blue-400 hover:text-bright-teal-blue-700 dark:hover:text-bright-teal-blue-300 font-medium text-sm mt-auto">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-french-blue-600 hover:bg-french-blue-700 md:text-lg transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
