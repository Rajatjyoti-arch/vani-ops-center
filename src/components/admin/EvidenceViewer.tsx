import { useState, useEffect } from "react";
import { FileText, Image, File, Download, ExternalLink, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface VaultFile {
  id: string;
  file_name: string;
  file_type: string;
  file_size: string | null;
  file_path: string;
  created_at: string;
  secret_metadata: string | null;
}

interface EvidenceViewerProps {
  vaultFileId: string | null;
}

export function EvidenceViewer({ vaultFileId }: EvidenceViewerProps) {
  const [file, setFile] = useState<VaultFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (vaultFileId) {
      fetchEvidence();
    } else {
      setIsLoading(false);
    }
  }, [vaultFileId]);

  const fetchEvidence = async () => {
    if (!vaultFileId) return;
    
    try {
      const { data, error } = await supabase
        .from("stealth_vault")
        .select("*")
        .eq("id", vaultFileId)
        .single();

      if (error) throw error;
      setFile(data);
    } catch (err) {
      console.error("Error fetching evidence:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type === "application/pdf") return FileText;
    return File;
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700 h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!vaultFileId || !file) {
    return (
      <Card className="bg-slate-800 border-slate-700 h-full">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            Encrypted Evidence Repository
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48 text-center">
          <Lock className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-slate-400 text-sm">No evidence attached to this resolution</p>
          <p className="text-slate-500 text-xs mt-1">
            Evidence files are end-to-end encrypted
          </p>
        </CardContent>
      </Card>
    );
  }

  const FileIcon = getFileIcon(file.file_type);

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader>
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          Encrypted Evidence Repository
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Preview */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {file.file_name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {file.file_type} • {file.file_size || "Unknown size"}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Uploaded: {new Date(file.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Encryption Status */}
        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">End-to-End Encrypted</span>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
            AES-256
          </Badge>
        </div>

        {/* Metadata */}
        {file.secret_metadata && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-medium">Hidden Metadata</p>
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-300 font-mono break-all">
                {file.secret_metadata}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Full View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
