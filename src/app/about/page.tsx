import { BadgeDollarSign, Clock, Microscope, Headset, Award, FlaskConical, Warehouse, ShieldCheck } from "lucide-react"
import { Reveal } from "@/components/ui/Reveal"

const reasons = [
  { icon: BadgeDollarSign, title: "Value for Money", text: "The best combination of cost, quality, and sustainability." },
  { icon: Clock, title: "On-Time Delivery", text: "We ensure all orders are delivered as promised because we value your time." },
  { icon: Microscope, title: "High-Quality Products", text: "Products meet industry standards and customer expectations." },
  { icon: Headset, title: "Excellent Support", text: "Our team is always available to assist with any queries." },
]

const highlights = [
  { icon: Award, label: "ISO-certified company" },
  { icon: FlaskConical, label: "Custom scientific glassware" },
  { icon: Warehouse, label: "Expansive, well-stocked warehouse" },
  { icon: ShieldCheck, label: "Checked & securely packed" },
]

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* About Us Header Section */}
      <section className="relative overflow-hidden bg-deep-twilight text-white">
        <div className="aurora pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" /><div className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-1/3 bg-bright-teal-blue" />
        <div className="container-x relative py-20 text-center md:py-28">
          <span className="eyebrow !text-sky-aqua animate-fade-up">Since 2018</span>
          <h1 className="mt-4 text-4xl font-bold text-white animate-fade-up md:text-6xl">
            About <span className="text-gradient">Us</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium text-slate-300 animate-fade-up [animation-delay:120ms]">
            Our Motive is to Provide Best for Those Who Deserve
          </p>
        </div>
      </section>

      <section className="container-x">
        <Reveal className="card relative overflow-hidden p-8 md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-green-500/15 blur-3xl" />
          <p className="relative text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-300">
            Since 2018, <span className="font-bold text-slate-900 dark:text-white">NIJ SCIENTIFIC</span> has been a leading national source of laboratory and
            scientific products, instruments, equipment, and supplies. We specialize in providing equipment for school and college laboratories, covering
            physics, biology, chemistry, and mathematics. In this endeavour, with increasing Indian economy &amp; education industry, we have expanded our
            product range to various fields, including Engineering, Medical, Pharmacy, Homeopathy, Nursing, Dental, and Polytechnic Colleges.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal className="card p-8" delay={100}>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              We have been engaged in the manufacturing of scientific Glassware &amp; Instruments. In addition to our outstanding portfolio of industry-leading
              brands and proprietary products, we also design Scientific Glassware as per customer requirements. Customers can rely on our team of highly
              trained technical Specialists to assist them in selecting a product tailored to their specific needs, as well as troubleshooting an existing
              system. Our Customer Service associates are unsurpassed in their product expertise.
            </p>
          </Reveal>
          <Reveal className="card p-8" delay={200}>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              Over the years, we have earned a strong reputation in the market. Our registered trademark is recognized for quality &amp; reliability. We are an
              ISO-certified company, and our expansive warehouse is stocked with nearly every item needed for scientific and industrial markets. Every product
              manufactured &amp; supplied by us is thoroughly checked and securely packed to ensure safe transportation and complete customer satisfaction.
            </p>
          </Reveal>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 80} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
              <span className="icon-chip !h-10 !w-10 !rounded-xl">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why People Choose Us Section */}
      <section className="container-x mt-24">
        <div className="relative overflow-hidden rounded-2xl bg-deep-twilight-100 px-6 py-16 md:px-12 lg:py-20">
          <div className="aurora pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 mask-fade" />
          <Reveal className="relative text-center">
            <span className="eyebrow !text-sky-aqua">Our promise</span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Why People <span className="text-gradient">Choose Us?</span>
            </h2>
          </Reveal>
          <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                key={title}
                delay={i * 100}
                className="group rounded-xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition duration-500 hover:-translate-y-1.5 hover:border-sky-aqua/40 hover:bg-white/[0.08]"
              >
                <span className="icon-chip !h-14 !w-14 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Directors Section */}
      <section className="container-x mt-24">
        <Reveal className="text-center">
          <span className="eyebrow">Leadership</span>
          <h2 className="section-title">
            Our <span className="text-gradient">Directors</span>
          </h2>
        </Reveal>
        <div className="mt-12 flex justify-center">
          <Reveal className="glow-border w-full max-w-sm rounded-xl">
            <div className="card !rounded-xl p-8 text-center">
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-bright-teal-blue p-1">
                <div className="grid h-full w-full place-items-center rounded-full bg-white dark:bg-deep-twilight-200">
                  <svg className="h-16 w-16 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">Hemant Limbani</h3>
              <p className="mt-1 text-sm font-medium text-bright-teal-blue dark:text-sky-aqua">Managing Director</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
