"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Wrench, Smartphone, ClipboardList, Package, BarChart3, Shield, Clock, Users, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const features = [
  {
    icon: ClipboardList,
    title: "Job Card Management",
    description: "Create, track, and manage repair jobs with detailed status tracking and customer notifications."
  },
  {
    icon: Package,
    title: "Product Management",
    description: "Keep track of spare parts, accessories, and stock levels with automatic low-stock alerts."
  },
  {
    icon: Smartphone,
    title: "Device Intake",
    description: "Streamlined device intake process with condition recording and customer acknowledgment."
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Gain insights into your business with comprehensive reports and performance metrics."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with encrypted data storage and automatic backups."
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Automate repetitive tasks and focus on what matters most - fixing devices."
  }
]

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Owner, QuickFix Mobile",
    content: "Konnect transformed how we manage our repair shop. Job tracking is now effortless!",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Manager, TechCare Services",
    content: "The inventory management feature alone saved us hours every week. Highly recommended!",
    rating: 5
  },
  {
    name: "Ahmed Khan",
    role: "Founder, Mobile Doctor",
    content: "Best investment for our repair business. Customer satisfaction improved significantly.",
    rating: 5
  }
]

export default function MarketingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Admins go to admin dashboard, regular users go to user dashboard
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/konnect-logo.png" alt="Konnect" className="h-20 w-auto" />
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {user?.role === "admin" && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Portal
                  </Button>
                </Link>
              )}
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="shadow-md">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 via-transparent to-transparent rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-primary">Now with AI-powered diagnostics</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Manage Your{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Repair Shop
                </span>{" "}
                Like a Pro
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg">
                The all-in-one platform for mobile repair shops. Track jobs, manage inventory, 
                and delight customers with a streamlined repair experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground hover:bg-primary/90">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-muted">
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">Repair Shops</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">50K+</div>
                  <div className="text-sm text-muted-foreground">Jobs Completed</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10 transform rotate-3" />
              <div className="relative bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/50">
                <Image
                  src="/images/hero-dashboard.png"
                  alt="Konnect Dashboard - Mobile Repair Shop Management"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
                {/* Floating Cards */}
                <div className="absolute top-4 left-4 bg-card/95 backdrop-blur rounded-xl p-3 shadow-lg border border-border/50 animate-scale-in">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Job Completed</div>
                      <div className="text-sm font-semibold">iPhone 14 Screen</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur rounded-xl p-3 shadow-lg border border-border/50 animate-scale-in" style={{ animationDelay: "0.2s" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">New Customer</div>
                      <div className="text-sm font-semibold">+3 today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Run Your Shop
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From job tracking to inventory management, Konnect has all the tools 
              you need to streamline your repair business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trusted by Repair Shops Everywhere
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what shop owners are saying about Konnect
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Repair Shop?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of repair shops already using Konnect. Start your free trial today 
            and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Konnect</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 Konnect. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <a href="mailto:support@konnect.in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
