"use client";

import { useEffect, useRef, useState } from "react";

export default function useSpeechToText() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any | null>(null);
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
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    shouldRestart.current = true;
    setTranscript("");
    recognition.start();
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
  };
}
