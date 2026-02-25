import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ArrowLeft, Save, Send, Image as ImageIcon } from "lucide-react";

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

  const saveMutation = useMutation({
    mutationFn: async (status: string) => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt || content.substring(0, 200));
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
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
        <div>
          <h1 className="text-2xl font-bold text-white">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>
          {!isNew && existingPost && (
            <p className="text-slate-400 text-sm mt-1">Status: {existingPost.status}</p>
          )}
        </div>
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
            <Label className="text-slate-300">Excerpt</Label>
            <Textarea
              data-testid="input-post-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the post (optional)"
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
                {coverImagePreview ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  data-testid="input-cover-image"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Content</Label>
            <Textarea
              data-testid="input-post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here..."
              className="bg-slate-700 border-slate-600 text-white resize-none font-mono"
              rows={20}
            />
            <p className="text-xs text-slate-500">Supports plain text. Use blank lines for paragraphs.</p>
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
