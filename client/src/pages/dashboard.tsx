import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { LessonDay } from "@shared/schema";

type MediaStyle = "photorealistic" | "illustration" | "cartoon" | "3d-render" | "watercolor" | "minimalist" | "cinematic";

const styleLabels: Record<MediaStyle, string> = {
  "photorealistic": "Photorealistic",
  "illustration": "Illustration",
  "cartoon": "Cartoon",
  "3d-render": "3D Render",
  "watercolor": "Watercolor",
  "minimalist": "Minimalist",
  "cinematic": "Cinematic",
};
import {
  Play,
  Pause,
  Square,
  Image,
  Video,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Zap,
  BarChart3,
  Grid3X3,
  List,
  RefreshCw,
  Eye,
  Upload,
  Download,
  Palette,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { MediaViewer } from "@/components/media-viewer";
import { FileUpload } from "@/components/file-upload";
import logoImage from "@assets/Sleek_SmartThinkerz_company_logo_on_dark_backgroun-17515430621_1771985098421.png";

type Stats = {
  totalDays: number;
  imagesCompleted: number;
  videosCompleted: number;
  imagesFailed: number;
  videosFailed: number;
  imagesGenerating: number;
  videosGenerating: number;
  imagesPending: number;
  videosPending: number;
};

function StatCard({
  title,
  value,
  total,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  total: number;
  icon: any;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-semibold tracking-tight">
          {value}
          <span className="text-sm text-muted-foreground font-normal ml-1">/ {total}</span>
        </div>
        <Progress value={percentage} className="mt-2 h-1.5" />
        <span className="text-xs text-muted-foreground mt-1 block">{percentage}% complete</span>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="default" className="bg-emerald-600 text-white">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Done
        </Badge>
      );
    case "generating":
      return (
        <Badge variant="secondary">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Generating
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
}

function DayCard({ day, onView }: { day: LessonDay; onView: (day: LessonDay) => void }) {
  const isComplete = day.imageStatus === "completed" && day.videoStatus === "completed";
  const isGenerating = day.imageStatus === "generating" || day.videoStatus === "generating";
  const hasFailed = day.imageStatus === "failed" || day.videoStatus === "failed";

  return (
    <Card
      className={`transition-all duration-200 cursor-pointer ${
        isComplete ? "border-emerald-200 dark:border-emerald-900"
        : hasFailed ? "border-red-200 dark:border-red-900"
        : isGenerating ? "border-blue-200 dark:border-blue-900"
        : ""
      }`}
      onClick={() => onView(day)}
      data-testid={`card-day-${day.id}`}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-1 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-semibold text-primary">Day {day.id}</span>
              {isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
            </div>
            <h4 className="text-sm font-medium truncate">{day.topic}</h4>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Image className="w-3 h-3 text-muted-foreground" />
            <StatusBadge status={day.imageStatus} />
          </div>
          <div className="flex items-center gap-1">
            <Video className="w-3 h-3 text-muted-foreground" />
            <StatusBadge status={day.videoStatus} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DayRow({ day, onView }: { day: LessonDay; onView: (day: LessonDay) => void }) {
  return (
    <div
      className="flex items-center gap-4 p-3 border rounded-md cursor-pointer hover-elevate"
      onClick={() => onView(day)}
      data-testid={`row-day-${day.id}`}
    >
      <div className="w-16 text-center">
        <span className="text-sm font-semibold text-primary">Day {day.id}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{day.topic}</h4>
        <p className="text-xs text-muted-foreground truncate">{day.description}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <Image className="w-3.5 h-3.5 text-muted-foreground" />
          <StatusBadge status={day.imageStatus} />
        </div>
        <div className="flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-muted-foreground" />
          <StatusBadge status={day.videoStatus} />
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => { e.stopPropagation(); onView(day); }}
          data-testid={`button-view-day-${day.id}`}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "generating" | "failed">("all");
  const [selectedDay, setSelectedDay] = useState<LessonDay | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [imageStyle, setImageStyle] = useState<MediaStyle>("photorealistic");
  const [videoStyle, setVideoStyle] = useState<MediaStyle>("photorealistic");

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    refetchInterval: 5000,
  });

  const { data: days = [], isLoading: daysLoading } = useQuery<LessonDay[]>({
    queryKey: ["/api/lesson-days"],
    refetchInterval: 5000,
  });

  const { data: jobStatus } = useQuery<{ isRunning: boolean; isPaused: boolean; status: string; job: any }>({
    queryKey: ["/api/generation/status"],
    refetchInterval: 3000,
  });

  const startGeneration = useMutation({
    mutationFn: () => apiRequest("POST", "/api/generation/start", { imageStyle, videoStyle }),
    onSuccess: () => {
      toast({ title: "Generation started", description: `Generating ${styleLabels[imageStyle]} images & ${styleLabels[videoStyle]} videos.` });
      queryClient.invalidateQueries({ queryKey: ["/api/generation/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const pauseGeneration = useMutation({
    mutationFn: () => apiRequest("POST", "/api/generation/pause"),
    onSuccess: () => {
      toast({ title: "Generation paused", description: "Will pause after the current item finishes. Click Resume to continue." });
      queryClient.invalidateQueries({ queryKey: ["/api/generation/status"] });
    },
  });

  const resumeGeneration = useMutation({
    mutationFn: () => apiRequest("POST", "/api/generation/resume"),
    onSuccess: () => {
      toast({ title: "Generation resumed", description: "Continuing media generation." });
      queryClient.invalidateQueries({ queryKey: ["/api/generation/status"] });
    },
  });

  const stopGeneration = useMutation({
    mutationFn: () => apiRequest("POST", "/api/generation/stop"),
    onSuccess: () => {
      toast({ title: "Generation stopped", description: "The generation process has been fully stopped." });
      queryClient.invalidateQueries({ queryKey: ["/api/generation/status"] });
    },
  });

  const retryFailed = useMutation({
    mutationFn: () => apiRequest("POST", "/api/generation/retry-failed"),
    onSuccess: () => {
      toast({ title: "Retrying failed items", description: "Failed generations will be retried." });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-days"] });
    },
  });

  const filteredDays = useMemo(() => {
    if (filter === "all") return days;
    return days.filter((d) => {
      if (filter === "completed") return d.imageStatus === "completed" && d.videoStatus === "completed";
      if (filter === "pending") return d.imageStatus === "pending" || d.videoStatus === "pending";
      if (filter === "generating") return d.imageStatus === "generating" || d.videoStatus === "generating";
      if (filter === "failed") return d.imageStatus === "failed" || d.videoStatus === "failed";
      return true;
    });
  }, [days, filter]);

  const totalMedia = (stats?.totalDays ?? 0) * 2;
  const completedMedia = (stats?.imagesCompleted ?? 0) + (stats?.videosCompleted ?? 0);
  const overallProgress = totalMedia > 0 ? Math.round((completedMedia / totalMedia) * 100) : 0;
  const isRunning = jobStatus?.isRunning ?? false;
  const isPaused = jobStatus?.isPaused ?? false;
  const hasLessons = (stats?.totalDays ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Link href="/">
                <div className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={logoImage} alt="SmartThinkerz" className="h-7 w-auto rounded" />
                  <span className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase ml-0.5 -mt-0.5">Studio</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground mt-0.5">
                Turn lessons, posts, and campaigns into stunning media
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isRunning && !isPaused ? (
                <>
                  <Button
                    onClick={() => pauseGeneration.mutate()}
                    variant="outline"
                    disabled={pauseGeneration.isPending}
                    data-testid="button-pause-generation"
                  >
                    {pauseGeneration.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Pause className="w-4 h-4 mr-2" />
                    )}
                    Pause
                  </Button>
                  <Button
                    onClick={() => stopGeneration.mutate()}
                    variant="destructive"
                    disabled={stopGeneration.isPending}
                    data-testid="button-stop-generation"
                  >
                    {stopGeneration.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Square className="w-4 h-4 mr-2" />
                    )}
                    Stop
                  </Button>
                </>
              ) : isPaused ? (
                <>
                  <Button
                    onClick={() => resumeGeneration.mutate()}
                    disabled={resumeGeneration.isPending}
                    data-testid="button-resume-generation"
                  >
                    {resumeGeneration.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Resume
                  </Button>
                  <Button
                    onClick={() => stopGeneration.mutate()}
                    variant="destructive"
                    disabled={stopGeneration.isPending}
                    data-testid="button-stop-generation"
                  >
                    {stopGeneration.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Square className="w-4 h-4 mr-2" />
                    )}
                    Stop
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => startGeneration.mutate()}
                  disabled={startGeneration.isPending || overallProgress === 100 || !hasLessons}
                  data-testid="button-start-generation"
                >
                  {startGeneration.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {!hasLessons ? "Upload Lessons First" : overallProgress === 100 ? "All Complete" : "Start Generation"}
                </Button>
              )}
              {hasLessons && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => retryFailed.mutate()}
                    disabled={retryFailed.isPending || ((stats?.imagesFailed ?? 0) + (stats?.videosFailed ?? 0)) === 0}
                    data-testid="button-retry-failed"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Failed
                  </Button>
                  {completedMedia > 0 && (
                    <a href="/api/download/all" download>
                      <Button variant="outline" data-testid="button-download-all">
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upload" data-testid="tab-upload">
              <Upload className="w-4 h-4 mr-1.5" />
              Upload Lessons
            </TabsTrigger>
            <TabsTrigger value="overview" data-testid="tab-overview">
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="days" data-testid="tab-days">
              <Grid3X3 className="w-4 h-4 mr-1.5" />
              All Days ({stats?.totalDays ?? 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold">Upload Your Document</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload any content document — lesson plans, training manuals, marketing briefs, manuscripts, or guides. 
                  The AI will analyze it, extract each section, and generate unique images and videos.
                </p>
              </div>
              <FileUpload />

              {hasLessons && (
                <Card className="mt-6">
                  <CardContent className="p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">{stats?.totalDays} lessons loaded</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Switch to the "Overview" tab and click "Start Generation" to begin creating media.
                    </p>
                    <Button
                      className="mt-3"
                      size="sm"
                      onClick={() => setActiveTab("overview")}
                      data-testid="button-go-to-overview"
                    >
                      Go to Overview
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            {!hasLessons ? (
              <div className="text-center py-20">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium">No lessons yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a lesson document to get started.
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("upload")} data-testid="button-upload-lessons">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Lessons
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-medium text-muted-foreground">Overall Progress</h2>
                    <span className="text-sm font-semibold">{completedMedia} / {totalMedia} media files</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{overallProgress}% complete</span>
                    {isRunning && !isPaused && (
                      <Badge variant="secondary">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </Badge>
                    )}
                    {isPaused && (
                      <Badge variant="outline" className="border-amber-500 text-amber-600">
                        <Pause className="w-3 h-3 mr-1" />
                        Paused
                      </Badge>
                    )}
                  </div>
                </div>

                <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300" data-testid="text-remaining-title">Remaining Work</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div data-testid="text-remaining-images">
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats?.imagesPending ?? 0}</p>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Images remaining</p>
                      </div>
                      <div data-testid="text-remaining-videos">
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats?.videosPending ?? 0}</p>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Videos remaining</p>
                      </div>
                      <div data-testid="text-remaining-total">
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{(stats?.imagesPending ?? 0) + (stats?.videosPending ?? 0)}</p>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Total remaining</p>
                      </div>
                      <div data-testid="text-estimated-time">
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                          {(() => {
                            const remaining = (stats?.imagesPending ?? 0) + (stats?.videosPending ?? 0);
                            const mins = Math.ceil(remaining * 0.25);
                            if (mins < 60) return `~${mins}m`;
                            const hrs = Math.floor(mins / 60);
                            const rm = mins % 60;
                            return `~${hrs}h ${rm}m`;
                          })()}
                        </p>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Est. time left</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard
                    title="Images Done"
                    value={stats?.imagesCompleted ?? 0}
                    total={stats?.totalDays ?? 0}
                    icon={Image}
                    color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                  />
                  <StatCard
                    title="Videos Done"
                    value={stats?.videosCompleted ?? 0}
                    total={stats?.totalDays ?? 0}
                    icon={Video}
                    color="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                  />
                  <StatCard
                    title="In Progress"
                    value={(stats?.imagesGenerating ?? 0) + (stats?.videosGenerating ?? 0)}
                    total={totalMedia}
                    icon={Loader2}
                    color="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                  />
                  <StatCard
                    title="Failed"
                    value={(stats?.imagesFailed ?? 0) + (stats?.videosFailed ?? 0)}
                    total={totalMedia}
                    icon={XCircle}
                    color="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                  />
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Media Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Image Style</label>
                        <Select
                          value={imageStyle}
                          onValueChange={(v) => setImageStyle(v as MediaStyle)}
                          disabled={isRunning}
                        >
                          <SelectTrigger data-testid="select-image-style">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(styleLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key} data-testid={`option-image-style-${key}`}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {imageStyle === "photorealistic" && "Ultra-realistic photography with natural lighting"}
                          {imageStyle === "illustration" && "Professional digital artwork with clean lines"}
                          {imageStyle === "cartoon" && "Fun, colorful cartoon with bold outlines"}
                          {imageStyle === "3d-render" && "Polished 3D visualization with studio lighting"}
                          {imageStyle === "watercolor" && "Artistic watercolor with soft brushstrokes"}
                          {imageStyle === "minimalist" && "Clean design with simple shapes and white space"}
                          {imageStyle === "cinematic" && "Dramatic film-quality composition"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Video Style</label>
                        <Select
                          value={videoStyle}
                          onValueChange={(v) => setVideoStyle(v as MediaStyle)}
                          disabled={isRunning}
                        >
                          <SelectTrigger data-testid="select-video-style">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(styleLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key} data-testid={`option-video-style-${key}`}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {videoStyle === "photorealistic" && "Ultra-realistic photography with natural lighting"}
                          {videoStyle === "illustration" && "Professional digital artwork with clean lines"}
                          {videoStyle === "cartoon" && "Fun, colorful cartoon with bold outlines"}
                          {videoStyle === "3d-render" && "Polished 3D visualization with studio lighting"}
                          {videoStyle === "watercolor" && "Artistic watercolor with soft brushstrokes"}
                          {videoStyle === "minimalist" && "Clean design with simple shapes and white space"}
                          {videoStyle === "cinematic" && "Dramatic film-quality composition"}
                        </p>
                      </div>
                    </div>
                    {isRunning && (
                      <p className="text-xs text-amber-600 mt-3">
                        Style can only be changed when generation is not running.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {days
                          .filter(d => d.imageStatus !== "pending" || d.videoStatus !== "pending")
                          .sort((a, b) => {
                            const aTime = Math.max(
                              a.imageGeneratedAt ? new Date(a.imageGeneratedAt).getTime() : 0,
                              a.videoGeneratedAt ? new Date(a.videoGeneratedAt).getTime() : 0
                            );
                            const bTime = Math.max(
                              b.imageGeneratedAt ? new Date(b.imageGeneratedAt).getTime() : 0,
                              b.videoGeneratedAt ? new Date(b.videoGeneratedAt).getTime() : 0
                            );
                            return bTime - aTime;
                          })
                          .slice(0, 20)
                          .map(day => (
                            <DayRow key={day.id} day={day} onView={setSelectedDay} />
                          ))}
                        {days.filter(d => d.imageStatus !== "pending" || d.videoStatus !== "pending").length === 0 && (
                          <div className="text-center py-12 text-muted-foreground">
                            <Zap className="w-8 h-8 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No media generated yet. Click "Start Generation" to begin.</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="days" className="space-y-4">
            {!hasLessons ? (
              <div className="text-center py-20">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium">No lessons yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Upload a lesson document to see all days here.</p>
                <Button className="mt-4" onClick={() => setActiveTab("upload")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Lessons
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")} data-testid="filter-all">
                      All ({days.length})
                    </Button>
                    <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")} data-testid="filter-pending">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending ({stats?.imagesPending ?? 0})
                    </Button>
                    <Button variant={filter === "generating" ? "default" : "outline"} size="sm" onClick={() => setFilter("generating")} data-testid="filter-generating">
                      <Loader2 className="w-3 h-3 mr-1" />
                      Generating
                    </Button>
                    <Button variant={filter === "completed" ? "default" : "outline"} size="sm" onClick={() => setFilter("completed")} data-testid="filter-completed">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed ({stats?.imagesCompleted ?? 0})
                    </Button>
                    <Button variant={filter === "failed" ? "default" : "outline"} size="sm" onClick={() => setFilter("failed")} data-testid="filter-failed">
                      <XCircle className="w-3 h-3 mr-1" />
                      Failed ({(stats?.imagesFailed ?? 0) + (stats?.videosFailed ?? 0)})
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")} data-testid="button-grid-view">
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("list")} data-testid="button-list-view">
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {daysLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {filteredDays.map(day => (
                      <DayCard key={day.id} day={day} onView={setSelectedDay} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredDays.map(day => (
                      <DayRow key={day.id} day={day} onView={setSelectedDay} />
                    ))}
                  </div>
                )}

                {filteredDays.length === 0 && !daysLoading && (
                  <div className="text-center py-20 text-muted-foreground">
                    <p className="text-sm">No lesson days match this filter.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {selectedDay && <MediaViewer day={selectedDay} onClose={() => setSelectedDay(null)} />}
    </div>
  );
}
