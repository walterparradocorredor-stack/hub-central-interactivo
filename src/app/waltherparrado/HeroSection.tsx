'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InteractiveParticles from './InteractiveParticles';
import { supabase } from '@/lib/supabase';

const defaultStats = [
  { value: "22+", label: "Años de experiencia", icon: "📅" },
  { value: "100K+", label: "Egresados formados", icon: "🎓" },
  { value: "5K+", label: "Red de voluntariado", icon: "👥" },
  { value: "50+", label: "Misiones académicas", icon: "🌍" },
];

export default function HeroSection() {
  const [heroTitle, setHeroTitle] = useState('Walther');
  const [heroHighlight, setHeroHighlight] = useState('Parrado');
  const [heroDesc, setHeroDesc] = useState(
    'Soy Ingeniero Electrónico, Doctor en Gerencia Educativa, y Consultor Institucional con más de 22 años de experiencia liderando la transformación de modelos educativos en Colombia.'
  );
  const [heroImageUrl, setHeroImageUrl] = useState('/foto-de-perfil-de-walther-parrado.webp');
  const [heroBtnWriteText, setHeroBtnWriteText] = useState('Escríbeme');
  const [heroBtnWriteLink, setHeroBtnWriteLink] = useState('https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20me%20comunico%20desde%20su%20sitio%20web.');
  const [heroBtnCvText, setHeroBtnCvText] = useState('Mi Hoja de Vida');
  const [heroBtnCvLink, setHeroBtnCvLink] = useState('/Dr-Walther-Parrado-HV.pdf');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'home_data')
          .single();

        if (data?.content) {
          const c = data.content;
          if (c.heroTitle) setHeroTitle(c.heroTitle);
          if (c.heroHighlight) setHeroHighlight(c.heroHighlight);
          if (c.heroDesc) setHeroDesc(c.heroDesc);
          if (c.heroImageUrl) setHeroImageUrl(c.heroImageUrl);
          if (c.heroBtnWriteText) setHeroBtnWriteText(c.heroBtnWriteText);
          if (c.heroBtnWriteLink) setHeroBtnWriteLink(c.heroBtnWriteLink);
          if (c.heroBtnCvText) setHeroBtnCvText(c.heroBtnCvText);
          if (c.heroBtnCvLink) setHeroBtnCvLink(c.heroBtnCvLink);
          return;
        }
      } catch (err) {
        console.warn('Could not load from Supabase, trying localStorage...', err);
      }

      if (typeof window !== 'undefined') {
        const savedHome = localStorage.getItem('walther_home_data');
        if (savedHome) {
          try {
            const parsed = JSON.parse(savedHome);
            if (parsed.heroTitle) setHeroTitle(parsed.heroTitle);
            if (parsed.heroHighlight) setHeroHighlight(parsed.heroHighlight);
            if (parsed.heroDesc) setHeroDesc(parsed.heroDesc);
            if (parsed.heroBtnWriteText) setHeroBtnWriteText(parsed.heroBtnWriteText);
            if (parsed.heroBtnWriteLink) setHeroBtnWriteLink(parsed.heroBtnWriteLink);
            if (parsed.heroBtnCvText) setHeroBtnCvText(parsed.heroBtnCvText);
            if (parsed.heroBtnCvLink) setHeroBtnCvLink(parsed.heroBtnCvLink);
          } catch (e) {
            console.error('Error parsing hero data from localStorage', e);
          }
        }
      }
    };

    fetchHomeData();
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--wp-navy) 0%, var(--wp-navy-2) 40%, #15202c 70%, var(--wp-navy) 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "70px",
      }}
    >
      <InteractiveParticles />
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "5%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(182, 146, 85, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "0%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(182, 146, 85, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(182, 146, 85, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(182, 146, 85, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center w-full relative z-10"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
        }}
      >
        {/* Left — Text */}
        <div className="animate-slide-left flex flex-col items-center md:items-start text-center md:text-left gap-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mx-auto md:mx-0">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "rgba(182, 146, 85, 0.12)",
                border: "1px solid rgba(182, 146, 85, 0.25)",
                borderRadius: "100px",
                color: "#bfac83",
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "0.08em",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#b69255",
                  animation: "pulse 2s infinite",
                }}
              />
              BOGOTÁ · COLOMBIA
            </span>
          </div>

          {/* Pre-heading */}
          <p
            className="wl-sans w-full"
            style={{
              fontSize: "1.1rem",
              fontWeight: "400",
              color: "#a59f95",
              letterSpacing: "0.05em",
              marginBottom: "-0.5rem"
            }}
          >
            Hola, Yo Soy
          </p>

          {/* Heading */}
          <h1
            className="wl-serif w-full"
            style={{
              fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
              fontWeight: "500",
              lineHeight: 1.05,
              color: "#f4f2ee",
              letterSpacing: "0.01em",
            }}
          >
            {heroTitle} <br className="md:hidden" />
            <span style={{ color: "var(--wp-gold)" }}> {heroHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p
            className="wl-sans mx-auto md:mx-0"
            style={{
              fontSize: "1.1rem",
              color: "#e2e8f0",
              lineHeight: 1.7,
              maxWidth: "520px",
            }}
          >
            {heroDesc}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start pt-2">
            <a
              id="hero-cta-whatsapp"
              href={heroBtnWriteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto text-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--wp-gold), var(--wp-gold-light))",
                boxShadow: "0 4px 15px rgba(182, 146, 85, 0.4)",
                color: "#1c2b3a",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "14px 32px"
              }}
            >
              {heroBtnWriteText}
            </a>
            <a
              id="hero-cta-cv"
              href={heroBtnCvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full sm:w-auto text-center justify-center"
              style={{
                borderColor: "rgba(182, 146, 85, 0.4)",
                color: "var(--wp-gold-light)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "13px 31px"
              }}
            >
              {heroBtnCvText}
            </a>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-4 border-t border-amber-500/20 mt-2 text-center md:text-left"
          >
            {defaultStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center md:items-start">
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "800",
                    color: "var(--wp-gold-light)",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span className="wl-sans" style={{ fontSize: "0.7rem", color: "#a59f95", marginTop: "4px" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Photo */}
        <div
          className="animate-slide-right w-full flex justify-center items-center relative py-8 md:py-0"
        >
          {/* Glow ring */}
          <div
            className="absolute w-[90%] md:w-[420px] aspect-square rounded-full animate-pulse-glow"
            style={{
              background: "radial-gradient(circle, rgba(182, 146, 85, 0.15) 0%, transparent 70%)",
            }}
          />
          {/* Photo container */}
          <div
            className="relative w-full max-w-[340px] md:max-w-[380px] aspect-[380/460] rounded-3xl overflow-hidden border border-amber-500/20"
            style={{
              boxShadow: "0 40px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(182,146,85,0.1)",
            }}
          >
            <img
              src={heroImageUrl ? encodeURI(heroImageUrl) : "/foto-de-perfil-de-walther-parrado.webp"}
              alt="Dr. José Walther Parrado Corredor"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/foto-de-perfil-de-walther-parrado.webp";
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
