"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Cpu, ShieldCheck, Rocket, Award, Users, ArrowRight } from "lucide-react";

export default function NosotrosPage() {
  const [data, setData] = useState({
    title: "Impulsando la Transformación Digital & la IA",
    subtitle: "Somos la aceleradora e integradora tecnológica detrás del ecosistema de empresas líderes en educación, consultoría y soluciones de software.",
    bio1: "En WP Ecosystem (Walther Parrado), diseñamos e implementamos arquitectura cloud de vanguardia, agentes autónomos de IA y ecosistemas educativos digitales.",
    bio2: "Todas las organizaciones de nuestro holding avanzan con tecnología de última generación bajo nuestra asesoría directa, optimizando procesos, automatizando la atención al cliente e integrando modelos masivos de lenguaje.",
    photos: [
      { src: "/office/office-1.webp", title: "Salas de Innovación & Trabajo Colaborativo" },
      { src: "/office/office-2.webp", title: "Centro de Desarrollo Tecnológico & Agentes IA" },
      { src: "/office/office-4.webp", title: "Talleres Ejecutivos & Capacitación Directiva" },
    ]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: dbData } = await supabase
          .from("cms_content")
          .select("content")
          .eq("id", "hub_about_data")
          .maybeSingle();

        if (dbData?.content) {
          setData((prev) => ({ ...prev, ...dbData.content }));
        }
      } catch (err) {
        console.warn("Cargando datos por defecto de Nosotros", err);
      }
    };
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#07090e] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/15 blur-[140px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-12 py-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-wider transition-all"
        >
          ← Volver al Hub Central
        </Link>

        {/* Hero Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-semibold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Empresas Avanzando con Tecnología & Asesoría IA
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
            {data.title}
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* Bio Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Rocket className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">Nuestra Visión Tecnológica</h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              {data.bio1}
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">Asesoría Integrada B2B</h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              {data.bio2}
            </p>
          </div>
        </div>

        {/* Photo Gallery (Editable from CMS) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">📸 Galería Institucional & Equipos</h2>
              <p className="text-xs text-gray-400 mt-1">Conoce las instalaciones y centros de desarrollo del Hub.</p>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-semibold">
              Editable en CMS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.photos?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="group relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="w-full h-48 overflow-hidden bg-slate-950 relative">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-gray-200 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-8 rounded-3xl text-center space-y-4 backdrop-blur-xl">
          <h3 className="text-2xl font-extrabold text-white">
            ¿Quieres transformar tu empresa con Inteligencia Artificial?
          </h3>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl mx-auto">
            Recibe asesoría directa del equipo técnico del Dr. Walther Parrado para integrar agentes de IA, automatización y plataformas SaaS.
          </p>
          <a
            href="https://waltherparrado.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-extrabold px-6 py-3 rounded-full text-xs md:text-sm hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20"
          >
            Solicitar Consultoría Tecnológica <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </main>
  );
}
