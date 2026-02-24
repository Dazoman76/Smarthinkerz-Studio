import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  XCircle,
  File,
  FileUp,
} from "lucide-react";
import type { UploadedDocument } from "@shared/schema";

export function FileUpload() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);

  const { data: uploads = [] } = useQuery<UploadedDocument[]>({
    queryKey: ["/api/uploads"],
    refetchInterval: 3000,
  });

  const { data: polledDoc } = useQuery<UploadedDocument>({
    queryKey: ["/api/uploads", uploadingDocId, "status"],
    enabled: uploadingDocId !== null,
    refetchInterval: 2000,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setUploadingDocId(data.documentId);
      toast({
        title: "Document uploaded",
        description: `"${data.filename}" is being analyzed by AI to extract lessons.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/uploads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-days"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (err: any) => {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  if (polledDoc && polledDoc.status === "completed" && uploadingDocId !== null) {
    setTimeout(() => {
      setUploadingDocId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-days"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Lessons extracted",
        description: `${polledDoc.parsedLessonsCount} lessons found. You can now start generating media.`,
      });
    }, 500);
  }

  const handleFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "text/markdown",
    ];
    const allowedExts = [".txt", ".csv", ".md", ".pdf", ".docx"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      toast({
        title: "Unsupported file",
        description: "Please upload a .txt, .csv, .md, .pdf, or .docx file.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-md p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        data-testid="dropzone-upload"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.csv,.md,.pdf,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
          data-testid="input-file-upload"
        />

        {uploadMutation.isPending ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
            <p className="text-sm font-medium">Uploading and analyzing...</p>
            <p className="text-xs text-muted-foreground">
              AI is reviewing your document to extract lessons
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center">
              <FileUp className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drop your lesson document here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF, DOCX, TXT, CSV, and Markdown files
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadingDocId && polledDoc && polledDoc.status === "processing" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">AI is analyzing your document...</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Extracting lesson topics, descriptions, and day assignments
                </p>
              </div>
              <Badge variant="secondary">Processing</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {uploads.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Upload History</h3>
          {uploads.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.parsedLessonsCount} lessons extracted
                  </p>
                </div>
                {doc.status === "completed" ? (
                  <Badge variant="default" className="bg-emerald-600 text-white">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done
                  </Badge>
                ) : doc.status === "processing" ? (
                  <Badge variant="secondary">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Parsing
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Failed
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
