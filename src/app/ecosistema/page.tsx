"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AIChatBubble from "@/components/AIChatBubble";
import {
  Sparkles, Cpu, ExternalLink, ArrowRight, ShieldCheck, Globe, MapPin, Info, Scale, Lock, Search, Bot, ChevronRight, Zap, CheckCircle2, Star, TrendingUp, Layers, Activity
} from "lucide-react";

type Project = {
  name: string;
  description: string;
  tag: string;
  url: string;
  logoUrl?: string;
  badgeColor: string;
  internalRoute?: string;
  statusBadge?: string;
  metrics?: string;
};

type Category = {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  projects: Project[];
};

const defaultCategories: Category[] = [
  {
    id: "educacion",
    title: "Educación, Validación y PreICFES",
    icon: "🎓",
    subtitle: "Plataformas tecnológicas de alto impacto para formación media, preparatoria y continuada.",
    projects: [
      {
        name: "PreICFES App",
        description: "Entrenamiento interactivo, simulacros inteligentes y análisis de resultados para pruebas Saber 11.",
        tag: "SaaS Educativo IA",
        url: "https://preicfes.app/",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        statusBadge: "SaaS con IA Active",
        metrics: "10K+ Estudiantes Impactados",
      },
      {
        name: "Fundetec Institucional",
        description: "Portal principal de educación técnica y académica con admisiones y chat IA ErIA integrado.",
        tag: "Institución Educativa",
        url: "https://fundetec.edu.co/",
        badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        statusBadge: "Sedes & Modalidades",
        metrics: "Técnicos & Bachillerato",
      },
      {
        name: "Fundetec Campus Virtual",
        description: "Aula y campus virtual para estudiantes, entrega de guías, evaluaciones y seguimiento Q10.",
        tag: "Campus Virtual Q10",
        url: "https://virtual.fundetec.edu.co/",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        statusBadge: "Integración Q10",
        metrics: "Plataforma 24/7 Cloud",
      },
      {
        name: "University Idiomas Link",
        description: "Socio estratégico e integral de alianzas educativas internacionales para la enseñanza e implementación del idioma inglés en FUNDETEC.",
        tag: "Socio Integral Bilingüismo",
        url: "https://universityidiomaslink.com/",
        logoUrl: "https://universityidiomaslink.com/wp-content/uploads/2025/06/Color-Vertical-1.png",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        statusBadge: "Socio Estratégico Active",
        metrics: "Alianza Internacional",
      },
      {
        name: "Fundetec Inglés",
        description: "Portal y programa institucional de formación bilingüe de FUNDETEC con niveles A1 a C1 y cursos continuados.",
        tag: "Programa Bilingüe Oficial",
        url: "https://fundetec.edu.co/ingles/",
        badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
        statusBadge: "Acreditación & Cursos",
        metrics: "Niveles A1 a C1",
      },
      {
        name: "Alcanza Una Beca",
        description: "Plataforma de orientación, convocatorias y acompañamiento para acceder a becas de educación superior.",
        tag: "Becas & EdTech",
        url: "https://alcanzaunabeca.org",
        badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
        statusBadge: "Becas & Oportunidades",
        metrics: "Orientación Estudiantil",
      },
      {
        name: "Walpa Planner Fundetec",
        description: "Planificador académico inteligente y sistema de gestión de actividades y horarios de clase.",
        tag: "Planificador Cloud",
        url: "https://walpaplanner.fundetec.cloud/",
        badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        statusBadge: "Cloud Fundetec Active",
        metrics: "Gestión Académica",
      },
      {
        name: "Parla 360",
        description: "Plataforma EdTech de aprendizaje de idiomas y comunicación asistida por modelos conversacionales de IA.",
        tag: "EdTech Idiomas IA",
        url: "https://parla360.tech",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        statusBadge: "IA Conversacional Active",
        metrics: "Aprendizaje 360°",
      },
    ],
  },
  {
    id: "identidad-govtech",
    title: "Identidad Digital & GovTech 360",
    icon: "🆔",
    subtitle: "Ecosistema de soluciones de identificación, validación de cédulas, traducción documental y analítica territorial.",
    projects: [
      {
        name: "Cédula 360 Tech",
        description: "Plataforma integral de verificación, consulta e identidad digital inteligente de última generación.",
        tag: "GovTech & Identidad",
        url: "https://cedula360.tech",
        badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
        statusBadge: "Verificación Digital",
        metrics: "Validación Instantánea",
      },
      {
        name: "Cédula 360 Translate",
        description: "Herramienta de traducción inteligente multilingüe especializada en documentos oficiales y credenciales.",
        tag: "Traducción Document AI",
        url: "https://translate.cedula360.tech",
        badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/30",
        statusBadge: "Document AI Engine",
        metrics: "Traducción Multilingüe",
      },
      {
        name: "Cédula 360 DeepMap",
        description: "Sistema de geolocalización, mapas térmicos profundos y análisis geoespacial para inteligencia territorial.",
        tag: "GeoInteligencia Spatial",
        url: "https://deepmap.cedula360.tech",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        statusBadge: "Deep Spatial Analytics",
        metrics: "Mapeo Territorial 360°",
      },
      {
        name: "Cédula 360 Pulse",
        description: "Monitor de métricas en tiempo real, telemetría de rendimiento y estado de la red de nodos cloud.",
        tag: "Telemetría Real-time",
        url: "https://pulse.cedula360.tech",
        badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        statusBadge: "Nodos & Telemetría",
        metrics: "Salud Cloud 24/7",
      },
    ],
  },
  {
    id: "liderazgo",
    title: "Liderazgo y Formación Directiva",
    icon: "🏛️",
    subtitle: "Ecosistema de aceleración ejecutiva y mentalidad estratégica para líderes del futuro.",
    projects: [
      {
        name: "Jowhalth Academy",
        description: "Academia de alto nivel orientada al desarrollo directivo, liderazgo transformacional y gestión ejecutiva.",
        tag: "Executive Education",
        url: "https://jowhalthacademy.com/",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        statusBadge: "Alta Dirección Exec",
        metrics: "Diplomados Directivos",
      },
      {
        name: "Jowhalth Tutor AI",
        description: "Tutor inteligente de IA y mentor académico personalizado para estudiantes y ejecutivos de Jowhalth Academy.",
        tag: "Tutor IA Ejecutivo",
        url: "https://tutor.jowhalthacademy.com",
        badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
        statusBadge: "Agente Tutor Active",
        metrics: "Mentoría Personalizada",
      },
    ],
  },
  {
    id: "saas-consultoria",
    title: "Inversiones & Propiedades Premium",
    icon: "📈",
    subtitle: "Plataformas de inversión, tecnología inmobiliaria y soluciones corporativas escalables.",
    projects: [
      {
        name: "Rentun Group",
        description: "Alojamiento premium, asesoría inmobiliaria y gestión integral de propiedades en zonas exclusivas de Bogotá.",
        tag: "Inmobiliaria & Propiedades",
        url: "https://www.rentungroup.com/",
        internalRoute: "/rentun",
        logoUrl: "https://www.rentungroup.com/logos/rentungroupwithe.webp",
        badgeColor: "bg-[#A9843C]/20 text-[#A9843C] border-[#A9843C]/40",
        statusBadge: "Landing Interna & DB Sync",
        metrics: "Bogotá 4 Zonas Premium",
      },
    ],
  },
  {
    id: "software-ia",
    title: "Soluciones de Software & IA B2B",
    icon: "⚡",
    subtitle: "Desarrollo a medida, automatización con agentes de IA y arquitectura cloud de vanguardia.",
    projects: [
      {
        name: "Walther Parrado — Consultoría IA",
        description: "Transformación digital, agentes autónomos de IA y arquitectura cloud B2B para empresas líderes.",
        tag: "Transformación Digital B2B",
        url: "https://waltherparrado.com/",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        statusBadge: "250+ Agentes Especializados",
        metrics: "Consultoría Estratégica",
      },
      {
        name: "Ollama LLM Local Engine",
        description: "Infraestructura de ejecución de modelos de lenguaje locales y agentes de IA de alto rendimiento en servidores privados.",
        tag: "Infraestructura LLM",
        url: "https://ollama.com",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        statusBadge: "Local AI Server Active",
        metrics: "Inferencia Privada Cloud",
      },
      {
        name: "Venta de Dominios Web & SSL",
        description: "Búsqueda, cotización y registro instantáneo de dominios web en tiempo real impulsado por la API de Namecheap.",
        tag: "Infraestructura & Dominios",
        url: "/dominios",
        internalRoute: "/dominios",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        statusBadge: "Namecheap API Active",
        metrics: "Consulta Instantánea",
      },
      {
        name: "Agente IA WhatsApp",
        description: "Asistentes de IA conversacionales para ventas, soporte y atención al cliente directamente en WhatsApp.",
        tag: "Agentes Conversacionales",
        url: "/whatsapp-ia",
        internalRoute: "/whatsapp-ia",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        statusBadge: "En Vivo 24/7",
        metrics: "WhatsApp Business API",
      },
      {
        name: "JARVIS AI — Asistente Ejecutivo",
        description: "Asistente de IA personal que gestiona agenda, correo, voz y visión en tiempo real. Probalo con datos de ejemplo, sin crear cuenta.",
        tag: "Agentes Conversacionales",
        url: "/jarvis-demo",
        internalRoute: "/jarvis-demo",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        statusBadge: "Demo en Vivo",
        metrics: "Calendar · Gmail · Voz · Visión",
      },
    ],
  },
];

