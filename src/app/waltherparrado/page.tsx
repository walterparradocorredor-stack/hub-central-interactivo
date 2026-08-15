import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AwardsSection } from "./AwardsSection";
import EducationSection from "./EducationSection";
import SchedulingSection from "./SchedulingSection";
import InteractiveParticles from "./InteractiveParticles";
import NavBar from "./NavBar";
import ProjectsPreview from "./ProjectsPreview";
import HeroSection from "./HeroSection";
import { Footer } from "./Footer";
import { supabase } from "@/lib/supabase";
import AIChatWidget from "./AIChatWidget";



export const metadata: Metadata = {
  title: "Dr. Walther Parrado — Consultor en Gerencia & Gestión Educativa",
  description:
    "Doctor en Gerencia Educativa, Magíster en Educación. Asesor, conferencista y consultor institucional en Colombia con más de 22 años de trayectoria.",
  alternates: {
    canonical: "https://waltherparrado.com",
  },
  openGraph: {
    title: "Dr. Walther Parrado — Liderazgo y Gestión Educativa",
    description: "Doctor en Gerencia Educativa, Magíster en Educación y Consultor Institucional.",
    images: [{ url: "/foto-de-perfil-de-walther-parrado.webp" }],
  },
};

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const blogPosts = [
  {
    id: "retos-gestion-educativa",
    title: "Retos de la gestión educativa regional",
    excerpt:
      "Una mirada profunda sobre las dinámicas de financiamiento educativo, infraestructura y cobertura escolar en el departamento de Sucre.",
    category: "Educación",
    date: "Mayo 2023",
    image: "/wp-logo.png",
    readTime: "7 min",
  },
  {
    id: "impulsando-el-desarrollo-de-sincelejo",
    title: "Impulsando el desarrollo educativo de Sincelejo",
    excerpt:
      "Propuestas concretas y reflexiones sobre cómo transformar la capital del Sucre en un referente de educación y desarrollo sostenible para el Caribe.",
    category: "Desarrollo",
    date: "Junio 2023",
    image: "/mpulsando-el-desarrollo-de-Sincelejo.webp",
    readTime: "5 min",
  },
  {
    id: "el-propio-de-sincelejo",
    title: "Gestión educativa en Sincelejo",
    excerpt:
      "Una mirada local sobre la actualidad pedagógica. Análisis semanal de la calidad educativa en la educación media colombiana.",
    category: "Calidad",
    date: "Julio 2023",
    image: "/wp-logo.png",
    readTime: "4 min",
  },
];

const mediaLogos = [
  { name: "El Heraldo", src: "/EL-HERALDO.webp" },
  { name: "El Sucreño", src: "/PERIODICO-EL-SUCRENO.webp" },
  { name: "El Meridiano de Sucre", src: "/periodico-el-meridiano-de-sucre.webp" },
];

const stats = [
  { value: "22+", label: "Años de experiencia", icon: "📅" },
  { value: "100.000+", label: "Egresados formados", icon: "🎓" },
  { value: "5.000+", label: "Red de voluntariado", icon: "👥" },
  { value: "50+", label: "Misiones académicas", icon: "🌍" },
];

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────




