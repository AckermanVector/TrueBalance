import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground mb-8">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span>Announcing $50M in Series B Funding</span>
            <ChevronRight className="h-4 w-4" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-foreground leading-tight text-balance">
            Intelligent Wealth
            <br />
            Management Platform
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Quickly deploy our suite of financial APIs designed for modern institutions. 
            Our industry-leading platform powers wealth management for firms representing $3T+ in assets.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Button size="lg" className="gap-2 h-14 px-8 text-base rounded-full">
              Request Access
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
