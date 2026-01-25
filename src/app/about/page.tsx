import Image from "next/image"
import { BadgeDollarSign, Clock, Microscope, Headset } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-deep-twilight-100">
      {/* About Us Header Section */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">About Us</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-12">
          Our Motive is to Provide Best for Those Who Deserve
        </p>

        <div className="text-gray-600 dark:text-gray-300 space-y-8 text-left max-w-6xl mx-auto">
          <p className="leading-relaxed">
            Since 1998, <span className="font-bold text-gray-900 dark:text-white">NIJ SCIENTIFIC</span> has been a leading national source of laboratory and scientific products, instruments, equipment, and supplies. We specialize in providing equipment for school and college laboratories, covering physics, biology, chemistry, and mathematics. In this endeavour, with increasing Indian economy & education industry, we have expanded our product range to various fields, including Engineering, Medical, Pharmacy, Homeopathy, Nursing, Dental, and Polytechnic Colleges.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <p className="leading-relaxed">
              We have been engaged in the manufacturing of scientific Glassware & Instruments. In addition to our outstanding portfolio of industry-leading brands and proprietary products, we also design Scientific Glassware as per customer requirements. Customers can rely on our team of highly trained technical Specialists to assist them in selecting a product tailored to their specific needs, as well as troubleshooting an existing system. Our Customer Service associates are unsurpassed in their product expertise.
            </p>
            <p className="leading-relaxed">
              Over the years, we have earned a strong reputation in the market. Our registered trademark is recognized for quality & reliability. We are an ISO-certified company, and our expansive warehouse is stocked with nearly every item needed for scientific and industrial markets. Every product manufactured & supplied by us is thoroughly checked and securely packed to ensure safe transportation and complete customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Why People Choose Us Section */}
      <section className="py-16 px-6 lg:px-8 bg-gray-50 dark:bg-deep-twilight-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Why People Choose Us?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-deep-twilight-300 p-8 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
                <BadgeDollarSign className="w-12 h-12 text-bright-teal-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Value for Money</h3>
              <p className="text-gray-600 dark:text-gray-200 text-sm">
                The best combination of cost, quality, and sustainability.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-deep-twilight-300 p-8 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
                <Clock className="w-12 h-12 text-bright-teal-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">On-Time Delivery</h3>
              <p className="text-gray-600 dark:text-gray-200 text-sm">
                We ensure all orders are delivered as promised because we value your time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-deep-twilight-300 p-8 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
                <Microscope className="w-12 h-12 text-french-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">High-Quality Products</h3>
              <p className="text-gray-600 dark:text-gray-200 text-sm">
                Products meet industry standards and customer expectations.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-deep-twilight-300 p-8 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
                <Headset className="w-12 h-12 text-bright-teal-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Excellent Support</h3>
              <p className="text-gray-600 dark:text-gray-200 text-sm">
                Our team is always available to assist with any queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Directors Section */}
      <section className="py-16 px-6 lg:px-8 bg-white dark:bg-deep-twilight-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Directors</h2>
          
          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            {/* Director 1 */}
            <div className="bg-white dark:bg-deep-twilight-200 p-6 rounded-lg shadow-sm text-center w-full max-w-sm border border-gray-100 dark:border-deep-twilight-300">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <Image
                  src="https://placehold.co/256x256/png?text=Hemant" // Placeholder professional
                  alt="Hemant Limbani"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hemant Limbani</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Managing Director</p>
            </div>

            {/* Director 2 */}
            <div className="bg-white dark:bg-deep-twilight-200 p-6 rounded-lg shadow-sm text-center w-full max-w-sm border border-gray-100 dark:border-deep-twilight-300">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Yash Limbani</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Managing Director</p>
            </div>

            {/* Director 3 */}
            <div className="bg-white dark:bg-deep-twilight-200 p-6 rounded-lg shadow-sm text-center w-full max-w-sm border border-gray-100 dark:border-deep-twilight-300">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <Image
                  src="https://placehold.co/256x256/png?text=Nij" // Placeholder professional
                  alt="Nij Limbani"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nij Limbani</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Managing Director</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
