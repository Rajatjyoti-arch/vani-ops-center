import { Link } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle, Globe, FileText, UserX, Download } from "lucide-react";
import { CUJLogo } from "@/components/ui/CUJLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GDPRCompliance = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">GDPR Compliance</h1>
          <p className="text-muted-foreground">
            Our commitment to data protection and privacy regulations
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                GDPR Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                The General Data Protection Regulation (GDPR) is a comprehensive data protection 
                law that governs how organizations collect, store, and process personal data. 
                The VANI system is designed with privacy-by-design principles to ensure compliance 
                with GDPR and similar data protection frameworks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Lawful Basis for Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>We process personal data under the following lawful bases:</p>
              <ul>
                <li><strong>Legitimate Interest:</strong> Maintaining institutional governance and transparency</li>
                <li><strong>Consent:</strong> When users voluntarily provide notification emails</li>
                <li><strong>Legal Obligation:</strong> Compliance with educational institution requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Your Rights Under GDPR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-1">Right to Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Request a copy of your personal data
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-1">Right to Rectification</h4>
                  <p className="text-sm text-muted-foreground">
                    Correct inaccurate personal data
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-1">Right to Erasure</h4>
                  <p className="text-sm text-muted-foreground">
                    Request deletion of your data
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-1">Right to Portability</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive your data in a portable format
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-primary" />
                Data Minimization
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                VANI implements data minimization principles:
              </p>
              <ul>
                <li>We collect only data necessary for the grievance resolution process</li>
                <li>Anonymous credentials replace personally identifiable information</li>
                <li>Email addresses are optional and collected only for notifications</li>
                <li>Automatic data deletion when no longer needed</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Exercising Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                To exercise any of your GDPR rights, please submit a request to:
              </p>
              <p>
                <strong>Data Protection Officer</strong><br />
                Central University of Jammu<br />
                Email: dpo@cujammu.ac.in<br />
                <br />
                We will respond to your request within 30 days as required by GDPR.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                International Transfers
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                Data processed by VANI is stored within secure infrastructure with appropriate 
                safeguards. Any international transfers comply with GDPR requirements, including 
                Standard Contractual Clauses where applicable.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GDPRCompliance;
