import React from 'react';
import { Check, X, Zap, Building2, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription';


const pricingPlans = [
  {
    type: "FREE",
    name: "Starter",
    price: "$0",
    description: "Perfect for small teams or individuals.",
    icon: <Zap className="w-5 h-5 text-blue-500" />,
    limits: SUBSCRIPTION_LIMITS.FREE,
  },
  {
    type: "PRO",
    name: "Professional",
    price: "$29",
    description: "Advanced tools for growing organizations.",
    icon: <Crown className="w-5 h-5 text-amber-500" />,
    limits: SUBSCRIPTION_LIMITS.PRO,
    popular: true,
  },
  {
    type: "ENTERPRISE",
    name: "Enterprise",
    price: "Custom",
    description: "Full control for large scale operations.",
    icon: <Building2 className="w-5 h-5 text-purple-500" />,
    limits: SUBSCRIPTION_LIMITS.ENTERPRISE,
  },
];

export const PricingSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Choose the plan that best fits your organization's needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.type} 
            className={`relative flex flex-col border-2 transition-all duration-300 hover:shadow-lg ${
              plan.popular ? 'border-primary shadow-md scale-105' : 'border-border'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}

            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {plan.icon}
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Limits</p>
                <ul className="space-y-2 text-sm text-foreground">
                  <FeatureItem label={`Up to ${plan.limits.MAX_USERS} Staffs`} />
                  <FeatureItem label={`${plan.limits.MAX_RESOURCES} Resources`} />
                  <FeatureItem label={`${plan.limits.INITIAL_CREDITS} Monthly Credits`} />
                  <FeatureItem label={`${plan.limits.BOOKING_WINDOW_DAYS} Days Booking Window`} />
                </ul>
              </div>

              <div className="pt-4 space-y-2 border-t border-border">
                <p className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Features</p>
                <ul className="space-y-2 text-sm">
                  {Object.entries(plan.limits.FEATURES).map(([key, value]) => (
                    <FeatureItem 
                      key={key} 
                      label={key.replace(/_/g, ' ')} 
                      included={value} 
                    />
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                variant={plan.popular ? "default" : "outline"} 
                className="w-full text-md font-semibold h-11"
              >
                {plan.type === "FREE" ? "Get Started" : plan.type === "PRO" ? "Upgrade to Pro" : "Contact Sales"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

const FeatureItem = ({ label, included = true }: { label: string; included?: boolean }) => (
  <li className={`flex items-start gap-3 ${included ? 'text-foreground' : 'text-muted-foreground/50'}`}>
    {included ? (
      <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
    ) : (
      <X className="w-4 h-4 mt-0.5 text-muted-foreground/50 shrink-0" />
    )}
    <span className="capitalize">{label.toLowerCase()}</span>
  </li>
);