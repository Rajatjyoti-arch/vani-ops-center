import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Database, Clock, Mail } from "lucide-react";
import { CUJLogo } from "@/components/ui/CUJLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CUJLogo size={40} className="text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Central University of Jammu
                </h1>
                <p className="text-xs text-muted-foreground">VANI System</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Our Commitment to Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                The Central University of Jammu ("University," "we," "us," or "our") is committed to 
                protecting the privacy and security of all users of the VANI (Verifiable Anonymous 
                Network Intelligence) system. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Anonymous Credentialing
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                VANI uses cryptographic hashing (SHA-256) to create anonymous credentials. Your 
                institutional ID is transformed into an irreversible hash, ensuring:
              </p>
              <ul>
                <li>Your real identity cannot be recovered from the hash</li>
                <li>Reports and submissions remain anonymous</li>
                <li>Only you can authenticate with your original credentials</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p><strong>Anonymous Users:</strong></p>
              <ul>
                <li>Cryptographic hash of institutional ID</li>
                <li>Generated ghost name and avatar</li>
                <li>Report submissions and evidence files</li>
                <li>Reputation scores based on activity</li>
              </ul>
              <p><strong>Administrative Users:</strong></p>
              <ul>
                <li>Email address for authentication</li>
                <li>Activity logs for security auditing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                How We Use Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <ul>
                <li>To process and resolve grievance reports</li>
                <li>To maintain system security and prevent abuse</li>
                <li>To generate anonymized analytics and transparency metrics</li>
                <li>To send resolution notifications (if email provided voluntarily)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                Anonymous credentials and associated data are retained for the duration necessary 
                to fulfill the purposes outlined in this policy. Users may request deletion of 
                their anonymous identity through the system's secure channels.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                For questions about this Privacy Policy or data protection practices, contact:
              </p>
              <p>
                <strong>Data Protection Officer</strong><br />
                Central University of Jammu<br />
                Rahya-Suchani (Bagla), District Samba - 181143<br />
                Email: privacy@cujammu.ac.in
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
