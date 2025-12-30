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
const STORAGE_KEY = "vani_sentinel_memory";

const QUICK_ACTIONS = [
  { label: "Explain SHA-256", query: "Explain how SHA-256 hashing protects my identity in simple terms." },
  { label: "Arena Guide", query: "Guide me through how The Arena negotiation works between the AI agents." },
  { label: "LSB Steganography", query: "What is LSB steganography and how does it hide my grievance in images?" },
  { label: "Dead Man's Switch", query: "How does the Dead Man's Switch work and what happens when it triggers?" },
];

export function SentinelChatbot() {
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
        content: "Encrypted channel established. I am the VANI Sentinel. How may I assist your operation?",
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
        content: "Memory banks purged. Starting fresh encrypted session. How may I assist?",
      },
    ]);
    toast({
      title: "Memory Cleared",
      description: "Sentinel conversation history has been erased.",
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
        title: "Connection Lost",
        description: error instanceof Error ? error.message : "Failed to reach Sentinel",
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
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-primary text-primary-foreground
          flex items-center justify-center
          shadow-lg cyber-glow
          transition-all duration-300
          hover:scale-110 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]
          ${isOpen ? "rotate-180" : "animate-pulse-glow"}
        `}
        aria-label="Toggle VANI Sentinel"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`
          fixed bottom-24 right-6 z-50
          w-[380px] max-w-[calc(100vw-3rem)]
          bg-card/80 backdrop-blur-xl
          border border-primary/30 rounded-lg
          shadow-2xl
          transform transition-all duration-300 ease-out
          ${isOpen 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-8 opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-safe rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">VANI Sentinel</h3>
              <p className="text-[10px] text-primary font-mono">SECURE CHANNEL ACTIVE</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearMemory}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Clear conversation memory"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-2 border-b border-border/30 bg-secondary/20">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.query)}
                disabled={isLoading}
                className="px-2 py-1 text-[10px] font-mono bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-72 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] px-3 py-2 rounded-lg text-sm
                    ${message.role === "user"
                      ? "bg-primary/20 text-foreground border border-primary/30"
                      : "bg-secondary/50 text-foreground border border-border/50"
                    }
                  `}
                >
                  {message.content || (
                    <DataStreamIndicator />
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 text-foreground border border-border/50 px-3 py-2 rounded-lg">
                  <DataStreamIndicator />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            {speechSupported && (
              <Button
                onClick={toggleListening}
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                className={`shrink-0 ${isListening ? "animate-pulse" : ""}`}
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
              placeholder={isListening ? "Listening..." : "Enter your query..."}
              className={`flex-1 bg-secondary/30 border-border/50 text-sm font-mono ${
                isListening ? "border-primary/50 animate-pulse" : ""
              }`}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="cyber-button bg-primary text-primary-foreground shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center font-mono">
            Gemini Flash • Memory Enabled • {speechSupported ? "Voice Ready" : "Text Only"}
          </p>
        </div>
      </div>
    </>
  );
}

function DataStreamIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="text-primary font-mono text-xs">▸</span>
      <div className="flex gap-0.5">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-3 bg-primary/60 animate-pulse"
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
      <span className="text-primary font-mono text-xs ml-1 animate-pulse">_</span>
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
