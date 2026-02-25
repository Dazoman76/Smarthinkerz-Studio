import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Crown, Pencil, Eye, FileText } from "lucide-react";

interface TeamMember {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const roleDescriptions: Record<string, { label: string; description: string; icon: any; color: string }> = {
  administrator: { label: "Administrator", description: "Full access to all features", icon: Crown, color: "bg-red-600 text-red-100" },
  editor: { label: "Editor", description: "Can manage blog posts and content", icon: Pencil, color: "bg-blue-600 text-blue-100" },
  writer: { label: "Writer", description: "Can create and edit own blog posts", icon: FileText, color: "bg-green-600 text-green-100" },
  viewer: { label: "Viewer", description: "Read-only access to dashboard", icon: Eye, color: "bg-slate-600 text-slate-100" },
};

export default function AdminTeam() {
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated" });
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

  const teamMembers = users?.filter((u) => u.role !== "viewer") || [];
  const viewers = users?.filter((u) => u.role === "viewer") || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Management</h1>
        <p className="text-slate-400 mt-1">Manage team roles and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(roleDescriptions).map(([role, info]) => {
          const count = users?.filter((u) => u.role === role).length || 0;
          return (
            <Card key={role} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${info.color}`}>
                    <info.icon className="w-4 h-4" />
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

      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" /> Team Members
        </h2>
        <div className="space-y-3">
          {teamMembers.map((member) => {
            const roleInfo = roleDescriptions[member.role];
            return (
              <Card key={member.id} className="bg-slate-800 border-slate-700" data-testid={`card-team-${member.id}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleInfo?.color || "bg-slate-600"}`}>
                      {roleInfo?.icon && <roleInfo.icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.username}</p>
                      <p className="text-sm text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={member.role}
                      onValueChange={(role) => updateRoleMutation.mutate({ id: member.id, role })}
                    >
                      <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white" data-testid={`select-team-role-${member.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="writer">Writer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="administrator">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant={member.status === "active" ? "default" : "destructive"}>
                      {member.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {teamMembers.length === 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No team members yet. Promote viewers from the Users page.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {viewers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Viewers ({viewers.length})</h2>
          <div className="space-y-2">
            {viewers.map((viewer) => (
              <Card key={viewer.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">{viewer.username}</p>
                    <p className="text-xs text-slate-400">{viewer.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => updateRoleMutation.mutate({ id: viewer.id, role: "writer" })}
                    data-testid={`button-promote-${viewer.id}`}
                  >
                    Promote to Writer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
