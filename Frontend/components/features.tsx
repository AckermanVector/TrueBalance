import { ArrowRight, BarChart3, Shield, Target, Zap, Globe, LineChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    title: "Automated Execution",
    description: "Streamline fixed income trading with automated execution capabilities and real-time market data integration.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Create custom risk policies, monitor open orders, and take control of your portfolio with advanced analytics.",
  },
  {
    icon: Target,
    title: "Custom Strategies",
    description: "Build ladders, automate reinvestment & rebalancing, and deploy sophisticated trading strategies at scale.",
  },
]

const stats = [
  { value: "$3T+", label: "Assets Under Management" },
  { value: "500+", label: "Enterprise Clients" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "150ms", label: "API Response Time" },
]

export function Features() {
  return (
    <section id="products" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card border-border/50 hover:border-border transition-colors group"
            >
              <CardContent className="p-8">
                {/* Icon Container */}
                <div className="mb-6 p-3 rounded-xl bg-secondary inline-block">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-primary rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-medium text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
