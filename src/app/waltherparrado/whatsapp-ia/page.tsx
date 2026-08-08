"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  MessageCircle,
  Globe,
  Share2,
  Zap,
  Shield,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  Phone,
  Users,
  BarChart3,
  Clock,
  Star,
  Send,
  Plus,
  Minus,
} from "lucide-react";

// ——— Datos de precios (rangos del PDF de cotización) ———
const WA_PRICE_TIERS = [
  { min: 1, max: 5, monthly: 200000, label: "Base" },
  { min: 6, max: 10, monthly: 600000, label: "Crecimiento" },
  { min: 11, max: 15, monthly: 1000000, label: "Escalado" },
  { min: 16, max: 20, monthly: 1400000, label: "Pro" },
  { min: 21, max: 25, monthly: 1800000, label: "Enterprise" },
  { min: 26, max: 30, monthly: 2200000, label: "Ultra Enterprise" },
];

const SETUP_FEE = 1000000;

function getPriceTier(lines: number) {
  return (
    WA_PRICE_TIERS.find((t) => lines >= t.min && lines <= t.max) ||
    WA_PRICE_TIERS[WA_PRICE_TIERS.length - 1]
  );
}

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ——— Comparativa de features por pilar ———
const FEATURES = [
  { label: "Bot IA en tu sitio web (widget)", plans: [true, true, true] },
  { label: "Entrenamiento con info del negocio (RAG)", plans: [true, true, true] },
  { label: "Panel de métricas & analítica", plans: [true, true, true] },
  { label: "WhatsApp Business API (Meta)", plans: [false, true, true] },
  { label: "Handoff a agente humano", plans: [false, true, true] },
  { label: "Respuestas automáticas 24/7", plans: [false, true, true] },
  { label: "Notificaciones proactivas WA", plans: [false, true, true] },
  { label: "Instagram DM + Messenger", plans: [false, false, true] },
  { label: "Telegram & otras redes", plans: [false, false, true] },
  { label: "CRM integrado multicanal", plans: [false, false, true] },
  { label: "Analítica avanzada omnicanal", plans: [false, false, true] },
  { label: "Soporte prioritario dedicado", plans: [false, false, true] },
];

const COMPETITORS = [
  { name: "Whaticket", price: "$49 USD", ia: false, wa: true },
  { name: "Wati.io", price: "$119 USD", ia: "Extra", wa: true },
  { name: "360dialog", price: "$49–$299 USD", ia: false, wa: true },
  { name: "Leadsales", price: "$84 USD", ia: "Básica", wa: true },
  { name: "Treble.ai", price: "~$140 USD", ia: true, wa: true },
  { name: "WP Ecosystem ✦", price: "Cotización a la medida", ia: true, wa: true, highlight: true },
];