export function AboutSection() {
  return (
    <section
      id="sobre-mi"
      style={{
        padding: "7rem 1.5rem",
        background: "linear-gradient(180deg, var(--wp-navy) 0%, var(--wp-navy-2) 50%, var(--wp-navy) 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: "4rem", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 14px",
              background: "rgba(182, 146, 85, 0.12)",
              border: "1px solid rgba(182, 146, 85, 0.25)",
              borderRadius: "100px",
              color: "#bfac83",
              fontSize: "0.7rem",
              fontWeight: "700",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            SOBRE MÍ
          </span>
          <h2
            className="wl-serif"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: "500",
              color: "#f4f2ee",
              marginBottom: "1rem",
            }}
          >
            Constructor constante{" "}
            <span className="gradient-text-gold">de grandes sueños</span>
          </h2>
          <div className="section-divider" style={{ margin: "0 auto" }} />
        </div>

        {/* Content grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center"
        >
          {/* Left — Photo alternate */}
          <div className="relative w-full">
            <div
              className="relative w-full h-[320px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl"
            >
              <Image
                src="/walther-7.webp"
                alt="Dr. Walther Parrado — Trabajando"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            {/* Decorative corner accent */}
            <div
              className="hidden lg:block absolute top-[-15px] left-[-15px] w-20 h-20 border-2 border-amber-500/20 rounded-xl pointer-events-none"
            />
            <div
              className="hidden lg:block absolute bottom-[-15px] right-[-15px] w-16 h-16 border-2 border-amber-500/20 rounded-xl pointer-events-none"
            />
          </div>

          {/* Right — Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
            <p className="wl-sans" style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.8 }}>
              Soy <strong style={{ color: "#f4f2ee" }}>José Walther Parrado Corredor</strong>,
              profesional en Ingeniería Electrónica con título de <strong style={{ color: "var(--wp-gold)" }}>Doctor en Gerencia Educativa</strong> y <strong style={{ color: "var(--wp-gold)" }}>Magíster en Educación</strong>. Con más de 22 años de experiencia en el sector educativo y administrativo en Colombia.
            </p>

            <p className="wl-sans" style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.8 }}>
              Desde junio de 2004, me desempeño como <strong style={{ color: "#f4f2ee" }}>Director General de FUNDETEC</strong>, donde lidero la formulación de proyectos, desarrollo empresarial, innovación y fortalecimiento institucional bajo estándares de calidad ISO 9001 y NTC.
            </p>

            {/* Feature cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
              {[
                {
                  icon: "🚀",
                  title: "Formulación de Proyectos",
                  desc: "Proyección institucional a nivel Nacional e Internacional y cumplimiento de objetivos estratégicos.",
                },
                {
                  icon: "💼",
                  title: "Desarrollo Empresarial",
                  desc: "Creación de programas técnicos e innovación tecnológica beneficiando múltiples comunidades.",
                },
                {
                  icon: "📊",
                  title: "Innovación y Sostenibilidad",
                  desc: "Implementación de modelos de gestión bajo normas ISO 9001 y NTC.",
                },
                {
                  icon: "✍️",
                  title: "Líder de opinión",
                  desc: "Voz propositiva en debates y articulista en principales medios de la región Caribe.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass-card-hover"
                  style={{ padding: "1.2rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}
                >
                  <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ color: "#f0f4ff", fontWeight: "600", fontSize: "0.9rem", marginBottom: "3px" }}>
                      {item.title}
                    </p>
                    <p style={{ color: "#64748b", fontSize: "0.83rem", lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CV link */}
            <a
              id="about-cv-link"
              href="/Dr-Walther-Parrado-HV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ width: "fit-content" }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Ver Hoja de Vida
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

async function MediaSection() {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/walther-parrado-corredor-b4943521/",
      gradient: "linear-gradient(135deg, #0a66c2 0%, #004b87 100%)",
      glowColor: "rgba(10, 102, 194, 0.4)",
      svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: "GitHub",
      url: "https://github.com/walterparradocorredor-stack",
      gradient: "linear-gradient(135deg, #24292e 0%, #0f1419 100%)",
      glowColor: "rgba(255, 255, 255, 0.15)",
      svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      )
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/walpaco_/",
      gradient: "linear-gradient(135deg, #e1306c 0%, #c13584 50%, #f77737 100%)",
      glowColor: "rgba(225, 48, 108, 0.4)",
      svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      )
    },
    {
      name: "Threads",
      url: "https://www.threads.net/@walpaco_",
      gradient: "linear-gradient(135deg, #101010 0%, #2c2c2c 100%)",
      glowColor: "rgba(255, 255, 255, 0.2)",
      svg: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
        </svg>
      )
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/walther.p.corredor",
      gradient: "linear-gradient(135deg, #1877f2 0%, #0d5ec4 100%)",
      glowColor: "rgba(24, 119, 242, 0.4)",
      svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    }
  ];

  const techStack = [
    {
      name: "Python", color: "#3776AB", svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.25.18c.9 0 1.66.73 1.66 1.63v2.87h-5.28c-1.16 0-2.1.95-2.1 2.1v2.1H5.16c-1.16 0-2.1.95-2.1 2.1v4.22c0 1.16.95 2.1 2.1 2.1h1.41v-1.41c0-1.16.95-2.1 2.1-2.1h4.22c1.16 0 2.1-.95 2.1-2.1V9.52h5.28c1.16 0 2.1-.95 2.1-2.1V3.2c0-1.16-.95-2.1-2.1-2.1h-4.22c-.41 0-.75-.34-.75-.75S13.84.18 14.25.18zM8.34 11.23a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm7.32-6.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
          <path d="M9.75 23.82c-.9 0-1.66-.73-1.66-1.63v-2.87h5.28c1.16 0 2.1-.95 2.1-2.1v-2.1h3.37c1.16 0 2.1-.95 2.1-2.1v-4.22c0-1.16-.95-2.1-2.1-2.1h-1.41v1.41c0 1.16-.95 2.1-2.1 2.1H11c-1.16 0-2.1.95-2.1 2.1v5.28c0 1.16-.95 2.1-2.1 2.1H2.58c-1.16 0-2.1.95-2.1 2.1v4.22c0 1.16.95 2.1 2.1 2.1h4.22c.41 0 .75.34.75.75s-.34.75-.75.75zm7.32-11.23a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm-7.32 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
        </svg>
      )
    },
    {
      name: "PostgreSQL", color: "#336791", svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.65 0 3 1.35 3 3 0 .96-.45 1.81-1.15 2.37l.79.79c.77-.73 1.36-1.68 1.63-2.75L21 11c0 3.39-2.01 6.32-4.9 7.39z" />
        </svg>
      )
    },
    {
      name: "AWS Cloud", color: "#FF9900", svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
        </svg>
      )
    },
    {
      name: "WhatsApp API", color: "#25D366", svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.06 22l4.3-1.8c1.61 1.1 3.57 1.8 5.64 1.8 5.52 0 10-4.48 10-10S17.524 2 12.004 2zm0 18c-1.85 0-3.59-.57-5.04-1.54l-.36-.24-2.51 1.05.62-2.42-.26-.37C3.51 15.03 3 13.56 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9-4.04 9-9 9z" />
        </svg>
      )
    },
    {
      name: "OpenAI", color: "#74AA9C", svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.2 10a5.6 5.6 0 0 0-2.6-3.4 5.7 5.7 0 0 0-4.2-.7 5.6 5.6 0 0 0-4.9-2.7 5.7 5.7 0 0 0-3.8 1.4 5.6 5.6 0 0 0-5 2.8A5.7 5.7 0 0 0 .9 11.6a5.6 5.6 0 0 0 2.6 3.4c.3.2.7.4 1 .5a5.7 5.7 0 0 0 4.2.7 5.6 5.6 0 0 0 4.9 2.7c1.4 0 2.7-.5 3.8-1.4a5.6 5.6 0 0 0 5-2.8c1.2-2.1.8-4.7-1-6.1zm-8.4 7.6a3.8 3.8 0 0 1-2.7-.9l.1-.1 4.5-2.6a1 1 0 0 0 .5-.8v-6.3l1.8 1v5.3a4 4 0 0 1-4.2 4.4zm-5.6-2.5a3.8 3.8 0 0 1-1.2-2.6v-5.2l.1-.1 4.5 2.6a1 1 0 0 0 1 0l5.5-3.2v2.1l-5.5 3.2a4 4 0 0 1-4.4-.1.1.1 0 0 0 0-.2zm-1.8-6A3.8 3.8 0 0 1 7 7.7l1.8 1v5.2L7 14.8V8.5a4 4 0 0 1 1.8-3.4h-.4zm5.8-3.3a3.8 3.8 0 0 1 2.7.9l-.1.1-4.5 2.6a1 1 0 0 0-.5.8v6.3l-1.8-1v-5.3a4 4 0 0 1 4.2-4.4zm5.6 2.5a3.8 3.8 0 0 1 1.2 2.6v5.2l-.1.1-4.5-2.6a1 1 0 0 0-1 0L8.7 13v-2.1l5.5-3.2a4 4 0 0 1 4.4.1zM20 14.9l-1.8-1V8.7l1.8.9v5.3a4 4 0 0 1-1.8 3.4c.1-.2 0-.2 0-.2zM12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      )
    },
    {
      name: "Machine Learning", color: "#9B59B6", svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93h2c0 2.76 2.24 5 5 5v2.93zm-5-7.93c0-2.76 2.24-5 5-5V4.07c-3.95.49-7 3.85-7 7.93h2zm11 0c0 3.95-3.05 7.32-7 7.82v-2.03c2.76-.43 4.88-2.72 4.98-5.79H20c0-.1 0-.2 0-.3h2c0 4.08-3.05 7.44-7 7.93v-2.03c2.76-.43 4.88-2.72 4.98-5.79H20c0-.1 0-.2 0-.3z" />
        </svg>
      )
    },
    {
      name: "Make.com", color: "#E67E22", svg: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      )
    }
  ];

  // Double tech stack elements to ensure smooth infinite ticker flow
  const doubleTechStack = [...techStack, ...techStack];

  return (
    <section
      id="medios"
      style={{
        padding: "6rem 1.5rem",
        background: "rgba(182, 146, 85, 0.04)",
        borderTop: "1px solid rgba(182, 146, 85, 0.15)",
        borderBottom: "1px solid rgba(182, 146, 85, 0.15)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>

        {/* SUBSECTION 2: SOCIAL BUBBLES */}
        <div style={{ marginBottom: "1rem" }}>
          <p
            className="wl-sans"
            style={{
              color: "var(--wp-muted)",
              fontSize: "0.75rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              marginBottom: "2rem",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Conéctate con mis redes profesionales
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1.2rem",
              flexWrap: "wrap",
            }}
          >
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-bubble"
                style={{
                  background: social.gradient,
                  color: "#ffffff",
                }}
              >
                {social.svg}
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* SUBSECTION 3: TECH TICKER */}
        <div className="ticker-wrap">
          <div className="ticker-content">
            {doubleTechStack.map((tech, index) => (
              <div key={`${tech.name}-${index}`} className="ticker-item">
                <span style={{ color: tech.color }}>{tech.svg}</span>
                <span className="wl-sans">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export function BlogSection() {
  return (
    <section
      id="blog"
      style={{
        padding: "7rem 1.5rem",
        background: "linear-gradient(180deg, var(--wp-navy) 0%, var(--wp-navy-2) 100%)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                background: "rgba(182, 146, 85, 0.12)",
                border: "1px solid rgba(182, 146, 85, 0.25)",
                borderRadius: "100px",
                color: "#bfac83",
                fontSize: "0.7rem",
                fontWeight: "700",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
              }}
            >
              COLUMNAS DE OPINIÓN
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: "800",
                color: "#f0f4ff",
              }}
            >
              El propio de{" "}
              <span className="gradient-text-gold">Bogotá</span>
            </h2>
          </div>
          <a
            id="blog-view-all"
            href="#blog"
            className="btn-outline"
            style={{ flexShrink: 0 }}
          >
            Ver todas las columnas
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Blog grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {blogPosts.map((post, idx) => (
            <article
              key={post.id}
              id={`blog-card-${post.id}`}
              className="glass-card-hover"
              style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              {/* Cover image */}
              <div
                style={{
                  position: "relative",
                  height: "220px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  unoptimized
                  src={post.image}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                {/* Category badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    padding: "4px 12px",
                    background: "rgba(10, 15, 30, 0.85)",
                    border: "1px solid rgba(37, 99, 235, 0.4)",
                    borderRadius: "100px",
                    color: "#93c5fd",
                    fontSize: "0.68rem",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {post.category}
                </div>
                {/* Read time */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    padding: "4px 12px",
                    background: "rgba(10, 15, 30, 0.85)",
                    borderRadius: "100px",
                    color: "#94a3b8",
                    fontSize: "0.68rem",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {post.readTime}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem", flex: 1 }}>
                <p style={{ color: "#475569", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.06em" }}>
                  {post.date}
                </p>
                <h3
                  style={{
                    color: "#f0f4ff",
                    fontWeight: "700",
                    fontSize: "1.05rem",
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.7, flex: 1 }}>
                  {post.excerpt}
                </p>
                <a
                  id={`blog-read-${post.id}`}
                  href={`#${post.id}`}
                  className="blog-read-link"
                >
                  Leer columna completa
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


export function ContactSection() {
  return (
    <section
      id="contacto"
      style={{
        padding: "7rem 1.5rem",
        background: "linear-gradient(180deg, var(--wp-navy-2) 0%, var(--wp-navy) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        {/* Label */}
        <span
          style={{
            display: "inline-block",
            padding: "4px 14px",
            background: "rgba(37, 99, 235, 0.12)",
            border: "1px solid rgba(37, 99, 235, 0.25)",
            borderRadius: "100px",
            color: "#93c5fd",
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.1em",
            marginBottom: "1.5rem",
          }}
        >
          CONTACTO
        </span>

        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: "800",
            color: "#f0f4ff",
            marginBottom: "1.2rem",
            lineHeight: 1.15,
          }}
        >
          ¿Tienes algo que{" "}
          <span className="gradient-text-blue">quieras compartir?</span>
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            lineHeight: 1.7,
            marginBottom: "3rem",
            maxWidth: "500px",
            margin: "0 auto 3rem",
          }}
        >
          Me interesa conocer las metas y desafíos de tu institución. Escríbeme
          directamente por WhatsApp o déjanos un mensaje para agendar una sesión exploratoria.
        </p>

        {/* Contact cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
            textAlign: "left",
          }}
        >
          {[
            {
              icon: "📱",
              title: "WhatsApp",
              value: "+57 301 764 0850",
              href: "https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20me%20comunico%20desde%20su%20sitio%20web.",
              id: "contact-whatsapp",
            },
            {
              icon: "📍",
              title: "Ubicación (Bogotá)",
              value: "WeWork Calle 81 (Calle 81 #11-08)",
              href: "https://maps.google.com/?q=Calle+81+%2311-08,+Bogota,+Colombia",
              id: "contact-location-bogota",
            },
          ].map((item) => (
            <a
              key={item.title}
              id={item.id}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="glass-card-hover"
              style={{
                padding: "1.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontSize: "1.8rem",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(37, 99, 235, 0.1)",
                  borderRadius: "12px",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <div>
                <p style={{ color: "#64748b", fontSize: "0.7rem", fontWeight: "600", marginBottom: "3px" }}>
                  {item.title}
                </p>
                <p style={{ color: "#f0f4ff", fontSize: "0.85rem", fontWeight: "600" }}>
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Main CTA */}
        <a
          id="contact-cta-whatsapp"
          href="https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20me%20gustar%C3%ADa%20compartir%20algo%20con%20usted."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          style={{ fontSize: "1rem", padding: "16px 40px" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  );
}



// ─────────────────────────────────────────────
// NEW SECTIONS: AWARDS, ECOSYSTEM, PROJECTS, PUBLICATIONS
// ─────────────────────────────────────────────



function FundetecCloudSection() {
  return (
    <section id="proyectos" style={{ padding: "7rem 1.5rem", background: "linear-gradient(180deg, var(--wp-navy) 0%, #15202c 100%)", borderTop: "1px solid rgba(182,146,85,0.15)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ display: "inline-block", padding: "4px 14px", background: "rgba(182, 146, 85, 0.12)", border: "1px solid rgba(182, 146, 85, 0.25)", borderRadius: "100px", color: "#bfac83", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            INNOVACIÓN Y DESARROLLO DIGITAL
          </span>
          <h2 className="wl-serif" style={{ fontSize: "2.5rem", fontWeight: "500", color: "#f4f2ee", marginBottom: "1.5rem" }}>
            Proyectos <span style={{ color: "#38bdf8" }}>Cloud</span> & Open Source
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "700px", margin: "0 auto", fontSize: "1.05rem" }}>
            Construimos ecosistemas digitales avanzados y modelos de Inteligencia Artificial que automatizan procesos, gestionan datos de forma inteligente y conectan el sector publico y privado con las necesidades de la industria moderna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(37,99,235,0.2)", textAlign: "center" }}>
            <p style={{ fontSize: "3rem", fontWeight: "900", color: "#38bdf8", lineHeight: 1 }}>+470</p>
            <p style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: "600", marginTop: "0.5rem" }}>PROYECTOS OPEN SOURCE</p>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(37,99,235,0.2)", textAlign: "center" }}>
            <p style={{ fontSize: "3rem", fontWeight: "900", color: "#a855f7", lineHeight: 1 }}>5</p>
            <p style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: "600", marginTop: "0.5rem" }}>MODELOS DE IA PROPIOS</p>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(37,99,235,0.2)", textAlign: "center" }}>
            <p style={{ fontSize: "3rem", fontWeight: "900", color: "#10b981", lineHeight: 1 }}>100%</p>
            <p style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: "600", marginTop: "0.5rem" }}>EFICIENCIA LEGALTECH</p>
          </div>
        </div>

        {/* Projects Preview Grid */}
        <div style={{ marginBottom: "3rem" }}>
          <ProjectsPreview />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/projects" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <span>📂</span>
            Abrir Projects Explorer Completo
          </Link>
          <a href="https://github.com/walterparradocorredor-stack" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
            Ver GitHub General
          </a>
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  const links = [
    { name: "Medios en Red", url: "https://mediosenred.gov.co/", color: "#3b82f6" },
    { name: "Fundetec Virtual", url: "https://virtual.fundetec.edu.co/", color: "#10b981" },
    { name: "Fundetec GO", url: "https://go.fundetec.edu.co/", color: "#f59e0b" },
    { name: "Jowhalth Academy", url: "https://jowhalthacademy.com/", color: "#8b5cf6" },
    { name: "Avanzatec", url: "https://www.avanzatec.gov.co/portal/", color: "#ef4444" },
    { name: "MPS Strategy", url: "https://www.mpsstrategy.com/", color: "#64748b" },
    { name: "Becas Propias (Telegram)", url: "#", color: "#0088cc" }
  ];

  return (
    <section id="ecosistema" style={{ padding: "5rem 1.5rem", background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#f0f4ff", marginBottom: "2rem" }}>
          Mi <span style={{ color: "#3b82f6" }}>Ecosistema Digital</span>
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ padding: "0.8rem 1.5rem", background: "rgba(255,255,255,0.03)", border: `1px solid ${link.color}40`, borderRadius: "100px", color: "#cbd5e1", textDecoration: "none", fontWeight: "600", transition: "all 0.3s" }} className="ecosystem-link hover:bg-white/10 hover:text-white">
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: link.color, marginRight: "8px" }}></span>
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

async function PublicationsSection() {
  let spotify = "https://open.spotify.com/show/27Muc9kplYkdUm4gEEZbbg";
  let itunes = "https://podcasts.apple.com/us/podcast/walther-parrado/id1523681772";

  try {
    const { data } = await supabase
      .from("cms_content")
      .select("content")
      .eq("id", "home_data")
      .single();
    if (data?.content) {
      if (data.content.spotifyLink) spotify = data.content.spotifyLink;
      if (data.content.itunesLink) itunes = data.content.itunesLink;
    }
  } catch (e) {
    console.error("Error loading podcast links:", e);
  }

  return (
    <section
      id="podcast"
      style={{
        padding: "6rem 1.5rem",
        background: "linear-gradient(180deg, var(--wp-navy) 0%, var(--wp-navy-2) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2.5rem" }}>
        {/* Book */}
        <div className="flex flex-col sm:flex-row gap-6 items-center bg-blue-900/5 p-6 sm:p-8 rounded-3xl border border-blue-500/15">
          <div
            style={{
              width: "120px",
              height: "180px",
              background: "linear-gradient(135deg, var(--wp-navy) 0%, #1e293b 50%, #020617 100%)",
              borderRadius: "8px",
              border: "1px solid rgba(182, 146, 85, 0.35)",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 0.5rem",
              boxShadow: "0 15px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 3D Spine effect shadow */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "8px", background: "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 100%)", zIndex: 2 }} />
            {/* Gold book accent line */}
            <div style={{ position: "absolute", left: "8px", top: 0, bottom: 0, width: "2px", background: "linear-gradient(180deg, var(--wp-gold), var(--wp-gold-light))", opacity: 0.6 }} />

            <span className="wl-sans" style={{ color: "var(--wp-gold)", fontSize: "0.55rem", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
              OBRA ESCRITA
            </span>
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <p className="wl-serif" style={{ color: "#f4f2ee", fontSize: "0.85rem", fontWeight: "500", lineHeight: "1.2", margin: "0.2rem 0" }}>
                Liderazgo
              </p>
              <p className="wl-serif" style={{ color: "var(--wp-gold)", fontSize: "0.8rem", fontWeight: "500", lineHeight: "1.2", margin: "0.2rem 0" }}>
                Educativo
              </p>
            </div>
            <span style={{ color: "#64748b", fontSize: "0.55rem", fontWeight: "600", position: "relative", zIndex: 1 }}>
              Dr. Walther Parrado
            </span>
          </div>
          <div className="text-center sm:text-left">
            <h3 style={{ color: "#f0f4ff", fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}>Liderazgo educativo en tiempos convulsivos</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1rem" }}>Descubre las estrategias clave de gerencia y dirección institucional plasmadas en mi obra principal.</p>
            <button className="btn-cyan" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
              Ver libro
            </button>
          </div>
        </div>

        {/* Podcasts */}
        <div className="flex flex-col justify-center gap-4 text-center lg:text-left">
          <h3 style={{ color: "#f0f4ff", fontSize: "1.8rem", fontWeight: "800", marginBottom: "0.5rem" }}>Escucha mi <span style={{ color: "#a855f7" }}>Podcast</span></h3>
          <p style={{ color: "#94a3b8", fontSize: "1rem", marginBottom: "1rem" }}>Reflexiones en audio sobre gerencia institucional, innovación pedagógica y liderazgo educativo en Colombia.</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <a href={spotify} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderColor: "#1db954", color: "#1db954" }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.36-.66.48-1.021.24-2.82-1.74-6.36-2.1-10.561-1.14-.418.12-.779-.18-.899-.54-.12-.42.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.24 1.02zm1.441-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.481.12-1.021-.12-1.141-.6-.12-.48.12-1.02.6-1.14 4.32-1.26 9.719-.6 13.379 1.56.42.18.6.72.3 1.26zm.12-3.36c-3.84-2.28-10.2-2.52-13.86-1.38-.6.18-1.2-.12-1.38-.72-.18-.6.12-1.2.72-1.38 4.26-1.32 11.28-1.08 15.72 1.56.54.3.72 1.02.42 1.56-.3.54-1.02.72-1.62.36z" /></svg>
              Spotify
            </a>
            <a href={itunes} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderColor: "#a855f7", color: "#a855f7" }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.87 9.877c0 1.258-.696 2.378-1.741 3.011-.478.293-1.042.448-1.638.448-1.663 0-3.018-1.355-3.018-3.018s1.355-3.018 3.018-3.018c.596 0 1.16.155 1.638.448 1.045.633 1.741 1.753 1.741 3.011l.03 1.171h2.247c1.378 0 2.503-1.125 2.503-2.503S16.525 6.924 15.147 6.924H8.384C5.23 6.924 2.662 9.492 2.662 12.646s2.568 5.722 5.722 5.722h6.763c3.154 0 5.722-2.568 5.722-5.722s-2.568-5.722-5.722-5.722H14.15V9.11h.997c1.996 0 3.619 1.623 3.619 3.619s-1.623 3.619-3.619 3.619H8.384c-2.482 0-4.502-2.02-4.502-4.502s2.02-4.502 4.502-4.502h5.795c-.328-.517-.899-.861-1.554-.861-1.026 0-1.859.833-1.859 1.859 0 .61.309 1.15.787 1.474.331.221.729.351 1.157.351.528 0 1.014-.202 1.381-.532l.06-.06.721 1.25zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" /></svg>
              Apple Podcasts
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfficeSection() {
  const officeImages = [
    "/office/office-1.webp",
    "/office/office-2.webp",
    "/office/office-3.webp",
    "/office/office-4.webp",
    "/office/office-5.webp",
    "/office/office-6.webp",
    "/office/office-7.jpg",
    "/office/office-8.jpg",
    "/office/office-9.jpg",
  ];

  return (
    <section
      id="oficina"
      style={{
        padding: "6rem 1.5rem",
        background: "var(--wp-navy)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 14px",
            background: "rgba(34, 211, 238, 0.12)",
            border: "1px solid rgba(34, 211, 238, 0.25)",
            borderRadius: "100px",
            color: "#22d3ee",
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          Sede Corporativa
        </span>
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: "800",
            color: "#f0f4ff",
            marginBottom: "1rem",
          }}
        >
          Nuestra <span className="gradient-text-gold">Oficina en Bogotá</span>
        </h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "1rem",
            lineHeight: "1.7",
            marginBottom: "3.5rem",
            maxWidth: "650px",
            margin: "0 auto 3.5rem",
          }}
        >
          Te esperamos en <strong>WeWork Calle 81</strong> (Calle 81 #11-08), un espacio empresarial y de consultoría
          élite diseñado para la cocreación de modelos educativos y el desarrollo tecnológico.
        </p>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
          style={{ textAlign: "left" }}
        >
          {/* Map Embed */}
          <div
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(34, 211, 238, 0.15)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              minHeight: "380px",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1545.313511206609!2d-74.05460397541741!3d4.664982078798632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfda1c4eb1d%3A0x33970f369a741c63!2sWeWork%20Espacio%20de%20Oficinas%20%26%20Coworking!5e0!3m2!1ses-419!2sco!4v1783549609494!5m2!1ses-419!2sco"
              width="100%"
              height="100%"
              style={{ border: 0, position: "absolute", inset: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          {/* Photo Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
            }}
          >
            {officeImages.map((img, i) => (
              <div
                key={i}
                className="glass-card-hover"
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Image
                  src={img}
                  alt={`Sede Bogotá - Oficina ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 33vw, 150px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────

// PAGE
// ─────────────────────────────────────────────
export default async function WaltherParradoHomePage() {
  return (
    <main
      id="main-walther"
      style={{
        background: "var(--wp-navy)",
        minHeight: "100vh",
        color: "var(--wp-text)",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <NavBar />
      <HeroSection />
      <MediaSection />
      <FundetecCloudSection />
      <EcosystemSection />
      <PublicationsSection />
      <Footer />
      <AIChatWidget />
    </main>
  );
}
