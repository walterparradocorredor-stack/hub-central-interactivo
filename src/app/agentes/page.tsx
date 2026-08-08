"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ALL_AGENTS, AGENT_CATEGORIES, AIAgent } from "@/lib/agentsData";
import AIChatBubble from "@/components/AIChatBubble";
import {
  Bot, Search, Sparkles, Cpu, ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2, Zap, Layers, Filter, ChevronLeft, ChevronRight, X, MessageSquare, Code, Terminal, Send
} from "lucide-react";

export default function AgentesCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // CONSULTATION CHATBOT STATE FOR AGENTS
  const [consultMessages, setConsultMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; recommendedAgents?: AIAgent[] }>
  >([
    {
      role: "assistant",
      content:
        "¡Hola! Soy ErIkA, tu Arquitecta de Integración de IA. ¿Qué desafío o proyecto deseas automatizar? Cuéntame tu necesidad (ej. contabilidad PUC, educación Saber 11, trámites GovTech, WhatsApp de ventas) y te recomendaré los agentes exactos de nuestra red de 250 disponibles.",
    },
  ]);
  const [consultInput, setConsultInput] = useState("");
  const [isConsulting, setIsConsulting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 24;

  // MOUSE SPOTLIGHT EFFECT
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // COSMIC CANVAS SYSTEM
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = Math.min(80, Math.floor(width / 20));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 0.5,
      color: [
        "rgba(168, 85, 247, ",
        "rgba(56, 189, 248, ",
        "rgba(169, 132, 60, ",
        "rgba(16, 185, 129, ",
      ][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color + "0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // FILTERED AGENTS
  const filteredAgents = ALL_AGENTS.filter((agent) => {
    const matchesCategory =
      selectedCategory === "all" || agent.category === selectedCategory;
    const matchesQuery =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE) || 1;
  const currentAgents = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // SCROLL CHAT TO BOTTOM
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consultMessages]);

  // PROCESS AGENT CONSULTATION CHAT
  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultInput.trim() || isConsulting) return;

    const userText = consultInput.trim();
    setConsultInput("");

    // Add user message
    setConsultMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsConsulting(true);

    setTimeout(() => {
      const queryLower = userText.toLowerCase();
      const matched = ALL_AGENTS.filter(
        (a) =>
          a.name.toLowerCase().includes(queryLower) ||
          a.description.toLowerCase().includes(queryLower) ||
          a.role.toLowerCase().includes(queryLower) ||
          a.capabilities.some((cap) => cap.toLowerCase().includes(queryLower))
      ).slice(0, 3);

      const fallbackAgents = matched.length > 0 ? matched : ALL_AGENTS.slice(0, 3);

      let replyText = `Para tu necesidad ("${userText}"), te recomiendo considerar los siguientes agentes especializados de la red:`;

      setConsultMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: replyText,
          recommendedAgents: fallbackAgents,
        },
      ]);
      setIsConsulting(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#04060a] text-white flex flex-col justify-between p-4 md:p-10 font-sans relative overflow-hidden selection:bg-purple-600 selection:text-white">
      {/* COSMIC PARTICLES CANVAS */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-70"
      />

      {/* DYNAMIC MOUSE RADIAL SPOTLIGHT */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.12), rgba(56, 189, 248, 0.06) 50%, transparent 80%)`,
        }}
      />

      {/* GLOWING ORBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-purple-600/20 blur-[180px] rounded-full animate-pulse-cosmic" />
        <div className="absolute top-[35%] right-[-5%] w-[650px] h-[650px] bg-cyan-500/18 blur-[190px] rounded-full animate-pulse-cosmic" />
        <div className="absolute bottom-[-10%] left-[25%] w-[750px] h-[750px] bg-[#A9843C]/18 blur-[200px] rounded-full animate-pulse-cosmic" />
      </div>

      <div className="z-10 max-w-7xl w-full mx-auto flex flex-col gap-10 py-2">
        
        {/* HEADER NAVBAR (LIBERADO, SIN RECUADRO PESADO) */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-2 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all flex items-center gap-2 text-xs font-bold shadow-md hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" /> Volver al Hub Central
            </Link>
            <div className="h-6 w-px bg-white/15 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-cyan-400 to-[#A9843C] p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#04060a] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="font-extrabold text-lg md:text-xl text-white tracking-tight flex items-center gap-2">
                  Red de 250 Agentes de IA{" "}
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Live Catalog
                  </span>
                </h1>
                <p className="text-xs text-[#A9843C] font-semibold tracking-wide">
                  WP Ecosystem — Walther Parrado Holding Corporativo
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cotizar-web"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-[#A9843C] text-white font-extrabold text-xs shadow-xl shadow-purple-500/30 hover:brightness-125 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" /> Solicitar Integración de Agentes
            </Link>
          </div>
        </header>

        {/* HERO HEADER LIBERADO Y ABIERTO */}
        <div className="w-full pt-2 pb-6 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-300 shadow-lg backdrop-blur-md">
            <Cpu className="w-4 h-4 text-cyan-400 animate-spin" /> ECOSISTEMA DE 250 AGENTES AUTÓNOMOS DE IA
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
                250 Agentes Especializados{" "}
                <span className="shimmer-gradient-text block mt-1">
                  Disponibles para Integración Directa
                </span>
              </h2>
              <p className="text-sm md:text-base text-gray-300 max-w-3xl leading-relaxed font-light">
                Modelos e inferencias locales privadas (Ollama LLM Engine) entrenados específicamente para Educación (PreICFES & Fundetec), Contabilidad PUC, GovTech 360, WhatsApp B2B, DevOps Cloud y Analítica Predictiva.
              </p>
            </div>

            {/* METRICAS ABIERTAS Y LIBRES */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md space-y-1 hover:border-purple-500/40 transition-all">
                <div className="text-2xl font-black text-purple-400">250</div>
                <div className="text-xs font-bold text-white">Agentes Activos</div>
                <div className="text-[10px] text-gray-400">Listos en &lt; 24h</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md space-y-1 hover:border-cyan-500/40 transition-all">
                <div className="text-2xl font-black text-cyan-400">10</div>
                <div className="text-xs font-bold text-white">Áreas Clave</div>
                <div className="text-[10px] text-gray-400">EdTech, PUC, GovTech...</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md space-y-1 hover:border-amber-500/40 transition-all">
                <div className="text-2xl font-black text-amber-400">Ollama</div>
                <div className="text-xs font-bold text-white">Engine Local</div>
                <div className="text-[10px] text-gray-400">Servidores Privados</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md space-y-1 hover:border-emerald-500/40 transition-all">
                <div className="text-2xl font-black text-emerald-400">99.9%</div>
                <div className="text-xs font-bold text-white">Uptime Cloud</div>
                <div className="text-[10px] text-gray-400">Supabase & VPS</div>
              </div>
            </div>
          </div>
        </div>

        {/* ASISTENTE CONVERSIONAL ERIKA (LIBERADO, SIN RECUADRO APRETADO) */}
        <div className="w-full border-t border-b border-white/10 py-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-extrabold text-white flex items-center gap-2">
                Asistente de Consulta & Recomendación de Agentes
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ErIkA AI Engine
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Escribe tu desafío o proyecto y ErIkA te indicará exactamente qué agentes de la red utilizar.
              </p>
            </div>
          </div>

          {/* CHAT MESSAGES DISPLAY */}
          <div className="max-h-72 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {consultMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-3xl leading-relaxed ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none font-medium shadow-lg"
                      : "bg-white/5 text-gray-200 border border-white/10 rounded-tl-none space-y-3 backdrop-blur-md"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.recommendedAgents && msg.recommendedAgents.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {msg.recommendedAgents.map((ag) => (
                        <button
                          key={ag.id}
                          onClick={() => setSelectedAgent(ag)}
                          className="bg-white/5 hover:bg-purple-600/20 border border-purple-500/30 rounded-xl p-3 text-left transition-all hover:scale-105 cursor-pointer group shadow-md"
                        >
                          <div className="text-[10px] font-bold text-cyan-300 font-mono">
                            {ag.code}
                          </div>
                          <div className="text-xs font-extrabold text-white truncate group-hover:text-purple-300">
                            {ag.name}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate mt-1">
                            {ag.role}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isConsulting && (
              <div className="flex gap-2 text-xs text-purple-300 items-center">
                <Bot className="w-4 h-4 animate-spin text-cyan-400" />
                <span>ErIkA está buscando en el catálogo de 250 agentes...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* CHAT INPUT FORM */}
          <form onSubmit={handleConsultSubmit} className="flex gap-3 pt-2 max-w-4xl">
            <input
              type="text"
              value={consultInput}
              onChange={(e) => setConsultInput(e.target.value)}
              placeholder="Ej: Necesito un agente para la contabilidad de mi empresa o evaluador de simulacros Saber 11..."
              className="flex-1 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-2xl px-5 py-3.5 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isConsulting || !consultInput.trim()}
              className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Send className="w-4 h-4" /> Preguntar
            </button>
          </form>
        </div>

        {/* MAIN CATALOG LAYOUT: SIDEBAR FILTERS + AGENTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* COLUMNA IZQUIERDA: SIDEBAR / CUADRO DE FILTROS LATERAL */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#0a0f1d]/90 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6 sticky top-6">
              
              {/* HEADER FILTROS */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm uppercase tracking-wider">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <span>Filtros de Agentes</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {filteredAgents.length} Activos
                </span>
              </div>

              {/* BUSCADOR DENTRO DEL SIDEBAR */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Buscador Directo
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar agente o palabra clave..."
                    className="w-full bg-[#04060a] border border-white/15 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* LISTADO VERTICAL DE CATEGORÍAS */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block flex items-center justify-between">
                  <span>Categorías (10 Áreas)</span>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-[10px] text-cyan-400 hover:underline capitalize"
                    >
                      Limpiar
                    </button>
                  )}
                </label>

                <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                  {AGENT_CATEGORIES.map((cat) => {
                    const count =
                      cat.id === "all"
                        ? ALL_AGENTS.length
                        : ALL_AGENTS.filter((a) => a.category === cat.id).length;
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-sm">{cat.icon}</span>
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-white/5 text-gray-400 group-hover:text-white"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* COLUMNA DERECHA: GRID DE AGENTES & PAGINACIÓN */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* GRID DE AGENTES */}
            {currentAgents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="glass-cosmic-card glass-cosmic-card-hover rounded-3xl p-5 flex flex-col justify-between gap-4 relative group overflow-hidden border border-white/10 shadow-xl"
                  >
                    <div className="space-y-3 relative z-10">
                      {/* CARD HEADER */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                            {agent.icon}
                          </span>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-cyan-300 block">
                              {agent.code}
                            </span>
                            <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                              {agent.name}
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* ROLE BADGE */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${agent.badgeColor}`}
                      >
                        {agent.role}
                      </span>

                      {/* DESCRIPTION */}
                      <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-3">
                        {agent.description}
                      </p>

                      {/* CAPABILITY TAG */}
                      <div className="text-[11px] text-gray-400 bg-white/5 px-2.5 py-1 rounded-xl border border-white/5 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{agent.capabilities[0]}</span>
                      </div>
                    </div>

                    {/* ACTION FOOTER */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="w-full bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-xs font-bold text-white py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn cursor-pointer shadow-md"
                      >
                        <Code className="w-4 h-4 text-cyan-400" /> Ficha Técnica & Prompt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-[#0a0f1d]/60 border border-white/10 rounded-3xl p-12 text-center space-y-3">
                <Bot className="w-12 h-12 text-purple-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">No se encontraron agentes</h4>
                <p className="text-xs text-gray-400">
                  Prueba cambiando la palabra clave o seleccionando otra categoría en el panel lateral.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg hover:bg-purple-500 transition-all"
                >
                  Restablecer Filtros
                </button>
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-gray-300">
                  Página <span className="text-white font-extrabold text-sm">{currentPage}</span> de{" "}
                  <span className="text-white font-extrabold text-sm">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>

        {/* FOOTER */}
        <footer className="w-full border-t border-white/10 pt-8 pb-4 text-center text-xs text-gray-500 space-y-2">
          <p className="font-bold text-gray-400">
            WP Ecosystem — Walther Parrado Holding Corporativo & Tecnológico
          </p>
          <p className="text-[11px] font-mono">
            Red de 250 Agentes Digitales © 2026. Todos los derechos reservados.
          </p>
        </footer>
      </div>

      {/* AGENT INSPECTION MODAL */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <button
              onClick={() => setSelectedAgent(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
              <span className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10">
                {selectedAgent.icon}
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 block">
                  {selectedAgent.code}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white">
                  {selectedAgent.name}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block mt-1 ${selectedAgent.badgeColor}`}
                >
                  {selectedAgent.role}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Descripción & Rol de Integración
                </h4>
                <p className="text-gray-200 leading-relaxed text-sm">
                  {selectedAgent.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Capacidades & Especificaciones Técnicas
                </h4>
                <ul className="space-y-2">
                  {selectedAgent.capabilities.map((cap, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-300 bg-white/5 p-2.5 rounded-xl border border-white/5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-purple-400" /> Prompt Base de Sistema (Ollama LLM Engine)
                </h4>
                <div className="bg-[#04060a] border border-white/10 p-3.5 rounded-xl font-mono text-[11px] text-cyan-300 leading-relaxed overflow-x-auto">
                  {selectedAgent.promptSnippet}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-300" /> Integración lista en {selectedAgent.integrationTime}
              </span>
              <Link
                href="/cotizar-web"
                onClick={() => setSelectedAgent(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-[#A9843C] text-white font-extrabold text-xs shadow-lg shadow-purple-500/30 hover:brightness-125 transition-all text-center flex items-center justify-center gap-2"
              >
                Solicitar Integración de {selectedAgent.code} <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ERIKA AI CHAT BUBBLE */}
      <AIChatBubble />
    </main>
  );
}
