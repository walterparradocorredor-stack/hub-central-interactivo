'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const seminarsData = [
  {
    id: "claude-cowork",
    title: "Claude Cowork: Aumenta tu Productividad",
    emoji: "💼",
    imageCover: "/claude-cowork-cover.png",
    accentColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.15)",
    badge: "Productividad Profesional",
    duration: "4 Horas",
    modality: "Virtual en vivo",
    category: "Seminario",
    description: "Aprende a integrar Claude y modelos de lenguaje avanzados en tu flujo diario. Optimiza la redacción de informes, gestión de correos, actas de reuniones y análisis de datos sin comprometer la seguridad de la información institucional.",
    presentationUrl: "/seminario-claude-cowork.html",
    videoUrl: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    activities: "1. Diseñar un System Prompt (Prompt de Sistema) personalizado para automatizar un proceso repetitivo en tu oficina (ej. responder solicitudes de clientes o redactar actas ejecutivas).\n2. Probar el prompt en Claude y tomar capturas del prompt utilizado y de los resultados generados.\n3. Crear un informe PDF con el prompt, la prueba realizada y un análisis crítico de la calidad del resultado.\n4. Enviar el informe digital al correo Virtualidad@fundetec.edu.co con el asunto 'Entrega Actividad - Claude Cowork' para tu certificación.",
    blocks: [
      { num: "Bloque 1", title: "Introducción al Coworking con IA", desc: "Conceptos clave de modelos masivos de lenguaje, interfaz de Claude y cómo delegar tareas administrativas diarias." },
      { num: "Bloque 2", title: "Ingeniería de Prompts y Contextos", desc: "Fórmulas avanzadas de prompts, delimitación de roles, carga de archivos y variables dinámicas para resultados precisos." },
      { num: "Bloque 3", title: "Casos Prácticos en Oficina", desc: "Creación de actas ejecutivas, redacción de respuestas complejas, ordenamiento de bases de datos y resúmenes analíticos." },
      { num: "Bloque 4", title: "Ética, Privacidad y Buenas Prácticas", desc: "Gestión segura de datos, límites del modelo (alucinaciones) y checklist de seguridad de la información corporativa." }
    ],
    keywords: ["Claude AI", "Productividad de oficina", "Ingeniería de prompts", "Automatización de tareas", "Gestión documental"]
  },
  {
    id: "menus-ia",
    title: "Composición de Menús Gastronómicos con IA",
    emoji: "🍳",
    imageCover: "/menus-ia-cover.png",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.15)",
    badge: "Gestión Gastronómica",
    duration: "4 Horas",
    modality: "Virtual en vivo",
    category: "Seminario",
    description: "Domina la ingeniería de menú moderna aliada con herramientas de inteligencia artificial. Diseña cartas equilibradas, optimiza la matriz de rentabilidad y popularidad de tus platos, y crea descripciones sensoriales irresistibles.",
    presentationUrl: "/seminario-menus-ia.html",
    videoUrl: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    activities: "1. Seleccionar la carta actual de un negocio gastronómico o diseñar una nueva propuesta.\n2. Clasificar al menos 5 platos dentro de la matriz de ingeniería de menús (Estrella, Vaca, Puzle, Perro) estimando su popularidad y margen.\n3. Utilizar inteligencia artificial para redactar descripciones neuro-sensoriales sugerentes para relanzar los platos clasificados como 'Puzle'.\n4. Estructurar la propuesta final en PDF detallando ingredientes, alérgenos y la matriz de optimización.\n5. Enviar el entregable académico al correo Virtualidad@fundetec.edu.co para certificar la aprobación del seminario.",
    blocks: [
      { num: "Bloque 1", title: "Ingeniería de Menú y Psicología", desc: "La matriz clásica de popularidad/rentabilidad (Estrellas, Vacas, Puzles y Perros). Psicología del comensal y jerarquía visual." },
      { num: "Bloque 2", title: "Redacción de Platos con IA", desc: "Prompts específicos para descripciones gastronómicas que despierten sentidos, maridaje inteligente e ideación de recetas." },
      { num: "Bloque 3", title: "Gestión de Alérgenos y Dietas", desc: "Inclusión de opciones veganas, sin gluten y control de alérgenos cruzados certificado bajo estándares de cocina real." },
      { num: "Bloque 4", title: "Analítica en Menús Digitales", desc: "Uso de menús QR interactivos, medición de la tasa de conversión vista-pedido y optimización de carta basada en datos." }
    ],
    keywords: ["Ingeniería de menú", "Diseño de cartas con IA", "Marketing gastronómico", "Gestión de alérgenos", "Menús digitales QR"]
  },
  {
    id: "gemini-notebooklm",
    title: "Gemini y NotebookLM para la Productividad",
    emoji: "🤖",
    imageCover: "/gemini-notebooklm-cover.png",
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.15)",
    badge: "Investigación & Análisis",
    duration: "4 Horas",
    modality: "Virtual en vivo",
    category: "Seminario",
    description: "Aprovecha el poder del ecosistema de Google para centralizar tu conocimiento. Usa NotebookLM para interrogar múltiples documentos, generar resúmenes automáticos y crear podcasts interactivos con Audio Overviews profesionales.",
    presentationUrl: "/seminario-gemini-notebooklm.html",
    videoUrl: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    activities: "1. Crear una cuenta en NotebookLM, diseñar una nueva libreta y cargar al menos 3 fuentes documentales (PDFs, artículos web o transcripciones).\n2. Ejecutar 3 consultas cruzadas utilizando citación interactiva y guardar las respuestas como notas de estudio.\n3. Generar una Guía de Estudio (Study Guide) y un documento de preguntas y respuestas (FAQ) automático utilizando la herramienta.\n4. Compartir la libreta de forma pública o exportar el resumen en un archivo PDF consolidado.\n5. Enviar el PDF y el enlace de la libreta compartida al correo Virtualidad@fundetec.edu.co para revisión.",
    blocks: [
      { num: "Bloque 1", title: "Ecosistema de Productividad Google", desc: "Diferencias entre Gemini Free/Advanced, integraciones con Workspace (Docs, Sheets) y búsqueda inteligente en nube." },
      { num: "Bloque 2", title: "NotebookLM como Cerebro Virtual", desc: "Carga de PDFs, URLs y notas. Generación de guías de estudio, resúmenes automáticos y el impacto del Audio Overview." },
      { num: "Bloque 3", title: "Prompts de Redacción y Análisis", desc: "Cruce de datos provenientes de múltiples fuentes, resúmenes cruzados, y estructuración de informes ejecutivos complejos." },
      { num: "Bloque 4", title: "Seguridad y Privacidad Corporativa", desc: "Políticas de protección de datos en Google Cloud y cómo evitar el entrenamiento público de la IA con tus archivos." }
    ],
    keywords: ["Google Gemini", "NotebookLM", "Audio Overview podcast", "Cerebro virtual de documentos", "Seguridad de datos corporativos"]
  },
  {
    id: "estructura-unas-bioseguridad",
    title: "Estructura de Uñas y Bioseguridad en el Salón",
    emoji: "💅",
    imageCover: "/unas-bioseguridad-cover.png",
    accentColor: "#db2777",
    glowColor: "rgba(219, 39, 119, 0.15)",
    badge: "Estética Profesional",
    duration: "4 Horas",
    modality: "Virtual en vivo",
    category: "Seminario",
    description: "Un seminario indispensable para manicuristas que deseen comprender la física-química de la uña natural, diagnosticar alteraciones correctamente y aplicar protocolos de esterilización de grado clínico en cumplimiento de las normativas de salud.",
    presentationUrl: "/seminario-estructura-unas-bioseguridad.html",
    videoUrl: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    activities: "1. Elaborar la lista de chequeo de Elementos de Protección Personal (EPP) obligatorios para manicuristas en tu espacio de trabajo.\n2. Diseñar el flujo de manejo de residuos cortopunzantes y biosanitarios en cumplimiento con la Resolución 2827 de 2006.\n3. Describir el protocolo paso a paso de desinfección y esterilización química y por autoclave de las herramientas metálicas.\n4. Compilar los protocolos en un informe PDF con esquemas visuales.\n5. Enviar el informe firmado al correo Virtualidad@fundetec.edu.co para la expedición de tu certificado oficial.",
    blocks: [
      { num: "Bloque 1", title: "Anatomía y Química de la Uña", desc: "Estructura celular de la lámina ungueal, matriz (la fábrica de la uña), lecho y eponiquio. Crecimiento, flexibilidad y queratina dura." },
      { num: "Bloque 2", title: "Patologías y Alteraciones", desc: "Identificación de onicólisis, onicomicosis, pseudomonas (mancha verde) y paroniquia. Cuándo proceder cosméticamente y cuándo remitir." },
      { num: "Bloque 3", title: "Bioseguridad y Esterilización", desc: "Sanitización vs Desinfección vs Esterilización. Uso correcto del autoclave y calor seco. Residuos biosanitarios según Res. 2827 de 2006." },
      { num: "Bloque 4", title: "Protocolos de Cabina y EPP", desc: "Uso de mascara N95 contra vapores y polvos, monogafas y guantes de nitrilo sin polvo. Fichas de seguridad química MSDS." }
    ],
    keywords: ["Anatomía ungueal", "Bioseguridad en salón de belleza", "Esterilización autoclave manicura", "Onicomicosis diagnóstico visual", "Normativa de salud estética"]
  },
  {
    id: "liderazgo-educativo",
    title: "Gerencia y Liderazgo Educativo",
    emoji: "🎯",
    imageCover: "/liderazgo-educativo-cover.png",
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.15)",
    badge: "Ruta de Aprendizaje",
    duration: "4 Módulos · 6 Horas",
    modality: "Formación Ejecutiva",
    category: "Curso",
    description: "Desarrolla las habilidades necesarias para liderar con propósito en instituciones y proyectos educativos modernos.",
    presentationUrl: "/seminario-liderazgo-educativo.html",
    videoUrl: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    activities: "1. Redactar una propuesta estratégica de transformación para una institución educativa.\n2. Incluir el análisis del modelo pedagógico y plan de acción de 90 días.\n3. Enviar el plan a Virtualidad@fundetec.edu.co para revisión.",
    blocks: [
      { num: "Módulo 1", title: "Fundamentos de la gestión educativa moderna", desc: "Principios de liderazgo transformacional y dirección institucional." },
      { num: "Módulo 2", title: "Diseño de Modelos Pedagógicos Innovadores", desc: "Integración de tecnologías y enfoques contemporáneos en el aula." },
      { num: "Módulo 3", title: "Ética en la administración escolar", desc: "Toma de decisiones, transparencia y clima organizacional." },
      { num: "Módulo 4", title: "Evaluación y Proyecto Final", desc: "Sistematización de la propuesta de mejora institucional." }
    ],
    keywords: ["Gerencia educativa", "Liderazgo institucional", "Modelos pedagógicos", "Gestión directiva"]
  },
  {
    id: "acreditacion-institucional",
    title: "Evaluación y Acreditación de Calidad",
    emoji: "📊",
    imageCover: "/acreditacion-calidad-cover.png",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.15)",
    badge: "Cápsula Directiva",
    duration: "2 Lecciones · 45 min",
    modality: "Autoformación",
    category: "Curso",
    description: "Aprende los estándares de calidad y metodologías para liderar procesos de acreditación y autoevaluación ante el MEN.",
    presentationUrl: "/seminario-acreditacion.html",
    videoUrl: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    activities: "1. Diseñar una matriz de PMI (Plan de Mejoramiento Institucional) basada en los criterios del MEN.\n2. Enviar el documento preliminar a Virtualidad@fundetec.edu.co.",
    blocks: [
      { num: "Lección 1", title: "Indicadores de Calidad del MEN", desc: "Requisitos normativos y análisis de evidencia de calidad escolar." },
      { num: "Lección 2", title: "Autoevaluación y planes de mejoramiento", desc: "Diseño de matrices PMI e implementación de planes institucionales." }
    ],
    keywords: ["Acreditación de calidad", "Autoevaluación MEN", "Planes de mejoramiento", "Calidad educativa"]
  },
  {
    id: "comunicacion-academica",
    title: "Comunicación Estratégica para Docentes",
    emoji: "🎙️",
    imageCover: "/comunicacion-docente-cover.png",
    accentColor: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.15)",
    badge: "Ruta de Aprendizaje",
    duration: "3 Módulos · 5 Horas",
    modality: "Taller Práctico",
    category: "Curso",
    description: "Técnicas de oratoria, debate pedagógico y construcción de mensaje para directivos y líderes educativos.",
    presentationUrl: "/seminario-comunicacion.html",
    videoUrl: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    activities: "1. Grabar un video de 3 minutos aplicando la técnica de discursos persuasivos pedagógicos.\n2. Enviar la grabación a Virtualidad@fundetec.edu.co.",
    blocks: [
      { num: "Módulo 1", title: "Controlando el pánico escénico en el aula", desc: "Manejo de voz, corporalidad y proyección en entornos académicos." },
      { num: "Módulo 2", title: "Estructura de discursos pedagógicos persuasivos", desc: "Storytelling educativo y conexión emotiva con la audiencia." },
      { num: "Módulo 3", title: "Manejo de comunicación en crisis institucionales", desc: "Estrategias de vocería y resolución de conflictos comunitarios." }
    ],
    keywords: ["Oratoria docente", "Comunicación pedagógica", "Storytelling educativo", "Liderazgo de voz"]
  }
];

