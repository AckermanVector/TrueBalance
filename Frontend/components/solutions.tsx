import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const solutions = [
  {
    title: "For Wealth Managers",
    description: "Comprehensive tools for managing client portfolios and optimizing investment strategies.",
    features: [
      "Portfolio analytics dashboard",
      "Client reporting automation",
      "Risk assessment tools",
      "Multi-asset allocation",
    ],
  },
  {
    title: "For Institutions",
    description: "Enterprise-grade infrastructure for large-scale financial operations.",
    features: [
      "API-first architecture",
      "Custom integrations",
      "Dedicated support team",
      "SOC 2 Type II certified",
    ],
    highlighted: true,
  },
  {
    title: "For Developers",
    description: "Build financial applications with our comprehensive API suite.",
    features: [
      "RESTful & WebSocket APIs",
      "SDKs for major languages",
      "Sandbox environment",
      "Extensive documentation",
    ],
  },
]

export function Solutions() {
  return (
    <section id="solutions" className="py-20 md:py-32 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
            Solutions for Every Scale
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you&apos;re a solo advisor or a global institution, we have the tools you need.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <Card 
              key={index} 
              className={`border-border/50 ${
                solution.highlighted 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card"
              }`}
            >
              <CardHeader className="pb-4">
                <h3 className={`text-xl font-semibold ${
                  solution.highlighted ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {solution.title}
                </h3>
                <p className={`text-sm ${
                  solution.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  {solution.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        solution.highlighted 
                          ? "bg-primary-foreground/20" 
                          : "bg-accent/10"
                      }`}>
                        <Check className={`h-3 w-3 ${
                          solution.highlighted ? "text-primary-foreground" : "text-accent"
                        }`} />
                      </div>
                      <span className={`text-sm ${
                        solution.highlighted ? "text-primary-foreground/90" : "text-foreground"
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={solution.highlighted ? "secondary" : "outline"} 
                  className="w-full gap-2"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
