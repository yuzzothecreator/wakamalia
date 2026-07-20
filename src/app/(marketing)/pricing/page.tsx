import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DEMO_FAQS } from "@/lib/demo-data"
import { ROUTES, PLATFORM_COMMISSION_RATE } from "@/config/site"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "Pricing | Wakamalia",
  description: "Simple pricing for subscribers and tipsters.",
}

const plans = [
  {
    name: "Subscriber",
    price: "Free",
    description: "Follow tipsters, buy premium slips, and manage your wallet.",
    features: [
      "Browse free predictions",
      "Follow unlimited tipsters",
      "Wallet & local payments",
      "Performance transparency",
    ],
    cta: "Get started",
    href: ROUTES.register,
    highlighted: false,
  },
  {
    name: "Tipster Pro",
    price: "15% commission",
    description: `Only pay when you earn. Platform fee of ${PLATFORM_COMMISSION_RATE * 100}% on paid content.`,
    features: [
      "Creator dashboard & analytics",
      "Free + premium predictions",
      "Weekly & monthly subscriptions",
      "Verification badge eligibility",
      "M-Pesa, Stripe & bank payouts",
    ],
    cta: "Become a tipster",
    href: ROUTES.register,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For media brands, betting communities, and affiliate networks.",
    features: [
      "White-label options",
      "Dedicated support",
      "Custom commission tiers",
      "API & webhook access",
    ],
    cta: "Contact sales",
    href: "/contact",
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pricing that grows with you
        </h1>
        <p className="mt-4 text-muted-foreground text-pretty">
          Subscribers join free. Tipsters monetize with transparent fees and
          flexible payout methods across Africa and globally.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.highlighted
                ? "border-primary shadow-md ring-1 ring-primary/20"
                : undefined
            }
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <p className="pt-2 font-mono text-3xl font-bold">{plan.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl">
        <h2 className="mb-6 text-center text-2xl font-bold">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {DEMO_FAQS.map((faq, i) => (
            <AccordionItem key={faq.q} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
