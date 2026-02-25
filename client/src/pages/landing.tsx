import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  Zap,
  Upload,
  Image,
  Video,
  Download,
  Palette,
  PlugZap,
  Layers,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  Users,
  GraduationCap,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

const sampleImages = [
  "/generated/images/day_1.png",
  "/generated/images/day_2.png",
  "/generated/images/day_3.png",
  "/generated/images/day_4.png",
  "/generated/images/day_5.png",
  "/generated/images/day_6.png",
];

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sampleImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI-Powered Media Generation
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Turn Lessons into{" "}
              <span className="text-primary">Media Instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Upload lessons, generate images & videos automatically — scale
              your content effortlessly with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-base px-8 py-6"
                onClick={onGetStarted}
                data-testid="button-start-free-trial"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6"
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-testid="button-view-pricing"
              >
                View Pricing
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                10 free images/month
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border bg-card">
              <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-muted-foreground">
                  AI Media Generation Agent
                </span>
              </div>
              <div className="relative aspect-video bg-muted">
                {sampleImages.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Sample lesson Day ${i + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      i === currentImage ? "opacity-100" : "opacity-0"
                    }`}
                    data-testid={`img-hero-sample-${i}`}
                  />
                ))}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground">
                      Day {currentImage + 1}
                    </Badge>
                    <span className="text-white text-sm font-medium">
                      AI-Generated Lesson Image
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-md border-2 border-card overflow-hidden cursor-pointer transition-all ${
                          i === currentImage
                            ? "ring-2 ring-primary scale-110"
                            : "opacity-70"
                        }`}
                        onClick={() => setCurrentImage(i)}
                      >
                        <img
                          src={sampleImages[i]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  6 Generated
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      title: "Upload Your Lessons",
      description:
        "Upload your lesson plan document — PDF, DOCX, TXT, CSV, or Markdown. Any format works.",
      icon: Upload,
    },
    {
      step: "2",
      title: "AI Extracts & Generates",
      description:
        "Our AI analyzes your document, extracts every lesson, and generates unique images and videos for each one.",
      icon: Sparkles,
    },
    {
      step: "3",
      title: "Download & Use",
      description:
        "Download individually or bulk export as a zip. Use in your LMS, presentations, or social media.",
      icon: Download,
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Three simple steps from document to media. No design skills needed.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-sm font-bold">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Upload,
      title: "Bulk Lesson Upload",
      description:
        "Upload documents with hundreds of lessons at once. Supports PDF, DOCX, TXT, CSV, and Markdown.",
    },
    {
      icon: Image,
      title: "Automatic Image Generation",
      description:
        "AI generates unique, professional-quality 1536x1024 images for every lesson day.",
    },
    {
      icon: Video,
      title: "HD Video Generation",
      description:
        "Automatically creates animated HD videos with Ken Burns effects, day labels, and topic overlays.",
    },
    {
      icon: Palette,
      title: "Branding Options",
      description:
        "Add your logo, custom overlays, and color palettes to match your brand identity.",
      badge: "Coming Soon",
    },
    {
      icon: PlugZap,
      title: "Integration-Ready",
      description:
        "Export media for your LMS, presentations, or social platforms. API access for automation.",
      badge: "Coming Soon",
    },
    {
      icon: Download,
      title: "Flexible Downloads",
      description:
        "Download individual files or bulk export everything as a zip — files named with day and topic.",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Powerful Features
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Everything you need to turn lesson plans into professional media at
            scale.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover-elevate transition-all duration-200"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for Scale
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you have 10 lessons or 600, our engine handles it all with
              smart chunking, retry logic, and rate limit management.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: Layers,
                  text: "Handles hundreds of lessons at once",
                },
                {
                  icon: Zap,
                  text: "Generates both images and videos per lesson",
                },
                {
                  icon: DollarSign,
                  text: "Cost-efficient — as low as $0.04 per image",
                },
                {
                  icon: Video,
                  text: "Local video generation — no extra API cost",
                },
                {
                  icon: Play,
                  text: "Pause, resume, or stop generation anytime",
                },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {sampleImages.slice(0, 4).map((src, i) => (
              <div
                key={i}
                className="aspect-video rounded-lg overflow-hidden border shadow-md"
              >
                <img
                  src={src}
                  alt={`Sample Day ${i + 1}`}
                  className="w-full h-full object-cover"
                  data-testid={`img-capability-sample-${i}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ onGetStarted }: { onGetStarted: () => void }) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Get started with AI media generation",
      features: [
        "5 images per month",
        "5 videos per month",
        "Single document upload",
        "Individual downloads",
        "Standard resolution",
      ],
      cta: "Start Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For educators and content creators",
      features: [
        "200 images per month",
        "50 videos per month",
        "Bulk uploads",
        "Bulk zip downloads",
        "High-resolution outputs",
        "Branding options",
        "Priority generation",
      ],
      cta: "Start Pro Trial",
      variant: "default" as const,
      popular: true,
    },
    {
      name: "Business",
      price: "$49",
      period: "/month",
      description: "For teams and organizations",
      features: [
        "Unlimited images",
        "Unlimited videos",
        "Unlimited bulk uploads",
        "Advanced editing tools",
        "Team accounts",
        "Analytics dashboard",
        "Priority support",
      ],
      cta: "Start Business Trial",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large-scale deployments",
      features: [
        "Everything in Business",
        "API access",
        "White-label solution",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "On-premise option",
      ],
      cta: "Contact Sales",
      variant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. Scale up anytime.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary shadow-lg scale-[1.02]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.variant}
                  className="w-full"
                  onClick={onGetStarted}
                  data-testid={`button-plan-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      icon: GraduationCap,
      role: "Educators",
      quote:
        "Transform your lesson plans into engaging visuals that captivate students. No design skills required.",
      name: "For Teachers & Professors",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      icon: Users,
      role: "Content Creators",
      quote:
        "Save hours of editing and design work. Upload your content and let AI generate professional media instantly.",
      name: "For YouTubers & Course Creators",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      icon: Briefcase,
      role: "Enterprises",
      quote:
        "Scale your training media production across hundreds of modules. Consistent quality, fraction of the cost.",
      name: "For L&D Teams",
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for Everyone
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Whether you're an educator, content creator, or enterprise — we've
            got you covered.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <Card key={item.role} className="hover-elevate transition-all duration-200">
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">{item.role}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{item.quote}"
                </p>
                <p className="text-xs font-medium text-primary">{item.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            See What AI Creates
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Real examples generated from actual lesson plans. Every image is
            unique and tailored to the topic.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sampleImages.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-video rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={src}
                alt={`AI Generated - Day ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                data-testid={`img-showcase-${i}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-white/90 text-black">
                    Day {i + 1}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Generated using gpt-image-1 at 1536x1024 resolution
          </p>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t bg-card/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-semibold">AI Media Agent</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Turn lesson plans into professional images and videos with the
              power of AI.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="link-features">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors" data-testid="link-pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="link-api-docs">
                  API Docs
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="link-about">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="link-contact">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="link-blog">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Trusted by educators & creators worldwide
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Media Agent. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">AI Media Agent</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-link-pricing"
            >
              Pricing
            </a>
            <Button
              size="sm"
              onClick={handleGetStarted}
              data-testid="nav-button-get-started"
            >
              Get Started
            </Button>
          </div>
          <Button
            size="sm"
            className="sm:hidden"
            onClick={handleGetStarted}
            data-testid="nav-button-get-started-mobile"
          >
            Get Started
          </Button>
        </div>
      </nav>

      <HeroSection onGetStarted={handleGetStarted} />
      <HowItWorksSection />
      <FeaturesSection />
      <ShowcaseSection />
      <CapabilitiesSection />
      <PricingSection onGetStarted={handleGetStarted} />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
}
