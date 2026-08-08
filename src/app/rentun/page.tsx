"use client";

import { useState } from "react";
import Link from "next/link";
import { Fraunces, Work_Sans } from "next/font/google";
import { supabase } from "@/lib/supabase";
import { rentunSupabase } from "@/lib/rentunSupabase";
import AIChatBubble from "@/components/AIChatBubble";
import { ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2, Building2 } from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-work-sans",
});

export default function RentunGroupPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    zone: "Zona T",
    msg: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const OWNER_EMAIL = "rentungroup@gmail.com";
  const OWNER_WHATSAPP = "573134900223";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    setSubmitting(true);

    const summaryText = `Nuevo propietario interesado en Rentun Group (desde Hub WP Ecosystem)

Nombre: ${formData.name}
Teléfono: ${formData.phone}
Correo: ${formData.email}
Zona: ${formData.zone}
Mensaje: ${formData.msg || "-"}`;

    // 1. Guardar en Supabase Hub WP Ecosystem (hub_leads_data)
    try {
      const { data: existingRecords, error: selErr } = await supabase
        .from("cms_content")
        .select("content")
        .eq("id", "hub_leads_data")
        .maybeSingle();

      if (selErr) console.warn("Supabase select hub_leads_data notice:", selErr);

      let currentLeads = existingRecords?.content || [];
      if (!Array.isArray(currentLeads)) currentLeads = [];

      const newHubLead = {
        id: `lead_rentun_${Date.now()}`,
        contact: `${formData.email} / ${formData.phone}`,
        company: "Rentun Group",
        message: summaryText,
        habeasDataConsent: "Otorgado (Ley 1581)",
        status: "Pendiente CRM",
        createdAt: new Date().toISOString(),
      };

      const updatedLeads = [newHubLead, ...currentLeads];

      const { error: upsertErr } = await supabase.from("cms_content").upsert({
        id: "hub_leads_data",
        content: updatedLeads,
        updated_at: new Date().toISOString(),
      });

      if (upsertErr) console.error("Error upserting lead in Hub Supabase:", upsertErr);
    } catch (errHub) {
      console.error("Error guardando lead en Supabase Hub:", errHub);
    }

    // 2. Guardar en Supabase Dedicado de Rentun Group (public.leads)
    try {
      await rentunSupabase.from("leads").insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          destination: "hub_wp_ecosystem",
          consent: true,
          notes: `Zona: ${formData.zone} | Mensaje: ${formData.msg || "-"}`,
        },
      ]);
    } catch (errRentun) {
      console.warn("Error guardando lead en Supabase Rentun:", errRentun);
    }

    // 3. Abrir WhatsApp y Mailto
    const encodedMsg = encodeURIComponent(summaryText);
    const whatsappLink = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMsg}`;
    const mailtoLink = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
      "Nuevo propietario interesado - " + formData.name
    )}&body=${encodedMsg}`;

    window.open(whatsappLink, "_blank");
    window.location.href = mailtoLink;

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      className={`${fraunces.variable} ${workSans.variable} font-sans bg-[#F6F3EC] text-[#141F2B] min-h-screen selection:bg-[#A9843C] selection:text-white`}
    >
      {/* BARRA SUPERIOR DE NAVEGACIÓN WP ECOSYSTEM */}
      <div className="bg-[#141F2B] border-b border-[#A9843C]/20 text-[#F6F3EC] py-2.5 px-4 md:px-8 text-xs flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-gray-300 hover:text-[#A9843C] font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a WP Ecosystem
          </Link>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 font-semibold hidden sm:inline">
            Ecosistema de Empresas — Walther Parrado
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Trazabilidad Directa
          </span>
          <a
            href="https://www.rentungroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#A9843C] hover:underline font-bold"
          >
            Sitio Web Oficial <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* NAV RENTUN GROUP */}
      <nav className="sticky top-0 z-40 bg-[#F6F3EC]/95 backdrop-blur-md border-b border-[#CFC7B6]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#141F2B] px-3 py-1.5 rounded-xl border border-[#A9843C]/40 flex items-center shadow-md">
              <img
                src="https://www.rentungroup.com/logos/rentungroupwithe.webp"
                alt="Rentun Group Logo"
                className="h-7 md:h-8 w-auto object-contain"
              />
            </div>
            <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-[#141F2B] hidden sm:inline">
              Rentun <span className="text-[#A9843C]">Group</span>
            </span>
          </div>
          <a
            href="#form"
            className="bg-[#141F2B] text-[#F6F3EC] hover:bg-[#A9843C] hover:text-[#141F2B] px-5 py-2.5 rounded text-xs md:text-sm font-semibold tracking-wide transition-all shadow-md"
          >
            Quiero asociarme
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-[#141F2B] text-[#F6F3EC] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute -right-28 -top-28 w-96 h-96 rounded-full border border-[#A9843C]/25 pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full border border-[#A9843C]/18 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="mb-6 inline-flex items-center gap-3 bg-white/5 border border-[#A9843C]/30 px-4 py-2 rounded-2xl backdrop-blur-md">
            <img
              src="https://www.rentungroup.com/logos/rentungroupwithe.webp"
              alt="Rentun Group Logo"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#A9843C] font-semibold mb-4">
            Gestión de propiedades · Bogotá
          </div>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium max-w-3xl leading-[1.1] mb-6 text-[#F6F3EC]">
            Su apartamento es una inversión.{" "}
            <em className="text-[#A9843C] not-italic">
              No debería convertirse en un segundo empleo.
            </em>
          </h1>
          <p className="max-w-xl text-base md:text-lg text-[#D9D3C6] font-light leading-relaxed mb-10">
            Conviértalo en una fuente de ingresos pasivos. Usted decide invertir.
            Nosotros nos encargamos del resto.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href="#form"
              className="bg-[#A9843C] text-[#141F2B] hover:bg-[#c19a4c] px-8 py-4 rounded text-sm font-bold tracking-wide transition-all shadow-lg hover:-translate-y-0.5"
            >
              Quiero que administren mi apartamento
            </a>
            <a
              href="#proceso"
              className="text-[#F6F3EC] hover:text-[#A9843C] text-sm underline underline-offset-8 font-medium px-4 py-4 transition-colors"
            >
              Ver cómo funciona ↓
            </a>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#A9843C]/30">
            <div className="border-l-2 border-[#A9843C] pl-4 space-y-1">
              <div className="font-serif text-3xl font-bold text-[#A9843C]">
                4
              </div>
              <div className="text-xs text-[#B9B2A2] max-w-[150px]">
                Zonas premium de cobertura activa
              </div>
            </div>
            <div className="border-l-2 border-[#A9843C] pl-4 space-y-1">
              <div className="font-serif text-3xl font-bold text-[#A9843C]">
                100%
              </div>
              <div className="text-xs text-[#B9B2A2] max-w-[150px]">
                Gestión operativa asumida por Rentun
              </div>
            </div>
            <div className="border-l-2 border-[#A9843C] pl-4 space-y-1">
              <div className="font-serif text-3xl font-bold text-[#A9843C]">
                Nal. + Intl.
              </div>
              <div className="text-xs text-[#B9B2A2] max-w-[150px]">
                Alcance de huéspedes y clientes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COBERTURA ZONAS */}
      <section className="py-24 bg-[#F6F3EC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-[#A9843C] font-semibold mb-2">
              Cobertura actual
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#141F2B]">
              Estamos concentrando la operación en cuatro zonas de alta demanda.
            </h2>
          </div>

          <div className="border border-[#CFC7B6] bg-[#EFEAE0] p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-4 border-b sm:border-b-0 sm:border-r border-[#CFC7B6] last:border-0">
              <div className="w-3 h-3 rounded-full bg-[#A9843C] mx-auto mb-4 relative" />
              <div className="font-serif text-xl font-bold text-[#141F2B] mb-2">
                Zona T
              </div>
              <div className="text-xs text-[#6B6558] leading-relaxed">
                Calle 85 — epicentro gastronómico y corporativo
              </div>
            </div>

            <div className="text-center p-4 border-b sm:border-b-0 sm:border-r border-[#CFC7B6] last:border-0">
              <div className="w-3 h-3 rounded-full bg-[#141F2B] mx-auto mb-4 relative" />
              <div className="font-serif text-xl font-bold text-[#141F2B] mb-2">
                El Retiro
              </div>
              <div className="text-xs text-[#6B6558] leading-relaxed">
                Comercio de lujo y alta plusvalía
              </div>
            </div>

            <div className="text-center p-4 border-b sm:border-b-0 sm:border-r border-[#CFC7B6] last:border-0">
              <div className="w-3 h-3 rounded-full bg-[#141F2B] mx-auto mb-4 relative" />
              <div className="font-serif text-xl font-bold text-[#141F2B] mb-2">
                El Virrey
              </div>
              <div className="text-xs text-[#6B6558] leading-relaxed">
                Zona residencial arbolada, alta demanda ejecutiva
              </div>
            </div>

            <div className="text-center p-4">
              <div className="w-3 h-3 rounded-full bg-[#141F2B] mx-auto mb-4 relative" />
              <div className="font-serif text-xl font-bold text-[#141F2B] mb-2">
                Santa Bárbara
              </div>
              <div className="text-xs text-[#6B6558] leading-relaxed">
                Exclusividad residencial y cercanía empresarial
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 text-xs text-[#8A8371] font-medium tracking-wide">
            <span>Bogotá, Colombia</span>
            <span>Expansión activa 2026</span>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-[#141F2B] text-[#F6F3EC] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-xs uppercase tracking-[0.2em] text-[#A9843C] font-semibold mb-2">
            Por qué Rentun
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#F6F3EC] max-w-xl mb-14">
            Todo lo que implica administrar un apartamento premium, resuelto.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#A9843C]/25 border border-[#A9843C]/25">
            <div className="bg-[#141F2B] p-8">
              <div className="font-serif text-[#A9843C] text-lg font-bold mb-4">
                01
              </div>
              <h3 className="font-serif text-xl font-medium text-[#F6F3EC] mb-3">
                Rentabilidad optimizada
              </h3>
              <p className="text-xs md:text-sm text-[#BEB8A9] font-light leading-relaxed">
                Tarifas dinámicas y ocupación gestionada activamente para maximizar
                su ingreso mensual.
              </p>
            </div>

            <div className="bg-[#141F2B] p-8">
              <div className="font-serif text-[#A9843C] text-lg font-bold mb-4">
                02
              </div>
              <h3 className="font-serif text-xl font-medium text-[#F6F3EC] mb-3">
                Cuidado del inmueble
              </h3>
              <p className="text-xs md:text-sm text-[#BEB8A9] font-light leading-relaxed">
                Mantenimiento, aseo profesional y supervisión constante del
                estado de la propiedad.
              </p>
            </div>

            <div className="bg-[#141F2B] p-8">
              <div className="font-serif text-[#A9843C] text-lg font-bold mb-4">
                03
              </div>
              <h3 className="font-serif text-xl font-medium text-[#F6F3EC] mb-3">
                Gestión de huéspedes
              </h3>
              <p className="text-xs md:text-sm text-[#BEB8A9] font-light leading-relaxed">
                Check-in, atención 24/7 y selección cuidadosa de huéspedes
                nacionales e internacionales.
              </p>
            </div>

            <div className="bg-[#141F2B] p-8">
              <div className="font-serif text-[#A9843C] text-lg font-bold mb-4">
                04
              </div>
              <h3 className="font-serif text-xl font-medium text-[#F6F3EC] mb-3">
                Reportes transparentes
              </h3>
              <p className="text-xs md:text-sm text-[#BEB8A9] font-light leading-relaxed">
                Visibilidad clara de ingresos, ocupación y gastos, sin sorpresas
                a fin de mes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-24 bg-[#F6F3EC]" id="proceso">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-xs uppercase tracking-[0.2em] text-[#A9843C] font-semibold mb-2">
            Cómo funciona
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#141F2B] max-w-xl mb-14">
            De la primera visita a su primer pago, en cuatro pasos.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-t-2 border-[#141F2B] pt-6">
              <div className="font-serif text-2xl font-bold text-[#A9843C]">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-[#141F2B] my-2">
                Diagnóstico del inmueble
              </h3>
              <p className="text-xs text-[#6B6558] leading-relaxed">
                Visitamos su apartamento y evaluamos su potencial de renta en la
                zona.
              </p>
            </div>

            <div className="border-t-2 border-[#141F2B] pt-6">
              <div className="font-serif text-2xl font-bold text-[#A9843C]">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-[#141F2B] my-2">
                Puesta a punto
              </h3>
              <p className="text-xs text-[#6B6558] leading-relaxed">
                Ajustamos fotografía, precio y presentación para competir al más
                alto nivel.
              </p>
            </div>

            <div className="border-t-2 border-[#141F2B] pt-6">
              <div className="font-serif text-2xl font-bold text-[#A9843C]">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-[#141F2B] my-2">
                Publicación y gestión
              </h3>
              <p className="text-xs text-[#6B6558] leading-relaxed">
                Activamos el apartamento en los canales adecuados y operamos el
                día a día.
              </p>
            </div>

            <div className="border-t-2 border-[#141F2B] pt-6">
              <div className="font-serif text-2xl font-bold text-[#A9843C]">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-[#141F2B] my-2">
                Reportes y pagos
              </h3>
              <p className="text-xs text-[#6B6558] leading-relaxed">
                Usted recibe reportes periódicos y su rentabilidad, mes a mes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO DE ASOCIACIÓN / CTA */}
      <section
        className="py-24 bg-[#EFEAE0] border-t border-b border-[#CFC7B6]"
        id="form"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#A9843C] font-semibold mb-2">
              Asociarse con Rentun
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#141F2B] mb-4">
              Cuéntenos sobre su apartamento.
            </h2>
            <p className="text-sm text-[#544F44] leading-relaxed mb-8">
              Un asesor de Rentun Group se pondrá en contacto para evaluar su
              propiedad sin ningún compromiso.
            </p>

            <ul className="divide-y divide-[#CFC7B6] text-xs md:text-sm text-[#544F44]">
              <li className="py-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A9843C]" />
                Respuesta en menos de 48 horas hábiles
              </li>
              <li className="py-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A9843C]" />
                Evaluación de rentabilidad sin costo
              </li>
              <li className="py-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A9843C]" />
                Sin exclusividad forzada — usted decide
              </li>
            </ul>

            <div className="mt-8 p-4 bg-[#F6F3EC] border border-[#CFC7B6] rounded text-xs text-[#6B6558]">
              <p className="font-bold text-[#141F2B] mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Trazabilidad
                y Registro Doble Garantizado
              </p>
              Tus datos se registran simultáneamente en el Panel del Holding de
              WP Ecosystem y en el sistema operativo de Rentun Group bajo la Ley
              1581 de Habeas Data.
            </div>
          </div>

          <div>
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="bg-[#F6F3EC] border border-[#CFC7B6] p-8 shadow-xl space-y-5"
              >
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6558] mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border border-[#CFC7B6] bg-[#F6F3EC] text-sm text-[#141F2B] focus:outline-none focus:border-[#A9843C]"
                    placeholder="Ej. Carlos Mendoza"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6558] mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-3 border border-[#CFC7B6] bg-[#F6F3EC] text-sm text-[#141F2B] focus:outline-none focus:border-[#A9843C]"
                    placeholder="+57 300 000 0000"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6558] mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-3 border border-[#CFC7B6] bg-[#F6F3EC] text-sm text-[#141F2B] focus:outline-none focus:border-[#A9843C]"
                    placeholder="carlos@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6558] mb-1">
                    Zona del apartamento
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) =>
                      setFormData({ ...formData, zone: e.target.value })
                    }
                    className="w-full p-3 border border-[#CFC7B6] bg-[#F6F3EC] text-sm text-[#141F2B] focus:outline-none focus:border-[#A9843C]"
                  >
                    <option value="Zona T">Zona T</option>
                    <option value="El Retiro">El Retiro</option>
                    <option value="El Virrey">El Virrey</option>
                    <option value="Santa Bárbara">Santa Bárbara</option>
                    <option value="Otra zona de Bogotá">
                      Otra zona de Bogotá
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6558] mb-1">
                    Cuéntenos sobre su propiedad (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.msg}
                    onChange={(e) =>
                      setFormData({ ...formData, msg: e.target.value })
                    }
                    className="w-full p-3 border border-[#CFC7B6] bg-[#F6F3EC] text-sm text-[#141F2B] focus:outline-none focus:border-[#A9843C] resize-y"
                    placeholder="Número de habitaciones, piso, estado..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#141F2B] text-[#F6F3EC] hover:bg-[#A9843C] hover:text-[#141F2B] py-4 text-sm font-semibold tracking-wider uppercase transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitting ? "Registrando..." : "Enviar información"}
                </button>

                <p className="text-[11px] text-[#8A8371] text-center leading-relaxed">
                  Al enviar, se registrará el lead en ambas bases de datos y se
                  abrirán WhatsApp y tu cliente de correo con la información.
                </p>
              </form>
            ) : (
              <div className="bg-[#F6F3EC] border border-[#A9843C] p-10 text-center space-y-4 shadow-xl">
                <CheckCircle2 className="w-12 h-12 text-[#A9843C] mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-[#141F2B]">
                  ¡Gracias por tu interés!
                </h3>
                <p className="text-sm text-[#544F44] leading-relaxed">
                  Hemos registrado tu solicitud con trazabilidad en el Hub WP
                  Ecosystem y en el sistema de Rentun Group. Un asesor se
                  comunicará pronto.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 bg-[#141F2B] text-white text-xs uppercase tracking-wider font-bold rounded"
                >
                  Enviar otra propiedad
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#141F2B] text-[#F6F3EC] text-center border-t border-[#A9843C]/20">
        <div className="max-w-6xl mx-auto px-6 space-y-3">
          <div className="flex justify-center mb-2">
            <img
              src="https://www.rentungroup.com/logos/rentungroupwithe.webp"
              alt="Rentun Group Logo"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div className="font-serif text-xl font-bold">
            Rentun <span className="text-[#A9843C]">Group</span>
          </div>
          <p className="text-xs text-[#BEB8A9]">
            Alojamiento premium · Asesoría inmobiliaria · Gestión de propiedades
            · Bogotá, Colombia
          </p>
          <p className="text-xs text-[#8A8371] font-mono">
            © 2026 Rentun Group & WP Ecosystem — Walther Parrado & J&M Tech Solutions
          </p>
        </div>
      </footer>

      {/* ERIKA AI CHAT BUBBLE */}
      <AIChatBubble />
    </div>
  );
}