export default function HubLandingPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // MOUSE SPOTLIGHT EFFECT
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // COSMIC PARTICLE CANVAS SYSTEM (Estilo jymtechsolutions.online)
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

    // Particle Object Structure
    const particleCount = Math.min(80, Math.floor(width / 20));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 0.5,
      color: [
        "rgba(168, 85, 247, ", // Purple
        "rgba(56, 189, 248, ", // Cyan
        "rgba(169, 132, 60, ", // Gold
        "rgba(244, 63, 94, ",  // Rose
      ][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Particles & Constellation Lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Glow dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color + "0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
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

  // FETCH SUPABASE DATA
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase
          .from("cms_content")
          .select("content")
          .eq("id", "hub_projects_data")
          .maybeSingle();

        if (data?.content && Array.isArray(data.content)) {
          setCategories(data.content);
        }
      } catch (err) {
        console.warn("Cargando proyectos por defecto del Hub", err);
      }
    };
    fetchProjects();
  }, []);

  const filteredCategories = categories
    .filter((cat) => activeTab === "all" || cat.id === activeTab)
    .map((cat) => ({
      ...cat,
      projects: cat.projects.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tag.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.projects.length > 0);

  const totalProjects = categories.reduce((acc, c) => acc + c.projects.length, 0);

  return (
    <main className="min-h-screen bg-[#04060a] bg-grid-cosmic text-white flex flex-col justify-between p-4 md:p-8 font-sans relative overflow-hidden selection:bg-purple-600 selection:text-white">
      {/* HTML5 COSMIC PARTICLES CANVAS */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-70"
      />

      {/* DYNAMIC MOUSE RADIAL SPOTLIGHT */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.12), rgba(56, 189, 248, 0.08) 50%, transparent 80%)`,
        }}
      />

      {/* GLOWING AMBIENT ORBS (ESTILO J&M TECH SOLUTIONS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/25 blur-[160px] rounded-full animate-pulse-cosmic" />
        <div className="absolute top-[20%] right-[-5%] w-[550px] h-[550px] bg-cyan-500/22 blur-[170px] rounded-full animate-pulse-cosmic" />
        <div className="absolute bottom-[-10%] left-[30%] w-[650px] h-[650px] bg-[#A9843C]/18 blur-[180px] rounded-full animate-pulse-cosmic" />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="z-10 max-w-6xl w-full mx-auto flex flex-col gap-10 py-4">

        {/* TOP NAVBAR */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0f1d]/80 border border-white/10 p-4 md:px-7 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-[#A9843C] p-0.5 shadow-lg shadow-purple-500/30 flex-shrink-0 animate-float-1">
              <div className="w-full h-full bg-[#04060a] rounded-[14px] flex items-center justify-center overflow-hidden">
                <img src="/wp-logo.png" alt="WP Ecosystem Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-lg md:text-xl text-white tracking-tight flex items-center gap-2">
                WP Ecosystem{" "}
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Holding
                </span>
              </h1>
              <p className="text-xs text-[#A9843C] font-semibold tracking-wide flex items-center gap-1">
                Connecting Business Ecosystems <Sparkles className="w-3.5 h-3.5 text-[#A9843C] animate-spin" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/agentes"
              className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 border border-purple-400/50 shadow-lg shadow-purple-500/20"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-300 animate-bounce" /> 250 Agentes AI
            </Link>
            <Link
              href="/cotizar-web"
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-purple-500/40 shadow-lg shadow-purple-500/10 animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Cotizar Web & SaaS
            </Link>
            <Link
              href="/simulador"
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> 📱 Simulador Móvil
            </Link>
            <Link
              href="/nosotros"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" /> Nosotros
            </Link>
            <Link
              href="/ubicacion"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Ubicación
            </Link>
          </div>
        </header>

        {/* HERO SECTION CON PILLS FLOTANTES ESTILO J&M TECH SOLUTIONS */}
        <div className="w-full pt-4 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* COLUMNA IZQUIERDA: TITULO E INFORMACIÓN */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-purple-500/40 text-xs font-bold tracking-widest uppercase text-purple-300 shadow-xl backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" /> ECOSISTEMA TECNOLÓGICO DE IA & SOFTWARE
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
              El Ecosistema Tecnológico de{" "}
              <span className="shimmer-gradient-text block mt-1">
                Nuestras Empresas Líderes
              </span>
            </h2>

            <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed font-light">
              Orientamos e impulsamos la innovación tecnológica del holding: plataformas SaaS educativas Saber 11, Campus Virtuales Q10, programas ejecutivos directivos, gestión inmobiliaria premium y consultoría de Inteligencia Artificial B2B.
            </p>

            {/* BARRA DE BÚSQUEDA Y PESTAÑAS */}
            <div className="space-y-4 pt-2 max-w-xl">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por empresa, tecnología, servicios o palabras clave..."
                  className="w-full bg-[#0a0f1d]/90 border border-white/15 focus:border-cyan-400 rounded-2xl pl-11 pr-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-3 text-xs text-gray-400 hover:text-white"
                  >
                    ✕ Limpiar
                  </button>
                )}
              </div>

              {/* BOTONES PESTAÑAS CATEGORÍAS */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-[#A9843C] text-slate-950 shadow-lg shadow-[#A9843C]/20 scale-105"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  Todos ({totalProjects})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === cat.id
                        ? "bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 scale-105"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <span>{cat.icon}</span> {cat.title.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: PILLS FLOTANTES INTERACTIVAS (ESTILO CAPTURA J&M TECH) */}
          <div className="lg:col-span-5 relative min-h-[380px] flex items-center justify-center">
            
            {/* PILL 1: CHATBOTS IA */}
            <Link
              href="/agentes"
              className="absolute top-4 right-6 animate-float-1 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 border border-purple-400/40 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-purple-500/30 flex items-center gap-3 backdrop-blur-md hover:scale-105 transition-transform cursor-pointer group"
            >
              <Bot className="w-5 h-5 text-cyan-300 animate-pulse group-hover:rotate-12 transition-transform" />
              <div>
                <div className="text-xs font-extrabold flex items-center gap-1">
                  ErIkA AI Engine <ChevronRight className="w-3 h-3 text-cyan-300" />
                </div>
                <div className="text-[10px] text-purple-200">250 Agentes Especializados</div>
              </div>
            </Link>

            {/* PILL 2: PREICFES APP */}
            <div className="absolute top-28 left-2 animate-float-2 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 border border-emerald-400/40 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-3 backdrop-blur-md hover:scale-105 transition-transform cursor-pointer">
              <Zap className="w-5 h-5 text-amber-300" />
              <div>
                <div className="text-xs font-extrabold">PreICFES App SaaS</div>
                <div className="text-[10px] text-emerald-200">Entrenamiento Saber 11 IA</div>
              </div>
            </div>

            {/* PILL 3: FUNDETEC Q10 */}
            <div className="absolute bottom-20 right-2 animate-float-1 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 border border-cyan-400/40 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-cyan-500/30 flex items-center gap-3 backdrop-blur-md hover:scale-105 transition-transform cursor-pointer">
              <Globe className="w-5 h-5 text-blue-200" />
              <div>
                <div className="text-xs font-extrabold">FUNDETEC & Q10</div>
                <div className="text-[10px] text-cyan-100">Campus Virtual & Carreras</div>
              </div>
            </div>

            {/* PILL 4: RENTUN GROUP */}
            <div className="absolute bottom-2 left-10 animate-float-2 bg-gradient-to-r from-[#141F2B]/95 to-[#1c2b3c]/95 border border-[#A9843C]/50 text-[#F6F3EC] px-5 py-3 rounded-2xl shadow-2xl shadow-[#A9843C]/20 flex items-center gap-3 backdrop-blur-md hover:scale-105 transition-transform cursor-pointer">
              <TrendingUp className="w-5 h-5 text-[#A9843C]" />
              <div>
                <div className="text-xs font-extrabold text-[#A9843C]">Rentun Group</div>
                <div className="text-[10px] text-gray-300">Gestión de Propiedades Bogotá</div>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS STATS BAR ESTILO J&M TECH (300+%, 250+, 24/7) */}
        <div className="w-full bg-[#0a0f1d]/70 border border-white/10 rounded-3xl p-6 md:px-10 backdrop-blur-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-2xl">
          <Link
            href="/agentes"
            className="space-y-1 border-r border-white/10 last:border-0 pr-4 hover:brightness-125 transition-all cursor-pointer group"
          >
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 group-hover:scale-105 transition-transform">
              250+
            </div>
            <div className="text-xs font-bold text-gray-200 group-hover:text-purple-300">
              Agentes de IA →
            </div>
            <div className="text-[10px] text-gray-400">Ver Catálogo & Presentación</div>
          </Link>

          <div className="space-y-1 border-r border-white/10 last:border-0 pr-4">
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              10K+
            </div>
            <div className="text-xs font-bold text-gray-200">Estudiantes Activos</div>
            <div className="text-[10px] text-gray-400">PreICFES & Fundetec Q10</div>
          </div>

          <div className="space-y-1 border-r border-white/10 last:border-0 pr-4">
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#A9843C]">
              4 Zonas
            </div>
            <div className="text-xs font-bold text-gray-200">Cobertura Rentun</div>
            <div className="text-[10px] text-gray-400">Zona T, Retiro, Virrey, Sta Bárbara</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              24/7
            </div>
            <div className="text-xs font-bold text-gray-200">Operación Cloud</div>
            <div className="text-[10px] text-gray-400">Supabase & VPS Hostinger</div>
          </div>
        </div>

        {/* CATEGORIES AND PROJECTS GRID */}
        <div className="w-full space-y-12">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-5">
              
              {/* CATEGORY HEADER */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                    {cat.icon}
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-gray-400">{cat.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/30">
                  {cat.projects.length} {cat.projects.length === 1 ? "Empresa" : "Empresas"}
                </span>
              </div>

              {/* PROJECTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cat.projects.map((proj, pIdx) => (
                  <div
                    key={pIdx}
                    className="glass-cosmic-card glass-cosmic-card-hover rounded-3xl p-7 flex flex-col justify-between gap-6 relative group overflow-hidden"
                  >
                    {/* Top Right Glow Accent */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-[#A9843C]/25 transition-all" />

                    <div className="space-y-4 relative z-10">
                      {/* CARD HEADER */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          {proj.logoUrl ? (
                            <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-white/20 shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
                              <img
                                src={proj.logoUrl}
                                alt={proj.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center font-black text-white text-lg shadow-xl flex-shrink-0">
                              {proj.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="text-lg md:text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                              {proj.name}
                            </h4>
                            {proj.metrics && (
                              <span className="text-xs text-gray-400 font-medium block mt-0.5">
                                {proj.metrics}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* BADGE */}
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                            proj.badgeColor ||
                            "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          }`}
                        >
                          {proj.tag}
                        </span>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light">
                        {proj.description}
                      </p>

                      {/* STATUS PILL */}
                      {proj.statusBadge && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {proj.statusBadge}
                        </div>
                      )}
                    </div>

                    {/* CARD FOOTER ACTIONS */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
                      {proj.internalRoute ? (
                        <div className="flex items-center gap-3 w-full">
                          <Link
                            href={proj.internalRoute}
                            className="flex-1 bg-gradient-to-r from-[#A9843C] to-[#c19a4c] hover:brightness-110 text-slate-950 font-black text-xs py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group/btn"
                          >
                            Ver Landing Page Dedicada{" "}
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Ir a sitio web oficial externo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-between group/btn shadow-md"
                        >
                          <span>Visitar Plataforma Oficial</span>
                          <ExternalLink className="w-4 h-4 text-cyan-400 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BANNER IA ERIKA INTERACTIVO */}
        <div className="w-full bg-gradient-to-r from-purple-950/90 via-slate-900/90 to-indigo-950/90 border border-purple-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden my-4">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-cyan-400 to-[#A9843C] p-0.5 shadow-xl shadow-purple-500/30 flex-shrink-0 animate-bounce">
                <div className="w-full h-full bg-[#04060a] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-7 h-7 text-cyan-300" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  ErIkA — Asistente de IA Oficial
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    En Vivo 🤖
                  </span>
                </h3>
                <p className="text-xs text-gray-300 max-w-xl mt-1 leading-relaxed">
                  ¿Tienes dudas sobre PreICFES App, FUNDETEC, Rentun Group o consultoría? Haz tu pregunta en la burbuja del chat flotante y ErIkA te orientará en tiempo real.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-400">
                Haz clic abajo a la derecha ↘️ para chatear
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full border-t border-white/10 pt-8 pb-4 text-center text-xs text-gray-500 space-y-2">
          <p className="font-bold text-gray-400">
            WP Ecosystem — Walther Parrado Holding Corporativo & Tecnológico
          </p>
          <p className="text-[11px] font-mono">
            Desarrollado y Automatizado con IA por J&M Tech Solutions © 2026. Todos los derechos reservados.
          </p>
        </footer>
      </div>

      {/* ERIKA AI CHAT BUBBLE ELIMINADO PARA EVITAR DUPLICADO */}

    </main>
  );
}
