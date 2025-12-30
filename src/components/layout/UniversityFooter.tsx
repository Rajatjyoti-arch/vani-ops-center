import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function UniversityFooter() {
  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                <span className="font-bold text-primary text-sm">CUJ</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Central University of Jammu</h3>
                <p className="text-xs text-muted-foreground">जम्मू केंद्रीय विश्वविद्यालय</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Established under the Central Universities Act, 2009. 
              Committed to excellence in education and research.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Rahya-Suchani (Bagla), District Samba - 181143, Jammu (J&K)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground">+91-191-2585500</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground">info@cujammu.ac.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <a 
                  href="https://www.cujammu.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  www.cujammu.ac.in
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a 
                href="https://www.cujammu.ac.in/index.php?action=about-us" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </a>
              <a 
                href="https://www.cujammu.ac.in/index.php?action=academics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Academics
              </a>
              <a 
                href="https://www.cujammu.ac.in/index.php?action=admissions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Admissions
              </a>
              <a 
                href="https://www.cujammu.ac.in/index.php?action=research" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Research
              </a>
              <a 
                href="https://www.cujammu.ac.in/index.php?action=student-corner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Student Corner
              </a>
              <a 
                href="https://www.cujammu.ac.in/index.php?action=facilities" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Facilities
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Central University of Jammu. All Rights Reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Anonymous Reporting System (VANI) | Confidential & Secure
          </p>
        </div>
      </div>
    </footer>
  );
}
