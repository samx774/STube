"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function useSpeechToText(onSilence?: () => void) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const shouldRestart = useRef(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript.trim());

      // 🔥 Reset silence timer whenever new speech detected
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        console.log("Silence detected, stopping...");
        stopListening(); // ⬅️ stop listening automatically
        onSilence?.(); // ⬅️ notify parent component (optional)
      }, 200); // ⏱️ stop after 1 seconds of silence
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      shouldRestart.current = false;
    };

    recognition.onend = () => {
      if (shouldRestart.current) {
        recognition.start();
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;

    shouldRestart.current = true;
    recognitionRef.current.start();
    setListening(true);
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    shouldRestart.current = false;
    recognitionRef.current.stop();
    setListening(false);
  };

  return {
    listening,
    transcript,
    startListening,
    stopListening,
    setTranscript,
  };
}
