import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  Video,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Minus,
  Upload,
  Eye,
  Code,
  Loader2,
} from "lucide-react";

interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: string;
  authorName: string;
}

export default function AdminBlogEditor({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const postId = isNew ? null : parseInt(params.id);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const { data: existingPost } = useQuery<BlogPostData>({
    queryKey: ["/api/admin/blog", postId],
    enabled: !isNew && !!postId,
    queryFn: async () => {
      const res = await fetch(`/api/admin/blog`, { credentials: "include" });
      const posts = await res.json();
      return posts.find((p: any) => p.id === postId);
    },
  });

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setExcerpt(existingPost.excerpt || "");
      if (existingPost.coverImage) setCoverImagePreview(existingPost.coverImage);
    }
  }, [existingPost]);

  const insertAtCursor = useCallback((text: string) => {
    const textarea = contentRef.current;
    if (!textarea) {
      setContent((prev) => prev + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + text + after;
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      const newPos = start + text.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }, [content]);

  const wrapSelection = useCallback((prefix: string, suffix: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const before = content.substring(0, start);
    const after = content.substring(end);
    const wrapped = `${prefix}${selected || "text"}${suffix}`;
    setContent(before + wrapped + after);
    setTimeout(() => {
      textarea.focus();
      if (selected) {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + 4);
      }
    }, 0);
  }, [content]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload-media", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Upload failed");
        }

        const { url, type } = await res.json();

        if (type === "video") {
          insertAtCursor(`\n\n[video:${url}]\n\n`);
        } else {
          insertAtCursor(`\n\n[image:${url}]\n\n`);
        }

        toast({ title: `${type === "video" ? "Video" : "Image"} uploaded successfully` });
      }
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (status: string) => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt || content.replace(/\[image:[^\]]*\]|\[video:[^\]]*\]/g, "").substring(0, 200));
      formData.append("status", status);
      if (coverImageFile) formData.append("coverImage", coverImageFile);

      const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${postId}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Post saved successfully" });
      navigate("/admin/blog");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const renderPreview = (text: string) => {
    const parts: JSX.Element[] = [];
    const lines = text.split("\n");
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      const imageMatch = line.match(/^\[image:(.*?)\]$/);
      if (imageMatch) {
        parts.push(
          <div key={i} className="my-4">
            <img src={imageMatch[1]} alt="Content image" className="max-w-full rounded-lg border border-slate-600" />
          </div>
        );
        i++;
        continue;
      }

      const videoMatch = line.match(/^\[video:(.*?)\]$/);
      if (videoMatch) {
        parts.push(
          <div key={i} className="my-4">
            <video src={videoMatch[1]} controls className="max-w-full rounded-lg border border-slate-600" />
          </div>
        );
        i++;
        continue;
      }

      if (line.startsWith("## ")) {
        parts.push(<h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.substring(3)}</h2>);
      } else if (line.startsWith("# ")) {
        parts.push(<h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{line.substring(2)}</h1>);
      } else if (line.startsWith("> ")) {
        parts.push(
          <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-slate-400 my-3">
            {line.substring(2)}
          </blockquote>
        );
      } else if (line.startsWith("- ")) {
        const items = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          items.push(lines[i].substring(2));
          i++;
        }
        parts.push(
          <ul key={`ul-${i}`} className="list-disc pl-6 text-slate-300 my-3 space-y-1">
            {items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        );
        continue;
      } else if (line.match(/^\d+\.\s/)) {
        const items = [];
        while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
          items.push(lines[i].replace(/^\d+\.\s/, ""));
          i++;
        }
        parts.push(
          <ol key={`ol-${i}`} className="list-decimal pl-6 text-slate-300 my-3 space-y-1">
            {items.map((item, j) => <li key={j}>{item}</li>)}
          </ol>
        );
        continue;
      } else if (line === "---") {
        parts.push(<hr key={i} className="border-slate-600 my-6" />);
      } else if (line.trim() === "") {
        parts.push(<div key={i} className="h-2" />);
      } else {
        let processed = line;
        processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        processed = processed.replace(/`(.*?)`/g, '<code class="bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>');
        processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline" target="_blank">$1</a>');
        parts.push(
          <p key={i} className="text-slate-300 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: processed }} />
        );
      }
      i++;
    }
    return parts;
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => wrapSelection("**", "**") },
    { icon: Italic, label: "Italic", action: () => wrapSelection("*", "*") },
    { icon: Code, label: "Code", action: () => wrapSelection("`", "`") },
    { icon: Heading1, label: "H1", action: () => insertAtCursor("\n# ") },
    { icon: Heading2, label: "H2", action: () => insertAtCursor("\n## ") },
    { icon: List, label: "Bullet List", action: () => insertAtCursor("\n- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertAtCursor("\n1. ") },
    { icon: Quote, label: "Quote", action: () => insertAtCursor("\n> ") },
    { icon: LinkIcon, label: "Link", action: () => insertAtCursor("[link text](https://example.com)") },
    { icon: Minus, label: "Divider", action: () => insertAtCursor("\n---\n") },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/blog")}
          className="text-slate-400 hover:text-white"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>
          {!isNew && existingPost && (
            <p className="text-slate-400 text-sm mt-1">Status: {existingPost.status}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className={`border-slate-600 ${showPreview ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-700"}`}
          data-testid="button-toggle-preview"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? "Editor" : "Preview"}
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Title</Label>
            <Input
              data-testid="input-post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="bg-slate-700 border-slate-600 text-white text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Excerpt (short preview shown on blog listing)</Label>
            <Textarea
              data-testid="input-post-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence summary that appears on the blog cards (auto-generated if left empty)"
              className="bg-slate-700 border-slate-600 text-white resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Cover Image</Label>
            <div className="flex items-start gap-4">
              {coverImagePreview && (
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-40 h-24 object-cover rounded-lg border border-slate-600"
                  data-testid="img-cover-preview"
                />
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 hover:bg-slate-600 transition-colors">
                <ImageIcon className="w-4 h-4" />
                {coverImagePreview ? "Change Image" : "Upload Cover Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                  data-testid="input-cover-image"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Content</Label>

            {!showPreview && (
              <div className="flex items-center gap-1 p-2 bg-slate-900 rounded-t-lg border border-b-0 border-slate-600 flex-wrap">
                {toolbarButtons.map((btn) => (
                  <Button
                    key={btn.label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={btn.action}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                    title={btn.label}
                    data-testid={`button-toolbar-${btn.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <btn.icon className="w-4 h-4" />
                  </Button>
                ))}

                <div className="h-6 w-px bg-slate-600 mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={uploading}
                  className="h-8 px-3 text-slate-400 hover:text-white hover:bg-slate-700 gap-1.5"
                  title="Upload Image or Video"
                  data-testid="button-upload-media"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <ImageIcon className="w-3.5 h-3.5" />
                  <Video className="w-3.5 h-3.5" />
                </Button>

                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  data-testid="input-media-upload"
                />
              </div>
            )}

            {showPreview ? (
              <div className="min-h-[500px] p-6 bg-slate-700 border border-slate-600 rounded-lg">
                {content ? renderPreview(content) : (
                  <p className="text-slate-500 italic">Nothing to preview yet. Start writing content.</p>
                )}
              </div>
            ) : (
              <Textarea
                ref={contentRef}
                data-testid="input-post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here...&#10;&#10;Use the toolbar above to format text.&#10;Click the upload button to insert images or videos at cursor position.&#10;&#10;Formatting: **bold**, *italic*, `code`&#10;# Heading 1&#10;## Heading 2&#10;- Bullet point&#10;1. Numbered list&#10;> Quote&#10;[Link text](URL)"
                className="bg-slate-700 border-slate-600 text-white resize-none font-mono rounded-t-none"
                rows={24}
              />
            )}
            <p className="text-xs text-slate-500">
              Supports Markdown formatting. Use toolbar or type directly. Upload images and videos inline.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={() => saveMutation.mutate("draft")}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled={saveMutation.isPending || !title || !content}
              data-testid="button-save-draft"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={() => saveMutation.mutate("published")}
              disabled={saveMutation.isPending || !title || !content}
              data-testid="button-publish"
            >
              <Send className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
