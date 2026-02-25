import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import logoImage from "@assets/Sleek_SmartThinkerz_company_logo_on_dark_backgroun-17515430621_1771985098421.png";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

interface BlogPostPreview {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery<BlogPostPreview[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="Smarthinkerz Studio" className="h-8 w-auto" data-testid="img-blog-logo" />
              <span className="text-white font-semibold">Studio</span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white text-sm transition-colors">Home</Link>
            <Link href="/blog" className="text-white text-sm font-medium">Blog</Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10" data-testid="link-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Blog
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-4">Smarthinkerz Studio Blog</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Insights, tutorials, and updates on AI-powered content creation and media generation.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full bg-slate-700 rounded-t-lg" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4 bg-slate-700" />
                    <Skeleton className="h-4 w-full bg-slate-700" />
                    <Skeleton className="h-4 w-2/3 bg-slate-700" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="bg-slate-800 border-slate-700 hover:border-primary/50 transition-all cursor-pointer group h-full" data-testid={`card-blog-${post.id}`}>
                  <CardContent className="p-0">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        data-testid={`img-blog-cover-${post.id}`}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2" data-testid={`text-blog-title-${post.id}`}>
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-3 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {post.authorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && (!posts || posts.length === 0) && (
          <Card className="bg-slate-800 border-slate-700 max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl text-white font-medium mb-2">No posts yet</h3>
              <p className="text-slate-400">Check back soon for new articles and insights.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
