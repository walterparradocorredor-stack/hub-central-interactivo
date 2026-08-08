"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles, Cpu, CheckCircle2, ArrowRight, ShieldCheck, Zap, Laptop, ShoppingCart, Bot, CreditCard, FileText, MapPin, Lock, Send, Layers, HelpCircle, Check, ArrowLeft, RefreshCw
} from "lucide-react";

export default function CotizarWebPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<any>(null);

  // Form State
  const [clientName, setClientName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState("WhatsApp");
  const [projectType, setProjectType] = useState("SaaS / Web App Avanzada");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Panel Admin CMS Completo",
    "Chatbot IA Conversacional (WhatsApp / Web)",
    "Pasarela de Pagos (Wompi / MercadoPago)",
  ]);
  const [targetAudience, setTargetAudience] = useState("Empresas & Clientes B2B");
  const [designStyle, setDesignStyle] = useState("Dark Glassmorphic Premium (Futurista)");
  const [estimatedBudget, setEstimatedBudget] = useState("Medio ($1.500 - $3.500 USD)");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [habeasConsent, setHabeasConsent] = useState(true);

  const projectTypesList = [
    {
      id: "SaaS / Web App Avanzada",
      title: "Plataforma SaaS / Web App",
      desc: "Software en la nube con suscripciones, multitenancy y alta escalabilidad.",
      icon: "🚀",
    },
    {
      id: "Landing Page Corporativa Premium",
      title: "Landing Page Premium",
      desc: "Diseño cinematográfico enfocado en alta conversión, SEO y captura de leads.",
      icon: "⚡",
    },
    {
      id: "E-Commerce / Tienda Virtual",
      title: "Tienda Virtual / E-Commerce",
      desc: "Catálogo de productos, carrito de compras, inventario y checkout de pago en vivo.",
      icon: "🛒",
    },
    {
      id: "Portal Institucional / Educativo",
      title: "Portal Educativo / Institucional",
      desc: "Integración con Campus Virtual, admisiones, Q10 y gestión de estudiantes.",
      icon: "🎓",
    },
    {
      id: "Software / Sistema a Medida",
      title: "Software Empresarial a Medida",
      desc: "Arquitectura personalizada con microservicios, DIAN, WAF y automatización con IA.",
      icon: "🏛️",
    },
  ];

  const featuresList = [
    {
      id: "Panel Admin CMS Completo",
      title: "🖥️ Panel Admin CMS Completo",
      desc: "Gestión total de usuarios, roles, publicaciones, métricas y contenido en tiempo real.",
    },
    {
      id: "Chatbot IA Conversacional (WhatsApp / Web)",
      title: "🤖 Chatbot de IA Omnicanal",
      desc: "Agente inteligente capacitado con la información de tu empresa para atención 24/7 y Meta API WhatsApp.",
    },
    {
      id: "Pasarela de Pagos (Wompi / MercadoPago)",
      title: "💳 Pasarela de Pagos & Suscripciones",
      desc: "Recepción de pagos en línea con PSE, tarjetas de crédito, Wompi, MercadoPago o Stripe.",
    },
    {
      id: "Facturación Electrónica DIAN",
      title: "🧾 Facturación Electrónica DIAN",
      desc: "Integración con firmador digital GSE, UBL 2.1 y generación de PDF/XML oficial.",
    },
    {
      id: "Aula Virtual / Campus LMS",
      title: "🎓 Aula Virtual & Certificados",
      desc: "Gestión de notas, guías académicas, evaluaciones automáticas con IA e insignias digitales.",
    },
    {
      id: "GeoInteligencia & Google Maps API",
      title: "📍 Google Maps Autocomplete & GeoInteligencia",
      desc: "Búsqueda de direcciones inteligente, mapas interactivos y análisis territorial.",
    },
    {
      id: "Ciberseguridad WAF & Anti-Prompt Injection",
      title: "🛡️ Ciberseguridad WAF & Protección IA",
      desc: "Escudo de seguridad empresarial contra inyección SQL, ataques DDoS y manipulación de LLMs.",
    },
    {
      id: "PWA / App Móvil Instalable",
      title: "📱 PWA (Progressive Web App)",
      desc: "La página funciona como App móvil instalable sin necesidad de tiendas App Store / Play Store.",
    },
    {
      id: "Notificaciones Email & WhatsApp Transaccional",
      title: "📧 Notificaciones Automáticas Transaccionales",
      desc: "Envío automático de correos, comprobantes de pago y avisos por WhatsApp a clientes.",
    },
  ];

  const toggleFeature = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };

  const handleSubmitBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      alert("Por favor ingresa tu número de WhatsApp o correo electrónico.");
      return;
    }
    if (!habeasConsent) {
      alert("Debes aceptar la autorización de uso de datos (Ley 1581 de Habeas Data) para enviar el brief.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/web-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          company,
          contact,
          contactType,
          projectType,
          selectedFeatures,
          targetAudience,
          designStyle,
          estimatedBudget,
          additionalNotes,
          habeasDataConsent: habeasConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar la solicitud.");

      setGeneratedBrief(data.brief);
      setStep(4);
    } catch (err: any) {
      alert("Error generando brief: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!generatedBrief) return "https://wa.me/573045788873";
    const msg = `🚀 *SOLICITUD DE COTIZACIÓN DE SOFTWARE & IA*
    
*Cliente:* ${generatedBrief.clientName || "Empresa"} (${generatedBrief.company || "N/A"})
*Contacto:* ${generatedBrief.contact}
*Tipo de Proyecto:* ${generatedBrief.projectType}
*Módulos Requeridos:* ${generatedBrief.selectedFeatures.join(", ")}
*Presupuesto Estimado:* ${generatedBrief.estimatedBudget}

Hola Manuel / J&M Tech Solutions, he generado la estructura técnica de mi proyecto en el portal. ¡Me gustaría recibir la cotización formal y agendar una reunión ejecutiva!`;

    return `https://wa.me/573045788873?text=${encodeURIComponent(msg)}`;
  };

  return (
    <main className="min-h-screen bg-[#04060a] text-white p-4 md:p-10 font-sans relative overflow-hidden selection:bg-purple-600 selection:text-white">
      {/* GLOW ORBS */}
      <div className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] bg-purple-600/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-300">
                AI Web Architect & Brief Builder
              </h1>
              <p className="text-xs text-gray-400">
                Diseña la estructura de tu proyecto web o SaaS con Inteligencia Artificial y recibe una cotización ejecutiva.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 animate-pulse" /> J&M Tech Solutions
            </span>
          </div>
        </header>

        {/* PROGRESS INDICATOR */}
        <div className="grid grid-cols-4 gap-2 border-b border-white/10 pb-4 text-xs font-bold">
          <div className={`p-2.5 rounded-xl text-center flex items-center justify-center gap-2 transition-all ${step >= 1 ? "bg-purple-600 text-white" : "bg-white/5 text-gray-500"}`}>
            <span>1. Tipo de Proyecto</span>
          </div>
          <div className={`p-2.5 rounded-xl text-center flex items-center justify-center gap-2 transition-all ${step >= 2 ? "bg-purple-600 text-white" : "bg-white/5 text-gray-500"}`}>
            <span>2. Módulos & Full Integración</span>
          </div>
          <div className={`p-2.5 rounded-xl text-center flex items-center justify-center gap-2 transition-all ${step >= 3 ? "bg-purple-600 text-white" : "bg-white/5 text-gray-500"}`}>
            <span>3. Datos & Envíos</span>
          </div>
          <div className={`p-2.5 rounded-xl text-center flex items-center justify-center gap-2 transition-all ${step >= 4 ? "bg-emerald-600 text-white" : "bg-white/5 text-gray-500"}`}>
            <span>4. Brief & Cotización</span>
          </div>
        </div>

        {/* STEP 1: TIPO DE PROYECTO */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                ¿Qué tipo de solución tecnológica deseas construir?
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Selecciona la categoría principal de tu plataforma para adaptar la arquitectura.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypesList.map((pt) => {
                const selected = projectType === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setProjectType(pt.id)}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                      selected
                        ? "bg-purple-600/20 border-purple-500 text-white shadow-xl shadow-purple-500/20 scale-[1.02]"
                        : "bg-slate-900/60 border-white/10 text-gray-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{pt.icon}</span>
                      {selected && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white mb-1">{pt.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{pt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                Siguiente: Elegir Módulos <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MÓDULOS E INTEGRACIONES */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Selecciona los Módulos de Tu Plataforma (A Full Integración)
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Puedes incluir Panel Admin CMS, Agentes de IA, Facturación DIAN, Pasarelas de Pago y más.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuresList.map((feat) => {
                const selected = selectedFeatures.includes(feat.id);
                return (
                  <button
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      selected
                        ? "bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-cyan-400 text-white shadow-xl shadow-cyan-500/20"
                        : "bg-slate-900/60 border-white/10 text-gray-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-white">{feat.title}</h3>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${selected ? "bg-cyan-500 border-cyan-400" : "border-gray-600"}`}>
                        {selected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{feat.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Volver
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                Siguiente: Datos de Contacto <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATOS DE CONTACTO Y NOTAS */}
        {step === 3 && (
          <form onSubmit={handleSubmitBrief} className="space-y-6">
            <div className="text-left">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Datos de Contacto y Alcance del Proyecto
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                La Inteligencia Artificial generará el reporte de arquitectura técnica y te lo enviará inmediatamente.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Ing. Carlos Mendoza"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Empresa / Proyecto</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ej. InnovaTech S.A.S."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Teléfono WhatsApp o Correo</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+57 300 000 0000 o correo@empresa.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Presupuesto / Alcance Estimado</label>
                  <select
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Básico ($500 - $1.200 USD)">Landing / Sitio Básico ($500 - $1.200 USD)</option>
                    <option value="Medio ($1.500 - $3.500 USD)">SaaS / Plataforma Completa ($1.500 - $3.500 USD)</option>
                    <option value="Enterprise ($4.000+ USD)">Software Enterprise & Multi-tenant ($4.000+ USD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Detalles o Requerimientos Especiales</label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                  placeholder="Describe funciones específicas que deseas incluir..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              {/* HABEAS DATA CONSENT */}
              <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-white/5">
                <input
                  type="checkbox"
                  id="habeas"
                  checked={habeasConsent}
                  onChange={(e) => setHabeasConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-purple-600 rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="habeas" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
                  Autorizo el tratamiento de mis datos personales de acuerdo con la <strong>Ley 1581 de 2012 (Habeas Data)</strong> para recibir la propuesta comercial y cotización ejecutiva de J&M Tech Solutions.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Generando Brief con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generar Brief & Recibir Cotización
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: REPORTE GENERADO & ACCIONES */}
        {step === 4 && generatedBrief && (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-center space-y-1">
              <h2 className="text-lg font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> ¡Brief de Arquitectura Generado Exitosamente!
              </h2>
              <p className="text-xs text-emerald-300">
                Tu solicitud ha sido registrada en Supabase DB. Puedes revisar las especificaciones abajo y enviarlas a nuestro WhatsApp en 1-clic.
              </p>
            </div>

            {/* BRIEF DISPLAY */}
            <div className="bg-slate-900/80 border border-white/10 p-6 md:p-8 rounded-3xl space-y-6 text-left shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {generatedBrief.clientName} — {generatedBrief.company}
                  </h3>
                  <span className="text-xs text-indigo-400 font-semibold">
                    {generatedBrief.projectType} • {generatedBrief.estimatedBudget}
                  </span>
                </div>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Enviar Especificaciones a WhatsApp
                </a>
              </div>

              {/* AI BRIEF TEXT */}
              <div className="prose prose-invert max-w-none text-xs leading-relaxed text-gray-300 space-y-3 font-mono whitespace-pre-wrap bg-slate-950 p-6 rounded-2xl border border-white/5">
                {generatedBrief.aiTechnicalBrief}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Crear Otro Brief / Proyecto
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
