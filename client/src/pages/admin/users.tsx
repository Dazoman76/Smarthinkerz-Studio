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
  Search,
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  Ban,
  CheckCircle,
  Mail,
  Crown,
  Star,
  Zap,
  User,
} from "lucide-react";

interface ClientUser {
  id: number;
  username: string;
  email: string;
  role: string;
  userType: string;
  subscription: string;
  status: string;
  createdAt: string;
}

const SUBSCRIPTIONS = ["free", "basic", "advanced", "premium"] as const;
const SUB_HIERARCHY: Record<string, number> = { free: 0, basic: 1, advanced: 2, premium: 3 };

const subColors: Record<string, string> = {
  free: "bg-slate-600",
  basic: "bg-blue-600",
  advanced: "bg-purple-600",
  premium: "bg-amber-500",
};

const subIcons: Record<string, any> = {
  free: User,
  basic: Zap,
  advanced: Star,
  premium: Crown,
};

const subLabels: Record<string, string> = {
  free: "Free",
  basic: "Basic",
  advanced: "Advanced",
  premium: "Premium",
};

export default function AdminClients() {
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSub, setFilterSub] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", subscription: "free" });

  const { data: clients, isLoading } = useQuery<ClientUser[]>({
    queryKey: ["/api/admin/clients"],
  });

  const addClientMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const res = await apiRequest("POST", "/api/admin/users", {
        ...userData,
        role: "viewer",
        userType: "client",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setShowAdd(false);
      setNewUser({ username: "", email: "", password: "", subscription: "free" });
      toast({ title: "Client added successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      const action = variables.data.status
        ? (variables.data.status === "blocked" ? "blocked" : "unblocked")
        : variables.data.subscription
          ? "subscription updated"
          : "updated";
      toast({ title: `Client ${action}` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({ title: "Client removed" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const filteredClients = clients?.filter((c) => {
    const matchSearch = searchQuery === "" ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSub = filterSub === "all" || c.subscription === filterSub;
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchSub && matchStatus;
  }) || [];

  const stats = {
    total: clients?.length || 0,
    free: clients?.filter(c => c.subscription === "free").length || 0,
    basic: clients?.filter(c => c.subscription === "basic").length || 0,
    advanced: clients?.filter(c => c.subscription === "advanced").length || 0,
    premium: clients?.filter(c => c.subscription === "premium").length || 0,
    active: clients?.filter(c => c.status === "active").length || 0,
    blocked: clients?.filter(c => c.status === "blocked").length || 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Client Management</h1>
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
          <h1 className="text-2xl font-bold text-white">Client Management</h1>
          <p className="text-slate-400 mt-1">Manage app users, subscriptions, and access</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-client">
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Client</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addClientMutation.mutate(newUser);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-slate-300">Username</Label>
                <Input
                  data-testid="input-new-client-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input
                  data-testid="input-new-client-email"
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
                  data-testid="input-new-client-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Subscription Tier</Label>
                <Select value={newUser.subscription} onValueChange={(v) => setNewUser({ ...newUser, subscription: v })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-new-client-sub">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={addClientMutation.isPending} data-testid="button-submit-client">
                {addClientMutation.isPending ? "Adding..." : "Add Client"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["free", "basic", "advanced", "premium"] as const).map((tier) => {
          const Icon = subIcons[tier];
          return (
            <Card key={tier} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${subColors[tier]}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats[tier]}</p>
                    <p className="text-xs text-slate-400 capitalize">{tier}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            data-testid="input-search-clients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or email..."
            className="bg-slate-700 border-slate-600 text-white pl-10"
          />
        </div>
        <Select value={filterSub} onValueChange={setFilterSub}>
          <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white" data-testid="select-filter-sub">
            <SelectValue placeholder="Subscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white" data-testid="select-filter-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">
                {clients?.length === 0 ? "No clients yet. Add your first client above." : "No clients match your filters."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => {
            const SubIcon = subIcons[client.subscription] || User;
            const currentLevel = SUB_HIERARCHY[client.subscription] ?? 0;
            const canUpgrade = currentLevel < 3;
            const canDowngrade = currentLevel > 0;
            const nextUp = canUpgrade ? SUBSCRIPTIONS[currentLevel + 1] : null;
            const nextDown = canDowngrade ? SUBSCRIPTIONS[currentLevel - 1] : null;

            return (
              <Card key={client.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors" data-testid={`card-client-${client.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${subColors[client.subscription] || "bg-slate-600"}`}>
                      <SubIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-lg" data-testid={`text-client-name-${client.id}`}>{client.username}</p>
                        <Badge variant={client.status === "active" ? "default" : "destructive"} className="text-xs">
                          {client.status === "active" ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><Ban className="w-3 h-3 mr-1" /> Blocked</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {client.email}
                        </span>
                        <Badge variant="outline" className={`capitalize text-xs border-slate-500 text-slate-300`}>
                          <SubIcon className="w-3 h-3 mr-1" /> {subLabels[client.subscription] || client.subscription} Plan
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Joined {new Date(client.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      {canUpgrade && nextUp && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateClientMutation.mutate({ id: client.id, data: { subscription: nextUp } })}
                          className="border-green-700 text-green-400 hover:bg-green-900/30 text-xs"
                          title={`Upgrade to ${subLabels[nextUp]}`}
                          data-testid={`button-upgrade-client-${client.id}`}
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
                          Upgrade to {subLabels[nextUp]}
                        </Button>
                      )}

                      {canDowngrade && nextDown && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateClientMutation.mutate({ id: client.id, data: { subscription: nextDown } })}
                          className="border-amber-700 text-amber-400 hover:bg-amber-900/30 text-xs"
                          title={`Downgrade to ${subLabels[nextDown]}`}
                          data-testid={`button-downgrade-client-${client.id}`}
                        >
                          <ArrowDownCircle className="w-3.5 h-3.5 mr-1" />
                          Downgrade
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateClientMutation.mutate({
                            id: client.id,
                            data: { status: client.status === "active" ? "blocked" : "active" },
                          })
                        }
                        className={client.status === "active"
                          ? "border-amber-700 text-amber-400 hover:bg-amber-900/30 text-xs"
                          : "border-green-700 text-green-400 hover:bg-green-900/30 text-xs"
                        }
                        data-testid={`button-toggle-client-${client.id}`}
                      >
                        {client.status === "active" ? (
                          <><Ban className="w-3.5 h-3.5 mr-1" /> Block</>
                        ) : (
                          <><CheckCircle className="w-3.5 h-3.5 mr-1" /> Unblock</>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Remove client "${client.username}"? This cannot be undone.`)) {
                            deleteClientMutation.mutate(client.id);
                          }
                        }}
                        className="border-red-700 text-red-400 hover:bg-red-900/30 text-xs"
                        data-testid={`button-delete-client-${client.id}`}
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
