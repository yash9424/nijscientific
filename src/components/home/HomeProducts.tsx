"use client";

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface Product {
  _id: string;
  name: string;
  description: string;
  mainImage: string;
  category: { name: string } | string;
}

export function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data.slice(0, 10)); // Show latest 10 products
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-deep-twilight-100" id="products">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-french-blue-600 dark:text-french-blue-400 tracking-wide uppercase">Discover Quality</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Our Products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <Link 
              href={`/products/${product._id}`} 
              key={product._id} 
              className="bg-white dark:bg-deep-twilight-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group block"
            >
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image
                  src={product.mainImage || 'https://placehold.co/600x400'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">{product.description}</p>
              </div>
            </Link>
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
