import { useState } from "react";
import { Mail, Bell, CheckCircle, Loader2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

interface NotificationPreferencesProps {
  ghostIdentityId: string;
  currentEmail: string | null;
  onUpdate?: (email: string | null) => void;
}

const emailSchema = z.string().email("Please enter a valid email address");

export function NotificationPreferences({
  ghostIdentityId,
  currentEmail,
  onUpdate,
}: NotificationPreferencesProps) {
  const [email, setEmail] = useState(currentEmail || "");
  const [isEnabled, setIsEnabled] = useState(!!currentEmail);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (isEnabled && email) {
      const result = emailSchema.safeParse(email);
      if (!result.success) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("ghost_identities")
        .update({ notification_email: isEnabled ? email : null })
        .eq("id", ghostIdentityId);

      if (error) throw error;

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      
      onUpdate?.(isEnabled ? email : null);
      
      toast({
        title: isEnabled ? "Notifications Enabled" : "Notifications Disabled",
        description: isEnabled 
          ? "You will receive email updates about your case resolutions."
          : "You will no longer receive email notifications.",
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (!checked) {
      setEmail("");
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Email Notifications
              </p>
              <p className="text-xs text-muted-foreground">
                Receive updates when your cases are resolved
              </p>
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {isEnabled && (
          <div className="space-y-3 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="notification-email" className="text-sm">
                Notification Email
              </Label>
              <Input
                id="notification-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="h-10"
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <Shield className="w-3 h-3 mt-0.5 shrink-0" />
                Your email is stored securely and only used for case resolution notifications.
                Your anonymous identity remains protected.
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={isSaving || (isEnabled && !email)}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : isSaved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