const COVER_MAP: Record<string, string> = {
  'claude-cowork': '/claude-cowork-cover.png',
  'menus-ia': '/menus-ia-cover.png',
  'gemini-notebooklm': '/gemini-notebooklm-cover.png',
  'estructura-unas-bioseguridad': '/unas-bioseguridad-cover.png',
  'liderazgo-educativo': '/liderazgo-educativo-cover.png',
  'acreditacion-institucional': '/acreditacion-calidad-cover.png',
  'comunicacion-academica': '/comunicacion-docente-cover.png',
  'gestion-financiera-escolar': '/gestion-financiera-cover.png',
  'innovacion-tecnologica-aula': '/innovacion-tecnologica-cover.png',
  'diseno-curricular-contemporaneo': '/diseno-curricular-cover.png'
};

const getSeminarCover = (seminar: any) => {
  if (seminar.imageCover) return seminar.imageCover;
  if (COVER_MAP[seminar.id]) return COVER_MAP[seminar.id];
  const title = (seminar.title || '').toLowerCase();
  if (title.includes('financiera')) return '/gestion-financiera-cover.png';
  if (title.includes('tecnológic') || title.includes('innovación') || title.includes('aula')) return '/innovacion-tecnologica-cover.png';
  if (title.includes('curricular')) return '/diseno-curricular-cover.png';
  if (title.includes('liderazgo')) return '/liderazgo-educativo-cover.png';
  if (title.includes('acreditación') || title.includes('calidad')) return '/acreditacion-calidad-cover.png';
  if (title.includes('comunicación') || title.includes('oratoria')) return '/comunicacion-docente-cover.png';
  return null;
};

