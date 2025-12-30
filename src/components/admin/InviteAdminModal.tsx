import { useState } from "react";
import { UserPlus, Loader2, Copy, Check, Mail, Link } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "@/hooks/use-toast";

interface InviteAdminModalProps {
  onInviteCreated?: () => void;
}

export function InviteAdminModal({ onInviteCreated }: InviteAdminModalProps) {
  const { user } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "moderator">("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateInviteToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  const handleCreateInvite = async () => {
    if (!email || !user) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = generateInviteToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      const { error } = await supabase
        .from("admin_invites")
        .insert({
          email,
          role,
          invite_token: token,
          expires_at: expiresAt.toISOString(),
          invited_by: user.id,
        });

      if (error) throw error;

      const link = `${window.location.origin}/admin/accept-invite?token=${token}`;
      setInviteLink(link);

      toast({
        title: "Invite Created",
        description: `Invite link generated for ${email}`,
      });

      onInviteCreated?.();
    } catch (err: any) {
      console.error("Error creating invite:", err);
      toast({
        title: "Failed to Create Invite",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied",
        description: "Invite link copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset state after modal closes
    setTimeout(() => {
      setEmail("");
      setRole("admin");
      setInviteLink(null);
      setCopied(false);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Administrator
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            Invite New Administrator
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Generate an invite link to add a new admin to the system.
          </DialogDescription>
        </DialogHeader>

        {!inviteLink ? (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email" className="text-slate-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="newadmin@cujammu.ac.in"
                  className="pl-10 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role" className="text-slate-300">
                Role
              </Label>
              <Select value={role} onValueChange={(v) => setRole(v as "admin" | "moderator")}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="admin" className="text-white hover:bg-slate-700">
                    Admin - Full access
                  </SelectItem>
                  <SelectItem value="moderator" className="text-white hover:bg-slate-700">
                    Moderator - Limited access
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateInvite}
                disabled={isLoading || !email}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Generate Invite"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Link className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">Invite Link Generated</span>
              </div>
              <p className="text-slate-400 text-xs mb-3">
                Share this link with <span className="text-white">{email}</span>. It expires in 7 days.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="bg-slate-900 border-slate-600 text-slate-300 text-xs"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="border-slate-600 hover:bg-slate-700 flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
