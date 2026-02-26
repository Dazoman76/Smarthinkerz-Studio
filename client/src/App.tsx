import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/landing";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import AdminLogin from "@/pages/admin-login";
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBlogList from "@/pages/admin/blog-list";
import AdminBlogEditor from "@/pages/admin/blog-editor";
import AdminUsers from "@/pages/admin/users";
import AdminTeam from "@/pages/admin/team";
import AdminSettings from "@/pages/admin/settings";
import AdminProfile from "@/pages/admin/profile";
import AdminBranding from "@/pages/admin/branding";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

function AdminRoute({ component: Component, ...rest }: { component: any; params?: any }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  return (
    <AdminLayout>
      <Component {...rest} />
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        {() => <AdminRoute component={AdminDashboard} />}
      </Route>
      <Route path="/admin/blog">
        {() => <AdminRoute component={AdminBlogList} />}
      </Route>
      <Route path="/admin/blog/:id">
        {(params) => <AdminRoute component={AdminBlogEditor} params={params} />}
      </Route>
      <Route path="/admin/clients">
        {() => <AdminRoute component={AdminUsers} />}
      </Route>
      <Route path="/admin/users">
        {() => <AdminRoute component={AdminUsers} />}
      </Route>
      <Route path="/admin/team">
        {() => <AdminRoute component={AdminTeam} />}
      </Route>
      <Route path="/admin/settings">
        {() => <AdminRoute component={AdminSettings} />}
      </Route>
      <Route path="/admin/profile">
        {() => <AdminRoute component={AdminProfile} />}
      </Route>
      <Route path="/admin/branding">
        {() => <AdminRoute component={AdminBranding} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
