import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
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
  Users,
  Crown,
  Pencil,
  Eye,
  FileText,
  Shield,
  Mail,
  Ban,
  CheckCircle,
} from "lucide-react";

interface TeamMember {
  id: number;
  username: string;
  email: string;
  role: string;
  userType: string;
  status: string;
  createdAt: string;
}

const roleInfo: Record<string, { label: string; description: string; icon: any; color: string; badgeColor: string }> = {
  administrator: { label: "Administrator", description: "Full access to all features and settings", icon: Crown, color: "bg-red-600", badgeColor: "border-red-500 text-red-400" },
  editor: { label: "Editor", description: "Can manage blog posts and edit all content", icon: Pencil, color: "bg-blue-600", badgeColor: "border-blue-500 text-blue-400" },
  writer: { label: "Writer", description: "Can create and edit own blog posts", icon: FileText, color: "bg-green-600", badgeColor: "border-green-500 text-green-400" },
  viewer: { label: "Viewer", description: "Read-only access to the dashboard", icon: Eye, color: "bg-slate-600", badgeColor: "border-slate-500 text-slate-400" },
};

export default function AdminTeam() {
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ username: "", email: "", password: "", role: "writer" });

  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/admin/team"],
  });

  const addMemberMutation = useMutation({
    mutationFn: async (userData: typeof newMember) => {
      const res = await apiRequest("POST", "/api/admin/users", {
        ...userData,
        userType: "team",
        subscription: "free",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setShowAdd(false);
      setNewMember({ username: "", email: "", password: "", role: "writer" });
      toast({ title: "Team member added" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({ title: "Team member updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({ title: "Team member removed" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Team Management</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 bg-slate-700" />
        ))}
      </div>
    );
  }

  const members = teamMembers || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 mt-1">Manage your internal team members and assign roles</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-team-member">
              <Plus className="w-4 h-4 mr-2" /> Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Team Member</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMemberMutation.mutate(newMember);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-slate-300">Username</Label>
                <Input
                  data-testid="input-team-username"
                  value={newMember.username}
                  onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input
                  data-testid="input-team-email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Password</Label>
                <Input
                  data-testid="input-team-password"
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Role</Label>
                <Select value={newMember.role} onValueChange={(v) => setNewMember({ ...newMember, role: v })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-team-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                    <SelectItem value="writer">Writer - Can create blog posts</SelectItem>
                    <SelectItem value="editor">Editor - Can manage all content</SelectItem>
                    <SelectItem value="administrator">Administrator - Full access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={addMemberMutation.isPending} data-testid="button-submit-team">
                {addMemberMutation.isPending ? "Adding..." : "Add Team Member"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(roleInfo).map(([role, info]) => {
          const count = members.filter(m => m.role === role).length;
          return (
            <Card key={role} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${info.color}`}>
                    <info.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{info.label}</p>
                    <p className="text-xs text-slate-400">{count} member{count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{info.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        {members.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">No team members yet. Add your first team member above.</p>
            </CardContent>
          </Card>
        ) : (
          members.map((member) => {
            const info = roleInfo[member.role] || roleInfo.viewer;
            const RoleIcon = info.icon;

            return (
              <Card key={member.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors" data-testid={`card-team-${member.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${info.color}`}>
                      <RoleIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-lg">{member.username}</p>
                        <Badge variant={member.status === "active" ? "default" : "destructive"} className="text-xs">
                          {member.status === "active" ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><Ban className="w-3 h-3 mr-1" /> Blocked</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {member.email}
                        </span>
                        <Badge variant="outline" className={`text-xs ${info.badgeColor}`}>
                          <RoleIcon className="w-3 h-3 mr-1" /> {info.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Joined {new Date(member.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      <Select
                        value={member.role}
                        onValueChange={(role) => updateMemberMutation.mutate({ id: member.id, data: { role } })}
                      >
                        <SelectTrigger className="w-[160px] bg-slate-700 border-slate-600 text-white text-xs" data-testid={`select-member-role-${member.id}`}>
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
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateMemberMutation.mutate({
                            id: member.id,
                            data: { status: member.status === "active" ? "blocked" : "active" },
                          })
                        }
                        className={member.status === "active"
                          ? "border-amber-700 text-amber-400 hover:bg-amber-900/30 text-xs"
                          : "border-green-700 text-green-400 hover:bg-green-900/30 text-xs"
                        }
                        data-testid={`button-toggle-team-${member.id}`}
                      >
                        {member.status === "active" ? (
                          <><Ban className="w-3.5 h-3.5 mr-1" /> Block</>
                        ) : (
                          <><CheckCircle className="w-3.5 h-3.5 mr-1" /> Unblock</>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Remove "${member.username}" from the team?`)) {
                            deleteMemberMutation.mutate(member.id);
                          }
                        }}
                        className="border-red-700 text-red-400 hover:bg-red-900/30 text-xs"
                        data-testid={`button-remove-team-${member.id}`}
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
