import { Award, CalendarCheck, FlaskConical, GraduationCap } from "lucide-react"

// Facts taken from the About page content
const stats = [
  { icon: CalendarCheck, value: "2018", label: "Established" },
  { icon: Award, value: "ISO", label: "Certified Company" },
  { icon: GraduationCap, value: "12+", label: "Fields Served" },
  { icon: FlaskConical, value: "Custom", label: "Glassware Design" },
]

export function TrustStrip() {
  return (
    <section className="bg-deep-twilight text-white">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <div
            key={label}
            className={`flex items-center gap-4 py-8 ${i % 2 === 1 ? "pl-6" : ""} ${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""}`}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-bright-teal-blue">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold md:text-3xl">{value}</p>
              <p className="text-sm text-slate-300">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
