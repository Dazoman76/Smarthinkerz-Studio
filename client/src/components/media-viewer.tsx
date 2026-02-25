import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LessonDay } from "@shared/schema";
import { Image, Video, CheckCircle2, XCircle, Clock, Loader2, Download } from "lucide-react";

function StatusDisplay({ status, error }: { status: string; error?: string | null }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="default" className="bg-emerald-600 text-white">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "generating":
      return (
        <Badge variant="secondary">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Generating...
        </Badge>
      );
    case "failed":
      return (
        <div className="space-y-1">
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>
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

export function MediaViewer({
  day,
  onClose,
}: {
  day: LessonDay;
  onClose: () => void;
}) {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-primary font-semibold">Day {day.id}</span>
            <span className="text-muted-foreground">-</span>
            <span>{day.topic}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{day.description}</p>
        </DialogHeader>

        <Tabs defaultValue="image">
          <TabsList className="w-full">
            <TabsTrigger value="image" className="flex-1" data-testid="tab-image">
              <Image className="w-4 h-4 mr-1.5" />
              Image
            </TabsTrigger>
            <TabsTrigger value="video" className="flex-1" data-testid="tab-video">
              <Video className="w-4 h-4 mr-1.5" />
              Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <StatusDisplay status={day.imageStatus} error={day.imageError} />
                {day.imageStatus === "completed" && (
                  <a href={`/api/download/image/${day.id}`} download>
                    <Button size="sm" variant="outline" data-testid={`button-download-image-${day.id}`}>
                      <Download className="w-4 h-4 mr-1.5" />
                      Download Image
                    </Button>
                  </a>
                )}
              </div>
              {day.imageStatus === "completed" && day.imagePath ? (
                <div className="aspect-video rounded-md overflow-hidden bg-muted">
                  <img
                    src={day.imagePath}
                    alt={`Day ${day.id} - ${day.topic}`}
                    className="w-full h-full object-cover"
                    data-testid={`img-day-${day.id}`}
                  />
                </div>
              ) : day.imageStatus === "generating" ? (
                <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Generating image for Day {day.id}...
                    </p>
                  </div>
                </div>
              ) : day.imageStatus === "failed" ? (
                <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <XCircle className="w-8 h-8 text-destructive mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Image generation failed
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Image className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Waiting to generate
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <StatusDisplay status={day.videoStatus} error={day.videoError} />
                {day.videoStatus === "completed" && (
                  <a href={`/api/download/video/${day.id}`} download>
                    <Button size="sm" variant="outline" data-testid={`button-download-video-${day.id}`}>
                      <Download className="w-4 h-4 mr-1.5" />
                      Download Video
                    </Button>
                  </a>
                )}
              </div>
              {day.videoStatus === "completed" && day.videoPath ? (
                <div className="aspect-video rounded-md overflow-hidden bg-muted">
                  <video
                    src={day.videoPath}
                    controls
                    className="w-full h-full"
                    data-testid={`video-day-${day.id}`}
                  />
                </div>
              ) : day.videoStatus === "generating" ? (
                <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Generating video for Day {day.id}...
                    </p>
                  </div>
                </div>
              ) : day.videoStatus === "failed" ? (
                <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <XCircle className="w-8 h-8 text-destructive mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Video generation failed
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Video className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Waiting to generate
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