export default function WhatsAppIAPage() {
  const [lines, setLines] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(1); // 0=web, 1=wa, 2=premium

  const tier = getPriceTier(lines);
  const whatsAppLink = `https://wa.me/573017640850?text=${encodeURIComponent(
    `🤖 *Solicitud — Bot IA & WhatsApp | WP Ecosystem*\n\nHola Dr. Walther, estoy interesado en el servicio de automatización con IA para WhatsApp.\n\n*Líneas WhatsApp requeridas:* ${lines}\n*Plan seleccionado:* ${["Bot Web Essentials", "Bot Web + WhatsApp IA", "Omnicanal Premium"][selectedPlan]}\n*Cotización:* Solicito propuesta personalizada\n\n¡Me gustaría agendar una reunión para conocer más detalles!`
  )}`;

  return (
    <main className="min-h-screen bg-[#04060a] text-white font-sans relative overflow-x-hidden selection:bg-emerald-600 selection:text-white">

      {/* ═══ GLOW ORBS DE FONDO ═══ */}
      <div className="fixed top-[-15%] left-[-10%] w-[700px] h-[700px] bg-emerald-600/10 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-green-500/8 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10">

        {/* ═══ HEADER NAV ═══ */}
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
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm text-white">WhatsApp IA</span>
              </div>
            </div>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              Hablar con un experto
            </a>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-20 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold mb-8">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Automatización con IA · WhatsApp Business API · Omnicanal
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-white">Tu negocio responde</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #34d399 0%, #06b6d4 50%, #818cf8 100%)",
              }}
            >
              24/7 con IA
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Automatiza la atención al cliente en WhatsApp, Instagram, Messenger y tu web con un
            agente de Inteligencia Artificial entrenado con la información de tu empresa.
          </p>

          {/* CTA Hero */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-2xl shadow-emerald-500/25"
            >
              <Send className="w-4 h-4" />
              Solicitar Demo Gratis
            </a>
            <a
              href="#planes"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-2xl transition-all"
            >
              Ver planes y precios
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats rápidas */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Clock, value: "24/7", label: "Atención sin parar" },
              { icon: Zap, value: "<1s", label: "Tiempo de respuesta" },
              { icon: Users, value: "Multi", label: "Agentes en paralelo" },
              { icon: BarChart3, value: "100%", label: "Analítica en tiempo real" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm text-center"
              >
                <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 3 PILARES / PLANES ═══ */}
        <section id="planes" className="max-w-7xl mx-auto px-4 md:px-8 py-24">

          <div className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Planes & Precios</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Elige el nivel de automatización
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Todos los planes incluyen IA conversacional nativa entrenada con la información de tu empresa. El precio varía según los canales y las líneas de WhatsApp activas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ─── PILAR 1: Web Bot ─── */}
            <div
              onClick={() => setSelectedPlan(0)}
              className={`relative p-7 rounded-3xl border cursor-pointer transition-all duration-300 ${
                selectedPlan === 0
                  ? "border-emerald-500/60 bg-emerald-500/8 shadow-2xl shadow-emerald-500/10"
                  : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                {selectedPlan === 0 && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black text-white mb-1">Bot Web Essentials</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Bot de IA en tu sitio web. Responde preguntas, captura leads y filtra consultas automáticamente.
              </p>
              <div className="mb-6">
                <span className="text-2xl font-black text-white">Cotización a la medida</span>
                <p className="text-xs text-gray-500 mt-1">Setup e integración incluidos según requerimientos</p>
              </div>
              <ul className="space-y-2.5 text-sm">
                {["Widget de chat IA en tu web", "Entrenado con tu negocio (RAG)", "Panel de métricas básico", "Soporte por email"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-gray-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/8">
                <span className="text-xs text-gray-500">Canal incluido:</span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2.5 py-1 bg-slate-700/50 border border-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Web
                  </div>
                </div>
              </div>
            </div>

            {/* ─── PILAR 2: WA + Web — POPULAR ─── */}
            <div
              onClick={() => setSelectedPlan(1)}
              className={`relative p-7 rounded-3xl border cursor-pointer transition-all duration-300 ${
                selectedPlan === 1
                  ? "border-cyan-400/60 bg-cyan-500/8 shadow-2xl shadow-cyan-500/15"
                  : "border-cyan-500/25 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              {/* Badge popular */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-widest">
                ✦ Más Popular
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                {selectedPlan === 1 && (
                  <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black text-white mb-1">Bot Web + WhatsApp IA</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Todo lo del plan web más integración real con WhatsApp Business API. Tu bot responde, gestiona y escala a un agente cuando sea necesario.
              </p>
              <div className="mb-6">
                <span className="text-2xl font-black text-white">Según líneas activas</span>
                <p className="text-xs text-gray-500 mt-1">Tarifa flexible adaptada a tus números requeridos</p>
              </div>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Todo lo del plan Web",
                  "WhatsApp Business API (Meta)",
                  "Handoff a agente humano",
                  "Notificaciones proactivas",
                  "Respuestas automáticas 24/7",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-gray-300">
                    <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/8">
                <span className="text-xs text-gray-500">Canales incluidos:</span>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="px-2.5 py-1 bg-slate-700/50 border border-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Web
                  </div>
                  <div className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center gap-1.5">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </div>
                </div>
              </div>
            </div>

            {/* ─── PILAR 3: Omnicanal Premium ─── */}
            <div
              onClick={() => setSelectedPlan(2)}
              className={`relative p-7 rounded-3xl border cursor-pointer transition-all duration-300 ${
                selectedPlan === 2
                  ? "border-purple-500/60 bg-purple-500/8 shadow-2xl shadow-purple-500/15"
                  : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                {selectedPlan === 2 && (
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black text-white mb-1">Omnicanal Premium</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Automatización total. Tu IA atiende en WhatsApp, Instagram, Messenger, Telegram y tu web desde un solo sistema centralizado.
              </p>
              <div className="mb-6">
                <span className="text-2xl font-black text-white">Plan Enterprise</span>
                <p className="text-xs text-gray-500 mt-1">Solución a la medida para múltiples redes</p>
              </div>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Todo lo del plan WhatsApp",
                  "Instagram DM + Messenger",
                  "Telegram & otras redes",
                  "CRM integrado multicanal",
                  "Analítica avanzada omnicanal",
                  "Soporte prioritario dedicado",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-gray-300">
                    <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/8">
                <span className="text-xs text-gray-500">Todos los canales:</span>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="px-2.5 py-1 bg-slate-700/50 border border-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Web
                  </div>
                  <div className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center gap-1.5">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </div>
                  <div className="px-2.5 py-1 bg-pink-500/15 border border-pink-500/30 rounded-lg text-xs text-pink-400 flex items-center gap-1.5">
                    <Share2 className="w-3 h-3" /> IG
                  </div>
                  <div className="px-2.5 py-1 bg-blue-500/15 border border-blue-500/30 rounded-lg text-xs text-blue-400 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> +más
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nota setup */}
          <p className="text-center text-xs text-gray-500 mt-6">
            * Todos los planes incluyen integración oficial con Meta API, entrenamiento personalizado de IA RAG y puesta a punto de canales.
          </p>
        </section>

        {/* ═══ CALCULADORA DE LÍNEAS WHATSAPP ═══ */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
          <div className="p-8 md:p-12 rounded-3xl border border-white/8 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">

            {/* Glow de fondo */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/8 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Calculadora</p>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                ¿Cuántas líneas de WhatsApp necesitas?
              </h2>
              <p className="text-gray-400 text-sm mb-10">
                Selecciona la cantidad de números de WhatsApp que requiere tu empresa para consultar tu plan ideal.
              </p>

              {/* Slider + controles */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Líneas de WhatsApp activas</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLines(Math.max(1, lines - 1))}
                      className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5 text-white" />
                    </button>
                    <span className="text-3xl font-black text-white w-12 text-center tabular-nums">
                      {lines}
                    </span>
                    <button
                      onClick={() => setLines(Math.min(30, lines + 1))}
                      className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={30}
                  value={lines}
                  onChange={(e) => setLines(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${((lines - 1) / 29) * 100}%, rgba(255,255,255,0.1) ${((lines - 1) / 29) * 100}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />

                {/* Etiquetas de rango */}
                <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>30</span>
                </div>
              </div>

              {/* Resultado del precio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 col-span-1 md:col-span-2">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
                    Plan Seleccionado — {tier.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      Cotización a la medida
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Configuración para {lines} {lines === 1 ? "línea" : "líneas"} de WhatsApp activas · Rango {tier.min}–{tier.max}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/8">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Setup & Meta API</p>
                  <div className="text-xl font-black text-white">A consultar</div>
                  <p className="text-xs text-gray-500 mt-1">Incluido en propuesta</p>
                </div>
              </div>

              {/* Tabla de rangos */}
              <div className="overflow-hidden rounded-2xl border border-white/8">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/[0.03]">
                      <th className="text-left px-4 py-3 text-gray-400 font-bold uppercase tracking-wider">Categoría</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-bold uppercase tracking-wider">Líneas WA</th>
                      <th className="text-center px-4 py-3 text-gray-400 font-bold uppercase tracking-wider">Modalidad</th>
                      <th className="text-right px-4 py-3 text-gray-400 font-bold uppercase tracking-wider">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WA_PRICE_TIERS.map((t) => {
                      const isActive = tier.label === t.label;
                      return (
                        <tr
                          key={t.label}
                          className={`border-b border-white/5 last:border-0 transition-all ${
                            isActive
                              ? "bg-emerald-500/10 text-white"
                              : "text-gray-400 hover:bg-white/[0.02]"
                          }`}
                        >
                          <td className="px-4 py-3 font-bold">
                            {t.label}
                            {isActive && (
                              <span className="ml-2 px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-400 text-[9px] font-black uppercase">
                                Seleccionado
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {t.min}–{t.max} líneas
                          </td>
                          <td className="px-4 py-3 text-center text-gray-400">
                            Escalable
                          </td>
                          <td className="px-4 py-3 text-right">
                            <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                              Cotizar
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TABLA COMPARATIVA DE FEATURES ═══ */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              Comparativa completa de planes
            </h2>
            <p className="text-gray-400 text-sm">Todos los planes incluyen IA conversacional nativa.</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] backdrop-blur-sm">
            {/* Encabezado */}
            <div className="grid grid-cols-4 border-b border-white/8 bg-white/[0.03]">
              <div className="px-6 py-4 text-xs text-gray-400 font-bold uppercase tracking-wider">Característica</div>
              {["🌐 Web Bot", "📱 WA + Web", "🚀 Omnicanal"].map((plan, i) => (
                <div
                  key={i}
                  className={`px-4 py-4 text-center text-xs font-black uppercase tracking-wider ${
                    i === 1 ? "text-cyan-400" : i === 2 ? "text-purple-400" : "text-gray-300"
                  }`}
                >
                  {plan}
                </div>
              ))}
            </div>
            {/* Filas */}
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 border-b border-white/5 last:border-0 ${
                  i % 2 === 0 ? "bg-white/[0.01]" : ""
                }`}
              >
                <div className="px-6 py-3.5 text-xs text-gray-300 font-medium">{feat.label}</div>
                {feat.plans.map((has, j) => (
                  <div key={j} className="px-4 py-3.5 flex justify-center">
                    {has ? (
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          j === 0
                            ? "bg-emerald-500/20 border border-emerald-500/40"
                            : j === 1
                            ? "bg-cyan-500/20 border border-cyan-500/40"
                            : "bg-purple-500/20 border border-purple-500/40"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            j === 0 ? "text-emerald-400" : j === 1 ? "text-cyan-400" : "text-purple-400"
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                        <div className="w-2 h-0.5 bg-white/20 rounded" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ═══ BENCHMARKING vs MERCADO ═══ */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              ¿Por qué WP Ecosystem?
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Comparado con las plataformas globales, WP Ecosystem ofrece IA conversacional nativa en español, sin cobros ocultos de Meta y con soporte local en Colombia.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] backdrop-blur-sm">
            <div className="grid grid-cols-4 border-b border-white/8 bg-white/[0.03] text-xs font-bold uppercase tracking-wider text-gray-400">
              <div className="px-6 py-4">Plataforma</div>
              <div className="px-4 py-4 text-center">Precio/mes</div>
              <div className="px-4 py-4 text-center">IA nativa</div>
              <div className="px-4 py-4 text-center">WhatsApp API</div>
            </div>
            {COMPETITORS.map((c, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 border-b border-white/5 last:border-0 transition-all ${
                  c.highlight
                    ? "bg-emerald-500/8 border-emerald-500/20"
                    : i % 2 === 0
                    ? "bg-white/[0.01]"
                    : ""
                }`}
              >
                <div className={`px-6 py-4 text-sm font-bold ${c.highlight ? "text-emerald-400" : "text-gray-300"}`}>
                  {c.name}
                </div>
                <div className={`px-4 py-4 text-center text-sm font-bold ${c.highlight ? "text-emerald-400" : "text-gray-400"}`}>
                  {c.price}
                </div>
                <div className="px-4 py-4 flex justify-center">
                  {c.ia === true ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.highlight ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-gray-300"}`}>
                      ✓ Sí
                    </span>
                  ) : c.ia === false ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">✗ No</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Extra</span>
                  )}
                </div>
                <div className="px-4 py-4 flex justify-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.highlight ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-gray-300"}`}>
                    ✓ Sí
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-24">
          <div className="relative p-10 md:p-16 rounded-[2rem] overflow-hidden text-center"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 50%, rgba(129,140,248,0.10) 100%)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            {/* Glow interno */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
                <Bot className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                ¿Listo para automatizar tu negocio?
              </h2>
              <p className="text-gray-300 text-base mb-8 max-w-xl mx-auto leading-relaxed">
                Escríbenos por WhatsApp y en menos de 24 horas te presentamos una propuesta personalizada con demo incluida.
              </p>

              {/* Resumen del plan seleccionado */}
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl mb-8 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Plan seleccionado:</span>
                <span className="font-bold text-white">
                  {["Bot Web Essentials", "Bot Web + WhatsApp IA", "Omnicanal Premium"][selectedPlan]}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="font-bold text-emerald-400">Cotización a la medida</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-2xl shadow-emerald-500/25 w-full sm:w-auto justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Solicitar propuesta por WhatsApp
                </a>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-sm rounded-2xl transition-all w-full sm:w-auto justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Hub
                </Link>
              </div>

              {/* Info de contacto */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Sin compromisos · Demo sin costo
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  Respuesta en menos de 24h
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  waltherparrado.com
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER MÍNIMO ═══ */}
        <footer className="border-t border-white/5 py-8 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} WP Ecosystem — Walther Parrado · Automatización con IA ·{" "}
            <Link href="/privacidad" className="hover:text-gray-400 transition-colors">
              Privacidad
            </Link>{" "}
            ·{" "}
            <Link href="/habeas-data" className="hover:text-gray-400 transition-colors">
              Habeas Data
            </Link>
          </p>
        </footer>

      </div>
    </main>
  );
}
