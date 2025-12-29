import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  enableSound?: boolean;
}

export function TypewriterText({
  text,
  speed = 30,
  className = "",
  onComplete,
  enableSound = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTypeSound = () => {
    if (!enableSound) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Subtle click sound
      oscillator.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
      oscillator.type = "square";

      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio not supported or blocked
    }
  };

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
        playTypeSound();
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedText, text, speed, isComplete, onComplete, enableSound]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse text-primary">▊</span>}
    </span>
  );
}
