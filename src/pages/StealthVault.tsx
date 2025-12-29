import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Upload, File, Image, FileText, Lock, Clock, Trash2 } from "lucide-react";

interface VaultFile {
  id: string;
  name: string;
  type: "image" | "document" | "video" | "other";
  size: string;
  uploadedAt: string;
  expiresAt?: string;
  linkedReport?: string;
}

const mockFiles: VaultFile[] = [
  { id: "1", name: "evidence_photo_001.jpg", type: "image", size: "2.4 MB", uploadedAt: "2024-01-22", linkedReport: "RPT-247" },
  { id: "2", name: "incident_report.pdf", type: "document", size: "156 KB", uploadedAt: "2024-01-21", expiresAt: "2024-02-21" },
  { id: "3", name: "security_footage.mp4", type: "video", size: "45.2 MB", uploadedAt: "2024-01-20", linkedReport: "RPT-243" },
  { id: "4", name: "witness_statement.pdf", type: "document", size: "89 KB", uploadedAt: "2024-01-18" },
];

const typeIcons = {
  image: Image,
  document: FileText,
  video: File,
  other: File,
};

const StealthVault = () => {
  const [files, setFiles] = useState(mockFiles);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Mock file upload
    const newFile: VaultFile = {
      id: Date.now().toString(),
      name: "new_evidence_file.jpg",
      type: "image",
      size: "1.2 MB",
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    setFiles([newFile, ...files]);
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-7 h-7 text-primary" />
              Stealth Vault
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Secure encrypted storage for evidence and documents
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <Card
          className={`
            border-2 border-dashed transition-all duration-300 cursor-pointer
            ${dragOver ? "border-primary bg-primary/5 cyber-glow" : "border-border/50 bg-card/50"}
          `}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <CardContent className="py-12 flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drop files here to upload
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              End-to-end encrypted • Auto-expiring links available
            </p>
            <Button className="cyber-button bg-primary text-primary-foreground">
              <Upload className="w-4 h-4 mr-2" />
              Select Files
            </Button>
          </CardContent>
        </Card>

        {/* Vault Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card/80 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{files.length}</p>
                <p className="text-xs text-muted-foreground">Total Files</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-safe/10">
                <Lock className="w-5 h-5 text-status-safe" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">256-bit</p>
                <p className="text-xs text-muted-foreground">Encryption</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <Clock className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">1</p>
                <p className="text-xs text-muted-foreground">Expiring Soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files List */}
        <Card className="bg-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Vault Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => {
                const Icon = typeIcons[file.type];
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-secondary">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>Uploaded {file.uploadedAt}</span>
                        {file.linkedReport && (
                          <>
                            <span>•</span>
                            <span className="text-primary">{file.linkedReport}</span>
                          </>
                        )}
                        {file.expiresAt && (
                          <>
                            <span>•</span>
                            <span className="text-status-warning">Expires {file.expiresAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => deleteFile(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StealthVault;
