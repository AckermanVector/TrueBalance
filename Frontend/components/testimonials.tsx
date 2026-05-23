import Image from "next/image"

const logos = [
  { name: "Goldman Sachs", initials: "GS" },
  { name: "JP Morgan", initials: "JPM" },
  { name: "BlackRock", initials: "BR" },
  { name: "Fidelity", initials: "FID" },
  { name: "Charles Schwab", initials: "CS" },
  { name: "Vanguard", initials: "VG" },
]

const testimonials = [
  {
    quote: "Nexus has transformed how we manage our client portfolios. The automation capabilities alone have saved us hundreds of hours per quarter.",
    author: "Sarah Chen",
    title: "Chief Investment Officer",
    company: "Alpine Capital Partners",
  },
  {
    quote: "The API integration was seamless. We were up and running in days, not months. Their documentation is exceptional.",
    author: "Michael Torres",
    title: "VP of Engineering",
    company: "Meridian Wealth",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trusted By Section */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <div 
                key={index}
                className="flex items-center justify-center w-20 h-10 text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {logo.initials}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 md:p-10 border border-border/50"
            >
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-semibold text-foreground">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
