import { useNavigate } from "react-router-dom";
import { UserCheck, Shield, ArrowLeft, Lock } from "lucide-react";
import { VaniLogo } from "@/components/ui/VaniLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PortalSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <VaniLogo variant="icon" size="sm" />
            <div className="flex flex-col leading-tight">
              <span
                className="font-semibold text-foreground tracking-[0.15em] uppercase"
                style={{ fontSize: "15px" }}
              >
                VANI
              </span>
              <span className="text-[10px] text-muted-foreground/60 hidden sm:block">
                Central University of Jammu
              </span>
            </div>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Select Your Portal
            </h1>
            <p className="text-muted-foreground">
              Choose how you would like to access the VANI system
            </p>
          </div>

          {/* Portal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Student Portal */}
            <Card
              className="group cursor-pointer border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              onClick={() => navigate("/student-dashboard")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <UserCheck className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Student Portal
                </h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Access anonymous credentialing, submit grievances, and track
                  resolution progress with full privacy protection.
                </p>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300"
                  size="lg"
                >
                  Enter as Student
                </Button>
              </CardContent>
            </Card>

            {/* Authority Portal */}
            <Card
              className="group cursor-pointer border-border/50 bg-card/50 hover:bg-card hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
              onClick={() => navigate("/admin/login")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-10 h-10 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Administrative Oversight
                </h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Restricted access for governance officers and resolution
                  committees. Manage cases and institutional analytics.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground shadow-lg shadow-accent/10 group-hover:shadow-xl group-hover:shadow-accent/20 transition-all duration-300"
                  size="lg"
                >
                  Institutional Personnel Login
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Badge */}
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                Zero-Knowledge Authentication Available
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Central University of Jammu. VANI
            Governance System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PortalSelection;
