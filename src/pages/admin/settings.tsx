import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Settings as SettingsIcon, Globe } from "lucide-react";

const settingsFields = [
  { key: "hero_title", label: "Hero Title", type: "text", placeholder: "Transform Your Content Into Stunning Visuals" },
  { key: "hero_tagline", label: "Hero Tagline", type: "text", placeholder: "Smart thinking, stunning media" },
  { key: "about_text", label: "About Text", type: "textarea", placeholder: "Brief description about Smarthinkerz Studio..." },
  { key: "cta_title", label: "CTA Section Title", type: "text", placeholder: "Ready to Transform Your Content?" },
  { key: "cta_description", label: "CTA Description", type: "textarea", placeholder: "Call-to-action description text..." },
  { key: "contact_email", label: "Contact Email", type: "text", placeholder: "hello@smarthinkerz.com" },
  { key: "footer_text", label: "Footer Text", type: "text", placeholder: "Smart thinking, stunning media" },
];

export default function AdminSettings() {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settings) setValues(settings);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      await apiRequest("PATCH", "/api/admin/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Settings saved successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 bg-slate-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" /> Site Settings
          </h1>
          <p className="text-slate-400 mt-1">Configure front page content and site information</p>
        </div>
        <Button
          onClick={() => saveMutation.mutate(values)}
          disabled={saveMutation.isPending}
          data-testid="button-save-settings"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" /> Front Page Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {settingsFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-slate-300">{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  data-testid={`input-setting-${field.key}`}
                  value={values[field.key] || ""}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="bg-slate-700 border-slate-600 text-white resize-none"
                  rows={3}
                />
              ) : (
                <Input
                  data-testid={`input-setting-${field.key}`}
                  value={values[field.key] || ""}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
