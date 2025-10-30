"use client";

import { useEffect, useRef, useState } from "react";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { MicIcon } from "lucide-react";
import useSpeechToText from "@/modules/search/hooks/use-speech-to-text";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

export default function VoiceSearchModal() {
    const [open, setOpen] = useState(false);
    const { listening, transcript, startListening, stopListening } = useSpeechToText();

    const startStopListening = () => {
        listening ? stopVoiceInput() : startListening()
    }

    const stopVoiceInput = () => {
        stopListening()
        setOpen(false)
    }



    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="rounded-full size-10"
                size="icon"
            >
                <MicIcon className="size-5" />
                <span className="sr-only">Toggle voice search</span>
            </Button>

            <ResponsiveDialog title="Voice Search (NOT WORKING YET)" open={open} onOpenChange={setOpen}>
                <div className="flex flex-col items-center justify-center gap-4 py-6">
                    <div
                        onClick={startStopListening}
                        className={`size-40 rounded-full border flex items-center justify-center cursor-pointer transition-all 
              ${listening
                                ? "bg-red-500 text-white scale-105 shadow-lg animate-pulse"
                                : "bg-muted text-foreground"
                            }`}
                    >
                        <MicIcon className="size-16" />
                    </div>

                    <p className="text-sm text-muted-foreground min-h-[24px] text-center px-4">
                        {transcript || (listening ? "Listening..." : "Tap the mic to start")}
                    </p>
                </div>
            </ResponsiveDialog>
        </>
    );
}
