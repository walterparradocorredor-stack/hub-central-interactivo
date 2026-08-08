"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  FolderKanban, Info, MapPin, Scale, Bot, Plus, Trash2, Save, LogOut, Lock, Upload, Image as ImageIcon, CheckCircle, AlertCircle, UserCheck, Download, Send, Check, Search, Mail, Phone, ShieldCheck, Laptop
} from "lucide-react";

export default function HubAdminPage() {
  const [session, setSession] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("proyectos");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // TAB 5: LEADS CAPTURADOS POR ERIKA STATE
  const [leads, setLeads] = useState<any[]>([]);
  const [leadSearchTerm, setLeadSearchTerm] = useState("");
  const [selectedLeadCompany, setSelectedLeadCompany] = useState("TODOS");
  const [webBriefs, setWebBriefs] = useState<any[]>([]);

  // TAB 1: PROYECTOS & CATEGORÍAS
  const [categories, setCategories] = useState<any[]>([
    {
      id: "educacion",
      title: "Educación, Validación y PreICFES",
      icon: "🎓",
      subtitle: "Plataformas tecnológicas de alto impacto para formación media, preparatoria y continuada.",
      projects: [
        {
          name: "PreICFES App",
          description: "Entrenamiento interactivo, simulacros inteligentes y análisis de resultados para pruebas de Estado.",
          tag: "SaaS Educativo",
          url: "https://preicfes.app/",
          badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        },
        {
          name: "Fundetec Institucional",
          description: "Portal principal de educación técnica y académica con admisiones y chat IA ErIA integrado.",
          tag: "Institución Educativa",
          url: "https://fundetec.edu.co/",
          badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        },
        {
          name: "Fundetec Campus Virtual",
          description: "Aula y campus virtual para estudiantes, entrega de guías, evaluaciones y seguimiento Q10.",
          tag: "Campus Virtual",
          url: "https://virtual.fundetec.edu.co/",
          badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        },
        {
          name: "Alcanza Una Beca",
          description: "Plataforma de orientación, convocatorias y acompañamiento para acceder a becas de educación superior.",
          tag: "Becas & EdTech",
          url: "https://alcanzaunabeca.org",
          badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
        },
        {
          name: "Walpa Planner Fundetec",
          description: "Planificador académico inteligente y sistema de gestión de actividades y horarios de clase.",
          tag: "Planificador Cloud",
          url: "https://walpaplanner.fundetec.cloud/",
          badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        },
        {
          name: "Parla 360",
          description: "Plataforma EdTech de aprendizaje de idiomas y comunicación asistida por modelos conversacionales de IA.",
          tag: "EdTech Idiomas IA",
          url: "https://parla360.tech",
          badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
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
        },
        {
          name: "Cédula 360 Translate",
          description: "Herramienta de traducción inteligente multilingüe especializada en documentos oficiales y credenciales.",
          tag: "Traducción Document AI",
          url: "https://translate.cedula360.tech",
          badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/30",
        },
        {
          name: "Cédula 360 DeepMap",
          description: "Sistema de geolocalización, mapas térmicos profundos y análisis geoespacial para inteligencia territorial.",
          tag: "GeoInteligencia Spatial",
          url: "https://deepmap.cedula360.tech",
          badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        },
        {
          name: "Cédula 360 Pulse",
          description: "Monitor de métricas en tiempo real, telemetría de rendimiento y estado de la red de nodos cloud.",
          tag: "Telemetría Real-time",
          url: "https://pulse.cedula360.tech",
          badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
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
          description: "Academia de alto nivel orientada al desarrollo directivo, liderazgo transformacional y gestión de alto rendimiento.",
          tag: "Executive Education",
          url: "https://jowhalthacademy.com/",
          badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        },
        {
          name: "Jowhalth Tutor AI",
          description: "Tutor inteligente de IA y mentor académico personalizado para estudiantes y ejecutivos de Jowhalth Academy.",
          tag: "Tutor IA Ejecutivo",
          url: "https://tutor.jowhalthacademy.com",
          badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
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
          description: "Alojamiento premium, asesoría inmobiliaria y gestión integral de propiedades en Bogotá.",
          tag: "Inmobiliaria & Propiedades",
          url: "https://www.rentungroup.com/",
          logoUrl: "https://www.rentungroup.com/logos/rentungroupwithe.webp",
          badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        },
      ],
    },
    {
      id: "software-ia",
      title: "Soluciones de Software y IA",
      icon: "⚡",
      subtitle: "Desarrollo a medida, automatización con agentes de IA y arquitectura de software de vanguardia.",
      projects: [
        {
          name: "Walther Parrado - Consultoría IA",
          description: "Transformación digital, agentes de IA conversacionales y arquitectura cloud B2B para empresas.",
          tag: "Transformación Digital",
          url: "https://waltherparrado.com/",
          badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        },
        {
          name: "Ollama LLM Local Engine",
          description: "Infraestructura de ejecución de modelos de lenguaje locales y agentes de IA de alto rendimiento en servidores privados.",
          tag: "Infraestructura LLM",
          url: "https://ollama.com",
          badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        },
      ],
    },
  ]);

  // TAB 2: NOSOTROS
  const [aboutData, setAboutData] = useState({
    title: "Impulsando la Transformación Digital & la IA",
    subtitle: "Somos la aceleradora e integradora tecnológica detrás del ecosistema de empresas líderes en educación, consultoría y soluciones de software.",
    bio1: "En WP Ecosystem (Walther Parrado), diseñamos e implementamos arquitectura cloud de vanguardia, agentes autónomos de IA y ecosistemas educativos digitales.",
    bio2: "Todas las organizaciones de nuestro holding avanzan con tecnología de última generación bajo nuestra asesoría directa, optimizando procesos, automatizando la atención al cliente e integrando modelos masivos de lenguaje.",
    photos: [
      { src: "/office/office-1.webp", title: "Salas de Innovación & Trabajo Colaborativo" },
      { src: "/office/office-2.webp", title: "Centro de Desarrollo Tecnológico & Agentes IA" },
      { src: "/office/office-4.webp", title: "Talleres Ejecutivos & Capacitación Directiva" },
    ],
  });

  // TAB 3: UBICACIÓN
  const [officeData, setOfficeData] = useState({
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
    ],
  });

  // TAB 4: LEGALES & HABEAS DATA
  const [legalData, setLegalData] = useState({
    contactEmail: "Virtualidad@fundetec.edu.co / contacto@waltherparrado.com",
    bogotaAddress: "WeWork Calle 85 (Ac. 85 #12-66) y Calle 81, Bogotá",
    academicAddress: "FUNDETEC (Sincelejo / Villavicencio)",
    habeasDataText: "WP Ecosystem (Walther Parrado & J&M Tech Solutions), en coordinación con la institución educativa FUNDETEC, Jowhalth Academy, Rentun Group y sus plataformas tecnológicas asociadas, actúa como Responsable del Tratamiento de los datos personales suministrados por estudiantes, docentes, rectores, clientes y usuarios del ecosistema.",
    termsText: "Al acceder o utilizar los sitios web, aplicaciones SaaS (PreICFES App, Campus Virtual FUNDETEC, Jowhalth Academy) y servicios de consultoría tecnológica de WP Ecosystem, usted acepta estar vinculado por estos Términos y Condiciones.",
    intellectualPropertyText: "Todos los contenidos, marcas corporativas, código fuente, modelos de Inteligencia Artificial, imágenes, diseños y logotipos exhibidos en este portal son propiedad exclusiva de Walther Parrado, J&M Tech Solutions, FUNDETEC y Rentun Group. Queda prohibida la reproducción no autorizada.",
    privacyText: "En WP Ecosystem respetamos la confidencialidad y privacidad de nuestros clientes, alumnos y colaboradores. Los datos proporcionados son tratados con estrictos estándares de seguridad y encriptación."
  });

  // Check login on load
  useEffect(() => {
    const isLogged = localStorage.getItem("hub_admin_logged") === "true";
    if (isLogged) setSession(true);
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const { data } = await supabase.from("cms_content").select("id, content");
      if (data) {
        const catItem = data.find((r) => r.id === "hub_projects_data");
        if (catItem?.content) setCategories(catItem.content);

        const abtItem = data.find((r) => r.id === "hub_about_data");
        if (abtItem?.content) setAboutData(abtItem.content);

        const offItem = data.find((r) => r.id === "hub_office_data");
        if (offItem?.content) setOfficeData(offItem.content);

        const legItem = data.find((r) => r.id === "hub_legal_data");
        if (legItem?.content) setLegalData(legItem.content);

        const leadItem = data.find((r) => r.id === "hub_leads_data");
        if (leadItem?.content && Array.isArray(leadItem.content)) setLeads(leadItem.content);

        const briefItem = data.find((r) => r.id === "hub_web_briefs");
        if (briefItem?.content && Array.isArray(briefItem.content)) setWebBriefs(briefItem.content);
      }
    } catch (err) {
      console.warn("Cargando configuraciones Supabase CMS", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Walther2026Secure!" || password === "walther2026") {
      setSession(true);
      localStorage.setItem("hub_admin_logged", "true");
      setLoginError("");
    } else {
      setLoginError("Contraseña incorrecta. Intenta nuevamente.");
    }
  };

  const handleLogout = () => {
    setSession(false);
    localStorage.removeItem("hub_admin_logged");
  };

  // SAVE ACTIONS
  const saveProjectsData = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("cms_content").upsert({
        id: "hub_projects_data",
        content: categories,
      });
      if (error) throw error;
      alert("¡Proyectos y categorías guardados exitosamente en Supabase!");
    } catch (err: any) {
      alert("Error al guardar proyectos: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAboutData = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("cms_content").upsert({
        id: "hub_about_data",
        content: aboutData,
      });
      if (error) throw error;
      alert("¡Sección Nosotros y Galería de fotos guardadas en Supabase!");
    } catch (err: any) {
      alert("Error al guardar Nosotros: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveOfficeData = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("cms_content").upsert({
        id: "hub_office_data",
        content: officeData,
      });
      if (error) throw error;
      alert("¡Ubicación, mapa y fotos de oficinas guardadas en Supabase!");
    } catch (err: any) {
      alert("Error al guardar Ubicación: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveLegalData = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("cms_content").upsert({
        id: "hub_legal_data",
        content: legalData,
      });
      if (error) throw error;
      alert("¡Contenido de Páginas Legales & Habeas Data guardado exitosamente en Supabase!");
    } catch (err: any) {
      alert("Error al guardar Legales: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // LEADS ACTIONS
  const saveLeadsData = async (updatedLeads: any[]) => {
    setLeads(updatedLeads);
    try {
      await supabase.from("cms_content").upsert({
        id: "hub_leads_data",
        content: updatedLeads,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Error guardando leads:", e);
    }
  };

  const handleSendToCRM = async (leadId: string, company: string) => {
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return { ...l, status: `Enviado a CRM (${company})` };
      }
      return l;
    });
    await saveLeadsData(updated);
    alert(`¡Lead enrutado y enviado al CRM digital de ${company}!`);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm("¿Seguro que deseas eliminar este prospecto?")) {
      const updated = leads.filter((l) => l.id !== leadId);
      await saveLeadsData(updated);
    }
  };

  const exportLeadsCSV = () => {
    if (leads.length === 0) {
      alert("No hay leads para exportar.");
      return;
    }
    const headers = ["ID", "Fecha/Hora", "Contacto", "Empresa Objetivo", "Habeas Data (Ley 1581)", "Estado CRM", "Mensaje / Consulta"];
    const rows = leads.map((l: any) => [
      l.id || "",
      l.createdAt ? new Date(l.createdAt).toLocaleString("es-CO") : "",
      `"${l.contact || ""}"`,
      `"${l.company || ""}"`,
      `"${l.habeasDataConsent || ""}"`,
      `"${l.status || ""}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e: any) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leads_ErIkA_WP_Ecosystem_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UPLOAD IMAGE HELPER
  const handleUploadFile = async (file: File, folder: string): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error subiendo la imagen");
      return data.url;
    } catch (err: any) {
      alert("Error subiendo imagen: " + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  if (!session) {
    return (
      <main className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="w-full max-w-md bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 mx-auto">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              CMS Admin Panel
            </h1>
            <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold">
              WP Ecosystem
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-semibold text-center flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Contraseña de Administrador</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              Acceder al Panel CMS
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090e] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
              CMS Admin Panel — WP Ecosystem
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Gestiona en tiempo real todos los proyectos, galerías de fotos, ubicaciones y contenido legal de tu portal.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer self-start md:self-auto"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            { id: "proyectos", label: "🚀 Proyectos & Empresas", icon: FolderKanban },
            { id: "nosotros", label: "🏢 Nosotros & Fotos", icon: Info },
            { id: "ubicacion", label: "📍 Ubicación & Mapa", icon: MapPin },
            { id: "legales", label: "📜 Legales & Habeas Data", icon: Scale },
            { id: "leads", label: "📬 Leads Capturados por ErIkA", icon: UserCheck },
            { id: "briefs", label: "🚀 Briefs & Cotizaciones Web", icon: Laptop },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-slate-950 shadow-lg shadow-indigo-500/20"
                    : "bg-white/[0.03] text-gray-400 hover:bg-white/[0.08]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROYECTOS */}
        {activeTab === "proyectos" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-cyan-400">Catálogo de Proyectos & Empresas</h2>
              <button
                onClick={saveProjectsData}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar Proyectos en Supabase"}
              </button>
            </div>

            <div className="space-y-6">
              {categories.map((cat, catIdx) => (
                <div key={cat.id} className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/10 pb-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Título Categoría</label>
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[catIdx].title = e.target.value;
                          setCategories(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Subtítulo Categoría</label>
                      <input
                        type="text"
                        value={cat.subtitle}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[catIdx].subtitle = e.target.value;
                          setCategories(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Projects List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 uppercase">Proyectos en esta categoría</span>
                      <button
                        onClick={() => {
                          const updated = [...categories];
                          updated[catIdx].projects.push({
                            name: "Nuevo Proyecto",
                            description: "Descripción del nuevo proyecto empresarial...",
                            tag: "Tecnología",
                            url: "https://",
                            logoUrl: "",
                            badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
                          });
                          setCategories(updated);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar Proyecto
                      </button>
                    </div>

                    {cat.projects.map((proj: any, pIdx: number) => (
                      <div key={pIdx} className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre Empresa / Proyecto</label>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[catIdx].projects[pIdx].name = e.target.value;
                                setCategories(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Etiqueta / Tag</label>
                            <input
                              type="text"
                              value={proj.tag}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[catIdx].projects[pIdx].tag = e.target.value;
                                setCategories(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">URL Enlace Sitio Web</label>
                            <input
                              type="text"
                              value={proj.url}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[catIdx].projects[pIdx].url = e.target.value;
                                setCategories(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Descripción Breve</label>
                          <textarea
                            value={proj.description}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[catIdx].projects[pIdx].description = e.target.value;
                              setCategories(updated);
                            }}
                            rows={2}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none resize-none"
                          />
                        </div>

                        {/* Logo upload */}
                        <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[10px] font-bold text-amber-400 uppercase">Logo / Imagen:</span>
                          {proj.logoUrl && (
                            <img src={proj.logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover bg-slate-950 border border-white/10" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            id={`proj-logo-${catIdx}-${pIdx}`}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await handleUploadFile(file, "projects");
                                if (url) {
                                  const updated = [...categories];
                                  updated[catIdx].projects[pIdx].logoUrl = url;
                                  setCategories(updated);
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById(`proj-logo-${catIdx}-${pIdx}`)?.click()}
                            className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded text-[11px] font-bold cursor-pointer"
                          >
                            📷 Subir Logo
                          </button>
                          <input
                            type="text"
                            value={proj.logoUrl || ""}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[catIdx].projects[pIdx].logoUrl = e.target.value;
                              setCategories(updated);
                            }}
                            placeholder="URL del logo (https://...)"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-gray-300 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const updated = [...categories];
                              updated[catIdx].projects.splice(pIdx, 1);
                              setCategories(updated);
                            }}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: NOSOTROS & FOTOS */}
        {activeTab === "nosotros" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-cyan-400">Página Nosotros & Galería de Fotos</h2>
              <button
                onClick={saveAboutData}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar Nosotros en Supabase"}
              </button>
            </div>

            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Título Principal</label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subtítulo / Resumen</label>
                <textarea
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Párrafo 1 (Misión / Visión)</label>
                  <textarea
                    value={aboutData.bio1}
                    onChange={(e) => setAboutData({ ...aboutData, bio1: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Párrafo 2 (Asesoría Tecnológica)</label>
                  <textarea
                    value={aboutData.bio2}
                    onChange={(e) => setAboutData({ ...aboutData, bio2: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Photo Gallery Manager */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-400 uppercase">📸 Galería de Fotos Institucionales</h3>
                  <button
                    onClick={() => {
                      setAboutData({
                        ...aboutData,
                        photos: [...(aboutData.photos || []), { src: "/office/office-1.webp", title: "Nueva Foto" }]
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Foto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aboutData.photos?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        {item.src && (
                          <img src={item.src} alt={item.title} className="w-16 h-12 rounded object-cover bg-slate-900 border border-white/10" />
                        )}
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...aboutData.photos];
                              updated[idx].title = e.target.value;
                              setAboutData({ ...aboutData, photos: updated });
                            }}
                            placeholder="Título de la foto..."
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            value={item.src}
                            onChange={(e) => {
                              const updated = [...aboutData.photos];
                              updated[idx].src = e.target.value;
                              setAboutData({ ...aboutData, photos: updated });
                            }}
                            placeholder="URL de la imagen..."
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[11px] text-gray-400 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = [...aboutData.photos];
                            updated.splice(idx, 1);
                            setAboutData({ ...aboutData, photos: updated });
                          }}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UBICACIÓN */}
        {activeTab === "ubicacion" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-cyan-400">Página Ubicación, Mapa & Oficinas</h2>
              <button
                onClick={saveOfficeData}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar Ubicación en Supabase"}
              </button>
            </div>

            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre de la Sede</label>
                  <input
                    type="text"
                    value={officeData.facilityName}
                    onChange={(e) => setOfficeData({ ...officeData, facilityName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirección Oficial</label>
                  <input
                    type="text"
                    value={officeData.address}
                    onChange={(e) => setOfficeData({ ...officeData, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Información de Parqueaderos</label>
                  <input
                    type="text"
                    value={officeData.parking}
                    onChange={(e) => setOfficeData({ ...officeData, parking: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Requisitos de Acceso</label>
                  <input
                    type="text"
                    value={officeData.accessReq}
                    onChange={(e) => setOfficeData({ ...officeData, accessReq: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">URL de Google Maps (Iframe embed)</label>
                <input
                  type="text"
                  value={officeData.mapUrl}
                  onChange={(e) => setOfficeData({ ...officeData, mapUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              {/* Photo Gallery Manager for Offices */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-400 uppercase">📷 Galería de Fotos de Oficinas</h3>
                  <button
                    onClick={() => {
                      setOfficeData({
                        ...officeData,
                        photos: [...(officeData.photos || []), { src: "/office/office-1.webp", title: "Nueva Foto Sede" }]
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Foto Sede
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {officeData.photos?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        {item.src && (
                          <img src={item.src} alt={item.title} className="w-16 h-12 rounded object-cover bg-slate-900 border border-white/10" />
                        )}
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...officeData.photos];
                              updated[idx].title = e.target.value;
                              setOfficeData({ ...officeData, photos: updated });
                            }}
                            placeholder="Título espacio de trabajo..."
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            value={item.src}
                            onChange={(e) => {
                              const updated = [...officeData.photos];
                              updated[idx].src = e.target.value;
                              setOfficeData({ ...officeData, photos: updated });
                            }}
                            placeholder="URL imagen..."
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[11px] text-gray-400 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = [...officeData.photos];
                            updated.splice(idx, 1);
                            setOfficeData({ ...officeData, photos: updated });
                          }}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEGALES & HABEAS DATA */}
        {activeTab === "legales" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-cyan-400">Páginas Legales & Habeas Data</h2>
                <p className="text-xs text-gray-400">Modifica la información legal, direcciones, correos y cláusulas del ecosistema en tiempo real.</p>
              </div>
              <button
                onClick={saveLegalData}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar Cambios Legales"}
              </button>
            </div>

            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl space-y-6">
              {/* Sección Habeas Data */}
              <div className="space-y-4 border-b border-white/10 pb-6">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  ⚖️ Habeas Data (Ley 1581 de 2012)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Correo Electrónico para Reclamaciones ARCO</label>
                    <input
                      type="text"
                      value={legalData.contactEmail || ""}
                      onChange={(e) => setLegalData({ ...legalData, contactEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirección Sede Principal Bogotá</label>
                    <input
                      type="text"
                      value={legalData.bogotaAddress || ""}
                      onChange={(e) => setLegalData({ ...legalData, bogotaAddress: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirección Sede Académica</label>
                  <input
                    type="text"
                    value={legalData.academicAddress || ""}
                    onChange={(e) => setLegalData({ ...legalData, academicAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Declaración del Responsable del Tratamiento</label>
                  <textarea
                    rows={3}
                    value={legalData.habeasDataText || ""}
                    onChange={(e) => setLegalData({ ...legalData, habeasDataText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Sección Términos y Condiciones */}
              <div className="space-y-4 border-b border-white/10 pb-6">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  📜 Términos y Condiciones de Uso
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Texto de Aceptación de los Términos</label>
                  <textarea
                    rows={3}
                    value={legalData.termsText || ""}
                    onChange={(e) => setLegalData({ ...legalData, termsText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cláusula de Propiedad Intelectual & Marcas</label>
                  <textarea
                    rows={3}
                    value={legalData.intellectualPropertyText || ""}
                    onChange={(e) => setLegalData({ ...legalData, intellectualPropertyText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Sección Política de Privacidad */}
              <div className="space-y-4 border-b border-white/10 pb-6">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  🔒 Política de Privacidad & Confidencialidad
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Declaración Global de Privacidad</label>
                  <textarea
                    rows={3}
                    value={legalData.privacyText || ""}
                    onChange={(e) => setLegalData({ ...legalData, privacyText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Vista Previa de Links */}
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Accesos Directos a Páginas Legales Públicas:</p>
                <div className="flex flex-wrap gap-3">
                  <a href="/habeas-data" target="_blank" className="px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-600/30 transition-all">
                    ⚖️ Abrir Habeas Data (Vista Previa)
                  </a>
                  <a href="/terminos" target="_blank" className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold hover:bg-indigo-600/30 transition-all">
                    📜 Abrir Términos (Vista Previa)
                  </a>
                  <a href="/privacidad" target="_blank" className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-600/30 transition-all">
                    🔒 Abrir Privacidad (Vista Previa)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LEADS CAPTURADOS POR ERIKA */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                  📬 Leads Capturados por ErIkA (IA)
                </h2>
                <p className="text-xs text-gray-400">Prospectos capturados automáticamente con autorización de Habeas Data (Ley 1581). Cero papel, 100% digital.</p>
              </div>
              <button
                onClick={exportLeadsCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <Download className="w-4 h-4" /> Exportar Leads (CSV)
              </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-white/10 p-4 rounded-2xl space-y-1">
                <p className="text-[11px] text-gray-400 font-bold uppercase">Total Leads Registrados</p>
                <p className="text-2xl font-extrabold text-white">{leads.length}</p>
              </div>
              <div className="bg-slate-900/60 border border-emerald-500/30 p-4 rounded-2xl space-y-1">
                <p className="text-[11px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Consentimiento Ley 1581
                </p>
                <p className="text-2xl font-extrabold text-emerald-300">
                  {leads.filter((l: any) => l.habeasDataConsent?.includes('Otorgado')).length}
                </p>
              </div>
              <div className="bg-slate-900/60 border border-indigo-500/30 p-4 rounded-2xl space-y-1">
                <p className="text-[11px] text-indigo-400 font-bold uppercase">Pendientes por CRM</p>
                <p className="text-2xl font-extrabold text-indigo-300">
                  {leads.filter((l: any) => !l.status || l.status.includes('Pendiente')).length}
                </p>
              </div>
              <div className="bg-slate-900/60 border border-cyan-500/30 p-4 rounded-2xl space-y-1">
                <p className="text-[11px] text-cyan-400 font-bold uppercase">Enviados a CRM</p>
                <p className="text-2xl font-extrabold text-cyan-300">
                  {leads.filter((l: any) => l.status?.includes('Enviado')).length}
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/40 border border-white/10 p-3 rounded-xl">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por correo, WhatsApp o consulta..."
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-400 font-bold uppercase">Empresa:</span>
                <select
                  value={selectedLeadCompany}
                  onChange={(e) => setSelectedLeadCompany(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="TODOS">Todas las Empresas</option>
                  <option value="PreICFES App">PreICFES App</option>
                  <option value="FUNDETEC">FUNDETEC</option>
                  <option value="Jowhalth Academy">Jowhalth Academy</option>
                  <option value="Rentun Group">Rentun Group</option>
                  <option value="Consultoría IA B2B">Consultoría IA B2B</option>
                </select>
              </div>
            </div>

            {/* Table of Leads */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {leads.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <UserCheck className="w-12 h-12 text-indigo-400/50 mx-auto" />
                  <p className="text-sm font-bold text-gray-300">Aún no hay leads capturados por ErIkA.</p>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Cuando los usuarios conversen con ErIkA en la página principal y compartan su correo o WhatsApp autorizando el contacto, aparecerán automáticamente en esta tabla.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-gray-400 uppercase tracking-wider font-bold border-b border-white/10">
                      <tr>
                        <th className="p-4">Fecha / Hora</th>
                        <th className="p-4">Contacto (Correo / WhatsApp)</th>
                        <th className="p-4">Empresa Objetivo</th>
                        <th className="p-4">Habeas Data (Ley 1581)</th>
                        <th className="p-4">Estado CRM</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {leads
                        .filter((l: any) => {
                          const matchCompany = selectedLeadCompany === "TODOS" || l.company === selectedLeadCompany;
                          const matchSearch =
                            !leadSearchTerm ||
                            (l.contact || "").toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                            (l.message || "").toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                            (l.company || "").toLowerCase().includes(leadSearchTerm.toLowerCase());
                          return matchCompany && matchSearch;
                        })
                        .map((lead: any, idx: number) => (
                          <tr key={lead.id || idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono text-gray-400">
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleString("es-CO") : "Reciente"}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-white bg-slate-950 border border-white/10 px-2.5 py-1 rounded-lg">
                                {lead.contact}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                                {lead.company}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <ShieldCheck className="w-3 h-3" /> {lead.habeasDataConsent || "Otorgado (Ley 1581)"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  lead.status?.includes("Enviado")
                                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                                    : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {lead.status || "Pendiente CRM"}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleSendToCRM(lead.id, lead.company)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold cursor-pointer transition-all"
                                  title="Enviar digitalmente al CRM de la empresa sin papel"
                                >
                                  <Send className="w-3.5 h-3.5" /> Enviar a CRM
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer transition-all"
                                  title="Eliminar lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: BRIEFS & COTIZACIONES WEB CON IA */}
        {activeTab === "briefs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-cyan-400">Briefs & Cotizaciones de Software Generados con IA</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Solicitudes completas de páginas web, tiendas online y aplicaciones SaaS recibidas desde /cotizar-web.
                </p>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                {webBriefs.length} Solicitudes
              </span>
            </div>

            {webBriefs.length === 0 ? (
              <div className="bg-slate-900/60 border border-white/10 p-12 rounded-2xl text-center space-y-3">
                <Laptop className="w-10 h-10 text-gray-500 mx-auto" />
                <p className="text-sm font-bold text-gray-400">No se han registrado briefs de cotización web aún.</p>
                <p className="text-xs text-gray-500">Los clientes que completen el wizard en /cotizar-web aparecerán listados aquí.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {webBriefs.map((b: any, idx: number) => (
                  <div key={b.id || idx} className="bg-slate-900/80 border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                          {b.clientName || "Cliente"} <span className="text-xs text-gray-400">({b.company || "Empresa"})</span>
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-indigo-400 font-semibold mt-1">
                          <span>📞 {b.contact} ({b.contactType})</span>
                          <span>•</span>
                          <span>🚀 {b.projectType}</span>
                          <span>•</span>
                          <span>💰 {b.estimatedBudget}</span>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/573045788873?text=${encodeURIComponent(`Hola ${b.clientName}, he revisado tu solicitud de cotización para ${b.projectType} (${b.company}). ¡Agendemos una reunión ejecutiva!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 self-start md:self-auto"
                      >
                        <Send className="w-3.5 h-3.5" /> Responder al Cliente por WhatsApp
                      </a>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-2">Módulos Solicitados:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(b.selectedFeatures) && b.selectedFeatures.map((feat: string, fIdx: number) => (
                          <span key={fIdx} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {b.aiTechnicalBrief && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Diagnóstico de Arquitectura IA:</span>
                        <pre className="text-[11px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          {b.aiTechnicalBrief}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
