import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import logoImage from "@assets/smarthinkerzstudio__1772109413138.gif";
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
  Megaphone,
  BookOpen,
  PenTool,
  BarChart3,
  Quote,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import educationImg from "@assets/lesson_upload_image_1772019754863.jpg";
import contentCreatorImg from "@assets/content_creator_image_1772019754862.jpg";
import businessesImg from "@assets/Training_and_onboarding_1772019754860.jpg";
import marketersImg from "@assets/Marketers_Campaigns_and_Ads_1772019754859.jpg";
import publishingImg from "@assets/3_Authors_and_Publishers_1772019754858.jpg";
import yourUseCaseImg from "@assets/Your_Use_Case_1772019754856.jpg";
import autoImageGenImg from "@assets/IMG_6413_1772099055969.jpeg";
import bulkUploadImg from "@assets/IMG_6414_1772099235676.jpeg";
import hdVideoGenImg from "@assets/IMG_6415_1772099436218.jpeg";
import brandingImg from "@assets/brand_ea55fa52-81e5-4578-bdbe-9dc2de1da18f_1772106356531.jpg";
import dashboardImg from "@assets/Dashboard_b02c1996-6b6a-4580-bd3e-95a54e79f941_1772106541282.jpg";
import integrationImg from "@assets/Integration-Ready_1772106673102.jpg";

