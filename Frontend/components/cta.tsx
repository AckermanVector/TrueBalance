import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-primary-foreground mb-4 text-balance">
            Ready to transform your
            <br className="hidden sm:block" />
            wealth management?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join hundreds of institutions already using Nexus to power their financial operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2 h-14 px-8 text-base rounded-full"
            >
              Request a Demo
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 h-14 px-8 text-base rounded-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
