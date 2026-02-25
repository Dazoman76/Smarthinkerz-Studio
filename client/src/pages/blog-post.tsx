import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import logoImage from "@assets/Sleek_SmartThinkerz_company_logo_on_dark_backgroun-17515430621_1771985098421.png";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";

interface BlogPostFull {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post, isLoading, error } = useQuery<BlogPostFull>({
    queryKey: ["/api/blog", params.slug],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="Smarthinkerz Studio" className="h-8 w-auto" />
              <span className="text-white font-semibold">Studio</span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white text-sm transition-colors">Home</Link>
            <Link href="/blog" className="text-slate-300 hover:text-white text-sm transition-colors">Blog</Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10" data-testid="link-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/blog">
          <Button variant="ghost" className="text-slate-400 hover:text-white mb-6" data-testid="button-back-to-blog">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Button>
        </Link>

        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 bg-slate-700" />
            <Skeleton className="h-64 w-full bg-slate-700 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-slate-700" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl text-white font-medium mb-2">Post not found</h3>
              <p className="text-slate-400 mb-4">The blog post you're looking for doesn't exist.</p>
              <Link href="/blog">
                <Button data-testid="button-browse-posts">Browse Posts</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!isLoading && post && (
          <article>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-post-title">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {post.authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-lg mb-8 border border-slate-700"
                data-testid="img-post-cover"
              />
            )}

            <div className="prose prose-invert prose-slate max-w-none" data-testid="text-post-content">
              {post.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-slate-300 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
