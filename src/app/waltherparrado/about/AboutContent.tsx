'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function AboutContent() {
  const [aboutTitle, setAboutTitle] = useState('Constructor constante');
  const [aboutHighlight, setAboutHighlight] = useState('de grandes sueños');
  const [bio1, setBio1] = useState(
    'Soy José Walther Parrado Corredor, profesional en Ingeniería Electrónica con título de Doctor en Gerencia y Política Educativa y Magíster en Educación. Con más de 22 años de experiencia liderando instituciones, equipos y proyectos de alcance municipal, departamental, nacional e internacional.'
  );
  const [bio2, setBio2] = useState(
    'Como Director General de FUNDETEC desde 2004, he contribuido a consolidar una organización con más de 100.000 egresados. Mi perfil integra educación y TIC para diseñar soluciones públicas escalables, conectar la educación virtual y fortalecer el talento digital de las regiones.'
  );
  const [aboutImageUrl, setAboutImageUrl] = useState('/walther-7.webp');
  const [awards, setAwards] = useState([
    { title: 'Doctorado Summa Cum Laude', entity: 'Gerencia y Política Educativa - UBC', year: '2018' },
    { title: 'Reconocimiento Presidencial', entity: 'Calidad en Educación FUNDETEC', year: '2013' },
    { title: 'Orden de Barlovento', entity: 'Grado de Gran Caballero - ASFOTEC', year: '2020' }
  ]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'about_data')
          .single();

        if (data?.content) {
          const c = data.content;
          if (c.aboutTitle) setAboutTitle(c.aboutTitle);
          if (c.aboutHighlight) setAboutHighlight(c.aboutHighlight);
          if (c.aboutImageUrl) setAboutImageUrl(c.aboutImageUrl);
          if (c.bio1) setBio1(c.bio1);
          if (c.bio2) setBio2(c.bio2);
          if (c.awards) setAwards(c.awards);
          return;
        }
      } catch (err) {
        console.warn('Could not load from Supabase, trying localStorage...', err);
      }

      if (typeof window !== 'undefined') {
        const savedAbout = localStorage.getItem('walther_about_data');
        if (savedAbout) {
          try {
            const parsed = JSON.parse(savedAbout);
            if (parsed.aboutTitle) setAboutTitle(parsed.aboutTitle);
            if (parsed.aboutHighlight) setAboutHighlight(parsed.aboutHighlight);
            if (parsed.bio1) setBio1(parsed.bio1);
            if (parsed.bio2) setBio2(parsed.bio2);
            if (parsed.awards) setAwards(parsed.awards);
          } catch (e) {
            console.error('Error parsing about data from localStorage', e);
          }
        }
      }
    };

    fetchAboutData();
  }, []);

  return (
    <>
      {/* SOBRE MÍ SECTION */}
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
              {aboutTitle}{" "}
              <span className="gradient-text-gold">{aboutHighlight}</span>
            </h2>
            <div className="section-divider" style={{ margin: "0 auto" }} />
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Left — Photo */}
            <div className="relative w-full">
              <div className="relative w-full h-[320px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl">
                <img
                  src={aboutImageUrl ? encodeURI(aboutImageUrl) : "/walther-7.webp"}
                  alt="Dr. Walther Parrado — Trabajando"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/walther-7.webp";
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
              </div>
              {/* Decorative accents */}
              <div className="hidden lg:block absolute top-[-15px] left-[-15px] w-20 h-20 border-2 border-amber-500/20 rounded-xl pointer-events-none" />
              <div className="hidden lg:block absolute bottom-[-15px] right-[-15px] w-16 h-16 border-2 border-amber-500/20 rounded-xl pointer-events-none" />
            </div>

            {/* Right — Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              <p className="wl-sans" style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.8 }}>
                Soy <strong style={{ color: "#f4f2ee" }}>José Walther Parrado Corredor</strong>, {bio1}
              </p>

              <p className="wl-sans" style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.8 }}>
                {bio2}
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

      {/* AWARDS SECTION */}
      <section id="reconocimientos" style={{ padding: "5rem 1.5rem", background: "var(--wp-navy-2)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="wl-serif" style={{ fontSize: "2rem", fontWeight: "500", color: "#f4f2ee", marginBottom: "3rem", textAlign: "center" }}>
            Premios y <span className="gradient-text-gold">Reconocimientos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awards.map((award, i) => (
              <div
                key={i}
                className="glass-card-hover"
                style={{ padding: "2rem", textAlign: "center", borderTop: "3px solid var(--wp-gold)" }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏆</div>
                <h3 style={{ color: "#f4f2ee", fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
                  {award.title}
                </h3>
                <p style={{ color: "#a59f95", fontSize: "0.9rem" }}>
                  {award.entity} · {award.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