const sampleImages = [
  { src: "/generated/images/day_1.png", style: "Photorealistic" },
  { src: "/generated/images/day_3.png", style: "Illustrated" },
  { src: "/generated/images/day_5.png", style: "Photorealistic" },
  { src: "/generated/images/day_7.png", style: "Illustrated" },
  { src: "/generated/images/day_9.png", style: "Photorealistic" },
  { src: "/generated/images/day_11.png", style: "Illustrated" },
  { src: "/generated/images/day_2.png", style: "Photorealistic" },
  { src: "/generated/images/day_4.png", style: "Illustrated" },
  { src: "/generated/images/day_6.png", style: "Photorealistic" },
  { src: "/generated/images/day_8.png", style: "Illustrated" },
  { src: "/generated/images/day_10.png", style: "Photorealistic" },
  { src: "/generated/images/day_12.png", style: "Illustrated" },
];

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const [currentImage, setCurrentImage] = useState(0);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

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
              AI-Powered Media Studio
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-primary">Smarthinkerz</span> Studio
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Turn any content into stunning visuals. Upload your content once and let AI transform it into professional images and videos across multiple styles. Save time, scale your creativity, and engage your audience like never before.
            </p>
            <div
              className="rounded-xl overflow-hidden border shadow-lg max-w-lg cursor-pointer"
              onMouseEnter={() => {
                if (heroVideoRef.current) {
                  heroVideoRef.current.currentTime = 0;
                  heroVideoRef.current.muted = false;
                  heroVideoRef.current.play().catch(() => {});
                }
              }}
              onMouseLeave={() => {
                if (heroVideoRef.current) {
                  heroVideoRef.current.pause();
                  heroVideoRef.current.muted = true;
                }
              }}
            >
              <video
                ref={heroVideoRef}
                src="/generated/media/smarthinkerz_hero.mp4"
                muted
                loop
                playsInline
                className="w-full h-auto"
                data-testid="video-hero-showcase"
              />
            </div>
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
                7 visual styles
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
                  Smarthinkerz Studio
                </span>
              </div>
              <div className="relative aspect-video bg-muted">
                {sampleImages.map((img, i) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={`${img.style} sample ${i + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      i === currentImage ? "opacity-100" : "opacity-0"
                    }`}
                    data-testid={`img-hero-sample-${i}`}
                  />
                ))}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground">
                      {sampleImages[currentImage]?.style || "Sample"}
                    </Badge>
                    <span className="text-white text-sm font-medium">
                      AI-Generated Visual
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {sampleImages.slice(0, 6).map((img, i) => (
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
                          src={img.src}
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

function UseCaseCard({ uc }: { uc: { icon: any; title: string; subtitle: string; description: string; examples: string[]; color: string; image: string; video?: string; dashed?: boolean } }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
  }, []);

  return (
    <Card
      className={`hover-elevate transition-all duration-200 overflow-hidden ${uc.dashed ? "border-dashed" : ""}`}
      onMouseEnter={uc.video ? handleMouseEnter : undefined}
      onMouseLeave={uc.video ? handleMouseLeave : undefined}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {uc.video ? (
          <video
            ref={videoRef}
            src={uc.video}
            poster={uc.image}
            muted
            playsInline
            loop
            className="w-full h-full object-cover"
            data-testid={`video-usecase-${uc.title.toLowerCase().replace(/\s+/g, "-")}`}
          />
        ) : (
          <img
            src={uc.image}
            alt={uc.title}
            className="w-full h-full object-cover"
            data-testid={`img-usecase-${uc.title.toLowerCase().replace(/\s+/g, "-")}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${uc.color}`}>
            <uc.icon className="w-4 h-4" />
          </div>
          <span className="text-white font-semibold text-sm drop-shadow-md">{uc.subtitle}</span>
        </div>
      </div>
      <CardContent className="p-5 space-y-3">
        <h3 className="text-lg font-semibold">{uc.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {uc.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {uc.examples.map((ex) => (
            <Badge key={ex} variant="secondary" className="text-xs">
              {ex}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UseCasesSection() {
  const useCases = [
    {
      icon: GraduationCap,
      title: "Education",
      subtitle: "Lessons & Courses",
      description: "Upload lesson plans and curricula. AI generates images and videos for every lesson day — perfect for LMS, slides, and classroom materials.",
      examples: ["Lesson visuals", "Course thumbnails", "Study guides"],
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      image: educationImg,
      video: "/generated/media/education_usecase.mp4",
    },
    {
      icon: PenTool,
      title: "Content Creators",
      subtitle: "Social & Explainers",
      description: "Create social media posts, explainer video frames, and infographics from your content briefs or scripts.",
      examples: ["Social media posts", "Explainer videos", "Infographics"],
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      image: contentCreatorImg,
    },
    {
      icon: Briefcase,
      title: "Businesses",
      subtitle: "Training & Onboarding",
      description: "Turn training manuals, onboarding guides, and product tutorials into professional visual content at scale.",
      examples: ["Training modules", "Onboarding guides", "Product tutorials"],
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      image: businessesImg,
      video: "/generated/media/onboarding_business.mp4",
    },
    {
      icon: Megaphone,
      title: "Marketers",
      subtitle: "Campaigns & Ads",
      description: "Generate campaign visuals, ad creatives, and branded video snippets from marketing briefs and copy.",
      examples: ["Ad creatives", "Campaign visuals", "Branded snippets"],
      color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
      image: marketersImg,
      video: "/generated/media/marketers_usecase.mp4",
    },
    {
      icon: BookOpen,
      title: "Authors & Publishers",
      subtitle: "Books & Guides",
      description: "Create illustrated chapters, visual summaries, and study guides from your manuscripts and outlines.",
      examples: ["Chapter illustrations", "Visual summaries", "Study guides"],
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      image: publishingImg,
    },
    {
      icon: Sparkles,
      title: "Your Use Case",
      subtitle: "Flexible Workflows",
      description: "Any structured document can become visual content. Flexible workflows adapt to any content type you throw at it.",
      examples: ["Custom content", "Any document", "Any format"],
      color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
      image: yourUseCaseImg,
      video: "/generated/media/your_usecase.mp4",
      dashed: true,
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for Every Industry
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Smarthinkerz Studio is built for anyone who needs high-impact visuals at scale.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc) => (
            <UseCaseCard key={uc.title} uc={uc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StylesSection() {
  const styles = [
    { name: "Photorealistic", description: "Ultra-realistic photography with natural lighting", color: "bg-sky-100 dark:bg-sky-900/30" },
    { name: "Illustration", description: "Professional digital artwork with clean lines", color: "bg-indigo-100 dark:bg-indigo-900/30" },
    { name: "Cartoon", description: "Fun, colorful with bold outlines", color: "bg-orange-100 dark:bg-orange-900/30" },
    { name: "3D Render", description: "Polished 3D visualization with studio lighting", color: "bg-cyan-100 dark:bg-cyan-900/30" },
    { name: "Watercolor", description: "Artistic with soft brushstrokes", color: "bg-pink-100 dark:bg-pink-900/30" },
    { name: "Minimalist", description: "Clean design, simple shapes, white space", color: "bg-slate-100 dark:bg-slate-900/30" },
    { name: "Cinematic", description: "Dramatic film-quality composition", color: "bg-amber-100 dark:bg-amber-900/30" },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            7 Visual Styles
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Choose the perfect look for your content. Every style is optimized for professional results.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {styles.map((style) => (
            <div key={style.name} className={`rounded-xl p-4 text-center space-y-2 ${style.color} transition-transform hover:scale-105`}>
              <h3 className="text-sm font-semibold">{style.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{style.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      title: "Upload Your Content",
      description:
        "Upload any document — lesson plans, training manuals, marketing briefs, manuscripts. Supports PDF, DOCX, TXT, CSV, and Markdown.",
      icon: Upload,
    },
    {
      step: "2",
      title: "AI Extracts & Generates",
      description:
        "Our AI analyzes your document, extracts each section, and generates unique images and videos in your chosen style.",
      icon: Sparkles,
    },
    {
      step: "3",
      title: "Download & Use",
      description:
        "Download individually or bulk export as a zip. Use in your LMS, social media, presentations, or marketing campaigns.",
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
      title: "Bulk Content Uploads",
      description:
        "Upload documents with hundreds of sections at once. Supports PDF, DOCX, TXT, CSV, and Markdown.",
      image: bulkUploadImg,
    },
    {
      icon: Image,
      title: "Automatic Image Generation",
      description:
        "AI generates unique, professional-quality 1536x1024 images for every section of your content.",
      image: autoImageGenImg,
    },
    {
      icon: Video,
      title: "HD Video Generation",
      description:
        "Automatically creates animated HD videos with Ken Burns effects, labels, and topic overlays.",
      image: hdVideoGenImg,
      imagePosition: "center" as const,
    },
    {
      icon: Palette,
      title: "Branding Options",
      description:
        "Add your logo, custom overlays, and color palettes to match your brand identity.",
      image: brandingImg,
    },
    {
      icon: PlugZap,
      title: "Integration-Ready",
      description:
        "Export media for your LMS, social platforms, APIs, and team workflows. Built for automation.",
      badge: "Coming Soon",
      image: integrationImg,
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track engagement, monitor generation progress, and measure the impact of your visual content.",
      badge: "Coming Soon",
      image: dashboardImg,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Powerful Capabilities
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Everything you need to turn any content into professional media at scale.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover-elevate transition-all duration-200"
            >
              <CardContent className="p-6 space-y-4">
                {feature.image ? (
                  <img src={feature.image} alt={feature.title} className={`w-full h-40 object-cover rounded-xl ${feature.imagePosition === "bottom" ? "object-bottom" : "object-center"}`} />
                ) : (
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
                )}
                {!feature.image && feature.badge && null}
                {feature.image && feature.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                )}
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

function ShowcaseSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            See What AI Creates
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Real examples generated from uploaded content. Every image is unique and tailored to the topic.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sampleImages.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-video rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={img.src}
                alt={`${img.style} - Sample ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                data-testid={`img-showcase-${i}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3">
                  <Badge className={img.style === "Photorealistic" ? "bg-cyan-500/90 text-white" : "bg-purple-500/90 text-white"}>
                    {img.style}
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

function CapabilitiesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for Scale
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you have 10 sections or 600+, our engine handles it all with
              smart chunking, retry logic, and rate limit management.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: Layers,
                  text: "Handles hundreds of content sections at once",
                },
                {
                  icon: Zap,
                  text: "Generates both images and videos per section",
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
                {
                  icon: Palette,
                  text: "7 distinct visual styles to match your brand",
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
            {sampleImages.slice(4, 8).map((img, i) => (
              <div
                key={i}
                className="relative aspect-video rounded-lg overflow-hidden border shadow-md"
              >
                <img
                  src={img.src}
                  alt={`${img.style} ${i + 1}`}
                  className="w-full h-full object-cover"
                  data-testid={`img-capability-sample-${i}`}
                />
                <div className="absolute top-2 left-2">
                  <Badge className={`text-[10px] ${img.style === "Photorealistic" ? "bg-cyan-500/90 text-white" : "bg-purple-500/90 text-white"}`}>
                    {img.style}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ onGetStarted }: { onGetStarted: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState("education");

  const categories = [
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "creators", label: "Creators", icon: PenTool },
    { id: "business", label: "Businesses", icon: Briefcase },
    { id: "marketers", label: "Marketers", icon: Megaphone },
    { id: "publishers", label: "Publishers", icon: BookOpen },
  ];

  const plansByCategory: Record<string, Array<{
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    variant: "outline" | "default";
    popular: boolean;
  }>> = {
    education: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Test the platform",
        features: [
          "10 images + 2 videos/month",
          "Illustration style only",
          "Single document upload",
          "Individual downloads",
        ],
        cta: "Start Free",
        variant: "outline",
        popular: false,
      },
      {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "For mid-tier creators",
        features: [
          "200 images + 50 videos/month",
          "Illustration, Cartoon & Minimalist",
          "Bulk uploads",
          "Bulk zip downloads",
          "Priority generation",
        ],
        cta: "Start Pro Trial",
        variant: "default",
        popular: true,
      },
      {
        name: "Business",
        price: "$49",
        period: "/month",
        description: "Professional content creators",
        features: [
          "500 images + 100 videos/month",
          "Unlock Photorealistic & Watercolor",
          "All Pro styles included",
          "Bulk uploads & downloads",
          "Priority support",
        ],
        cta: "Start Business Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Premium",
        price: "$99",
        period: "/month",
        description: "Schools & training companies",
        features: [
          "1,000 images + 200 videos/month",
          "All 7 styles unlocked",
          "3D Render & Cinematic included",
          "Team accounts & analytics",
          "Priority support",
        ],
        cta: "Start Premium Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        description: "Large institutions",
        features: [
          "Unlimited images & videos",
          "All styles unlocked",
          "API access & white-label",
          "Team accounts & analytics",
          "Dedicated support & SLA",
        ],
        cta: "Contact Sales",
        variant: "outline",
        popular: false,
      },
    ],
    creators: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Try it out",
        features: [
          "10 posts (Illustration/Cartoon)",
          "Single document upload",
          "Individual downloads",
        ],
        cta: "Start Free",
        variant: "outline",
        popular: false,
      },
      {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "Growing creators",
        features: [
          "200 posts + 50 explainer videos",
          "Illustration & Cartoon styles",
          "Bulk uploads & downloads",
          "Priority generation",
        ],
        cta: "Start Pro Trial",
        variant: "default",
        popular: true,
      },
      {
        name: "Business",
        price: "$49",
        period: "/month",
        description: "Pro content creators",
        features: [
          "500 posts + 100 videos",
          "Photorealistic & Watercolor",
          "All Pro styles included",
          "Priority support",
        ],
        cta: "Start Business Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Premium",
        price: "$99",
        period: "/month",
        description: "Full-time creators",
        features: [
          "1,000 posts + 200 videos",
          "All 7 styles unlocked",
          "Cinematic & 3D Render",
          "Analytics dashboard",
          "Priority support",
        ],
        cta: "Start Premium Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        description: "Agencies & teams",
        features: [
          "Unlimited posts & videos",
          "API + team accounts",
          "White-label solution",
          "Dedicated support",
        ],
        cta: "Contact Sales",
        variant: "outline",
        popular: false,
      },
    ],
    business: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Evaluate the platform",
        features: [
          "1 training module (Illustration)",
          "Single document upload",
          "Individual downloads",
        ],
        cta: "Start Free",
        variant: "outline",
        popular: false,
      },
      {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "Small teams",
        features: [
          "10 training modules",
          "Branded visuals",
          "Illustration & Cartoon styles",
          "Bulk downloads",
        ],
        cta: "Start Pro Trial",
        variant: "default",
        popular: true,
      },
      {
        name: "Business",
        price: "$49",
        period: "/month",
        description: "Growing companies",
        features: [
          "25 training modules",
          "Onboarding guides included",
          "Photorealistic & Watercolor",
          "Branding options",
          "Priority support",
        ],
        cta: "Start Business Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Premium",
        price: "$99",
        period: "/month",
        description: "Training companies",
        features: [
          "50 training modules",
          "Product tutorials",
          "All 7 styles unlocked",
          "Team accounts & analytics",
          "Priority support",
        ],
        cta: "Start Premium Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        description: "Large organizations",
        features: [
          "Unlimited training content",
          "White-label solution",
          "API access",
          "Team accounts & analytics",
          "Dedicated support & SLA",
        ],
        cta: "Contact Sales",
        variant: "outline",
        popular: false,
      },
    ],
    marketers: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Test campaigns",
        features: [
          "5 ad creatives (Minimalist only)",
          "Single document upload",
          "Individual downloads",
        ],
        cta: "Start Free",
        variant: "outline",
        popular: false,
      },
      {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "Solo marketers",
        features: [
          "50 ad creatives/month",
          "Cartoon & Minimalist styles",
          "Bulk uploads & downloads",
          "Priority generation",
        ],
        cta: "Start Pro Trial",
        variant: "default",
        popular: true,
      },
      {
        name: "Business",
        price: "$49",
        period: "/month",
        description: "Marketing teams",
        features: [
          "100 ad creatives/month",
          "Photorealistic & Watercolor",
          "All Pro styles included",
          "Campaign organization",
          "Priority support",
        ],
        cta: "Start Business Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Premium",
        price: "$99",
        period: "/month",
        description: "Agencies",
        features: [
          "200 ad creatives/month",
          "All styles incl. Cinematic",
          "Video ad snippets",
          "Analytics dashboard",
          "Priority support",
        ],
        cta: "Start Premium Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        description: "Large campaigns",
        features: [
          "Unlimited campaigns",
          "API + dedicated support",
          "White-label solution",
          "Team accounts & SLA",
        ],
        cta: "Contact Sales",
        variant: "outline",
        popular: false,
      },
    ],
    publishers: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Try it out",
        features: [
          "1 chapter visual (Illustration)",
          "Single document upload",
          "Individual downloads",
        ],
        cta: "Start Free",
        variant: "outline",
        popular: false,
      },
      {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "Indie authors",
        features: [
          "10 chapters illustrated",
          "Illustration & Minimalist styles",
          "Bulk downloads",
          "Priority generation",
        ],
        cta: "Start Pro Trial",
        variant: "default",
        popular: true,
      },
      {
        name: "Business",
        price: "$49",
        period: "/month",
        description: "Small publishers",
        features: [
          "25 chapters illustrated",
          "Photorealistic & Watercolor",
          "All Pro styles included",
          "Priority support",
        ],
        cta: "Start Business Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Premium",
        price: "$99",
        period: "/month",
        description: "Publishing houses",
        features: [
          "50 chapters with all styles",
          "Visual summaries & study guides",
          "All 7 styles unlocked",
          "Analytics dashboard",
          "Priority support",
        ],
        cta: "Start Premium Trial",
        variant: "outline",
        popular: false,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        description: "Large publishers",
        features: [
          "Unlimited book/guide visuals",
          "White-label solution",
          "API access",
          "Team accounts & SLA",
          "Dedicated support",
        ],
        cta: "Contact Sales",
        variant: "outline",
        popular: false,
      },
    ],
  };

  const plans = plansByCategory[selectedCategory] || plansByCategory.education;

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Pricing tailored to your industry. Choose the plan that fits your needs.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="gap-1.5"
              data-testid={`pricing-tab-${cat.id}`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
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
      role: "Educator",
      quote: "Smarthinkerz Studio saved me hours of editing. My lessons now look cinematic.",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      icon: PenTool,
      role: "Content Creator",
      quote: "I scaled my social content from 10 posts a week to 200 in minutes.",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      icon: Briefcase,
      role: "Business Trainer",
      quote: "Our onboarding guides are now visual and engaging. Employees love them.",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      icon: Megaphone,
      role: "Marketer",
      quote: "Campaign visuals that used to take days now take minutes.",
      color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    },
    {
      icon: BookOpen,
      role: "Author",
      quote: "My book chapters now have professional illustrations without hiring a designer.",
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Trusted by professionals across industries.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {testimonials.map((item) => (
            <Card key={item.role} className="hover-elevate transition-all duration-200">
              <CardContent className="p-5 space-y-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="relative">
                  <Quote className="w-4 h-4 text-muted-foreground/30 absolute -top-1 -left-1" />
                  <p className="text-sm text-muted-foreground leading-relaxed italic pl-4">
                    {item.quote}
                  </p>
                </div>
                <p className="text-xs font-semibold text-foreground">&mdash; {item.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Your AI-Powered Media Studio
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Start creating today and bring your ideas to life with stunning visuals. Smart thinking, stunning media.
        </p>
        <Button
          size="lg"
          className="text-base px-10 py-6"
          onClick={onGetStarted}
          data-testid="button-cta-get-started"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-[#bfc6d6] bg-[#d9dde9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-start">
              <video src="/generated/media/logo_video_transparent.webm" autoPlay loop muted playsInline className="h-14 w-auto" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Turn lessons, posts, and campaigns into stunning media automatically. Your AI-powered creative partner.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#use-cases" className="hover:text-gray-900 transition-colors" data-testid="link-use-cases">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-gray-900 transition-colors" data-testid="link-pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors" data-testid="link-api-docs">
                  API Docs
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors" data-testid="link-about">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors" data-testid="link-contact">
                  Contact
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-gray-900 transition-colors" data-testid="link-blog">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors" data-testid="link-terms">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#bfc6d6] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Smart thinking, stunning media.
          </p>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Smarthinkerz Studio. All rights reserved.
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
      <nav className="sticky top-0 z-50 border-b border-[#c5c8d5]" style={{ background: 'linear-gradient(to bottom, #E8E6E9 0%, #E0DFE5 25%, #D3D9E5 50%, #CFD2E1 75%, #D1D4E3 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <video src="/generated/media/logo_video_transparent.webm" autoPlay loop muted playsInline className="h-14 w-auto" />
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <a
              href="#use-cases"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              data-testid="nav-link-use-cases"
            >
              Use Cases
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              data-testid="nav-link-pricing"
            >
              Pricing
            </a>
            <a
              href="/blog"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              data-testid="nav-link-blog"
            >
              Blog
            </a>
            <Button
              size="sm"
              className="bg-[#3a4a6b] hover:bg-[#2d3b56] text-white font-semibold"
              onClick={handleGetStarted}
              data-testid="nav-button-get-started"
            >
              Get Started
            </Button>
          </div>
          <Button
            size="sm"
            className="sm:hidden bg-[#3a4a6b] hover:bg-[#2d3b56] text-white font-semibold"
            onClick={handleGetStarted}
            data-testid="nav-button-get-started-mobile"
          >
            Get Started
          </Button>
        </div>
      </nav>

      <HeroSection onGetStarted={handleGetStarted} />
      <UseCasesSection />
      <StylesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ShowcaseSection />
      <CapabilitiesSection />
      <PricingSection onGetStarted={handleGetStarted} />
      <TestimonialsSection />
      <CTASection onGetStarted={handleGetStarted} />
      <FooterSection />
    </div>
  );
}
