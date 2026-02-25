import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/admin/analytics"],
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your platform activity</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Users" value={analytics.totalUsers} icon={Users} color="bg-blue-600" />
          <StatCard title="Active Users" value={analytics.activeUsers} icon={UserCheck} color="bg-green-600" />
          <StatCard title="Blocked Users" value={analytics.blockedUsers} icon={UserX} color="bg-red-600" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Posts" value={analytics.totalBlogPosts} icon={FileText} color="bg-purple-600" />
          <StatCard title="Published" value={analytics.publishedPosts} icon={BookOpen} color="bg-emerald-600" />
          <StatCard title="Drafts" value={analytics.draftPosts} icon={FileEdit} color="bg-amber-600" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Media Generation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Lessons" value={analytics.totalLessons} icon={BookOpen} color="bg-indigo-600" />
          <StatCard title="Images Generated" value={analytics.imagesGenerated} icon={Image} color="bg-cyan-600" />
          <StatCard title="Videos Generated" value={analytics.videosGenerated} icon={Video} color="bg-teal-600" />
          <StatCard title="Failed Jobs" value={analytics.imagesFailed + analytics.videosFailed} icon={AlertTriangle} color="bg-red-600" />
        </div>
      </div>
    </div>
  );
}
