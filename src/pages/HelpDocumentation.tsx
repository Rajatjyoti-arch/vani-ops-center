import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Shield, 
  UserCheck, 
  Scale, 
  FileText, 
  HelpCircle, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HelpDocumentation = () => {
  const navigate = useNavigate();
  const sections = [
    {
      title: "Getting Started",
      icon: BookOpen,
      items: [
        {
          title: "Platform Overview",
          description: "VANI (Verifiable Anonymous Network Intelligence) is an institutional governance platform designed for secure, anonymous reporting and transparent resolution of concerns within the university community."
        },
        {
          title: "Core Principles",
          description: "The platform operates on three foundational principles: Data Integrity, Institutional Transparency, and Policy Compliance. All interactions are governed by these standards."
        }
      ]
    },
    {
      title: "Anonymous Credentialing",
      icon: UserCheck,
      items: [
        {
          title: "How Authentication Works",
          description: "Your institutional ID is converted to a SHA-256 cryptographic hash, creating a verified credential that cannot be traced back to your identity. This ensures complete anonymity while maintaining accountability."
        },
        {
          title: "Credential Security",
          description: "Credentials are stored locally and encrypted. The system never stores your original institutional ID. Each credential is unique and verifiable without revealing personal information."
        },
        {
          title: "Trust Score System",
          description: "Your trust score reflects your engagement history and the quality of your submissions. Higher trust scores unlock additional platform features and provide greater weight in resolution processes."
        }
      ]
    },
    {
      title: "Evidence Repository",
      icon: Shield,
      items: [
        {
          title: "Secure File Upload",
          description: "All uploaded files are encrypted using AES-256 encryption before storage. Report details can be embedded directly into image files using LSB steganography, ensuring data persistence independent of database systems."
        },
        {
          title: "Supported File Types",
          description: "The repository accepts images (JPG, PNG, WebP), documents (PDF, DOC, DOCX), and video files (MP4, MOV). Maximum file size is determined by institutional policy."
        },
        {
          title: "Data Independence",
          description: "Evidence data embedded in files remains accessible even if the database is compromised, ensuring the integrity and availability of your submissions."
        }
      ]
    },
    {
      title: "Governance Resolution Matrix",
      icon: Scale,
      items: [
        {
          title: "Resolution Process",
          description: "The Governance Resolution Matrix facilitates structured deliberation between the Student Advocate AI and Administration Representative AI, with oversight from the Resolution Officer AI when needed."
        },
        {
          title: "Priority Escalation Protocol",
          description: "When safety concerns are met with budget-based objections, the system automatically triggers Priority Escalation mode. This ensures that life-safety issues receive appropriate urgency and attention."
        },
        {
          title: "Resolution Outcomes",
          description: "All resolutions are documented in the Compliance Log with cryptographic certificates. Outcomes are transparent and can be verified using the provided certificate hashes."
        }
      ]
    },
    {
      title: "Compliance & Transparency",
      icon: FileText,
      items: [
        {
          title: "Compliance Log",
          description: "All submitted reports, their current status, and resolution outcomes are tracked in the Compliance Log. This ensures full transparency in the grievance resolution process."
        },
        {
          title: "Public Disclosure Archive",
          description: "The Public Disclosure Archive contains information released through the Emergency Disclosure protocol. This serves as a permanent record of institutional transparency."
        },
        {
          title: "Audit Trail",
          description: "Every action on the platform is logged with timestamps and cryptographic verification, ensuring a complete and tamper-proof audit trail."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Lock,
      items: [
        {
          title: "Zero-Knowledge Architecture",
          description: "The platform is designed with zero-knowledge principles. Administrators cannot access your original identity, and all sensitive data is encrypted end-to-end."
        },
        {
          title: "Data Retention",
          description: "Evidence files and report data are retained according to institutional policy. You may request deletion of your submissions through the appropriate administrative channels."
        },
        {
          title: "Emergency Disclosure",
          description: "The Emergency Disclosure feature is a safeguard that automatically releases evidence to the Public Archive if resolution processes fail to address critical concerns within defined timeframes."
        }
      ]
    }
  ];

  const faqs = [
    {
      question: "Can my identity be traced from my credential?",
      answer: "No. Your credential is generated using one-way SHA-256 hashing. It is mathematically impossible to reverse the hash to obtain your original institutional ID."
    },
    {
      question: "What happens to my submitted evidence?",
      answer: "Evidence is encrypted and stored securely. If you include report details with an image upload, the data is also embedded into the image file itself for redundancy."
    },
    {
      question: "How do I know my report is being addressed?",
      answer: "All reports appear in the Compliance Log with real-time status updates. You can track the progress of your submission from 'Submitted' through 'Resolved'."
    },
    {
      question: "What is the Emergency Disclosure feature?",
      answer: "Emergency Disclosure is a fail-safe mechanism that automatically publishes evidence to the Public Archive if critical concerns are not addressed through normal resolution processes."
    },
    {
      question: "Can I delete my submissions?",
      answer: "Data deletion requests must be submitted through institutional channels. The platform maintains audit logs for compliance purposes, which may be subject to retention requirements."
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
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
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <HelpCircle className="w-7 h-7 text-primary" />
                Help & Documentation
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Institutional guidelines and platform documentation
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/identity">
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Anonymous Credentialing</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/vault">
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Evidence Repository</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/arena">
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Scale className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Governance Matrix</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/ledger">
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Compliance Log</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <section.icon className="w-5 h-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-l-2 border-primary/30 pl-4">
                    <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQs */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <HelpCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <h4 className="font-medium text-foreground">{faq.question}</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Need Additional Support?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have questions not covered in this documentation, you can use the Compliance Assistant 
                  (floating button in the bottom-right corner) for real-time guidance, or contact the 
                  institutional support team through official university channels.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.cujammu.ac.in/contact-us/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      University Contact
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:grievance@cujammu.ac.in">
                      <FileText className="w-4 h-4 mr-2" />
                      Email Support
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HelpDocumentation;
