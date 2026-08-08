"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MapPin, Navigation, Car, ShieldCheck, Clock, ExternalLink } from "lucide-react";

export default function UbicacionPage() {
  const [data, setData] = useState({
    title: "Nuestra Ubicación & Sedes Corporativas",
    subtitle: "Ubicados estratégicamente en el sector financiero y empresarial del norte de Bogotá en WeWork Calle 85 y Calle 81, más nuestras sedes académicas regionales.",
    facilityName: "Sede Corporativa Hub - WeWork Calle 85",
    address: "Ac. 85 #12-66, Bogotá, Colombia",
    parking: "CC Andino, CC Atlantis o Bahías WeWork",
    accessReq: "Presentar documento de identidad en la recepción principal de WeWork.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1545.313511206609!2d-74.05460397541741!3d4.664982078798632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfda1c4eb1d%3A0x33970f369a741c63!2sWeWork%20Espacio%20de%20Oficinas%20%26%20Coworking!5e0!3m2!1ses-419!2sco!4v1783549609494!5m2!1ses-419!2sco",
    photos: [
      { src: "/office/office-1.webp", title: "Salas de Reuniones Corporativas" },
      { src: "/office/office-2.webp", title: "Área de Coworking & Redes" },
      { src: "/office/office-3.webp", title: "Espacios de Cafetería & Relajación" },
      { src: "/office/office-4.webp", title: "Salón de Eventos & Talleres" },
      { src: "/office/office-5.webp", title: "Oficinas de Consultoría Privada" },
      { src: "/office/office-6.webp", title: "Áreas de Espera para Clientes" },
    ]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: dbData } = await supabase
          .from("cms_content")
          .select("content")
          .eq("id", "hub_office_data")
          .maybeSingle();

        if (dbData?.content) {
          setData((prev) => ({ ...prev, ...dbData.content }));
        }
      } catch (err) {
        console.warn("Cargando datos por defecto de Ubicación", err);
      }
    };
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#07090e] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/15 blur-[140px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10 py-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-wider transition-all"
        >
          ← Volver al Hub Central
        </Link>

        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Bogotá & Sedes Institucionales Colombia
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
            {data.title}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            {data.subtitle}
          </p>
        </div>

        {/* Location Grid: Details & Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-indigo-400" />
                {data.facilityName}
              </h2>

              <div className="space-y-3 text-xs md:text-sm text-gray-300">
                <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Dirección Oficial:</strong>
                    <span>{data.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <Car className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Estacionamiento / Parqueadero:</strong>
                    <span>{data.parking}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Requisitos de Acceso:</strong>
                    <span>{data.accessReq}</span>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(data.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20"
            >
              Abrir en Google Maps <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Interactive Google Map Frame */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative min-h-[320px]">
            <iframe
              src={data.mapUrl}
              className="w-full h-full min-h-[320px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Photo Gallery of Offices (Editable from CMS) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">📷 Instalaciones & Espacios de Trabajo</h2>
              <p className="text-xs text-gray-400 mt-1">Ambientes de innovación preparados para atender a rectores, directivos e inversionistas.</p>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-semibold">
              Editable en CMS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.photos?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="group relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="w-full h-44 overflow-hidden bg-slate-950 relative">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-3.5">
                  <p className="text-xs font-bold text-gray-200 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
