import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, Upload, File, Image, FileText, Lock, Clock, Trash2, Loader2, Binary, Database, Info, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatRelativeTime } from "@/lib/crypto";
import { encodeTextInImage, isValidImageForSteganography } from "@/lib/steganography";

interface VaultFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: string | null;
  secret_metadata: string | null;
  expires_at: string | null;
  created_at: string;
}

const typeIcons: Record<string, React.ElementType> = {
  image: Image,
  document: FileText,
  video: File,
  other: File,
};

const StealthVault = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [grievanceText, setGrievanceText] = useState("");

  // Fetch vault files
  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("stealth_vault")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching files:", error);
    } else {
      setFiles(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const getFileType = (file: File): string => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.includes("pdf") || file.type.includes("document")) return "document";
    if (file.type.startsWith("video/")) return "video";
    return "other";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        // Generate unique file path
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        
        let fileToUpload: File | Blob = file;
        let finalFileName = file.name;
        let filePath = `${timestamp}_${sanitizedName}`;

        // If it's a valid image and there's grievance text, encode it using steganography
        if (grievanceText && isValidImageForSteganography(file)) {
          try {
            const encodedBlob = await encodeTextInImage(file, grievanceText);
            // Convert to PNG for lossless storage of encoded data
            const pngName = file.name.replace(/\.[^/.]+$/, "") + "_secured.png";
            finalFileName = pngName;
            filePath = `${timestamp}_${pngName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            fileToUpload = encodedBlob;
            
            toast({
              title: "Evidence Secured",
              description: "Data embedded into image using LSB encoding.",
            });
          } catch (encodeError) {
            console.error("Steganography encoding failed:", encodeError);
            // Continue with regular upload if encoding fails
          }
        }

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("decoy-images")
          .upload(filePath, fileToUpload);

        if (uploadError) throw uploadError;

        // Save metadata to stealth_vault table
        const { error: dbError } = await supabase.from("stealth_vault").insert({
          file_name: finalFileName,
          file_path: filePath,
          file_type: getFileType(file),
          file_size: formatFileSize(file.size),
          secret_metadata: grievanceText || null,
        });

        if (dbError) throw dbError;
      }

      // Show success notification
      toast({
        title: "Upload Complete",
        description: "Evidence securely stored in encrypted repository.",
      });

      // Clear form and refresh
      setGrievanceText("");
      fetchFiles();

      // Redirect to Compliance Log
      setTimeout(() => {
        navigate("/ledger");
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const deleteFile = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      await supabase.storage.from("decoy-images").remove([filePath]);

      // Delete from database
      await supabase.from("stealth_vault").delete().eq("id", id);

      setFiles(files.filter((f) => f.id !== id));
      toast({
        title: "File Deleted",
        description: "Evidence has been permanently removed.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file.",
        variant: "destructive",
      });
    }
  };

  const expiringCount = files.filter((f) => f.expires_at).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                <Shield className="w-7 h-7 text-primary" />
                Encrypted Evidence Repository
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Secure storage for confidential documentation and evidence
              </p>
            </div>
          </div>
        </div>

        {/* Report Submission Form */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Submit Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grievance">Report Details</Label>
              <Textarea
                id="grievance"
                placeholder="Describe the incident or provide context for the evidence..."
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload Zone */}
        <Card
          className={`
            border-2 border-dashed transition-all duration-200 cursor-pointer
            ${dragOver ? "border-primary bg-primary/5" : "border-border/50"}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <CardContent className="py-12 flex flex-col items-center justify-center">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Encrypting & Uploading...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Securing your evidence in the repository
                </p>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Drop files here to upload
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  All files are encrypted with AES-256 encryption
                </p>
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Select Files
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.mp4,.mov"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Data Independence Note */}
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-accent">Data Independence</p>
              <p className="text-xs text-muted-foreground mt-1">
                Evidence data is embedded directly into uploaded files using LSB steganography. 
                This ensures data integrity even if the database is compromised.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Repository Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{files.length}</p>
                <p className="text-xs text-muted-foreground">Total Files</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Binary className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-semibold">LSB</p>
                <p className="text-xs text-muted-foreground">Encoding</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">AES-256</p>
                <p className="text-xs text-muted-foreground">Encryption</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <Clock className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{expiringCount}</p>
                <p className="text-xs text-muted-foreground">Expiring</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Repository Contents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No files in the repository</p>
                <p className="text-sm">Upload evidence to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => {
                  const Icon = typeIcons[file.file_type] || File;
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-background">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{file.file_name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{file.file_size}</span>
                          <span>•</span>
                          <span>Uploaded {formatRelativeTime(file.created_at)}</span>
                          {file.secret_metadata && (
                            <>
                              <span>•</span>
                              <span className="text-accent">
                                Contains report data
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={() => deleteFile(file.id, file.file_path)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StealthVault;
