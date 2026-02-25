import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, Eye, Calendar } from "lucide-react";

interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminBlogList() {
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery<BlogPostItem[]>({
    queryKey: ["/api/admin/blog"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "Post deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/blog/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "Post status updated" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Blog Management</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 bg-slate-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Management</h1>
          <p className="text-slate-400 mt-1">{posts?.length || 0} posts total</p>
        </div>
        <Link href="/admin/blog/new">
          <Button data-testid="button-new-post">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {posts?.map((post) => (
          <Card key={post.id} className="bg-slate-800 border-slate-700" data-testid={`card-post-${post.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium" data-testid={`text-post-title-${post.id}`}>{post.title}</h3>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>By {post.authorName}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {post.status === "draft" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-400 hover:bg-green-600/20"
                      onClick={() => publishMutation.mutate({ id: post.id, status: "published" })}
                      data-testid={`button-publish-${post.id}`}
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-600 text-amber-400 hover:bg-amber-600/20"
                      onClick={() => publishMutation.mutate({ id: post.id, status: "draft" })}
                      data-testid={`button-unpublish-${post.id}`}
                    >
                      Unpublish
                    </Button>
                  )}
                  <Link href={`/admin/blog/${post.id}`}>
                    <Button variant="ghost" size="icon" data-testid={`button-edit-post-${post.id}`}>
                      <Pencil className="w-4 h-4 text-slate-400" />
                    </Button>
                  </Link>
                  {post.status === "published" && (
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="icon" data-testid={`button-view-post-${post.id}`}>
                        <Eye className="w-4 h-4 text-slate-400" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Delete this post?")) deleteMutation.mutate(post.id);
                    }}
                    data-testid={`button-delete-post-${post.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!posts || posts.length === 0) && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <p className="text-slate-400 mb-4">No blog posts yet. Create your first post.</p>
              <Link href="/admin/blog/new">
                <Button data-testid="button-create-first-post">
                  <Plus className="w-4 h-4 mr-2" /> Create Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
