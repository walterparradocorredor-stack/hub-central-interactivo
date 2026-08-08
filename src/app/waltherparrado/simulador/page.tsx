"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";

export default function SimuladorPage() {
  return (
    <main className="w-screen h-screen flex flex-col bg-[#04060a] overflow-hidden fixed inset-0 z-50 p-0 m-0">
      {/* BARRA SUPERIOR COMPACTA DE 40PX */}
      <div className="w-full h-10 bg-[#0a0f1d] border-b border-white/10 px-3 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/10 flex items-center justify-center text-[11px] font-bold gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Inicio
          </Link>
          <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
            WP ResponsiveLab{" "}
            <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-500/40">
              Simulador Móvil 📱
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cotizar-web"
            className="px-2.5 py-1 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white font-bold text-[11px] transition-all border border-purple-500/40 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" /> Cotizar Web
          </Link>
          <a
            href="/device-simulator/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] transition-all flex items-center gap-1"
          >
            <span>Pestaña Nueva</span> <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* IFRAME DE MISMO ORIGEN CON GUÍA INTERACTIVA AUTO-DESPLAZABLE */}
      <iframe
        src="/device-simulator/index.html"
        title="WP ResponsiveLab - Simulador de Dispositivos Online"
        className="w-full h-[calc(100vh-40px)] border-0 block shrink-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </main>
  );
}
