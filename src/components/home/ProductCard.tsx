import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export interface ProductCardData {
  _id: string
  name: string
  description: string
  mainImage: string
  category: { name: string } | string
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const categoryName = typeof product.category === "object" && product.category ? product.category.name : ""

  return (
    <Link
      href={`/products/${product._id}`}
      className="group card flex h-full flex-col overflow-hidden !rounded-xl p-2 transition-all duration-500 hover:-translate-y-1 hover:border-bright-teal-blue hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-white/5">
        <Image
          src={product.mainImage || "https://placehold.co/600x400"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {categoryName && (
          <span className="absolute left-3 top-3 rounded-sm bg-deep-twilight px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            {categoryName}
          </span>
        )}
        <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-3 place-items-center rounded-md bg-bright-teal-blue text-white opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-grow flex-col px-3 pb-3 pt-4">
        <h3 className="font-display text-base font-semibold text-deep-twilight transition-colors group-hover:text-bright-teal-blue dark:text-white dark:group-hover:text-sky-aqua">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-grow text-sm text-slate-500 dark:text-slate-400">{product.description}</p>
      </div>
    </Link>
  )
}
