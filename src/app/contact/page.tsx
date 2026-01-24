"use client"

import { Mail, MapPin, Phone, Send, User } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", formData)
    alert("Message sent successfully! (This is a demo)")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Address for Google Maps
  const address = "Nij Scientific, Plot No.13, Shed No.5&6, N/hNo.27, B/h.SkodaShowroom, near KisanPetrolPump, Rajkot, Gujarat 360022"
  const encodedAddress = encodeURIComponent(address)

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gray-50 py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions or need assistance? Reach out to our team for support with your laboratory equipment needs.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map Section */}
          <div className="h-[500px] bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 relative">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`}
            ></iframe>
            {/* Fallback since we don't have a real API Key in this environment, using a generic embed for Rajkot if the above fails or looks blank, 
                but for a real project, the user needs an API key. 
                Alternatively, we can use the standard embed iframe which doesn't always require a key for basic searches if using the 'output=embed' format, 
                but Google has tightened this. 
                Let's use the standard 'maps?q=...' iframe format which is often free for basic usage or the one that doesn't require a key if possible, 
                or just a placeholder if we want to be safe.
                Actually, the standard non-API embed is: https://maps.google.com/maps?q=...&t=&z=13&ie=UTF8&iwloc=&output=embed
            */}
            <div className="absolute inset-0 z-10">
               <iframe 
                 width="100%" 
                 height="100%" 
                 id="gmap_canvas" 
                 src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                 frameBorder="0" 
                 scrolling="no" 
                 marginHeight={0} 
                 marginWidth={0}
               ></iframe>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Your Name
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bright-teal-blue-500 focus:ring-2 focus:ring-bright-teal-blue-200 outline-none transition-all bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Your Email
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bright-teal-blue-500 focus:ring-2 focus:ring-bright-teal-blue-200 outline-none transition-all bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> Subject
                  </span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What would you like to discuss?"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bright-teal-blue-500 focus:ring-2 focus:ring-bright-teal-blue-200 outline-none transition-all bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Your Message
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bright-teal-blue-500 focus:ring-2 focus:ring-bright-teal-blue-200 outline-none transition-all bg-gray-50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-french-blue-600 hover:bg-french-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