export default function SeminarsSection() {
  const [seminars, setSeminars] = useState<any[]>(seminarsData);
  const [expandedSeminar, setExpandedSeminar] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'seminar' | 'course'>('all');
  const [activeTabs, setActiveTabs] = useState<Record<string, 'blocks' | 'video' | 'activities'>>({});

  const setActiveTab = (id: string, tab: 'blocks' | 'video' | 'activities') => {
    setActiveTabs(prev => ({ ...prev, [id]: tab }));
  };

  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [purchasedSeminars, setPurchasedSeminars] = useState<Record<string, boolean>>({});
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [showPaywallSeminars, setShowPaywallSeminars] = useState<Record<string, boolean>>({});
  const [previewSecondsLeft, setPreviewSecondsLeft] = useState<Record<string, number>>({});

  const [buyerEmails, setBuyerEmails] = useState<Record<string, string>>({});
  const [restoreEmails, setRestoreEmails] = useState<Record<string, string>>({});
  const [showRestoreForm, setShowRestoreForm] = useState<Record<string, boolean>>({});
  const [isVerifyingRestore, setIsVerifyingRestore] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Seminars and Education resources from Supabase
      try {
        const { data: semRes } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'seminars_data')
          .single();

        const { data: eduRes } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'education_data')
          .single();

        let combined = [...seminarsData];

        if (semRes?.content && Array.isArray(semRes.content)) {
          semRes.content.forEach((item: any) => {
            const idx = combined.findIndex(c => c.id === item.id);
            if (idx >= 0) {
              combined[idx] = { ...combined[idx], ...item };
            } else {
              combined.push(item);
            }
          });
        }

        if (eduRes?.content && Array.isArray(eduRes.content)) {
          eduRes.content.forEach((item: any) => {
            const idx = combined.findIndex(c => c.id === item.id);
            if (idx >= 0) {
              combined[idx] = { ...combined[idx], ...item, category: 'Curso' };
            } else {
              combined.push({
                ...item,
                category: 'Curso',
                emoji: item.icon || '🎓',
                accentColor: item.accentColor || '#3b82f6',
                glowColor: 'rgba(59, 130, 246, 0.15)',
                badge: item.type || 'Ruta de Aprendizaje',
                duration: item.duration || `${item.syllabus?.length || 0} módulos`,
                blocks: item.syllabus?.map((s: any, i: number) => ({
                  num: `Módulo ${i + 1}`,
                  title: s.title,
                  desc: s.desc || "Módulo de formación interactivo"
                })) || [],
                keywords: ["Educación", "Formación directiva", "Certificación"]
              });
            }
          });
        }

        setSeminars(combined);
      } catch (err) {
        console.warn('Could not load seminars from Supabase:', err);
      }

      // 2. Fetch Payment Config
      try {
        const { data: payData } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'payment_config')
          .single();

        if (payData?.content) {
          setPaymentConfig(payData.content);
        }
      } catch (err) {
        console.warn('Could not load payment configuration from Supabase:', err);
      }
    };

    fetchData();
  }, []);

  // Sync purchase status
  useEffect(() => {
    const purchased: Record<string, boolean> = {};
    seminars.forEach(s => {
      purchased[s.id] = localStorage.getItem(`walther_bought_${s.id}`) === 'true';
    });
    setPurchasedSeminars(purchased);
  }, [seminars]);

  // Manage preview countdown interval for each seminar
  useEffect(() => {
    const activeSeminarsToCount = new Set<string>();

    if (expandedSeminar && !purchasedSeminars[expandedSeminar] && !showPaywallSeminars[expandedSeminar]) {
      activeSeminarsToCount.add(expandedSeminar);
    }

    Object.keys(activeTabs).forEach(semId => {
      if (activeTabs[semId] === 'video' && !purchasedSeminars[semId] && !showPaywallSeminars[semId]) {
        activeSeminarsToCount.add(semId);
      }
    });

    const activeList = Array.from(activeSeminarsToCount);
    if (activeList.length === 0) return;

    const interval = setInterval(() => {
      setPreviewSecondsLeft(prev => {
        const updated = { ...prev };
        activeList.forEach(semId => {
          const current = updated[semId] !== undefined ? updated[semId] : 15;
          if (current <= 1) {
            setShowPaywallSeminars(prevWall => ({ ...prevWall, [semId]: true }));
            updated[semId] = 0;
          } else {
            updated[semId] = current - 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expandedSeminar, activeTabs, purchasedSeminars, showPaywallSeminars]);

  const registerPurchaseInSupabase = async (
    email: string,
    seminarId: string,
    amountCents: number,
    gateway: string,
    transactionId: string
  ) => {
    try {
      const { error } = await supabase.from('purchases').insert({
        email: email.trim().toLowerCase(),
        item_id: seminarId,
        item_type: 'seminar',
        amount_cents: amountCents,
        currency: 'COP',
        gateway: gateway,
        transaction_id: transactionId,
        status: 'approved'
      });
      if (error) console.error('Error inserting purchase in Supabase:', error.message);
    } catch (err) {
      console.error('Catch error inserting purchase in Supabase:', err);
    }
  };

  const handleVerifyPurchase = async (seminarId: string) => {
    const email = restoreEmails[seminarId];
    if (!email || !email.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setIsVerifyingRestore(prev => ({ ...prev, [seminarId]: true }));
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('item_id', seminarId)
        .eq('status', 'approved');

      if (error) {
        alert('Ocurrió un error al verificar tu acceso. Intenta de nuevo.');
        console.error(error);
      } else if (data && data.length > 0) {
        localStorage.setItem(`walther_bought_${seminarId}`, 'true');
        setPurchasedSeminars(prev => ({ ...prev, [seminarId]: true }));
        setShowPaywallSeminars(prev => ({ ...prev, [seminarId]: false }));
        alert('¡Acceso verificado! Tu seminario ha sido desbloqueado con éxito.');
      } else {
        alert('No encontramos ninguna compra aprobada asociada a este correo para este seminario.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al verificar el acceso.');
    } finally {
      setIsVerifyingRestore(prev => ({ ...prev, [seminarId]: false }));
    }
  };

  const unlockSeminar = (seminarId: string) => {
    localStorage.setItem(`walther_bought_${seminarId}`, 'true');
    setPurchasedSeminars(prev => ({ ...prev, [seminarId]: true }));
    setShowPaywallSeminars(prev => ({ ...prev, [seminarId]: false }));
    alert('¡Felicidades! Pago aprobado. Tu seminario ha sido desbloqueado con éxito.');
  };

  const loadWompiWidget = (amountInCents: number, reference: string, publicKey: string, seminarId: string) => {
    if (typeof window === 'undefined') return;
    if (!(window as any).WidgetCheckout) {
      const script = document.createElement("script");
      script.src = "https://checkout.wompi.co/widget.js";
      script.async = true;
      script.onload = () => {
        openWompiWidget(amountInCents, reference, publicKey, seminarId);
      };
      document.body.appendChild(script);
    } else {
      openWompiWidget(amountInCents, reference, publicKey, seminarId);
    }
  };

  const openWompiWidget = (amountInCents: number, reference: string, publicKey: string, seminarId: string) => {
    const email = buyerEmails[seminarId] || '';
    const checkout = new (window as any).WidgetCheckout({
      currency: 'COP',
      amountInCents: amountInCents,
      reference: reference,
      publicKey: publicKey,
      redirectUrl: window.location.href,
      customerEmail: email.trim().toLowerCase() || undefined
    });

    checkout.open(async (result: any) => {
      const transaction = result.transaction;
      if (transaction && (transaction.status === 'APPROVED' || transaction.status === 'SUCCESS')) {
        if (email) {
          await registerPurchaseInSupabase(email, seminarId, amountInCents, 'wompi', transaction.id || '');
        }
        unlockSeminar(seminarId);
      }
    });
  };

  const loadPayPalScript = (clientId: string) => {
    if (typeof window === 'undefined') return;
    if ((window as any).paypal) {
      setPaypalLoaded(true);
      return;
    }
    const existingScript = document.getElementById("paypal-sdk-script");
    if (existingScript) {
      setPaypalLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk-script";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => {
      setPaypalLoaded(true);
    };
    document.body.appendChild(script);
  };

  // PayPal buttons rendering hook
  useEffect(() => {
    if (paypalLoaded && expandedSeminar && !purchasedSeminars[expandedSeminar] && (showPaywallSeminars[expandedSeminar] || activeTabs[expandedSeminar] === 'activities')) {
      const buttonId = `paypal-button-container-${expandedSeminar}`;
      const container = document.getElementById(buttonId);
      if (container) {
        container.innerHTML = ""; // Clear existing buttons
        const seminar = seminars.find(s => s.id === expandedSeminar);
        if (seminar) {
          (window as any).paypal.Buttons({
            style: {
              layout: 'vertical',
              color:  'gold',
              shape:  'rect',
              label:  'paypal'
            },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  description: `Seminario: ${seminar.title}`,
                  amount: {
                    value: "30.00" // 30 USD
                  }
                }]
              });
            },
            onApprove: async (data: any, actions: any) => {
              const order = await actions.order.capture();
              if (order.status === "COMPLETED") {
                const email = buyerEmails[expandedSeminar] || order.payer?.email_address || '';
                if (email) {
                  await registerPurchaseInSupabase(email, expandedSeminar, 3000, 'paypal', order.id || '');
                }
                unlockSeminar(expandedSeminar);
              }
            },
            onError: (err: any) => {
              console.error("PayPal Error:", err);
            }
          }).render(`#${buttonId}`);
        }
      }
    }
  }, [paypalLoaded, expandedSeminar, purchasedSeminars, showPaywallSeminars, activeTabs]);

  const renderSeminarLogo = (seminarId: string) => {
    const style = { width: '40px', height: '40px', objectFit: 'contain' as const };
    
    if (seminarId === 'claude-cowork') {
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 22 2 12 2Z" fill="#f59e0b" opacity="0.15"/>
          <path d="M12.015 6.002c-.524.004-.988.353-1.127.86l-1.92 7.02c-.173.633.2 1.28.833 1.453s1.28-.2 1.453-.833l1.92-7.02c.15-.548-.15-1.123-.699-1.272a1.05 1.05 0 0 0-.67-.208Z" fill="#f59e0b"/>
          <path d="M7.05 9.06a1.05 1.05 0 0 0-.208.67c.004.524.353.988.86 1.127l7.02 1.92c.633.173 1.28-.2 1.453-.833s-.2-1.28-.833-1.453l-7.02-1.92a1.05 1.05 0 0 0-.67.208Z" fill="#f59e0b"/>
          <path d="M16.95 9.06a1.05 1.05 0 0 0-.67-.208 1.05 1.05 0 0 0-.67.208l-7.02 1.92c-.633.173-.833.82-.66 1.453.173.633.82.833 1.453.66l7.02-1.92a1.05 1.05 0 0 0 .67-.67c.15-.548-.15-1.123-.699-1.272Z" fill="#f59e0b"/>
          <path d="M12.015 17.998a1.05 1.05 0 0 0 .67-.208c.548-.15.849-.724.7-1.272l-1.92-7.02c-.173-.633-.82-.833-1.453-.66-.633.173-.833.82-.66 1.453l1.92 7.02c.139.507.603.856 1.127.86Z" fill="#f59e0b"/>
        </svg>
      );
    }
    
    if (seminarId === 'gemini-notebooklm') {
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 22 2 12 2Z" fill="#3b82f6" opacity="0.15"/>
          <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="url(#geminiGrad)"/>
          <defs>
            <linearGradient id="geminiGrad" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333EA"/>
              <stop offset="0.5" stopColor="#3B82F6"/>
              <stop offset="1" stopColor="#EC4899"/>
            </linearGradient>
          </defs>
        </svg>
      );
    }

    return (
      <img 
        src="/logo-fundetec.webp" 
        alt="Fundetec Logo" 
        style={style}
      />
    );
  };

  const SeminarPaywall = ({ seminar }: { seminar: any }) => {
    const [step, setStep] = useState<'register' | 'test' | 'insignia' | 'checkout'>('register');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [activeInsignia, setActiveInsignia] = useState<{ number: number; title: string; emoji: string } | null>(null);
    
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const questions = [
      // Bloque 1: Fundamentos y Adopción de IA (1-10)
      { q: "¿Qué es el Procesamiento del Lenguaje Natural (PLN)?", opts: ["Un método para entrenar hardware mecánico.", "Una rama de la IA para que las máquinas comprendan el lenguaje humano.", "Un protocolo de seguridad web.", "Una técnica de diseño gráfico."], correctIdx: 1 },
      { q: "¿Cuál de los siguientes es un modelo de lenguaje de tipo generativo (LLM)?", opts: ["MySQL", "GPT-4", "Linux", "Kubernetes"], correctIdx: 1 },
      { q: "¿Qué representa la \"Alucinación\" en un modelo de IA?", opts: ["Un estado de hibernación del servidor.", "Datos correctos y confirmados por expertos.", "Respuestas generadas que suenan coherentes pero son falsas o inexactas.", "Una técnica de aceleración de tarjeta gráfica."], correctIdx: 2 },
      { q: "¿Qué es el Machine Learning o Aprendizaje Automático?", opts: ["El proceso de ensamblar computadoras físicamente.", "El entrenamiento de algoritmos para aprender de los datos y hacer predicciones.", "El escaneo óptico de documentos.", "Un lenguaje de programación."], correctIdx: 1 },
      { q: "¿Qué significa \"Deep Learning\"?", opts: ["Aprendizaje profundo basado en redes neuronales artificiales de múltiples capas.", "Lectura rápida de bases de datos.", "Una base de datos en la nube.", "Una técnica de compresión de archivos."], correctIdx: 0 },
      { q: "¿Cuál es el propósito del \"Prompt Engineering\"?", opts: ["Programar nuevos lenguajes de programación.", "Diseñar y optimizar instrucciones de entrada (prompts) para guiar modelos de IA.", "Administrar servidores en la nube.", "Configurar cortafuegos (firewalls)."], correctIdx: 1 },
      { q: "¿Qué es la IA Débil (o Estrecha)?", opts: ["IA que tiene conciencia propia.", "IA diseñada y entrenada para una tarea específica.", "Un algoritmo lento y desactualizado.", "Un procesador de baja potencia."], correctIdx: 1 },
      { q: "¿Qué es la IA Fuerte (o General - AGI)?", opts: ["Un procesador de alta potencia de cómputo.", "IA con capacidad de comprender, aprender y aplicar conocimiento igual que un ser humano.", "Un cortafuegos avanzado de seguridad.", "Un robot industrial físico."], correctIdx: 1 },
      { q: "En IA, ¿qué es un \"Token\"?", opts: ["Un dispositivo físico de seguridad.", "La unidad básica de texto (como sílabas o palabras) procesada por un modelo de lenguaje.", "Una criptomoneda del sistema.", "Un puerto de red."], correctIdx: 1 },
      { q: "¿Cuál es el beneficio de la IA de código abierto?", opts: ["Es completamente privada y no se puede modificar.", "Permite que la comunidad audite, modifique y construya sobre el código base libremente.", "Requiere servidores de pago obligatorios.", "No es compatible con la nube."], correctIdx: 1 },
      
      // Bloque 2: Automatización y Herramientas (11-20)
      { q: "¿Cuál es el principal beneficio de automatizar tareas repetitivas mediante IA?", opts: ["Reemplazar a todos los profesores del aula.", "Liberar tiempo valioso para el pensamiento crítico y la mentoría individualizada.", "Apagar los servidores por las noches.", "Eliminar los exámenes tradicionales."], correctIdx: 1 },
      { q: "¿Qué es un \"Agente de IA\"?", opts: ["Un representante comercial humano.", "Un sistema autónomo que percibe su entorno, toma decisiones y ejecuta acciones para lograr metas.", "Una base de datos relacional.", "Un cable de conexión de fibra óptica."], correctIdx: 1 },
      { q: "¿Qué herramienta de automatización permite conectar diferentes apps sin saber programar?", opts: ["VS Code", "Zapier o Make", "Docker", "PostgreSQL"], correctIdx: 1 },
      { q: "En automatización de contenidos, ¿qué es RAG (Retrieval-Augmented Generation)?", opts: ["Una técnica para comprimir imágenes pesadas.", "Recuperar información de documentos externos para mejorar la precisión y contexto de las respuestas de IA.", "Un método para encriptar claves.", "Un tipo de base de datos no relacional."], correctIdx: 1 },
      { q: "¿Qué beneficio tiene usar IA en la evaluación de exámenes?", opts: ["Aprobar a todos los estudiantes de forma automática.", "Reducir los tiempos de calificación y dar retroalimentación detallada e inmediata al estudiante.", "Hacer que el examen sea imposible de aprobar.", "Eliminar las clases prácticas."], correctIdx: 1 },
      { q: "¿Qué es una automatización basada en \"Trigger\" (Disparador)?", opts: ["Un botón para formatear el disco duro.", "Un evento inicial (ej: recibir un correo) que inicia la secuencia automatizada.", "Una consulta SQL.", "Un error crítico del compilador."], correctIdx: 1 },
      { q: "¿Qué es la automatización de procesos mediante robótica (RPA)?", opts: ["Construir brazos robóticos en una fábrica.", "Software que emula acciones humanas repetitivas interactuando con interfaces digitales.", "La actualización automática de Windows.", "Configuración de discos duros."], correctIdx: 1 },
      { q: "En el desarrollo de software con IA, ¿qué hace un copiloto de código?", opts: ["Escribe todo el software sin supervisión humana.", "Sugiere líneas de código, funciones y documentación en tiempo real mientras el programador escribe.", "Sube la app a la App Store de forma automática.", "Monitorea la velocidad del internet."], correctIdx: 1 },
      { q: "¿Cuál es el primer paso para automatizar un proceso académico o de oficina?", opts: ["Comprar el software más caro.", "Mapear y documentar el flujo de trabajo manual actual para identificar cuellos de botella.", "Despedir a los coordinadores del área.", "Eliminar todos los registros históricos."], correctIdx: 1 },
      { q: "En APIs de IA, ¿qué representa la tasa de consumo (\"Rate Limit\")?", opts: ["La velocidad de descarga de archivos.", "El límite máximo de solicitudes permitidas en un periodo de tiempo determinado.", "La cantidad de memoria RAM consumida.", "El precio mensual de la suscripción."], correctIdx: 1 },

      // Bloque 3: Ciberseguridad, Privacidad y Ética (21-30)
      { q: "¿Qué es el \"Phishing\"?", opts: ["Una técnica para buscar archivos duplicados.", "Correos o mensajes falsos que simulan ser de entidades legítimas para robar datos o contraseñas.", "Un protocolo de autenticación de red.", "El desarrollo de páginas web responsivas."], correctIdx: 1 },
      { q: "¿Qué es un ataque de inyección de prompts (\"Prompt Injection\")?", opts: ["Borrar el código fuente del servidor.", "Introducir instrucciones maliciosas en un modelo de IA para evadir sus filtros de seguridad y reglas.", "Modificar la contraseña de la base de datos.", "Un tipo de virus para teléfonos móviles."], correctIdx: 1 },
      { q: "¿Por qué es crítico proteger la API Key de un servicio de IA?", opts: ["Para evitar que la app cargue lento en móviles.", "Porque otorga acceso total de pago al servicio, y si es robada, pueden generar cargos masivos a tu cuenta.", "Para que los usuarios puedan ver el código.", "No es necesario protegerla."], correctIdx: 1 },
      { q: "¿Qué es el principio de Privacidad por Diseño (\"Privacy by Design\")?", opts: ["Crear diseños visuales llamativos.", "Integrar medidas de protección de datos desde la fase de planeación y diseño del software.", "Ocultar los términos y condiciones de la app.", "Hacer que la base de datos sea inaccesible."], correctIdx: 1 },
      { q: "¿Qué es la \"IA Explicable\" (XAI)?", opts: ["Un manual de usuario para usar ChatGPT.", "Métodos y técnicas que permiten a los humanos comprender y confiar en los resultados y decisiones de los modelos de IA.", "Traducir el código de IA a otros idiomas.", "Un compilador de código fuente."], correctIdx: 1 },
      { q: "¿Qué representa el \"Sesgo\" (Bias) en un modelo de IA?", opts: ["La velocidad con la que responde el servidor.", "Desviaciones sistemáticas en las respuestas de la IA causadas por datos de entrenamiento prejuiciosos o incompletos.", "La longitud máxima del texto generado.", "Un puerto de red seguro."], correctIdx: 1 },
      { q: "En autenticación, ¿qué representa el MFA?", opts: ["Escribir la contraseña dos veces.", "Un factor de autenticación basado en múltiples elementos de verificación independientes.", "Configuración de redes virtuales.", "Un tipo de disco duro."], correctIdx: 1 },
      { q: "¿Qué es un filtro de protección contra XSS (Cross-Site Scripting)?", opts: ["Un sistema para cambiar contraseñas.", "Mecanismo que sanitiza las entradas del usuario para evitar que inyecte código javascript malicioso en la web.", "Un acelerador de descargas.", "Un diseño CSS adaptable."], correctIdx: 1 },
      { q: "¿Qué establece la regulación GDPR sobre los datos personales en sistemas de IA?", opts: ["Que los datos de los usuarios pueden venderse libremente.", "Que los usuarios tienen derecho al olvido, a la transparencia y a saber cómo se procesan y protegen sus datos.", "Que todas las bases de datos deben ser públicas.", "Que la IA no debe guardar contraseñas."], correctIdx: 1 },
      { q: "¿Qué es una auditoría de seguridad en aplicaciones de IA?", opts: ["Contar la cantidad de líneas de código escritas.", "El proceso sistemático para evaluar vulnerabilidades, cumplimiento normativo y seguridad en el flujo de datos e infraestructura de IA.", "Medir las visitas diarias de la página web.", "Registrar usuarios de pruebas."], correctIdx: 1 }
    ];

    const inputStyle = {
      width: "100%",
      padding: "10px 12px",
      fontSize: "0.8rem",
      background: "#050814",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "6px",
      color: "white",
      outline: "none"
    };

    const handleStartTest = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim() || !phone.trim()) {
        alert("Por favor completa tu nombre, correo y celular/WhatsApp.");
        return;
      }
      setStep('test');
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
    };

    const handleNextQuestion = () => {
      if (selectedOption === null) {
        alert("Por favor selecciona una opción antes de continuar.");
        return;
      }

      // Guardar respuesta
      const newAnswers = { ...answers, [currentQuestionIdx]: selectedOption };
      setAnswers(newAnswers);
      setSelectedOption(null);

      // Revisar si desbloquea insignia (cada 10 preguntas)
      if (currentQuestionIdx === 9) {
        setActiveInsignia({ number: 1, title: "Especialista en Fundamentos de IA Académica", emoji: "🏅" });
        setStep('insignia');
      } else if (currentQuestionIdx === 19) {
        setActiveInsignia({ number: 2, title: "Innovador en Automatización Académica", emoji: "🚀" });
        setStep('insignia');
      } else if (currentQuestionIdx === 29) {
        setActiveInsignia({ number: 3, title: "Experto en Ciberseguridad y Ética", emoji: "🛡️" });
        setStep('insignia');
      } else {
        setCurrentQuestionIdx(prev => prev + 1);
      }
    };

    const handleInsigniaAction = async () => {
      if (currentQuestionIdx === 9) {
        setStep('test');
        setCurrentQuestionIdx(10);
      } else if (currentQuestionIdx === 19) {
        setStep('test');
        setCurrentQuestionIdx(20);
      } else if (currentQuestionIdx === 29) {
        // En la última insignia, calcular resultados y enviar
        setIsSubmitting(true);
        try {
          let correct = 0;
          let incorrect = 0;
          questions.forEach((q, idx) => {
            if (answers[idx] === q.correctIdx) {
              correct++;
            } else {
              incorrect++;
            }
          });
          setCorrectCount(correct);
          setIncorrectCount(incorrect);

          // 1. Guardar lead y respuestas en Supabase (integrado con el sistema de formularios dinámicos)
          const formAnswers: Record<string, any> = {
            nombre: name.trim(),
            email: email.trim().toLowerCase(),
            celular: phone.trim(),
            seminario: seminar.title,
            correctas: String(correct),
            incorrectas: String(incorrect)
          };

          // Mapear cada opción de respuesta seleccionada
          questions.forEach((q, idx) => {
            const selectedIdx = answers[idx];
            formAnswers[`q_${idx}`] = q.opts[selectedIdx] || '';
          });

          const { error } = await supabase.from('custom_form_responses').insert({
            form_id: 'a7b3c2d1-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
            answers: formAnswers
          });

          if (error) {
            console.error("Error al registrar lead en custom_form_responses:", error.message);
          }

          // Register student email in purchases table for instant classroom access
          await registerPurchaseInSupabase(email.trim().toLowerCase(), seminar.id, 0, 'diagnostic_registration', `diag_${Date.now()}`);

          // 2. Pre-llenar email del comprador para el checkout
          setBuyerEmails(prev => ({ ...prev, [seminar.id]: email.trim().toLowerCase() }));

          // 3. Enviar correo de notificación de insignias mediante Apps Script (Gmail)
          try {
            await fetch('/api/gmail', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'send_badge_email',
                email: email.trim().toLowerCase(),
                name: name.trim(),
                seminar_title: seminar.title,
                correct: correct,
                incorrect: incorrect
              })
            });
          } catch (mailErr) {
            console.warn("No se pudo notificar por correo:", mailErr);
          }

          setStep('checkout');
        } catch (err) {
          console.error("Error al finalizar diagnóstico:", err);
          setStep('checkout');
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    if (step === 'register') {
      return (
        <div 
          style={{
            background: "linear-gradient(135deg, rgba(13, 21, 48, 0.95), rgba(10, 15, 30, 0.98))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            padding: "2rem",
            borderRadius: "12px",
            border: `1px solid ${seminar.accentColor}33`,
            maxWidth: "500px",
            margin: "0 auto",
            textAlign: "left"
          }}
          className="animate-fade-in"
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2.5rem" }}>📝</span>
            <h4 style={{ color: "#ffffff", fontWeight: "800", fontSize: "1.25rem", marginTop: "0.5rem", marginBottom: "0.2rem" }}>
              Registro & Diagnóstico Académico
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: 1.4 }}>
              Presenta la evaluación diagnóstica oficial de <strong>30 preguntas</strong>. Desbloquea 3 insignias de avance (cada 10 preguntas) y habilita tu certificación.
            </p>
          </div>

          <form onSubmit={handleStartTest} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.7rem", fontWeight: "bold", marginBottom: "4px" }}>Nombre Completo:</label>
              <input
                type="text"
                required
                placeholder="Juan Pérez"
                style={inputStyle}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.7rem", fontWeight: "bold", marginBottom: "4px" }}>Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  placeholder="juan@correo.com"
                  style={inputStyle}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.7rem", fontWeight: "bold", marginBottom: "4px" }}>Celular / WhatsApp:</label>
                <input
                  type="tel"
                  required
                  placeholder="+57 300 123 4567"
                  style={inputStyle}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(90deg, #b69255, #d4af37)",
                color: "#0a0f1d",
                fontWeight: "bold",
                fontSize: "0.8rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                marginTop: "10px"
              }}
            >
              Comenzar Evaluación Diagnóstica (30 Preguntas) ➔
            </button>
          </form>
        </div>
      );
    }

    if (step === 'test') {
      const q = questions[currentQuestionIdx];
      const progress = Math.round(((currentQuestionIdx) / 30) * 100);
      const isLast = currentQuestionIdx === 29;

      return (
        <div 
          style={{
            background: "linear-gradient(135deg, rgba(13, 21, 48, 0.95), rgba(10, 15, 30, 0.98))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            padding: "2rem",
            borderRadius: "12px",
            border: `1px solid ${seminar.accentColor}33`,
            maxWidth: "500px",
            margin: "0 auto",
            textAlign: "left"
          }}
          className="animate-fade-in"
        >
          {/* Progress Header */}
          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", color: "#94a3b8", fontWeight: "700", marginBottom: "6px" }}>
              <span>PROGRESO EVALUACIÓN</span>
              <span>{currentQuestionIdx + 1} / 30 Preguntas</span>
            </div>
            <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #b69255, #3b82f6)", transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
              Bloque {currentQuestionIdx < 10 ? "1: Fundamentos de IA" : currentQuestionIdx < 20 ? "2: Automatización" : "3: Seguridad y Ética"}
            </p>
            <h5 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: "700", lineHeight: 1.4, margin: 0 }}>
              {currentQuestionIdx + 1}. {q.q}
            </h5>
          </div>

          {/* Options List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
            {q.opts.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    background: isSelected ? "rgba(182, 146, 85, 0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? "#b69255" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    color: isSelected ? "#ffffff" : "#cbd5e1",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  className="hover:border-slate-700"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: `2px solid ${isSelected ? "#b69255" : "#475569"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                      color: isSelected ? "#b69255" : "#475569",
                      background: isSelected ? "rgba(182, 146, 85, 0.2)" : "transparent"
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNextQuestion}
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(90deg, #b69255, #d4af37)",
              color: "#0a0f1d",
              fontWeight: "bold",
              fontSize: "0.8rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              textAlign: "center"
            }}
          >
            {isLast ? "Finalizar Diagnóstico ➔" : "Siguiente Pregunta ➔"}
          </button>
        </div>
      );
    }

    if (step === 'insignia' && activeInsignia) {
      return (
        <div 
          style={{
            background: "linear-gradient(135deg, rgba(13, 21, 48, 0.98), rgba(10, 15, 30, 0.99))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2.5rem 2rem",
            borderRadius: "16px",
            border: "2px solid #b69255",
            maxWidth: "450px",
            margin: "0 auto",
            textAlign: "center",
            boxShadow: "0 0 30px rgba(182, 146, 85, 0.25)"
          }}
          className="animate-fade-in"
        >
          {/* Badge Visual Effect */}
          <div style={{
            position: "relative",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(182, 146, 85, 0.2) 0%, rgba(0,0,0,0) 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem"
          }}>
            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "2px dashed #b69255",
              animation: "spin 20s linear infinite"
            }} />
            <span style={{ fontSize: "3.5rem" }}>{activeInsignia.emoji}</span>
          </div>

          <p style={{ color: "#b69255", fontSize: "0.68rem", fontWeight: "900", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
            ¡Logro Alcanzado!
          </p>
          <h4 style={{ color: "#ffffff", fontWeight: "900", fontSize: "1.25rem", marginBottom: "0.8rem", lineHeight: 1.3 }}>
            Insignia #{activeInsignia.number} Desbloqueada
          </h4>
          <p style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: "600", background: "rgba(255,255,255,0.03)", padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.2rem" }}>
            {activeInsignia.title}
          </p>
          <p style={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.4, maxWidth: "340px", marginBottom: "1.8rem" }}>
            Has completado las preguntas de esta sección correctamente. Esta insignia digital quedará vinculada a tu perfil al finalizar el seminario.
          </p>

          <button
            type="button"
            onClick={handleInsigniaAction}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "linear-gradient(90deg, #b69255, #d4af37)",
              color: "#0a0f1d",
              fontWeight: "bold",
              fontSize: "0.8rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            {isSubmitting ? "Procesando..." : activeInsignia.number === 3 ? "Finalizar y Ver Resultados ➔" : "Continuar al siguiente bloque ➔"}
          </button>
        </div>
      );
    }

    // step === 'checkout'
    return (
      <div 
        style={{
          background: "linear-gradient(135deg, rgba(13, 21, 48, 0.95), rgba(10, 15, 30, 0.98))",
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          borderRadius: "12px",
          border: `1px solid ${seminar.accentColor}22`
        }} 
        className="animate-fade-in"
      >
        <span style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>🎓</span>
        <h4 style={{ color: "#ffffff", fontWeight: "800", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          ¡Diagnóstico Completado!
        </h4>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.78rem", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "4px 10px", borderRadius: "100px", fontWeight: "700" }}>
            Correctas: {correctCount}
          </span>
          <span style={{ fontSize: "0.78rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "4px 10px", borderRadius: "100px", fontWeight: "700" }}>
            Incorrectas: {incorrectCount}
          </span>
        </div>
        
        <p style={{ color: "#94a3b8", fontSize: "0.8rem", maxWidth: "420px", marginBottom: "1.2rem", lineHeight: 1.5 }}>
          🏅 🚀 🛡️ <strong>Tus 3 insignias digitales han sido reservadas.</strong> Te hemos enviado un correo indicando que en los próximos días se te enviarán formalmente a tu buzón.<br /><br />
          Para desbloquear el acceso completo e ilimitado de por vida a la grabación del seminario virtual de 4 horas y emitir tu Certificado de Asistencia avalado por Jowhalth Academy, realiza tu pago único de <strong>$120.000 COP</strong> (o $30 USD):
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "340px", alignItems: "center" }}>
          
          {/* Email input for purchase */}
          <div style={{ width: "100%", marginBottom: "5px", textAlign: "left" }}>
            <label style={{ display: "block", color: "#64748b", fontSize: "0.68rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>
              Correo electrónico registrado:
            </label>
            <input
              type="email"
              disabled
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "0.8rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "6px",
                color: "#94a3b8",
                outline: "none"
              }}
              value={buyerEmails[seminar.id] || ""}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <button 
              onClick={() => {
                const customLink = 
                  seminar.id.includes('claude') ? paymentConfig?.wompiLinkClaudeCowork :
                  seminar.id.includes('menu') ? paymentConfig?.wompiLinkMenusIa :
                  (seminar.id.includes('gemini') || seminar.id.includes('notebook')) ? paymentConfig?.wompiLinkGemini :
                  (seminar.id.includes('una') || seminar.id.includes('bioseguridad')) ? paymentConfig?.wompiLinkUnas :
                  null;

                if (customLink && customLink.startsWith('http')) {
                  window.open(customLink, '_blank');
                  return;
                }

                const email = buyerEmails[seminar.id];
                const isTest = (paymentConfig?.paymentMode || 'test') === 'test';
                const key = isTest 
                  ? (paymentConfig?.wompiPublicKeyTest || 'pub_test_Q5y4q64D928v68S391A80860A3n21234')
                  : (paymentConfig?.wompiPublicKeyLive || '');
                loadWompiWidget(15000000, `seminar-${seminar.id}-${Date.now()}`, key, seminar.id);
              }}
              style={{
                flex: 1,
                padding: "10px 16px",
                fontSize: "0.8rem",
                fontWeight: "700",
                background: seminar.accentColor,
                border: "none",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              🇨🇴 COP (Wompi)
            </button>

            <button 
              onClick={() => {
                const email = buyerEmails[seminar.id];
                const isTest = (paymentConfig?.paymentMode || 'test') === 'test';
                const clientId = isTest 
                  ? (paymentConfig?.paypalClientIdTest || 'test_client_id_sandbox')
                  : (paymentConfig?.paypalClientIdLive || '');
                loadPayPalScript(clientId);
              }}
              style={{
                flex: 1,
                padding: "10px 16px",
                fontSize: "0.8rem",
                fontWeight: "700",
                background: "#f59e0b",
                border: "1px solid #d97706",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              🌎 USD (PayPal)
            </button>
          </div>
          <div id={`paypal-button-container-${seminar.id}`} style={{ width: "100%", marginTop: "10px" }} />

          {/* Restore / Verify purchase block */}
          <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", marginTop: "8px", textAlign: "center" }}>
            {!showRestoreForm[seminar.id] ? (
              <button
                type="button"
                onClick={() => setShowRestoreForm(prev => ({ ...prev, [seminar.id]: true }))}
                style={{ background: "transparent", border: "none", color: "#06b6d4", fontSize: "0.75rem", textDecoration: "underline", cursor: "pointer" }}
              >
                ¿Ya compraste este seminario? Restaurar acceso
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                <p style={{ color: "#64748b", fontSize: "0.7rem", margin: 0 }}>Ingresa el correo con el que realizaste la compra:</p>
                <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: "0.75rem",
                      background: "#050814",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      color: "white",
                      outline: "none"
                    }}
                    value={restoreEmails[seminar.id] || ""}
                    onChange={(e) => setRestoreEmails(prev => ({ ...prev, [seminar.id]: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyPurchase(seminar.id)}
                    disabled={isVerifyingRestore[seminar.id]}
                    style={{
                      padding: "8px 14px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    {isVerifyingRestore[seminar.id] ? "..." : "Verificar"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRestoreForm(prev => ({ ...prev, [seminar.id]: false }))}
                  style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "0.7rem", textDecoration: "underline", cursor: "pointer", marginTop: "4px" }}
                >
                  Volver
                </button>
              </div>
            )}
          </div>

          <button 
            type="button"
            onClick={() => unlockSeminar(seminar.id)}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#475569", 
              fontSize: "0.68rem", 
              cursor: "pointer", 
              marginTop: "12px", 
              textDecoration: "underline" 
            }}
          >
            [Desb. Temp] Desbloquear Seminario Gratis
          </button>
        </div>
      </div>
    );
  };

  const toggleExpand = (id: string) => {
    if (expandedSeminar === id) {
      setExpandedSeminar(null);
    } else {
      setExpandedSeminar(id);
    }
  };

  // Structured Data Schema JSON-LD
  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://waltherparrado.com/#website",
        "name": "Dr. Walther Parrado",
        "url": "https://waltherparrado.com",
        "creator": {
          "@type": "Organization",
          "name": "J&M Tech Solutions",
          "url": "https://www.jymtechsolutions.online/es",
          "description": "Agencia de automatización con IA y desarrollo de software"
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://waltherparrado.com/seminars/#itemlist",
        "name": "Catálogo de Seminarios Virtuales de 4 Horas",
        "description": "Seminarios especializados con temarios interactivos enfocados en tecnología, productividad e higiene profesional.",
        "numberOfItems": 4,
        "itemListElement": seminars.map((sem, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Course",
            "@id": `https://waltherparrado.com/seminars/#${sem.id}`,
            "name": sem.title,
            "description": sem.description,
            "provider": {
              "@type": "EducationOrganization",
              "name": "Jowhalth Academy",
              "sameAs": "https://waltherparrado.com"
            },
            "timeRequired": "PT4H",
            "educationalCredentialAwarded": "Certificado de Participación de Jowhalth Academy",
            "offers": {
              "@type": "Offer",
              "category": "EducationEvent",
              "priceCurrency": "COP",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Jowhalth Academy"
              }
            }
          }
        }))
      }
    ]
  };

  return (
    <section
      id="seminarios-virtuales"
      style={{
        padding: "6rem 1.5rem",
        background: "linear-gradient(180deg, #0a0f1e 0%, #0c1228 100%)",
        position: "relative",
        minHeight: "100vh"
      }}
    >
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Background visual accents */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(219, 39, 119, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* --- DETAILED VIEW OR CATALOG GRID --- */}
      {expandedSeminar ? (() => {
        const activeSeminar = seminars.find(s => s.id === expandedSeminar);
        if (!activeSeminar) return null;
        const isPurchased = purchasedSeminars[activeSeminar.id];

        return (
          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
            {/* Back button */}
            <div style={{ marginBottom: "2rem" }}>
              <button 
                onClick={() => setExpandedSeminar(null)}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#cbd5e1",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s"
                }}
                className="hover:bg-slate-900 hover:text-white"
              >
                ← Volver al catálogo de seminarios
              </button>
            </div>

            {/* Seminar Detailed Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              
              {/* LEFT COLUMN: Hero details and Blocks vertical timeline */}
              <div className="flex flex-col">
                
                {/* Platzi Style Seminar Hero Header */}
                <div style={{ marginBottom: "2.5rem" }}>
                  <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: "100px", backgroundColor: `${activeSeminar.accentColor}18`, color: activeSeminar.accentColor, fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                    {activeSeminar.badge || "Seminario Profesional"}
                  </div>
                  
                  <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: "900", color: "white", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.8rem" }}>
                    {activeSeminar.title}
                  </h1>

                  {/* Rating & Reviews */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "1.2rem" }}>
                    <div style={{ display: "flex", color: "#f59e0b", fontSize: "0.85rem" }}>⭐⭐⭐⭐⭐</div>
                    <span style={{ color: "#f8fafc", fontSize: "0.85rem", fontWeight: "700" }}>4.9</span>
                    <span style={{ color: "#475569" }}>•</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>120 calificaciones de alumnos</span>
                  </div>

                  {/* Metadata Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "#cbd5e1", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: "6px" }}>
                      📊 Nivel Intermedio/Avanzado
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#cbd5e1", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: "6px" }}>
                      ⚡ {activeSeminar.blocks?.length || 0} bloques temáticos
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#cbd5e1", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: "6px" }}>
                      ⏱️ {activeSeminar.duration || "4 Horas"}
                    </span>
                  </div>

                  <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "700px" }}>
                    {activeSeminar.description}
                  </p>
                </div>

                {/* Blocks Timeline (Platzi Vertical Style) */}
                <div style={{ background: "rgba(13, 21, 48, 0.25)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "2rem", backdropFilter: "blur(8px)", marginBottom: "2rem" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "white", marginBottom: "2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Temario del Seminario
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", position: "relative", paddingLeft: "32px" }}>
                    {/* Vertical Timeline line */}
                    <div style={{ position: "absolute", left: "10px", top: "8px", bottom: "8px", width: "2px", background: `linear-gradient(180deg, ${activeSeminar.accentColor}, rgba(255,255,255,0.05))` }}></div>

                    {activeSeminar.blocks?.map((block: any, idx: number) => {
                      return (
                        <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "24px", position: "relative" }}>
                          
                          {/* Circle Bullet with block number */}
                          <div 
                            style={{
                              position: "absolute",
                              left: "-32px",
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: activeSeminar.accentColor,
                              border: `2px solid ${activeSeminar.accentColor}`,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                              zIndex: 2
                            }}
                          >
                            {idx + 1}
                          </div>

                          {/* Block Details Card */}
                          <div
                            style={{
                              flex: 1,
                              background: "rgba(255, 255, 255, 0.01)",
                              border: "1px solid rgba(255, 255, 255, 0.04)",
                              borderRadius: "12px",
                              padding: "1.2rem",
                              transition: "all 0.2s"
                            }}
                            className="hover:bg-slate-900/40"
                          >
                            <h3 style={{ color: "white", fontSize: "0.95rem", fontWeight: "700", marginBottom: "4px" }}>
                              {block.num || `Bloque ${idx + 1}`}: {block.title}
                            </h3>
                            <p style={{ color: "#cbd5e1", fontSize: "0.85rem", marginTop: "2px", lineHeight: 1.4 }}>
                              {block.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actividad Práctica Box */}
                <div style={{ background: "rgba(13, 21, 48, 0.25)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "2rem", backdropFilter: "blur(8px)" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "white", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Actividad Práctica de Certificación
                  </h2>
                  
                  {isPurchased ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {activeSeminar.activities || "No hay actividades de certificación configuradas para este seminario."}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '1.2rem', background: "rgba(59, 130, 246, 0.04)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: '12px', textAlign: 'center', alignItems: 'center' }}>
                        <p style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '700' }}>
                          📧 ¿Completaste la actividad?
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.5, maxWidth: "550px", margin: "0 auto" }}>
                          Envía tus documentos y evidencias a <strong style={{ color: '#ffffff' }}>Virtualidad@fundetec.edu.co</strong> para la revisión de tus tutores y expedición de tu certificado.
                        </p>
                        <a
                          href={`mailto:Virtualidad@fundetec.edu.co?subject=${encodeURIComponent(`Entrega de Actividad - Seminario: ${activeSeminar.title}`)}&body=${encodeURIComponent(`Hola Dr. Walther Parrado y equipo de Virtualidad,\n\nAdjunto las actividades correspondientes al seminario "${activeSeminar.title}" para su revisión y respectiva certificación.\n\nDatos del estudiante:\n- Nombre Completo:\n- Cédula / ID:\n- Teléfono:\n- Ciudad / Departamento:\n\n[Adjuntar archivo/s aquí]\n\nSaludos cordiales.`)}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            marginTop: "0.8rem",
                            padding: "10px 24px",
                            background: activeSeminar.accentColor,
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "700",
                            fontSize: "0.8rem",
                            transition: "opacity 0.2s"
                          }}
                          className="hover:opacity-90"
                        >
                          ✉️ Enviar Actividad por Correo
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", textAlign: "center" }}>
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                        🔒 Adquiere el seminario para desbloquear las actividades y obtener tu certificación académica.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Sticky Widget (Player or Paywall) */}
              <div 
                style={{ 
                  position: "sticky", 
                  top: "100px", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "1.5rem" 
                }}
              >
                
                {/* Player / Paywall Container */}
                <div 
                  style={{ 
                    background: "rgba(13, 21, 48, 0.45)", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    borderRadius: "16px", 
                    overflow: "hidden", 
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)" 
                  }}
                >
                  {isPurchased ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* Header text */}
                      <div style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <p style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>
                          🎥 Grabación Completa del Seminario (4 Horas)
                        </p>
                      </div>
                      
                      {/* Video Frame */}
                      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000" }}>
                        {(() => {
                          const getEmbedUrl = (url: string | null | undefined) => {
                            if (!url) return null;
                            const raw = url.trim();
                            if (raw.includes('5f80fbc1401a35565576dfa1c7c1bb48')) return null;

                            // Robust YouTube Extraction
                            const vMatch = raw.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
                            if (vMatch && vMatch[1]) {
                              return `https://www.youtube-nocookie.com/embed/${vMatch[1]}?autoplay=0&rel=0`;
                            }
                            const pathMatch = raw.match(/(?:embed\/|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                            if (pathMatch && pathMatch[1]) {
                              return `https://www.youtube-nocookie.com/embed/${pathMatch[1]}?autoplay=0&rel=0`;
                            }

                            if (raw.includes('youtube.com') || raw.includes('youtu.be')) {
                              return null;
                            }

                            const vimeoMatch = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/);
                            if (vimeoMatch && vimeoMatch[1]) {
                              return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                            }

                            return raw;
                          };

                          const embedUrl = getEmbedUrl(activeSeminar.videoUrl);

                          if (embedUrl && (embedUrl.includes('youtube') || embedUrl.includes('vimeo') || embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.startsWith('http'))) {
                            if (embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.endsWith('.ogg')) {
                              return (
                                <video
                                  src={embedUrl}
                                  controls
                                  controlsList="nodownload"
                                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                                />
                              );
                            }
                            return (
                              <iframe
                                src={embedUrl}
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            );
                          }

                          return (
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0d1530 0%, #1e1b4b 100%)", padding: "2rem", textAlign: "center" }}>
                              <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem" }}>{activeSeminar.emoji || "🎓"}</div>
                              <h4 style={{ color: "#f8fafc", fontWeight: "700", fontSize: "1rem", marginBottom: "0.4rem" }}>{activeSeminar.title}</h4>
                              <span style={{ display: "inline-block", padding: "4px 12px", background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "700", marginTop: "4px" }}>
                                📹 Sesión Intensiva en Vivo (4 Horas)
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Slides Download link */}
                      <div style={{ padding: "1.2rem", background: "rgba(255,255,255,0.01)" }}>
                        <a
                          href={activeSeminar.presentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            width: "100%",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            background: "rgba(59, 130, 246, 0.1)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            color: "#60a5fa",
                            fontWeight: "700",
                            fontSize: "0.8rem",
                            textDecoration: "none",
                            transition: "all 0.2s"
                          }}
                          className="hover:bg-blue-600/20 hover:border-blue-500"
                        >
                          📂 Descargar Diapositivas
                        </a>
                      </div>
                    </div>
                  ) : showPaywallSeminars[activeSeminar.id] ? (
                    <SeminarPaywall seminar={activeSeminar} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* Preview Indicator */}
                      <div style={{ padding: "0.8rem 1.2rem", background: "rgba(245, 158, 11, 0.1)", borderBottom: "1px solid rgba(245, 158, 11, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>
                          👀 Vista previa en reproducción
                        </p>
                        <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '100px' }}>
                          ⏱️ {previewSecondsLeft[activeSeminar.id] !== undefined ? previewSecondsLeft[activeSeminar.id] : 15}s restantes
                        </span>
                      </div>
                      
                      {/* Preview Video Frame */}
                      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000" }}>
                        {(() => {
                          const getEmbedUrl = (url: string | null | undefined) => {
                            if (!url) return null;
                            const raw = url.trim();
                            if (raw.includes('5f80fbc1401a35565576dfa1c7c1bb48')) return null;

                            const vMatch = raw.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
                            if (vMatch && vMatch[1]) {
                              return `https://www.youtube-nocookie.com/embed/${vMatch[1]}?autoplay=1&rel=0`;
                            }
                            const pathMatch = raw.match(/(?:embed\/|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                            if (pathMatch && pathMatch[1]) {
                              return `https://www.youtube-nocookie.com/embed/${pathMatch[1]}?autoplay=1&rel=0`;
                            }

                            if (raw.includes('youtube.com') || raw.includes('youtu.be')) {
                              return null;
                            }

                            const vimeoMatch = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/);
                            if (vimeoMatch && vimeoMatch[1]) {
                              return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                            }

                            return raw;
                          };

                          const embedUrl = getEmbedUrl(activeSeminar.videoUrl);

                          if (embedUrl && (embedUrl.includes('youtube') || embedUrl.includes('vimeo') || embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.startsWith('http'))) {
                            if (embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.endsWith('.ogg')) {
                              return (
                                <video
                                  src={embedUrl}
                                  controls
                                  controlsList="nodownload"
                                  autoPlay
                                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                                />
                              );
                            }
                            return (
                              <iframe
                                src={embedUrl}
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            );
                          }

                          return (
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0d1530 0%, #1e1b4b 100%)", padding: "2rem", textAlign: "center" }}>
                              <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem" }}>{activeSeminar.emoji || "🎓"}</div>
                              <h4 style={{ color: "#f8fafc", fontWeight: "700", fontSize: "1rem", marginBottom: "0.4rem" }}>{activeSeminar.title}</h4>
                              <span style={{ display: "inline-block", padding: "4px 12px", background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "700", marginTop: "4px" }}>
                                📹 Sesión Intensiva en Vivo (4 Horas)
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Locked Diapositivas preview info */}
                      <div style={{ padding: "1.2rem", background: "rgba(255,255,255,0.01)" }}>
                        <button
                          onClick={() => {
                            alert("Para descargar las diapositivas y el material de apoyo completo, por favor adquiere el seminario o restaura tu acceso.");
                            setShowPaywallSeminars(prev => ({ ...prev, [activeSeminar.id]: true }));
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            width: "100%",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            background: "rgba(71, 85, 105, 0.1)",
                            border: "1px solid rgba(71, 85, 105, 0.3)",
                            color: "#94a3b8",
                            fontWeight: "700",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          className="hover:bg-slate-800"
                        >
                          🔒 Diapositivas Protegidas
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Help Card */}
                <div 
                  style={{ 
                    background: "rgba(13, 21, 48, 0.25)", 
                    border: "1px solid rgba(255,255,255,0.03)", 
                    borderRadius: "16px", 
                    padding: "1.5rem",
                    backdropFilter: "blur(8px)" 
                  }}
                >
                  <h4 style={{ color: "white", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                    ¿Necesitas ayuda con el pago?
                  </h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                    Si presentas algún inconveniente con Wompi o PayPal, o prefieres pagar por transferencia directa bancaria (Bancolombia, Nequi, Daviplata), escríbenos directamente.
                  </p>
                  <a
                    href={`https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20necesito%20ayuda%20para%20adquirir%20el%20seminario%20%22${encodeURIComponent(activeSeminar.title)}%22.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "#00b463",
                      color: "white",
                      fontSize: "0.78rem",
                      fontWeight: "bold",
                      textDecoration: "none"
                    }}
                    className="hover:opacity-90"
                  >
                    💬 Contactar por WhatsApp
                  </a>
                </div>

              </div>

            </div>

          </div>
        );
      })() : (
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }} className="animate-fade-in">
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                background: "rgba(37, 99, 235, 0.12)",
                border: "1px solid rgba(37, 99, 235, 0.25)",
                borderRadius: "100px",
                color: "#60a5fa",
                fontSize: "0.78rem",
                fontWeight: "700",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "1rem"
              }}
            >
              Capacitación & Formación Profesional
            </span>
            <h1
              style={{
                fontSize: "2.6rem",
                fontWeight: "900",
                color: "white",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "1.2rem"
              }}
            >
              Seminarios, Cursos y <span style={{ color: "#3b82f6" }}>Rutas de Aprendizaje</span>
            </h1>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1.1rem",
                maxWidth: "750px",
                margin: "0 auto 2rem",
                lineHeight: 1.6
              }}
            >
              Formación ejecutiva y técnica en sesiones intensivas y programas guiados. Explora los temarios, visualiza el contenido interactivo y certifícate con Jowhalth Academy.
            </p>

            {/* Filter Category Pills */}
            <div style={{ display: "inline-flex", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "6px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => setFilterCategory('all')}
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  background: filterCategory === 'all' ? "#3b82f6" : "transparent",
                  color: filterCategory === 'all' ? "white" : "#94a3b8",
                  transition: "all 0.2s"
                }}
              >
                Todos ({seminars.length})
              </button>
              <button
                onClick={() => setFilterCategory('seminar')}
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  background: filterCategory === 'seminar' ? "#3b82f6" : "transparent",
                  color: filterCategory === 'seminar' ? "white" : "#94a3b8",
                  transition: "all 0.2s"
                }}
              >
                ⏱️ Seminarios ({seminars.filter(s => s.category === 'Seminario' || s.duration?.includes('4 Horas')).length})
              </button>
              <button
                onClick={() => setFilterCategory('course')}
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  background: filterCategory === 'course' ? "#3b82f6" : "transparent",
                  color: filterCategory === 'course' ? "white" : "#94a3b8",
                  transition: "all 0.2s"
                }}
              >
                🎓 Cursos y Rutas ({seminars.filter(s => s.category === 'Curso' || s.duration?.includes('Módulo') || s.duration?.includes('Lecciones')).length})
              </button>
            </div>
          </div>

          {/* Seminars Grid: 100% Mobile Responsive Cards */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 330px), 1fr))", 
              gap: "1.25rem",
              marginBottom: "4rem"
            }}
          >
            {seminars
              .filter(s => {
                if (filterCategory === 'seminar') return s.category === 'Seminario' || s.duration?.includes('4 Horas');
                if (filterCategory === 'course') return s.category === 'Curso' || s.duration?.includes('Módulo') || s.duration?.includes('Lecciones');
                return true;
              })
              .map((seminar) => {
                const isPurchased = purchasedSeminars[seminar.id];
              
              return (
                <div
                  key={seminar.id}
                  onClick={() => setExpandedSeminar(seminar.id)}
                  style={{
                    display: "flex",
                    background: "rgba(13, 21, 48, 0.4)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  className="flex-col sm:flex-row hover:scale-[1.01] hover:border-blue-500/40 hover:bg-slate-900/50 group w-full"
                >
                  {/* Left/Top 3D Image Cover */}
                  <div 
                    style={{ 
                      position: "relative",
                      background: `linear-gradient(135deg, ${seminar.accentColor}dd, #060b13)`, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      flexShrink: 0,
                      overflow: "hidden"
                    }}
                    className="w-full h-44 sm:w-40 sm:h-auto"
                  >
                    {getSeminarCover(seminar) ? (
                      <img 
                        src={getSeminarCover(seminar)!} 
                        alt={seminar.title} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span style={{ fontSize: "2.6rem" }} className="group-hover:scale-110 transition-transform duration-300">
                        {seminar.emoji}
                      </span>
                    )}
                    
                    {/* Hover Play Button Overlay */}
                    <div 
                      style={{ 
                        position: "absolute", 
                        inset: 0, 
                        background: "rgba(0,0,0,0.4)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s" 
                      }}
                      className="group-hover:opacity-100"
                    >
                      <span style={{ color: "white", fontSize: "1.4rem" }}>▶</span>
                    </div>
                  </div>

                  {/* Right/Bottom Details */}
                  <div style={{ flex: 1, padding: "1.2rem", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", marginBottom: "6px" }}>
                        <span 
                          style={{ 
                            fontSize: "0.62rem", 
                            fontWeight: "800", 
                            padding: "3px 9px", 
                            borderRadius: "100px", 
                            backgroundColor: `${seminar.accentColor}18`,
                            color: seminar.accentColor,
                            textTransform: "uppercase"
                          }}
                        >
                          {seminar.badge}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#64748b" }}>• {seminar.duration}</span>
                        {isPurchased && (
                          <span style={{ fontSize: "0.62rem", fontWeight: "800", padding: "3px 9px", borderRadius: "100px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399" }}>
                            ✓ ADQUIRIDO
                          </span>
                        )}
                      </div>

                      <h3 
                        style={{ 
                          fontSize: "1.05rem", 
                          fontWeight: "900", 
                          color: "white", 
                          lineHeight: "1.3",
                          margin: "6px 0 8px 0",
                          wordBreak: "break-word"
                        }}
                        className="group-hover:text-blue-400 transition-colors"
                      >
                        {seminar.title}
                      </h3>

                      <p style={{ color: "#94a3b8", fontSize: "0.82rem", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5, margin: "0 0 0.8rem 0" }}>
                        {seminar.description}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {seminar.keywords.map((kw: string, i: number) => (
                          <span key={i} style={{ fontSize: "0.62rem", color: "#475569", background: "rgba(255,255,255,0.03)", padding: "2px 6px", borderRadius: "4px" }}>
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <p style={{ color: "#64748b", fontSize: "0.72rem", margin: 0 }}>
                        Prof. Dr. Walther Parrado
                      </p>
                      <span style={{ color: "#3b82f6", fontSize: "0.8rem", fontWeight: "bold" }} className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Ver Programa e Inscribirse →
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* E-E-A-T trust section */}
          <div 
            style={{ 
              background: "rgba(13, 21, 48, 0.2)", 
              border: "1px solid rgba(37, 99, 235, 0.1)", 
              borderRadius: "16px", 
              padding: "2.5rem", 
              textAlign: "center" 
            }}
          >
            <h3 style={{ color: "white", fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              Respaldado por la Trayectoria Académica de Jowhalth Academy
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: "800px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
              El Dr. Walther Parrado cuenta con más de 10 años de experiencia dirigiendo proyectos educativos y asesorando instituciones de educación en Colombia. Todos los seminarios otorgan certificado de asistencia y son diseñados con rigor pedagógico adaptado a las necesidades de la industria actual.
            </p>
            <div style={{ display: "inline-flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: "600" }}>🛡️ Certificado Oficial Jowhalth</span>
              <span style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: "600" }}>📚 Pedagogía Activa</span>
              <span style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: "600" }}>🚀 Aplicación Práctica con IA</span>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
