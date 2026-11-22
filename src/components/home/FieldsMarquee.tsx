import { Atom, Calculator, Cog, Dna, FlaskConical, HeartPulse, Pill, Leaf, Stethoscope, Smile, Wrench, School } from "lucide-react"
import { Reveal } from "@/components/ui/Reveal"

// Fields served — taken from the About page content
const fields = [
  { name: "Physics", icon: Atom },
  { name: "Biology", icon: Dna },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Mathematics", icon: Calculator },
  { name: "Engineering", icon: Cog },
  { name: "Medical", icon: HeartPulse },
  { name: "Pharmacy", icon: Pill },
  { name: "Homeopathy", icon: Leaf },
  { name: "Nursing", icon: Stethoscope },
  { name: "Dental", icon: Smile },
  { name: "Polytechnic", icon: Wrench },
  { name: "Schools & Colleges", icon: School },
]

export function FieldsMarquee() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container-x">
        <Reveal className="grid items-end gap-6 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Industries we serve</span>
            <h2 className="section-title">Equipping laboratories across every discipline</h2>
          </div>
          <p className="text-slate-600 lg:text-right dark:text-slate-400">
            From school and college laboratories to Engineering, Medical, Pharmacy, Homeopathy, Nursing, Dental and Polytechnic colleges.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-3 lg:grid-cols-6 dark:border-white/10 dark:bg-white/10">
          {fields.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="group flex flex-col items-center gap-3 bg-white px-4 py-8 text-center transition-colors hover:bg-deep-twilight dark:bg-deep-twilight-100 dark:hover:bg-deep-twilight-300"
            >
              <Icon className="h-8 w-8 text-bright-teal-blue transition-transform group-hover:scale-110 dark:text-sky-aqua" />
              <span className="text-sm font-semibold text-deep-twilight transition-colors group-hover:text-white dark:text-slate-200">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
