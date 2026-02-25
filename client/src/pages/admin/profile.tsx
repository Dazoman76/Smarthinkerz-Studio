import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { User, Lock, Eye, EyeOff, Save, Shield, Bell, Mail, Send } from "lucide-react";

export default function AdminProfile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (data: { username?: string; currentPassword: string; newPassword?: string }) => {
      const res = await apiRequest("PATCH", "/api/auth/profile", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Profile updated", description: "Your changes have been saved successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (data.username) setUsername(data.username);
    },
    onError: (err: any) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast({ title: "Current password required", description: "Please enter your current password to make changes.", variant: "destructive" });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "New password and confirmation must match.", variant: "destructive" });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast({ title: "Password too short", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    const data: any = { currentPassword };
    if (username !== user?.username) data.username = username;
    if (newPassword) data.newPassword = newPassword;

    if (!data.username && !data.newPassword) {
      toast({ title: "No changes", description: "Update your username or password to save.", variant: "destructive" });
      return;
    }

    updateMutation.mutate(data);
  };

  const notifQuery = useQuery<{ notificationEmail: string; notifyOnComplete: boolean }>({
    queryKey: ["/api/auth/notifications"],
  });

  const [notifEmail, setNotifEmail] = useState("");
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  useEffect(() => {
    if (notifQuery.data) {
      setNotifEmail(notifQuery.data.notificationEmail || "");
      setNotifyEnabled(notifQuery.data.notifyOnComplete);
    }
  }, [notifQuery.data]);

  const notifMutation = useMutation({
    mutationFn: async (data: { notificationEmail: string; notifyOnComplete: boolean }) => {
      const res = await apiRequest("PATCH", "/api/auth/notifications", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/notifications"] });
      toast({ title: "Notifications updated", description: "Your notification preferences have been saved." });
    },
    onError: (err: any) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/notifications/test", {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Test email sent", description: "Check your inbox for the test notification." });
    },
    onError: (err: any) => {
      toast({ title: "Test failed", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Update your account credentials and notification preferences</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Account Information
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
            <span>Role: <span className="capitalize text-slate-300">{user?.role}</span></span>
            <span>·</span>
            <span>Email: <span className="text-slate-300">{user?.email}</span></span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4" /> Username
              </Label>
              <Input
                data-testid="input-profile-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Change Password
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Current Password <span className="text-red-400">*</span></Label>
                  <div className="relative">
                    <Input
                      data-testid="input-current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      data-testid="button-toggle-current-password"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Required to verify your identity</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">New Password</Label>
                  <div className="relative">
                    <Input
                      data-testid="input-new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      data-testid="button-toggle-new-password"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Confirm New Password</Label>
                  <Input
                    data-testid="input-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-400">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                data-testid="button-save-profile"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Email Notifications
          </CardTitle>
          <p className="text-sm text-slate-400">
            Get notified by email when media generation completes
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-slate-300">Enable notifications</Label>
              <p className="text-xs text-slate-500">Receive an email when all images and videos finish generating</p>
            </div>
            <Switch
              checked={notifyEnabled}
              onCheckedChange={setNotifyEnabled}
              data-testid="switch-notify-on-complete"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Notification Email
            </Label>
            <Input
              data-testid="input-notification-email"
              type="email"
              value={notifEmail}
              onChange={(e) => setNotifEmail(e.target.value)}
              placeholder="Enter email for notifications"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={!notifyEnabled}
            />
            <p className="text-xs text-slate-500">
              This can be different from your account email
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
            <Button
              onClick={() => notifMutation.mutate({ notificationEmail: notifEmail, notifyOnComplete: notifyEnabled })}
              disabled={notifMutation.isPending}
              data-testid="button-save-notifications"
            >
              <Save className="w-4 h-4 mr-2" />
              {notifMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
            {notifyEnabled && notifEmail && (
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => testMutation.mutate()}
                disabled={testMutation.isPending}
                data-testid="button-test-notification"
              >
                <Send className="w-4 h-4 mr-2" />
                {testMutation.isPending ? "Sending..." : "Send Test Email"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
