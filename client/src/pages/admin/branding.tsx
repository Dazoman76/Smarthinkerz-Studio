import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Palette, Upload, Image, Eye, Save, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type BrandingData = {
  logoPath: string | null;
  logoPosition: string;
  logoOpacity: number;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: string;
  overlayEnabled: boolean;
  overlayColor: string;
  overlayOpacity: number;
};

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Georgia", label: "Georgia" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Roboto", label: "Roboto" },
  { value: "Montserrat", label: "Montserrat" },
];

const positionOptions = [
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "center", label: "Center" },
];

const defaults: BrandingData = {
  logoPath: null,
  logoPosition: "bottom-right",
  logoOpacity: 80,
  primaryColor: "#0ea5e9",
  secondaryColor: "#1e293b",
  textColor: "#ffffff",
  fontFamily: "Inter",
  overlayEnabled: false,
  overlayColor: "#000000",
  overlayOpacity: 30,
};

export default function AdminBranding() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<BrandingData>(defaults);

  const { data: branding, isLoading } = useQuery<BrandingData>({
    queryKey: ["/api/branding"],
  });

  useEffect(() => {
    if (branding) setSettings(branding);
  }, [branding]);

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", "/api/branding", settings),
    onSuccess: () => {
      toast({ title: "Branding saved", description: "Your branding settings have been updated." });
      queryClient.invalidateQueries({ queryKey: ["/api/branding"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await fetch("/api/branding/logo", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: (data) => {
      setSettings(prev => ({ ...prev, logoPath: data.logoPath }));
      toast({ title: "Logo uploaded", description: "Your brand logo has been saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/branding"] });
    },
    onError: (err: any) => {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    },
  });

  const update = (key: keyof BrandingData, value: any) => setSettings(prev => ({ ...prev, [key]: value }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const logoPositionStyle = (() => {
    switch (settings.logoPosition) {
      case "top-left": return { top: 12, left: 12 };
      case "top-right": return { top: 12, right: 12 };
      case "bottom-left": return { bottom: 12, left: 12 };
      case "bottom-right": return { bottom: 12, right: 12 };
      default: return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-branding-title">Branding Options</h1>
          <p className="text-muted-foreground text-sm mt-1">Customize how your generated media looks with your brand identity.</p>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-branding">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Brand Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted/50"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-logo"
                >
                  {settings.logoPath ? (
                    <img src={settings.logoPath} alt="Brand logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <Image className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogoMutation.mutate(f); }} data-testid="input-logo-file" />
                  <p className="text-xs text-muted-foreground">Upload your logo (PNG, SVG recommended). It will be overlaid on generated images and videos.</p>
                  {uploadLogoMutation.isPending && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Logo Position</Label>
                <Select value={settings.logoPosition} onValueChange={(v) => update("logoPosition", v)}>
                  <SelectTrigger data-testid="select-logo-position"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {positionOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Logo Opacity</Label>
                  <span className="text-xs text-muted-foreground">{settings.logoOpacity}%</span>
                </div>
                <Slider value={[settings.logoOpacity]} onValueChange={([v]) => update("logoOpacity", v)} min={10} max={100} step={5} data-testid="slider-logo-opacity" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {([["primaryColor", "Primary"], ["secondaryColor", "Secondary"], ["textColor", "Text"]] as const).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm">{label}</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={settings[key]} onChange={(e) => update(key, e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" data-testid={`input-${key}`} />
                      <Input value={settings[key]} onChange={(e) => update(key, e.target.value)} className="text-xs font-mono" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-sm">Font Family</Label>
                <Select value={settings.fontFamily} onValueChange={(v) => update("fontFamily", v)}>
                  <SelectTrigger data-testid="select-font-family"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Overlay Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Enable Color Overlay</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Adds a semi-transparent color overlay to generated images</p>
                </div>
                <Switch checked={settings.overlayEnabled} onCheckedChange={(v) => update("overlayEnabled", v)} data-testid="switch-overlay-enabled" />
              </div>
              {settings.overlayEnabled && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm">Overlay Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={settings.overlayColor} onChange={(e) => update("overlayColor", e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" data-testid="input-overlay-color" />
                      <Input value={settings.overlayColor} onChange={(e) => update("overlayColor", e.target.value)} className="text-xs font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Overlay Opacity</Label>
                      <span className="text-xs text-muted-foreground">{settings.overlayOpacity}%</span>
                    </div>
                    <Slider value={[settings.overlayOpacity]} onValueChange={([v]) => update("overlayOpacity", v)} min={5} max={80} step={5} data-testid="slider-overlay-opacity" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border" style={{ backgroundColor: settings.secondaryColor }} data-testid="branding-preview">
                <img src="/generated/images/day_1.png" alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                {settings.overlayEnabled && (
                  <div className="absolute inset-0" style={{ backgroundColor: settings.overlayColor, opacity: settings.overlayOpacity / 100 }} />
                )}
                <div className="absolute px-4 py-3" style={{ ...logoPositionStyle }}>
                  {settings.logoPath ? (
                    <img src={settings.logoPath} alt="Logo" className="h-10 w-auto" style={{ opacity: settings.logoOpacity / 100 }} />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: settings.primaryColor, opacity: settings.logoOpacity / 100 }}>
                      <Palette className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">Your Logo</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">Preview shows how branding will appear on generated media.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Professional", primary: "#0ea5e9", secondary: "#0f172a", text: "#ffffff", overlay: false, colors: ["bg-sky-500", "bg-slate-900", "bg-white border"] },
                  { name: "Warm", primary: "#f97316", secondary: "#1c1917", text: "#fef3c7", overlay: false, colors: ["bg-orange-500", "bg-stone-900", "bg-amber-100"] },
                  { name: "Nature", primary: "#10b981", secondary: "#064e3b", text: "#ecfdf5", overlay: false, colors: ["bg-emerald-500", "bg-emerald-900", "bg-emerald-50"] },
                  { name: "Creative", primary: "#8b5cf6", secondary: "#1e1b4b", text: "#ede9fe", overlay: true, colors: ["bg-violet-500", "bg-indigo-950", "bg-violet-50"] },
                ].map(preset => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="h-auto py-3 flex-col gap-1"
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      primaryColor: preset.primary,
                      secondaryColor: preset.secondary,
                      textColor: preset.text,
                      overlayEnabled: preset.overlay,
                      ...(preset.overlay ? { overlayColor: preset.secondary, overlayOpacity: 20 } : {}),
                    }))}
                    data-testid={`button-preset-${preset.name.toLowerCase()}`}
                  >
                    <div className="flex gap-1">
                      {preset.colors.map((c, i) => <div key={i} className={`w-4 h-4 rounded-full ${c}`} />)}
                    </div>
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
