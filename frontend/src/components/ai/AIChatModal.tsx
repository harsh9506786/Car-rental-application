"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";

import AIMessage from "./AIMessage";
import { askAI } from "./ai.service";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
}

export default function AIChatModal({ open, onClose }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "👋 Hi! I'm KarZone AI. Ask me anything about our cars.",
      isUser: false,
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        isUser: true,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const reply = await askAI(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          text: reply,
          isUser: false,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Something went wrong. Please try again.",
          isUser: false,
        },
      ]);
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          ai-chat-open
          z-40
          bg-black/50
          sm:hidden
        "
      />

      <div
        className="
fixed
left-1/2
top-1/2
z-50
flex
h-[85vh]
w-[92vw]
-translate-x-1/2
-translate-y-1/2
flex-col
overflow-hidden
rounded-3xl
border
border-slate-700
bg-[#101826]
shadow-2xl

sm:left-auto
sm:top-auto
sm:right-8
sm:bottom-28
sm:h-auto
sm:w-auto
sm:max-h-[calc(100vh-8rem)]
sm:max-w-[420px]
sm:translate-x-0
sm:translate-y-0
"
      >
        {/* Header */}

        <div
          className="
          flex
          items-center
          justify-between
          border-b
          border-slate-700
          p-5
        "
        >
          <div className="flex items-center gap-3">
            <Bot className="text-orange-400" />

            <div>
              <h2 className="font-semibold text-white">KarZone AI</h2>

              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>

          <button onClick={onClose}>
            <X className="text-white cursor-pointer" />
          </button>
        </div>

        {/* Messages */}

        <div className="ai-scroll min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((msg, index) => (
            <AIMessage key={index} text={msg.text} isUser={msg.isUser} />
          ))}

          {loading && (
            <div className="text-sm text-gray-400">
              KarZone AI is typing...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}

        <div
          className="
          flex
          gap-3
          border-t
          border-slate-700
          p-4
        "
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask anything..."
            className="
            flex-1
            rounded-xl
            bg-[#0B1120]
            px-4
            py-3
            text-white
            outline-none
          "
          />

          <button
            onClick={sendMessage}
            className="
            rounded-xl
            bg-orange-500
            px-5
            text-white
            cursor-pointer
            transition
            hover:bg-orange-600
          "
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}