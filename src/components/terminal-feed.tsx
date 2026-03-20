"use client";
import { useEffect, useRef } from "react";

export function TerminalFeed({ messages }: { messages: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-charcoal rounded-sm overflow-hidden shadow-lg h-[500px] flex flex-col border border-hairline">
      <div className="bg-[#12122a] px-4 py-3 flex items-center justify-between border-b border-[#2a2a4a]">
        <span className="text-xs font-medium text-white/80">Live Scan Activity</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-on-surface-variant" />
          <div className="w-2 h-2 rounded-full bg-on-surface-variant" />
          <div className="w-2 h-2 rounded-full bg-on-surface-variant" />
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto font-mono text-xs leading-relaxed space-y-1">
        {messages.map((msg, i) => (
          <p key={i} className={msg.includes("VULNERABLE") ? "text-red-400 font-bold" : msg.includes("PASSED") ? "text-emerald-400" : "text-slate-400"}>
            {msg}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
