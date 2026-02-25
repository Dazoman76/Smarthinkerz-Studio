import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Search,
  Users,
  ShieldAlert,
  ShieldCheck,
  ArrowUpCircle,
  ArrowDownCircle,
  Ban,
  CheckCircle,
  Mail,
} from "lucide-react";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const ROLES = ["viewer", "writer", "editor", "administrator"] as const;
const ROLE_HIERARCHY = { viewer: 0, writer: 1, editor: 2, administrator: 3 };

export default function AdminUsers() {
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "viewer" });

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const addUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const res = await apiRequest("POST", "/api/admin/users", userData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setShowAdd(false);
      setNewUser({ username: "", email: "", password: "", role: "viewer" });
      toast({ title: "User created successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      const action = variables.data.status ? (variables.data.status === "blocked" ? "blocked" : "unblocked") : "updated";
      toast({ title: `User ${action} successfully` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({ title: "User removed successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const roleColors: Record<string, string> = {
    administrator: "bg-red-600",
    editor: "bg-blue-600",
    writer: "bg-green-600",
    viewer: "bg-slate-600",
  };

  const roleIcons: Record<string, any> = {
    administrator: ShieldAlert,
    editor: ShieldCheck,
    writer: UserCheck,
    viewer: Users,
  };

  const filteredUsers = users?.filter((user) => {
    const matchSearch = searchQuery === "" ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === "all" || user.role === filterRole;
    const matchStatus = filterStatus === "all" || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  }) || [];

  const stats = {
    total: users?.length || 0,
    active: users?.filter((u) => u.status === "active").length || 0,
    blocked: users?.filter((u) => u.status === "blocked").length || 0,
    admins: users?.filter((u) => u.role === "administrator").length || 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 bg-slate-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1">Add, edit roles, block, or remove app users</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-user">
              <Plus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New User</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addUserMutation.mutate(newUser);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-slate-300">Username</Label>
                <Input
                  data-testid="input-new-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input
                  data-testid="input-new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Password</Label>
                <Input
                  data-testid="input-new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Role</Label>
                <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-new-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Can view content only</SelectItem>
                    <SelectItem value="writer">Writer - Can create blog posts</SelectItem>
                    <SelectItem value="editor">Editor - Can edit all content</SelectItem>
                    <SelectItem value="administrator">Administrator - Full access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={addUserMutation.isPending} data-testid="button-submit-user">
                {addUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-slate-400">Total Users</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-xs text-slate-400">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{stats.blocked}</p>
            <p className="text-xs text-slate-400">Blocked</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.admins}</p>
            <p className="text-xs text-slate-400">Admins</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            data-testid="input-search-users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or email..."
            className="bg-slate-700 border-slate-600 text-white pl-10"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white" data-testid="select-filter-role">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="writer">Writer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="administrator">Administrator</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white" data-testid="select-filter-status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">No users found matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => {
            const RoleIcon = roleIcons[user.role] || Users;
            const currentLevel = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY] ?? 0;
            const canUpgrade = currentLevel < 3;
            const canDowngrade = currentLevel > 0;
            const nextRoleUp = canUpgrade ? ROLES[currentLevel + 1] : null;
            const nextRoleDown = canDowngrade ? ROLES[currentLevel - 1] : null;

            return (
              <Card key={user.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors" data-testid={`card-user-${user.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${roleColors[user.role] || "bg-slate-600"}`}>
                      <RoleIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-lg" data-testid={`text-username-${user.id}`}>{user.username}</p>
                        <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-xs">
                          {user.status === "active" ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><Ban className="w-3 h-3 mr-1" /> Blocked</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </span>
                        <Badge variant="outline" className={`capitalize text-xs ${user.role === "administrator" ? "border-red-500 text-red-400" : "border-slate-500 text-slate-300"}`}>
                          <RoleIcon className="w-3 h-3 mr-1" /> {user.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Joined {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      {canUpgrade && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserMutation.mutate({ id: user.id, data: { role: nextRoleUp } })}
                          className="border-green-700 text-green-400 hover:bg-green-900/30 text-xs"
                          title={`Upgrade to ${nextRoleUp}`}
                          data-testid={`button-upgrade-${user.id}`}
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
                          Upgrade
                        </Button>
                      )}

                      {canDowngrade && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserMutation.mutate({ id: user.id, data: { role: nextRoleDown } })}
                          className="border-amber-700 text-amber-400 hover:bg-amber-900/30 text-xs"
                          title={`Downgrade to ${nextRoleDown}`}
                          data-testid={`button-downgrade-${user.id}`}
                        >
                          <ArrowDownCircle className="w-3.5 h-3.5 mr-1" />
                          Downgrade
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateUserMutation.mutate({
                            id: user.id,
                            data: { status: user.status === "active" ? "blocked" : "active" },
                          })
                        }
                        className={user.status === "active"
                          ? "border-amber-700 text-amber-400 hover:bg-amber-900/30 text-xs"
                          : "border-green-700 text-green-400 hover:bg-green-900/30 text-xs"
                        }
                        data-testid={`button-toggle-status-${user.id}`}
                      >
                        {user.status === "active" ? (
                          <><Ban className="w-3.5 h-3.5 mr-1" /> Block</>
                        ) : (
                          <><CheckCircle className="w-3.5 h-3.5 mr-1" /> Unblock</>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently remove "${user.username}"? This cannot be undone.`)) {
                            deleteUserMutation.mutate(user.id);
                          }
                        }}
                        className="border-red-700 text-red-400 hover:bg-red-900/30 text-xs"
                        data-testid={`button-delete-user-${user.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
