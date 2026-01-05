import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send, Shield, Loader2, Mic, MicOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sentinel-chat`;
const STORAGE_KEY = "irene_assistant_memory";

const QUICK_ACTIONS = [
  { label: "Data Integrity", query: "Explain how SHA-256 hashing ensures data integrity in the credentialing process." },
  { label: "Resolution Process", query: "Guide me through the Governance Resolution Matrix and its procedural framework." },
  { label: "Evidence Security", query: "How does the evidence encoding system protect submitted materials?" },
  { label: "Compliance Protocol", query: "What are the institutional transparency and compliance requirements?" },
];

export function ComplianceAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access for voice input.",
            variant: "destructive",
          });
        }
      };
    }
  }, []);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved messages:", e);
      }
    }
    // Set default welcome message
    setMessages([
      {
        role: "assistant",
        content: "Hi, I am Irene. How may I help you today?",
      },
    ]);
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  };

  const clearMemory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        role: "assistant",
        content: "Hi, I am Irene. How may I help you today?",
      },
    ]);
    toast({
      title: "Session Cleared",
      description: "Conversation history has been reset.",
    });
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentRoute: location.pathname,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to connect to Sentinel");
      }

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // Incomplete JSON, put back and wait
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Sentinel chat error:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Unable to reach the compliance assistant",
        variant: "destructive",
      });
      // Remove the empty assistant message if error
      if (!assistantContent) {
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (query: string) => {
    handleSend(query);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-primary text-primary-foreground
          flex items-center justify-center
          shadow-lg
          transition-all duration-300
          hover:scale-110 hover:shadow-xl
          ${isOpen ? "rotate-180" : ""}
        `}
        aria-label="Toggle Irene Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window - Glass-morphism Effect */}
      <div
        className={`
          fixed bottom-24 right-6 z-50
          w-[400px] max-w-[calc(100vw-3rem)]
          bg-background/80 backdrop-blur-xl
          border border-border/50 rounded-xl
          shadow-2xl
          transform transition-all duration-300 ease-out
          ${isOpen 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-8 opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-status-safe rounded-full border-2 border-background" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Irene</h3>
              <p className="text-[10px] text-muted-foreground">Central University of Jammu</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearMemory}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-border/20 bg-secondary/10">
          <p className="text-[10px] text-muted-foreground mb-2 font-medium">Quick Topics</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.query)}
                disabled={isLoading}
                className="px-2.5 py-1 text-[10px] bg-secondary/50 text-foreground border border-border/50 rounded-full hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-72 p-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] px-3 py-2 rounded-xl text-sm
                    ${message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-foreground border border-border/30"
                    }
                  `}
                >
                  {message.content || (
                    <ProcessingIndicator />
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 text-foreground border border-border/30 px-3 py-2 rounded-xl">
                  <ProcessingIndicator />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border/30 bg-secondary/5 rounded-b-xl">
          <div className="flex gap-2">
            {speechSupported && (
              <Button
                onClick={toggleListening}
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                className="shrink-0"
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Type your question..."}
              className="flex-1 bg-background border-border/50 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-primary text-primary-foreground shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gemini-gradient-1)" />
              <path d="M2 17L12 22L22 17" stroke="url(#gemini-gradient-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="url(#gemini-gradient-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="gemini-gradient-1" x1="2" y1="7" x2="22" y2="7" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4285F4" />
                  <stop offset="0.5" stopColor="#9B72CB" />
                  <stop offset="1" stopColor="#D96570" />
                </linearGradient>
                <linearGradient id="gemini-gradient-2" x1="2" y1="19.5" x2="22" y2="19.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4285F4" />
                  <stop offset="0.5" stopColor="#9B72CB" />
                  <stop offset="1" stopColor="#D96570" />
                </linearGradient>
                <linearGradient id="gemini-gradient-3" x1="2" y1="14.5" x2="22" y2="14.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4285F4" />
                  <stop offset="0.5" stopColor="#9B72CB" />
                  <stop offset="1" stopColor="#D96570" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-[10px] text-muted-foreground">
              Powered by <span className="font-medium bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">Google Gemini</span>
            </span>
            <span className="text-[10px] text-muted-foreground">• {speechSupported ? "Voice enabled" : "Text only"}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function GeminiSparkle() {
  return (
    <div className="relative w-5 h-5">
      {/* Outer rotating ring */}
      <div className="absolute inset-0 animate-gemini-rotate">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="50%" stopColor="#9B72CB" />
              <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill="none" stroke="url(#sparkle-gradient)" strokeWidth="1.5" strokeDasharray="8 4" />
        </svg>
      </div>
      {/* Inner pulsing star */}
      <div className="absolute inset-0 flex items-center justify-center animate-gemini-pulse">
        <svg viewBox="0 0 24 24" className="w-3 h-3">
          <defs>
            <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="50%" stopColor="#9B72CB" />
              <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
          </defs>
          <path 
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
            fill="url(#star-gradient)"
          />
        </svg>
      </div>
      {/* Sparkle dots */}
      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4285F4] animate-gemini-sparkle" style={{ animationDelay: "0s" }} />
      <div className="absolute top-1/2 -right-0.5 -translate-y-1/2 w-1 h-1 rounded-full bg-[#9B72CB] animate-gemini-sparkle" style={{ animationDelay: "0.5s" }} />
      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D96570] animate-gemini-sparkle" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 -left-0.5 -translate-y-1/2 w-1 h-1 rounded-full bg-[#4285F4] animate-gemini-sparkle" style={{ animationDelay: "0.75s" }} />
    </div>
  );
}

function ProcessingIndicator() {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <GeminiSparkle />
      <span className="text-xs bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent font-medium">
        Thinking...
      </span>
    </div>
  );
}

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
