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
import { Plus, Trash2, Shield, UserCheck, UserX, Pencil } from "lucide-react";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated" });
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
      toast({ title: "User deleted" });
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
          <p className="text-slate-400 mt-1">{users?.length || 0} users total</p>
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
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
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

      <div className="space-y-3">
        {users?.map((user) => (
          <Card key={user.id} className="bg-slate-800 border-slate-700" data-testid={`card-user-${user.id}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleColors[user.role] || "bg-slate-600"}`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium" data-testid={`text-username-${user.id}`}>{user.username}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`capitalize ${user.role === "administrator" ? "border-red-500 text-red-400" : "border-slate-500 text-slate-300"}`}>
                  {user.role}
                </Badge>
                <Badge variant={user.status === "active" ? "default" : "destructive"}>
                  {user.status}
                </Badge>
                <Select
                  value={user.role}
                  onValueChange={(role) => updateUserMutation.mutate({ id: user.id, data: { role } })}
                >
                  <SelectTrigger className="w-[130px] bg-slate-700 border-slate-600 text-white text-xs" data-testid={`select-role-${user.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    updateUserMutation.mutate({
                      id: user.id,
                      data: { status: user.status === "active" ? "blocked" : "active" },
                    })
                  }
                  data-testid={`button-toggle-status-${user.id}`}
                >
                  {user.status === "active" ? (
                    <UserX className="w-4 h-4 text-amber-400" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-green-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm("Delete this user?")) deleteUserMutation.mutate(user.id);
                  }}
                  data-testid={`button-delete-user-${user.id}`}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
