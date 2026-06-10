"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { ReviewScreen, type ExtractedData } from "./review-screen";
import { SuccessScreen } from "./success-screen";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type IntakePhase = "chat" | "review" | "success";

// Use local Next.js API routes (which proxy to the on-prem DGX cyanide-api).
// Override with NEXT_PUBLIC_INTAKE_API_BASE only if you need to point at a remote backend.
const API_BASE = process.env.NEXT_PUBLIC_INTAKE_API_BASE ?? "";

export function IntakeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [phase, setPhase] = useState<IntakePhase>("chat");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = messagesEndRef.current;
    if (el?.parentElement) {
      el.parentElement.scrollTop = el.parentElement.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Start the conversation
  const startConversation = useCallback(async () => {
    if (hasStarted) return;
    setHasStarted(true);

    const welcomeId = crypto.randomUUID();
    setMessages([{ id: welcomeId, role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const res = await fetch(API_BASE + "/api/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      });

      if (!res.ok) throw new Error("Failed to start conversation");

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === welcomeId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === welcomeId
            ? {
                ...m,
                content:
                  "Welcome to IYA Medical! I'm here to help you with your patient intake. Could you start by telling me your full name?",
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [hasStarted]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    const updatedMessages = [...messages, userMsg];
    setMessages([...updatedMessages, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(API_BASE + "/api/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "I'm sorry, something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCompleteIntake = async () => {
    setIsExtracting(true);
    try {
      const conversation = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(API_BASE + "/api/intake/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });

      if (!res.ok) throw new Error("Extraction failed");

      const data = await res.json();
      setExtractedData(data);
      setPhase("review");
    } catch (error) {
      console.error("Extraction error:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async () => {
    if (!extractedData) return;

    try {
      const res = await fetch(API_BASE + "/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          patientName: extractedData.name,
          patientEmail: extractedData.email,
          patientPhone: extractedData.phone,
          data: extractedData,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setPhase("success");
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleBackToChat = () => {
    setPhase("chat");
    setExtractedData(null);
  };

  // Enough messages to show complete button (at least 6 exchanges)
  const canComplete = messages.length >= 6 && !isStreaming;

  if (phase === "review" && extractedData) {
    return (
      <ReviewScreen
        data={extractedData}
        onSubmit={handleSubmit}
        onBack={handleBackToChat}
      />
    );
  }

  if (phase === "success") {
    return <SuccessScreen />;
  }

  // Calculate progress based on message count
  const progressSteps = ['Personal Info', 'Medical History', 'Insurance', 'Review']
  const currentStep = Math.min(Math.floor(messages.length / 4), progressSteps.length - 1)

  return (
    <div suppressHydrationWarning className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-white">
                IYA Medical <span className="text-gray-400 font-normal">|</span> Patient Intake
              </h1>
              <p className="text-xs text-gray-400">
                AI-Powered Registration
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400">Secure</span>
            </div>
          </div>

          {/* Progress indicator */}
          {messages.length > 0 && (
            <div className="mt-3 flex items-center gap-1">
              {progressSteps.map((step, i) => (
                <div key={step} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`h-1 w-full rounded-full transition-all duration-500 ${
                      i <= currentStep
                        ? 'bg-gradient-to-r from-brand-500 to-emerald-500'
                        : 'bg-gray-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] transition-colors ${
                      i <= currentStep ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md ${
                    message.role === "assistant"
                      ? "bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-500/20"
                      : "bg-gradient-to-br from-gray-600 to-gray-700 shadow-gray-900/30"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-gray-200" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                    message.role === "assistant"
                      ? "rounded-tl-md bg-gray-800/80 text-gray-100 shadow-black/10 ring-1 ring-white/[0.06]"
                      : "rounded-tr-md bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-brand-600/20"
                  }`}
                >
                  {message.content || (
                    <span className="inline-flex items-center gap-1 py-1 text-gray-400">
                      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-brand-400/80 [animation-delay:0ms]" />
                      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-brand-400/80 [animation-delay:150ms]" />
                      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-brand-400/80 [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Complete Intake Button */}
      <AnimatePresence>
        {canComplete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex justify-center border-t border-white/5 bg-gray-900/50 px-4 py-3 backdrop-blur-sm"
          >
            <button
              onClick={handleCompleteIntake}
              disabled={isExtracting}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 disabled:opacity-50"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting information...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Complete Intake
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t border-white/5 bg-gray-950/90 px-4 pb-6 pt-4 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3 rounded-2xl bg-gray-800/50 p-2 ring-1 ring-white/10 transition-all duration-200 focus-within:ring-brand-500/50 focus-within:shadow-lg focus-within:shadow-brand-500/5">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              disabled={isStreaming}
              rows={1}
              className="max-h-[120px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/20 transition-all hover:brightness-110 disabled:opacity-30 disabled:shadow-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-600">
            Your information is encrypted and handled in accordance with HIPAA
            guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
