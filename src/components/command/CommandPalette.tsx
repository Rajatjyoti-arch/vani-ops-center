import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { UserCheck, Shield, Scale, BookOpen, Settings, HelpCircle, Keyboard, Home } from "lucide-react";
import { playClickSound, playTransitionSound } from "@/lib/audio";
import { useSettings } from "@/contexts/SettingsContext";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { soundEnabled, setDemoMode, demoMode } = useSettings();
  const { startTour } = useOnboarding();

  const runCommand = useCallback((command: () => void) => {
    if (soundEnabled) playTransitionSound();
    onOpenChange(false);
    command();
  }, [onOpenChange, soundEnabled]);

  const navigationCommands = [
    { icon: Home, label: "Dashboard", shortcut: "G then H", action: () => navigate("/") },
    { icon: UserCheck, label: "Anonymous Credentialing", shortcut: "G then I", action: () => navigate("/identity") },
    { icon: Shield, label: "Encrypted Repository", shortcut: "G then V", action: () => navigate("/vault") },
    { icon: Scale, label: "Governance Matrix", shortcut: "G then A", action: () => navigate("/arena") },
    { icon: BookOpen, label: "Compliance Log", shortcut: "G then L", action: () => navigate("/ledger") },
  ];

  const actionCommands = [
    { 
      icon: UserCheck, 
      label: "New Credential", 
      shortcut: "Ctrl+N", 
      action: () => navigate("/identity") 
    },
    { 
      icon: Shield, 
      label: "Upload Evidence", 
      shortcut: "Ctrl+U", 
      action: () => navigate("/vault") 
    },
    { 
      icon: Settings, 
      label: `Toggle Demo Mode (${demoMode ? "ON" : "OFF"})`, 
      shortcut: "Ctrl+D", 
      action: () => setDemoMode(!demoMode) 
    },
    { 
      icon: HelpCircle, 
      label: "Start Tour", 
      shortcut: "?", 
      action: () => startTour() 
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="bg-card border-primary/30">
        <CommandInput placeholder="Type a command or search..." className="border-none" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            {navigationCommands.map((cmd) => (
              <CommandItem
                key={cmd.label}
                onSelect={() => runCommand(cmd.action)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <cmd.icon className="w-4 h-4 text-primary" />
                  <span>{cmd.label}</span>
                </div>
                <kbd className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                  {cmd.shortcut}
                </kbd>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            {actionCommands.map((cmd) => (
              <CommandItem
                key={cmd.label}
                onSelect={() => runCommand(cmd.action)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <cmd.icon className="w-4 h-4 text-primary" />
                  <span>{cmd.label}</span>
                </div>
                <kbd className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                  {cmd.shortcut}
                </kbd>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        
        <div className="border-t border-border/50 p-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Keyboard className="w-3 h-3" />
            <span>Press <kbd className="font-mono bg-secondary px-1 rounded">Ctrl+K</kbd> anytime to open</span>
          </div>
          <span>ESC to close</span>
        </div>
      </Command>
    </CommandDialog>
  );
}

export function useKeyboardShortcuts() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const { soundEnabled, setDemoMode, demoMode } = useSettings();
  const { startTour, isActive: isTourActive } = useOnboarding();
  const [gKeyPressed, setGKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isTourActive
      ) {
        return;
      }

      // Command palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (soundEnabled) playClickSound();
        setCommandPaletteOpen(true);
        return;
      }

      // New report: Ctrl+N
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        if (soundEnabled) playTransitionSound();
        navigate("/identity");
        return;
      }

      // Upload evidence: Ctrl+U
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
        if (soundEnabled) playTransitionSound();
        navigate("/vault");
        return;
      }

      // Toggle demo mode: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        if (soundEnabled) playClickSound();
        setDemoMode(!demoMode);
        return;
      }

      // Start tour: ?
      if (e.key === "?") {
        e.preventDefault();
        if (soundEnabled) playClickSound();
        startTour();
        return;
      }

      // G then letter navigation
      if (e.key === "g" && !e.ctrlKey && !e.metaKey) {
        setGKeyPressed(true);
        setTimeout(() => setGKeyPressed(false), 1000);
        return;
      }

      if (gKeyPressed) {
        if (soundEnabled) playTransitionSound();
        switch (e.key) {
          case "h":
            navigate("/");
            break;
          case "i":
            navigate("/identity");
            break;
          case "v":
            navigate("/vault");
            break;
          case "a":
            navigate("/arena");
            break;
          case "l":
            navigate("/ledger");
            break;
        }
        setGKeyPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, soundEnabled, demoMode, setDemoMode, startTour, gKeyPressed, isTourActive]);

  return { commandPaletteOpen, setCommandPaletteOpen };
}
