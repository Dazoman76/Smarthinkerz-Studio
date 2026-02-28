import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  FileType2,
  ArrowRight,
} from "lucide-react";

type FormatStatus = "idle" | "uploading" | "processing" | "complete" | "error";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<FormatStatus>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      setStatus("uploading");
      const formData = new FormData();
      formData.append("document", selectedFile);

      setStatus("processing");

      const res = await fetch("/api/format", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to format document");
      }

      const contentDisposition = res.headers.get("content-disposition");
      let filename = "formatted_document.docx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match) filename = match[1];
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      return { url, filename };
    },
    onSuccess: (data) => {
      setDownloadUrl(data.url);
      setDownloadFilename(data.filename);
      setStatus("complete");
      toast({
        title: "Document formatted successfully",
        description: "Your document is ready for download.",
      });
    },
    onError: (error: Error) => {
      setStatus("error");
      setErrorMessage(error.message);
      toast({
        title: "Formatting failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const validateAndSetFile = (f: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(f.type) && !f.name.endsWith(".docx")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a Word document (.docx) file.",
        variant: "destructive",
      });
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 50MB.",
        variant: "destructive",
      });
      return;
    }
    setFile(f);
    setStatus("idle");
    setDownloadUrl(null);
    setErrorMessage("");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  };

  const handleFormat = () => {
    if (!file) return;
    formatMutation.mutate(file);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setDownloadUrl(null);
    setDownloadFilename("");
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span data-testid="text-tagline">Professional Document Formatting</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
              data-testid="text-title"
            >
              Format Your Documents
              <br />
              <span className="text-primary">With Precision</span>
            </h1>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-description"
            >
              Upload your Word document and get it professionally formatted with
              consistent fonts, headings, spacing, and bullet points — all in
              seconds.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="p-0 overflow-visible">
            <div className="p-8">
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      data-testid="dropzone"
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-all duration-200
                        ${
                          dragActive
                            ? "border-primary bg-primary/5 scale-[1.01]"
                            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
                        }
                      `}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileInput}
                        className="hidden"
                        data-testid="input-file"
                      />
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className={`
                            w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200
                            ${
                              dragActive
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }
                          `}
                        >
                          <Upload className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-base font-medium mb-1">
                            {dragActive
                              ? "Drop your file here"
                              : "Drag & drop your document here"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse your files
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <FileType2 className="w-3.5 h-3.5" />
                          <span>Supports .docx files up to 50MB</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file-info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 border border-border/50">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium truncate"
                          data-testid="text-filename"
                        >
                          {file.name}
                        </p>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid="text-filesize"
                        >
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      {status === "idle" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleReset}
                          data-testid="button-remove-file"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {status === "processing" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <Loader2
                            className="w-4 h-4 animate-spin text-primary"
                          />
                          <span
                            className="text-sm font-medium"
                            data-testid="text-status"
                          >
                            Formatting your document...
                          </span>
                        </div>
                        <Progress value={66} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">
                          Applying font styles, fixing headings, aligning
                          bullet points, and cleaning up spacing
                        </p>
                      </motion.div>
                    )}

                    {status === "complete" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p
                              className="font-medium text-green-800 dark:text-green-300"
                              data-testid="text-success"
                            >
                              Document formatted successfully
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                              All formatting rules have been applied
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p
                              className="font-medium text-red-800 dark:text-red-300"
                              data-testid="text-error"
                            >
                              Formatting failed
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">
                              {errorMessage || "An unexpected error occurred"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      {status === "idle" && (
                        <>
                          <Button
                            onClick={handleFormat}
                            className="flex-1"
                            data-testid="button-format"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Format Document
                          </Button>
                        </>
                      )}

                      {status === "complete" && downloadUrl && (
                        <>
                          <Button
                            onClick={handleDownload}
                            className="flex-1"
                            data-testid="button-download"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Formatted Document
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleReset}
                            data-testid="button-format-another"
                          >
                            Format Another
                          </Button>
                        </>
                      )}

                      {status === "error" && (
                        <>
                          <Button
                            onClick={handleFormat}
                            className="flex-1"
                            data-testid="button-retry"
                          >
                            Try Again
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleReset}
                            data-testid="button-reset"
                          >
                            Choose Another File
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <h2
            className="text-xl font-semibold text-center mb-8"
            data-testid="text-features-heading"
          >
            What Gets Formatted
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: FileText,
                title: "Fonts & Headings",
                desc: "Calibri throughout. Titles at 14pt bold, subtitles at 12pt bold, body at 12pt regular.",
              },
              {
                icon: ArrowRight,
                title: "Q&A Formatting",
                desc: "Questions styled bold, answers regular. Consistent single-line spacing between pairs.",
              },
              {
                icon: Sparkles,
                title: "Layout & Cleanup",
                desc: "Justified body text, uniform bullet alignment, consistent margins, and blank line removal.",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-6 hover-elevate"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3
                  className="font-semibold mb-2"
                  data-testid={`text-feature-title-${i}`}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  data-testid={`text-feature-desc-${i}`}
                >
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-12 mb-8"
        >
          <Card className="p-6">
            <h3
              className="font-semibold mb-4"
              data-testid="text-rules-heading"
            >
              Formatting Rules Applied
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {[
                "Questions: Calibri, Bold",
                "Answers: Calibri, Regular",
                "Titles: Calibri, Bold, 14pt",
                "Subtitles: Calibri, Bold, 12pt",
                "Body text: Calibri, Regular, 12pt",
                "Uniform bullet point alignment",
                "Body text justified alignment",
                "Consistent margins & line spacing",
                "Unnecessary blank lines removed",
              ].map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm py-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span data-testid={`text-rule-${i}`}>{rule}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
