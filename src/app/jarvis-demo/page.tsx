"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Mic,
  Eye,
  Calendar,
  Mail,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Cpu,
  ArrowLeft,
} from "lucide-react";

interface DemoMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "¿Cuál es mi próxima reunión?",
  "¿Cómo está mi bandeja de correo?",
  "Dame un resumen ejecutivo del día",
  "¿Cuánto vendimos este mes?",
];

const FEATURES = [
  { icon: MessageCircle, title: "Conversación natural", desc: "Hablale como a un colega — sin comandos, sin menús, entiende el contexto." },
  { icon: Calendar, title: "Agenda y tareas reales", desc: "Crea, mueve y borra citas de verdad en tu Calendar, no solo las lee." },
  { icon: Mail, title: "Bandeja de correo", desc: "Resume tu Gmail, prioriza lo importante, nunca inventa remitentes." },
  { icon: Eye, title: "Visión por cámara", desc: "Le mostrás una foto o documento y lo analiza al instante." },
  { icon: Mic, title: "Voz en tiempo real", desc: "Dictado y respuesta hablada — como hablarle a un asistente de verdad." },
  { icon: MapPin, title: "Rutas y tráfico en vivo", desc: "Distancia, duración y tráfico real de Google Maps, al momento." },
];

export default function JarvisDemoPage() {
  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      role: "assistant",
      content:
        "Hola, soy JARVIS. Esto es una **demo con datos de ejemplo** (Cronos Consulting, una empresa ficticia) — te muestro cómo se siente hablar conmigo de verdad. Probá preguntarme algo, o elegí una sugerencia abajo.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    const newMessages: DemoMessage[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/jarvis-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: newMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || `⚠️ ${data.error || "No se pudo responder."}` },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error de conexión. Probá de nuevo en un momento." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#04060a] text-white font-sans relative overflow-x-hidden selection:bg-cyan-600 selection:text-white">
      <div className="fixed top-[-15%] left-[-10%] w-[700px] h-[700px] bg-cyan-600/10 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-indigo-500/8 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10">
        {/* HEADER */}
        <header className="border-b border-white/5 bg-[#04060a]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/8 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm text-white">JARVIS AI — Demo</span>
              </div>
            </div>
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Quiero esto para mi empresa
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-bold mb-8">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Demo pública — datos de ejemplo, no reales
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-[1.1] mb-6">
            JARVIS AI — tu asistente ejecutivo, <span className="text-cyan-400">de verdad</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Un asistente de IA que gestiona tu agenda, tu correo y tu día real —
            no un chatbot genérico. Probalo abajo con datos de una empresa ficticia,
            sin necesidad de crear cuenta.
          </p>
        </section>

        {/* FEATURES */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-colors"
              >
                <f.icon className="w-6 h-6 text-cyan-400 mb-3" />
                <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CHAT DEMO */}
        <section className="max-w-3xl mx-auto px-4 md:px-8 pb-24">
          <div className="rounded-3xl border border-cyan-900/40 bg-[#070b14]/90 backdrop-blur-xl shadow-2xl shadow-cyan-950/40 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">JARVIS — Demo</p>
                <p className="text-[10px] text-gray-500">Cronos Consulting (empresa de ejemplo)</p>
              </div>
            </div>

            <div className="h-[420px] overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm"
                        : "bg-white/[0.05] border border-white/10 text-gray-200 rounded-tl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-1.5" />
                    escribiendo...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-gray-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 p-4 border-t border-white/5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribile algo a JARVIS..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-40 text-white transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-6 flex items-start gap-2.5 text-xs text-gray-500 px-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <p>
              Esta demo usa una empresa y datos 100% ficticios ("Cronos Consulting") — nunca
              información real de un cliente. La versión real se conecta a tu Calendar, Gmail,
              Maps y más, con tus propios datos y credenciales.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-cyan-500/30 text-sm font-bold text-cyan-300 hover:text-cyan-200 transition-all"
            >
              Quiero JARVIS para mi empresa <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/5 py-8 px-4 text-center max-w-7xl mx-auto">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} WP Ecosystem — Walther Parrado · JARVIS AI Platform
          </p>
        </footer>
      </div>
    </main>
  );
}
