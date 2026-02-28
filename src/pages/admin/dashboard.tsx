import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Users,
  FileText,
  Image,
  Video,
  UserCheck,
  UserX,
  BookOpen,
  FileEdit,
  AlertTriangle,
  TrendingUp,
  Shield,
  Activity,
  ArrowRight,
  BarChart3,
  Eye,
  Pencil,
} from "lucide-react";

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalBlogPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalLessons: number;
  imagesGenerated: number;
  videosGenerated: number;
  imagesFailed: number;
  videosFailed: number;
}

interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface BlogInfo {
  id: number;
  title: string;
  status: string;
  authorName: string;
  createdAt: string;
  publishedAt: string | null;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  subtitle?: string;
}) {
  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
              {value}
            </p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{value}/{max} ({pct}%)</span>
      </div>
      <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/admin/analytics"],
  });

  const { data: users } = useQuery<UserInfo[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: posts } = useQuery<BlogInfo[]>({
    queryKey: ["/api/admin/blog"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 bg-slate-700 mb-2" />
                <Skeleton className="h-8 w-16 bg-slate-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const recentUsers = users?.slice(-5).reverse() || [];
  const recentPosts = posts?.slice(-5).reverse() || [];
  const totalMedia = analytics.totalLessons * 2;
  const completedMedia = analytics.imagesGenerated + analytics.videosGenerated;
  const failedTotal = analytics.imagesFailed + analytics.videosFailed;

  const roleColors: Record<string, string> = {
    administrator: "bg-red-600",
    editor: "bg-blue-600",
    writer: "bg-green-600",
    viewer: "bg-slate-600",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your platform activity and content</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Users</h2>
          <Link href="/admin/clients">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white ml-auto h-7 text-xs" data-testid="link-manage-users">
              Manage <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Users" value={analytics.totalUsers} icon={Users} color="bg-blue-600" />
          <StatCard title="Active Users" value={analytics.activeUsers} icon={UserCheck} color="bg-green-600" subtitle="Can access platform" />
          <StatCard title="Blocked Users" value={analytics.blockedUsers} icon={UserX} color="bg-red-600" subtitle="Access restricted" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Blog</h2>
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white ml-auto h-7 text-xs" data-testid="link-manage-blog">
              Manage <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Posts" value={analytics.totalBlogPosts} icon={FileText} color="bg-purple-600" />
          <StatCard title="Published" value={analytics.publishedPosts} icon={BookOpen} color="bg-emerald-600" subtitle="Visible to public" />
          <StatCard title="Drafts" value={analytics.draftPosts} icon={FileEdit} color="bg-amber-600" subtitle="In progress" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Media Generation</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard title="Total Lessons" value={analytics.totalLessons} icon={BookOpen} color="bg-indigo-600" />
          <StatCard title="Images Generated" value={analytics.imagesGenerated} icon={Image} color="bg-cyan-600" subtitle={`of ${analytics.totalLessons} total`} />
          <StatCard title="Videos Generated" value={analytics.videosGenerated} icon={Video} color="bg-teal-600" subtitle={`of ${analytics.totalLessons} total`} />
          <StatCard title="Failed Jobs" value={failedTotal} icon={AlertTriangle} color={failedTotal > 0 ? "bg-red-600" : "bg-slate-600"} subtitle={failedTotal > 0 ? "Needs attention" : "All good"} />
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Generation Progress
            </h3>
            <ProgressBar label="Images" value={analytics.imagesGenerated} max={analytics.totalLessons} color="bg-cyan-500" />
            <ProgressBar label="Videos" value={analytics.videosGenerated} max={analytics.totalLessons} color="bg-teal-500" />
            <ProgressBar label="Overall" value={completedMedia} max={totalMedia} color="bg-primary" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Recent Users
              <Link href="/admin/clients">
                <Button variant="ghost" size="sm" className="ml-auto h-6 text-xs text-slate-400 hover:text-white" data-testid="link-view-all-users">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {recentUsers.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors" data-testid={`recent-user-${user.id}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${roleColors[user.role] || "bg-slate-600"}`}>
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{user.username}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize border-slate-600 text-slate-400">
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-xs">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Recent Blog Posts
              <Link href="/admin/blog">
                <Button variant="ghost" size="sm" className="ml-auto h-6 text-xs text-slate-400 hover:text-white" data-testid="link-view-all-posts">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {recentPosts.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">No blog posts yet</p>
            ) : (
              recentPosts.map((post) => (
                <Link key={post.id} href={`/admin/blog/${post.id}`}>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer" data-testid={`recent-post-${post.id}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${post.status === "published" ? "bg-emerald-600" : "bg-amber-600"}`}>
                        {post.status === "published" ? <Eye className="w-4 h-4 text-white" /> : <Pencil className="w-4 h-4 text-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{post.title}</p>
                        <p className="text-xs text-slate-500">by {post.authorName}</p>
                      </div>
                    </div>
                    <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-xs capitalize flex-shrink-0">
                      {post.status}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Quick Admin Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/clients">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="button-quick-users">
                <Users className="w-4 h-4 mr-2" /> Manage Clients
              </Button>
            </Link>
            <Link href="/admin/blog/new">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="button-quick-new-post">
                <FileEdit className="w-4 h-4 mr-2" /> New Blog Post
              </Button>
            </Link>
            <Link href="/admin/team">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="button-quick-team">
                <UserCheck className="w-4 h-4 mr-2" /> Team Members
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="button-quick-settings">
                <Activity className="w-4 h-4 mr-2" /> Site Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
