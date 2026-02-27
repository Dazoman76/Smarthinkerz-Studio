import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import logoImage from "@assets/smarthinkerzstudio__1772109413138.gif";
import logoNoBk from "@assets/logo_no_bk_1772176208956.png";
import sarahMitchellVideo from "@assets/Sarah_Mitchell_1772176519292.mp4";
import timesetDataImg from "@assets/timeset_data_1772184316994.jpg";
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
  { src: timesetDataImg, style: "Photorealistic" },
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

const accentColors = {
  education: "#2563EB",
  creators: "#7C3AED",
  business: "#F59E0B",
  marketers: "#F43F5E",
  authors: "#10B981",
};

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
    <section
      className="relative overflow-hidden min-h-[90vh] flex items-center"
      style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 45%, #1E293B 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0) 60%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-[80px] pb-[140px] relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1
              className="text-[32px] sm:text-[42px] lg:text-[56px] font-bold text-white"
              style={{ lineHeight: 1.1 }}
              data-testid="heading-hero"
            >
              Turn Structured Content Into Production Ready Media Instantly
            </h1>
            <p
              className="text-[20px] font-light max-w-[720px]"
              style={{ color: "#E2E8F0", lineHeight: 1.6 }}
            >
              Upload lesson plans, training manuals, marketing briefs, or manuscripts. Smarthinkerz Studio transforms every section into high resolution visuals and HD video at scale.
            </p>
            <div className="space-y-1 text-[18px]" style={{ color: "#F1F5F9" }}>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
                No design team required.
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
                No manual prompts required.
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
                No production bottlenecks.
              </p>
            </div>
            <div
              className="rounded-xl overflow-hidden max-w-lg cursor-pointer"
              style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}
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
            <div className="flex flex-col sm:flex-row gap-5">
              <Button
                size="lg"
                className="text-base px-7 py-4 font-semibold tracking-[0.4px] border-0"
                style={{
                  backgroundColor: "#22D3EE",
                  color: "#0F172A",
                  borderRadius: "12px",
                  boxShadow: "0 12px 30px rgba(34,211,238,0.35)",
                }}
                onClick={onGetStarted}
                data-testid="button-start-free-trial"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#06B6D4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#22D3EE"; }}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                className="text-base px-7 py-4 font-semibold tracking-[0.4px] bg-transparent text-white hover:text-[#0F172A]"
                style={{
                  border: "2px solid #22D3EE",
                  borderRadius: "12px",
                }}
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-testid="button-view-pricing"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#22D3EE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                View Pricing
              </Button>
            </div>
            <div className="flex items-center gap-6 text-[14px] pt-2" style={{ color: "#94A3B8" }}>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: "#10B981" }} />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: "#10B981" }} />
                Seven visual styles
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-[16px] overflow-hidden" style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ backgroundColor: "rgba(30,41,59,0.8)", borderColor: "#1F2937" }}>
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs" style={{ color: "#CBD5E1" }}>
                  Smarthinkerz Studio
                </span>
              </div>
              <div className="relative aspect-video bg-[#1E293B]">
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
                    <Badge style={{ backgroundColor: "#2563EB", color: "#FFFFFF", borderRadius: "20px" }}>
                      {sampleImages[currentImage]?.style || "Sample"}
                    </Badge>
                    <span className="text-white text-sm font-medium">
                      AI-Generated Visual
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between" style={{ backgroundColor: "#FFFFFF" }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {sampleImages.slice(0, 6).map((img, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 overflow-hidden cursor-pointer transition-all ${
                          i === currentImage
                            ? "ring-2 scale-110"
                            : "opacity-70"
                        }`}
                        style={{
                          borderRadius: "6px",
                          border: "2px solid white",
                          ringColor: "#2563EB",
                        }}
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
                <Badge
                  variant="outline"
                  style={{ color: "#10B981", borderColor: "#10B981", borderRadius: "20px" }}
                >
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

function ProblemSection() {
  return (
    <section className="py-[100px]" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: "#0F172A", lineHeight: 1.1 }}
        >
          Content Scales. Visual Production Does Not.
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "#475569", lineHeight: 1.6 }}>
          Teams create structured content every day. Turning that content into visuals and videos takes time, designers, revisions, and coordination. Visual production becomes the bottleneck that slows learning, marketing, and training.
        </p>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="py-[100px]" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: "#0F172A", lineHeight: 1.1 }}
        >
          The AI Media Engine for Structured Content
        </h2>
        <p className="text-lg font-semibold" style={{ color: "#475569", lineHeight: 1.6 }}>
          Upload once and generate at scale.
        </p>
        <p style={{ color: "#475569", lineHeight: 1.6 }}>
          Smarthinkerz Studio automatically extracts sections, understands context, generates professional images, creates HD videos per section, maintains style consistency, and processes hundreds of sections reliably.
        </p>
        <p className="text-lg font-semibold" style={{ color: "#475569", lineHeight: 1.6 }}>
          From document to distribution in minutes.
        </p>
      </div>
    </section>
  );
}

function CompetitiveTable() {
  const competitors = [
    { name: "Canva", single: "Yes", bulk: "No", video: "No", style: "Partial", teams: "Partial" },
    { name: "Runway", single: "Yes", bulk: "No", video: "Partial", style: "No", teams: "Partial" },
    { name: "Sora", single: "Yes", bulk: "No", video: "Yes", style: "No", teams: "No" },
    { name: "Smarthinkerz Studio", single: "No", bulk: "Yes", video: "Yes", style: "Yes", teams: "Yes", highlight: true },
  ];

  return (
    <section className="py-[100px]" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            Not Just Another AI Image Tool
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Most tools generate one asset at a time. Smarthinkerz Studio transforms structured documents into complete media libraries.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0, border: "1px solid #E2E8F0", borderRadius: "16px", overflow: "hidden" }} data-testid="table-competitive">
            <thead>
              <tr style={{ backgroundColor: "#FFFFFF" }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Platform</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Single Prompt Workflow</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Bulk Document Processing</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Video Per Section</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Style Consistency</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Built for Teams</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr
                  key={c.name}
                  style={{
                    backgroundColor: c.highlight ? "#EFF6FF" : "#FFFFFF",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                  className={c.highlight ? "font-semibold" : ""}
                >
                  <td className="py-3 px-4" style={{ color: "#0F172A" }}>{c.name}</td>
                  {[c.single, c.bulk, c.video, c.style, c.teams].map((val, i) => (
                    <td key={i} className="text-center py-3 px-4">
                      {val === "Yes" ? (
                        <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: "#10B981" }} />
                      ) : val === "No" ? (
                        <span style={{ color: "#94A3B8" }}>No</span>
                      ) : (
                        <span style={{ color: "#64748B" }}>{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function CostComparisonTable() {
  const methods = [
    { method: "Freelance Designer", cost: "$2,000 to $6,000", scalability: "Limited", speed: "Slow" },
    { method: "Agency", cost: "$5,000 to $20,000", scalability: "Moderate", speed: "Slow" },
    { method: "In house Team", cost: "$4,000 to $12,000", scalability: "Limited by headcount", speed: "Medium" },
    { method: "Smarthinkerz Studio", cost: "$0 to $99+", scalability: "High", speed: "Fast", highlight: true },
  ];

  return (
    <section className="py-[100px]" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            Traditional Media Production vs Smarthinkerz Studio
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0, border: "1px solid #E2E8F0", borderRadius: "16px", overflow: "hidden" }} data-testid="table-cost-comparison">
            <thead>
              <tr style={{ backgroundColor: "#FFFFFF" }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Production Method</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Typical Monthly Cost</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Scalability</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Speed</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <tr
                  key={m.method}
                  style={{
                    backgroundColor: m.highlight ? "#ECFEFF" : "#FFFFFF",
                    borderLeft: m.highlight ? "4px solid #22D3EE" : "none",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                  className={m.highlight ? "font-semibold" : ""}
                >
                  <td className="py-3 px-4" style={{ color: "#0F172A" }}>{m.method}</td>
                  <td className="text-center py-3 px-4" style={{ color: m.highlight ? "#2563EB" : "#475569", fontWeight: m.highlight ? 700 : 400 }}>{m.cost}</td>
                  <td className="text-center py-3 px-4" style={{ color: "#475569" }}>{m.scalability}</td>
                  <td className="text-center py-3 px-4" style={{ color: "#475569" }}>{m.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function WhyUpgradeTable() {
  const capabilities = [
    { name: "Bulk uploads and bulk export", free: false, pro: true, business: true, premium: true, enterprise: true },
    { name: "High volume processing", free: false, pro: true, business: true, premium: true, enterprise: true },
    { name: "Photorealistic output", free: false, pro: false, business: true, premium: true, enterprise: true },
    { name: "Watercolor output", free: false, pro: false, business: true, premium: true, enterprise: true },
    { name: "3D Render and Cinematic styles", free: false, pro: false, business: false, premium: true, enterprise: true },
    { name: "Team accounts", free: false, pro: false, business: false, premium: true, enterprise: true },
    { name: "Analytics dashboard", free: false, pro: false, business: false, premium: true, enterprise: true },
    { name: "API access", free: false, pro: false, business: false, premium: false, enterprise: true },
    { name: "White label", free: false, pro: false, business: false, premium: false, enterprise: true },
    { name: "SLA and dedicated support", free: false, pro: false, business: false, premium: false, enterprise: true },
  ];

  return (
    <section className="py-[100px]" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            Why Teams Upgrade
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0, border: "1px solid #E2E8F0", borderRadius: "16px", overflow: "hidden" }} data-testid="table-why-upgrade">
            <thead>
              <tr style={{ backgroundColor: "#FFFFFF" }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Capability</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Free</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Pro</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Business</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Premium</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {capabilities.map((cap) => (
                <tr key={cap.name} style={{ borderBottom: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
                  <td className="py-3 px-4" style={{ color: "#0F172A" }}>{cap.name}</td>
                  <td className="text-center py-3 px-4">{cap.free ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: "#10B981" }} /> : <span style={{ color: "#94A3B8" }}>No</span>}</td>
                  <td className="text-center py-3 px-4">{cap.pro ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: "#10B981" }} /> : <span style={{ color: "#94A3B8" }}>No</span>}</td>
                  <td className="text-center py-3 px-4">{cap.business ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: "#10B981" }} /> : <span style={{ color: "#94A3B8" }}>No</span>}</td>
                  <td className="text-center py-3 px-4">{cap.premium ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: "#10B981" }} /> : <span style={{ color: "#94A3B8" }}>No</span>}</td>
                  <td className="text-center py-3 px-4">{cap.enterprise ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: "#10B981" }} /> : <span style={{ color: "#94A3B8" }}>No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function UseCaseCard({ uc }: { uc: { icon: any; title: string; subtitle: string; description: string; examples: string[]; color: string; accentColor: string; image: string; video?: string; dashed?: boolean } }) {
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
    <div
      className={`group overflow-hidden transition-all duration-300 ${uc.dashed ? "border-dashed" : ""}`}
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "16px",
        padding: "0",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
        if (uc.video) handleMouseEnter();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
        if (uc.video) handleMouseLeave();
      }}
    >
      <div style={{ height: "4px", backgroundColor: uc.accentColor }} />
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
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: uc.accentColor + "20", color: uc.accentColor }}
          >
            <uc.icon className="w-4 h-4" />
          </div>
          <span className="text-white font-semibold text-sm drop-shadow-md">{uc.subtitle}</span>
        </div>
      </div>
      <div className="p-7 space-y-3">
        <h3 className="text-lg font-semibold" style={{ color: "#0F172A" }}>{uc.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "#475569", lineHeight: 1.6 }}>
          {uc.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {uc.examples.map((ex) => (
            <Badge
              key={ex}
              className="text-xs"
              style={{ backgroundColor: "#F1F5F9", color: "#475569", borderRadius: "20px" }}
            >
              {ex}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function UseCasesSection() {
  const useCases = [
    {
      icon: GraduationCap,
      title: "Education",
      subtitle: "Lessons and Courses",
      description: "Upload lesson plans and curricula. Generate images and videos for every lesson day for LMS, slides, and classroom materials.",
      examples: ["Lesson visuals", "Course thumbnails", "Study guides"],
      color: "bg-blue-100 text-blue-700",
      accentColor: accentColors.education,
      image: educationImg,
      video: "/generated/media/education_usecase.mp4",
    },
    {
      icon: PenTool,
      title: "Content Creators",
      subtitle: "Social and Explainers",
      description: "Create social media posts, explainer frames, and infographics from briefs or scripts.",
      examples: ["Social media posts", "Explainer videos", "Infographics"],
      color: "bg-purple-100 text-purple-700",
      accentColor: accentColors.creators,
      image: contentCreatorImg,
    },
    {
      icon: Briefcase,
      title: "Businesses",
      subtitle: "Training and Onboarding",
      description: "Turn manuals, onboarding guides, and tutorials into visual content at scale.",
      examples: ["Training modules", "Onboarding guides", "Product tutorials"],
      color: "bg-amber-100 text-amber-700",
      accentColor: accentColors.business,
      image: businessesImg,
      video: "/generated/media/onboarding_business.mp4",
    },
    {
      icon: Megaphone,
      title: "Marketers",
      subtitle: "Campaigns and Ads",
      description: "Generate campaign visuals, ad creatives, and branded snippets from marketing copy.",
      examples: ["Ad creatives", "Campaign visuals", "Branded snippets"],
      color: "bg-rose-100 text-rose-700",
      accentColor: accentColors.marketers,
      image: marketersImg,
      video: "/generated/media/marketers_usecase.mp4",
    },
    {
      icon: BookOpen,
      title: "Authors & Publishers",
      subtitle: "Books and Guides",
      description: "Create chapter illustrations, visual summaries, and study guides from manuscripts and outlines.",
      examples: ["Chapter illustrations", "Visual summaries", "Study guides"],
      color: "bg-emerald-100 text-emerald-700",
      accentColor: accentColors.authors,
      image: publishingImg,
    },
    {
      icon: Sparkles,
      title: "Your Use Case",
      subtitle: "Flexible Workflows",
      description: "Turn any structured document into visual content with workflows that adapt to your content type.",
      examples: ["Custom content", "Any document", "Any format"],
      color: "bg-slate-100 text-slate-700",
      accentColor: "#64748B",
      image: yourUseCaseImg,
      video: "/generated/media/your_usecase.mp4",
      dashed: true,
    },
  ];

  return (
    <section id="use-cases" className="py-[100px]" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            Built for High Output Teams
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Smarthinkerz Studio is built for anyone who needs professional visuals at scale.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "32px" }}>
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
    { name: "Photorealistic", description: "Ultra realistic photography with natural lighting" },
    { name: "Illustration", description: "Professional digital artwork with clean lines" },
    { name: "Cartoon", description: "Fun and colorful visuals with bold outlines" },
    { name: "3D Render", description: "Polished 3D visualization with studio lighting" },
    { name: "Watercolor", description: "Artistic visuals with soft brushstrokes" },
    { name: "Minimalist", description: "Clean design with simple shapes and white space" },
    { name: "Cinematic", description: "Dramatic film quality composition" },
  ];

  return (
    <section className="py-[100px]" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="w-6 h-6" style={{ color: "#2563EB" }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            Seven Production Optimized Visual Styles
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Choose the perfect look for your content. Every style is optimized for professional results.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7" style={{ gap: "32px" }}>
          {styles.map((style) => (
            <div
              key={style.name}
              className="p-4 text-center space-y-2 transition-all duration-200 cursor-pointer"
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#22D3EE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
            >
              <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>{style.name}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#475569", lineHeight: 1.4 }}>{style.description}</p>
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
      title: "Upload structured content",
      description:
        "Upload single or bulk documents in PDF, DOCX, TXT, CSV, and Markdown format.",
      icon: Upload,
    },
    {
      step: "2",
      title: "AI analyzes and generates",
      description:
        "Our engine extracts sections, understands context, and generates high resolution images and HD videos automatically.",
      icon: Sparkles,
    },
    {
      step: "3",
      title: "Download and deploy",
      description:
        "Bulk export your media and deploy instantly into LMS platforms, social channels, presentations, or internal systems.",
      icon: Download,
    },
  ];

  return (
    <section className="py-[100px]" style={{ backgroundColor: "#F1F5F9" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            Three Simple Steps
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Ready to download in minutes instead of weeks.
          </p>
        </div>
        <div className="grid md:grid-cols-3" style={{ gap: "32px" }}>
          {steps.map((item) => (
            <div
              key={item.step}
              className="text-center space-y-4 relative"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                padding: "28px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
              }}
            >
              <span
                className="text-[72px] font-bold absolute top-2 right-4"
                style={{ color: "#CBD5E1", opacity: 0.4 }}
              >
                {item.step}
              </span>
              <div
                className="w-16 h-16 flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#E0F2FE", borderRadius: "12px" }}
              >
                <item.icon className="w-8 h-8" style={{ color: "#2563EB" }} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: "#0F172A" }}>{item.title}</h3>
              <p style={{ color: "#475569", lineHeight: 1.6 }}>
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
        "Upload documents with hundreds of sections in one workflow.",
      image: bulkUploadImg,
    },
    {
      icon: Image,
      title: "Automatic Image Generation",
      description:
        "Generate unique 1536 by 1024 images for every section.",
      image: autoImageGenImg,
    },
    {
      icon: Video,
      title: "HD Video Generation",
      description:
        "Create animated HD videos with motion effects and topic overlays.",
      image: hdVideoGenImg,
      imagePosition: "center" as const,
    },
    {
      icon: Palette,
      title: "Branding Options",
      description:
        "Add your logo, overlays, and palettes to match your brand.",
      image: brandingImg,
    },
    {
      icon: PlugZap,
      title: "Integration Ready",
      description:
        "Export media for LMS platforms, social workflows, APIs, and automation pipelines.",
      badge: "Coming Soon",
      image: integrationImg,
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track engagement, monitor generation progress, and measure media impact.",
      badge: "Coming Soon",
      image: dashboardImg,
    },
  ];

  return (
    <section className="py-[100px]" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            Everything You Need to Turn Content Into Professional Media
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Everything you need to turn content into professional media at scale.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "32px" }}>
          {features.map((feature) => (
            <div
              key={feature.title}
              className="transition-all duration-200"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
              }}
            >
              <div className="p-6 space-y-4">
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={`w-full h-40 object-cover ${feature.imagePosition === "bottom" ? "object-bottom" : "object-center"}`}
                    style={{ borderRadius: "12px" }}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 flex items-center justify-center"
                      style={{ backgroundColor: "#E0F2FE", borderRadius: "12px" }}
                    >
                      <feature.icon className="w-6 h-6" style={{ color: "#2563EB" }} />
                    </div>
                    {feature.badge && (
                      <Badge style={{ backgroundColor: "#F1F5F9", color: "#64748B", borderRadius: "20px" }} className="text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                )}
                {feature.image && feature.badge && (
                  <Badge style={{ backgroundColor: "#F1F5F9", color: "#64748B", borderRadius: "20px" }} className="text-xs">
                    {feature.badge}
                  </Badge>
                )}
                <h3 className="text-lg font-semibold" style={{ color: "#0F172A" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#475569", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  return (
    <section className="py-[100px]" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            See What AI Creates
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Real examples generated from uploaded content. Every image is unique and tailored to the topic.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: "16px" }}>
          {sampleImages.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-video overflow-hidden"
              style={{
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
              }}
            >
              <img
                src={img.src}
                alt={`${img.style} - Sample ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                data-testid={`img-showcase-${i}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3">
                  <Badge style={{
                    backgroundColor: img.style === "Photorealistic" ? "rgba(34,211,238,0.9)" : "rgba(124,58,237,0.9)",
                    color: "#FFFFFF",
                    borderRadius: "20px",
                  }}>
                    {img.style}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: "#64748B" }}>
            Generated using gpt image 1 at 1536 by 1024 resolution
          </p>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section className="py-[100px]" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: "#0F172A", lineHeight: 1.1 }}
            >
              Reliable Output at High Volume
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "#475569", lineHeight: 1.6 }}>
              Whether you have 10 sections or 600 plus, the system handles smart chunking, retries, and rate management so your production stays stable.
            </p>
            <div className="space-y-4">
              {[
                { icon: Layers, text: "Handles hundreds of sections at once" },
                { icon: Zap, text: "Generates both images and videos per section" },
                { icon: DollarSign, text: "Cost efficient generation" },
                { icon: Video, text: "Local video generation with no extra API cost" },
                { icon: Play, text: "Pause, resume, or stop generation anytime" },
                { icon: Palette, text: "Seven distinct visual styles to match your brand" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#D1FAE5", borderRadius: "8px" }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: "#059669" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {sampleImages.slice(4, 8).map((img, i) => (
              <div
                key={i}
                className="relative aspect-video overflow-hidden"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={img.src}
                  alt={`${img.style} ${i + 1}`}
                  className="w-full h-full object-cover"
                  data-testid={`img-capability-sample-${i}`}
                />
                <div className="absolute top-2 left-2">
                  <Badge
                    className="text-[10px]"
                    style={{
                      backgroundColor: img.style === "Photorealistic" ? "rgba(34,211,238,0.9)" : "rgba(124,58,237,0.9)",
                      color: "#FFFFFF",
                      borderRadius: "20px",
                    }}
                  >
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
    enterprise?: boolean;
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
        description: "For creators scaling output",
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
        description: "For production teams",
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
        description: "For schools and training companies",
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
        description: "For large institutions",
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
        enterprise: true,
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
        enterprise: true,
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
        enterprise: true,
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
        enterprise: true,
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
        enterprise: true,
      },
    ],
  };

  const plans = plansByCategory[selectedCategory] || plansByCategory.education;

  return (
    <section id="pricing" className="py-[100px]" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Pricing tailored to your industry. Choose the plan that fits your needs.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              className="gap-1.5 tracking-[0.4px]"
              style={{
                backgroundColor: selectedCategory === cat.id ? "#2563EB" : "transparent",
                color: selectedCategory === cat.id ? "#FFFFFF" : "#475569",
                border: selectedCategory === cat.id ? "none" : "1px solid #E2E8F0",
                borderRadius: "10px",
              }}
              onClick={() => setSelectedCategory(cat.id)}
              data-testid={`pricing-tab-${cat.id}`}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat.id) e.currentTarget.style.backgroundColor = "#F1F5F9";
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat.id) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" style={{ gap: "20px" }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col ${plan.popular ? "scale-[1.02]" : ""}`}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "18px",
                border: plan.enterprise ? "2px solid #2563EB" : "1px solid #E2E8F0",
                padding: "36px",
                boxShadow: plan.popular ? "0 20px 50px rgba(0,0,0,0.12)" : "0 6px 16px rgba(0,0,0,0.05)",
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge
                    className="px-3 flex items-center gap-1"
                    style={{
                      backgroundColor: "#22D3EE",
                      color: "#0F172A",
                      borderRadius: "20px",
                    }}
                  >
                    <Star className="w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-semibold" style={{ color: "#0F172A" }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold" style={{ color: "#0F172A" }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: "#64748B" }}>
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                    <span style={{ color: "#475569" }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 font-semibold transition-colors tracking-[0.4px]"
                style={{
                  backgroundColor: plan.variant === "default" ? "#2563EB" : "transparent",
                  color: plan.variant === "default" ? "#FFFFFF" : "#2563EB",
                  border: plan.variant === "default" ? "none" : "1px solid #E2E8F0",
                  borderRadius: "10px",
                }}
                onClick={onGetStarted}
                data-testid={`button-plan-${plan.name.toLowerCase()}`}
                onMouseEnter={(e) => {
                  if (plan.variant === "default") {
                    e.currentTarget.style.backgroundColor = "#1D4ED8";
                  } else {
                    e.currentTarget.style.backgroundColor = "#F1F5F9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.variant === "default") {
                    e.currentTarget.style.backgroundColor = "#2563EB";
                  } else {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialVideoCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying && !videoRef.current.muted) {
        videoRef.current.muted = true;
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  return (
    <div
      className="transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.08)" : "0 12px 30px rgba(0,0,0,0.05)",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-testid="card-testimonial-educator"
    >
      <div className="space-y-4">
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: "12px", aspectRatio: "16/9" }}
        >
          <video
            ref={videoRef}
            src={sarahMitchellVideo}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 70%",
              filter: isHovered ? "brightness(1.05)" : "brightness(1)",
              transition: "filter 0.3s ease",
            }}
            data-testid="video-testimonial-educator"
          />
          {!isHovered && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
              >
                <div
                  className="w-0 h-0 ml-1"
                  style={{
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: "10px solid #0F172A",
                  }}
                />
              </div>
            </div>
          )}
          {isHovered && !isPlaying && (
            <div
              className="absolute bottom-2 right-2 px-2 py-1 rounded text-[10px] font-semibold"
              style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#FFFFFF" }}
            >
              Click for sound
            </div>
          )}
        </div>
        <p className="text-xs font-bold" style={{ color: "#0F172A" }}>Sarah Mitchell</p>
        <p className="text-xs" style={{ color: "#64748B" }}>Educator</p>
        <div className="relative">
          <Quote className="w-5 h-5 absolute -top-1 -left-1" style={{ color: "#22D3EE", opacity: 0.6 }} />
          <p className="text-sm leading-relaxed italic pl-5" style={{ color: "#475569", lineHeight: 1.6 }}>
            Smarthinkerz Studio saved me hours of editing. My lessons now look cinematic.
          </p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      icon: PenTool,
      role: "Content Creator",
      quote: "I scaled my social content from 10 posts a week to 200 in minutes.",
    },
    {
      icon: Briefcase,
      role: "Business Trainer",
      quote: "Our onboarding guides are now visual and engaging. Employees love them.",
    },
    {
      icon: Megaphone,
      role: "Marketer",
      quote: "Campaign visuals that used to take days now take minutes.",
    },
    {
      icon: BookOpen,
      role: "Author",
      quote: "My book chapters now have professional illustrations without hiring a designer.",
    },
  ];

  return (
    <section
      className="py-[100px]"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#0F172A", lineHeight: 1.1 }}
          >
            What Our Users Say
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: "#475569" }}>
            Trusted by professionals across industries.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" style={{ gap: "20px" }}>
          <TestimonialVideoCard />
          {testimonials.map((item) => (
            <div
              key={item.role}
              className="transition-all duration-200"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.05)";
              }}
            >
              <div className="space-y-4">
                <div className="relative">
                  <Quote className="w-5 h-5 absolute -top-1 -left-1" style={{ color: "#22D3EE", opacity: 0.6 }} />
                  <p className="text-sm leading-relaxed italic pl-5" style={{ color: "#475569", lineHeight: 1.6 }}>
                    {item.quote}
                  </p>
                </div>
                <p className="text-xs font-bold" style={{ color: "#0F172A" }}>&mdash; {item.role}</p>
                <p className="text-xs" style={{ color: "#64748B" }}>{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section
      className="py-[100px]"
      style={{
        background: "linear-gradient(135deg, #22D3EE 0%, #2563EB 60%, #1E293B 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2
          className="text-3xl sm:text-4xl font-bold text-white"
          style={{ lineHeight: 1.1 }}
        >
          Your AI Powered Media Studio
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "#E2E8F0", lineHeight: 1.6 }}>
          Start creating today and bring your ideas to life with stunning visuals and videos.
        </p>
        <button
          className="text-base px-10 py-4 font-semibold transition-colors tracking-[0.4px]"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#1E293B",
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
          }}
          onClick={onGetStarted}
          data-testid="button-cta-get-started"
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F1F5F9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; }}
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer
      className="py-12"
      style={{
        backgroundColor: "#0F172A",
        borderTop: "1px solid #1F2937",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-start">
              <img src={logoNoBk} alt="Smarthinkerz Studio" className="h-24 w-auto" data-testid="img-footer-logo" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF", lineHeight: 1.6 }}>
              Turn lessons, posts, and campaigns into stunning media automatically. Your AI powered creative partner.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm" style={{ color: "#FFFFFF" }}>Product</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#9CA3AF" }}>
              <li>
                <a
                  href="#use-cases"
                  className="transition-colors"
                  style={{ color: "#9CA3AF" }}
                  data-testid="link-use-cases"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  Use Cases
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="transition-colors"
                  style={{ color: "#9CA3AF" }}
                  data-testid="link-pricing"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors"
                  style={{ color: "#9CA3AF" }}
                  data-testid="link-api-docs"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  API Docs
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm" style={{ color: "#FFFFFF" }}>Company</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#9CA3AF" }}>
              <li>
                <a
                  href="#"
                  className="transition-colors"
                  style={{ color: "#9CA3AF" }}
                  data-testid="link-about"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors"
                  style={{ color: "#9CA3AF" }}
                  data-testid="link-contact"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="transition-colors"
                  style={{ color: "#9CA3AF" }}
                  data-testid="link-blog"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm" style={{ color: "#FFFFFF" }}>Legal</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#9CA3AF" }}>
              <li>
                <a
                  href="#"
                  className="transition-colors"
                  style={{ color: "#9CA3AF" }}
                  data-testid="link-privacy"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors"
                  style={{ color: "#9CA3AF" }}
                  data-testid="link-terms"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #1F2937" }}>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Smart thinking, stunning media.
          </p>
          <p className="text-xs" style={{ color: "#64748B" }}>
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
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
          borderBottom: "1px solid #1F2937",
          height: "80px",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center shrink-0">
            <video src="/generated/media/logo_video_transparent.webm" autoPlay loop muted playsInline className="h-16 w-auto" />
          </div>
          <div className="hidden md:flex flex-1 justify-center px-4">
            <span
              className="text-[22px] font-bold text-center"
              style={{ color: "#22D3EE", letterSpacing: "0.3px" }}
            >
              Transforming Structured Content into Scalable Media
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm shrink-0">
            <a
              href="#use-cases"
              className="font-medium transition-colors"
              style={{ color: "#CBD5E1" }}
              data-testid="nav-link-use-cases"
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#CBD5E1"; }}
            >
              Use Cases
            </a>
            <a
              href="#pricing"
              className="font-medium transition-colors"
              style={{ color: "#CBD5E1" }}
              data-testid="nav-link-pricing"
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#CBD5E1"; }}
            >
              Pricing
            </a>
            <a
              href="/blog"
              className="font-medium transition-colors"
              style={{ color: "#CBD5E1" }}
              data-testid="nav-link-blog"
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#CBD5E1"; }}
            >
              Blog
            </a>
            <button
              className="font-semibold text-sm tracking-[0.4px] transition-colors"
              style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                padding: "12px 22px",
                borderRadius: "10px",
                boxShadow: "0 6px 20px rgba(37, 99, 235, 0.25)",
              }}
              onClick={handleGetStarted}
              data-testid="nav-button-get-started"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1D4ED8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#2563EB"; }}
            >
              Get Started
            </button>
          </div>
          <button
            className="sm:hidden font-semibold text-sm"
            style={{
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              padding: "10px 18px",
              borderRadius: "10px",
            }}
            onClick={handleGetStarted}
            data-testid="nav-button-get-started-mobile"
          >
            Get Started
          </button>
        </div>
      </nav>

      <HeroSection onGetStarted={handleGetStarted} />
      <ShowcaseSection />
      <ProblemSection />
      <SolutionSection />
      <UseCasesSection />
      <StylesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CapabilitiesSection />
      <CompetitiveTable />
      <CostComparisonTable />
      <PricingSection onGetStarted={handleGetStarted} />
      <WhyUpgradeTable />
      <TestimonialsSection />
      <CTASection onGetStarted={handleGetStarted} />
      <FooterSection />
    </div>
  );
}
