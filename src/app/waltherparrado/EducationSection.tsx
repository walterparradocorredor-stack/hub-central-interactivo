"use client";

import { useState, useEffect } from "react";

const defaultEducationResources = [
  {
    id: "liderazgo-educativo",
    title: "Gerencia y Liderazgo Educativo",
    type: "Ruta de Aprendizaje",
    description: "Desarrolla las habilidades necesarias para liderar con propósito en instituciones y proyectos educativos modernos.",
    modules: 4,
    level: "Intermedio",
    icon: "🎯",
    videoPreview: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    syllabus: [
      { title: "Módulo 1: Fundamentos de la gestión educativa moderna", time: "15:20", locked: false },
      { title: "Módulo 2: Diseño de Modelos Pedagógicos Innovadores", time: "22:10", locked: true },
      { title: "Módulo 3: Ética en la administración escolar", time: "18:45", locked: true }
    ]
  },
  {
    id: "acreditacion-institucional",
    title: "Evaluación y Acreditación de Calidad",
    type: "Cápsula",
    description: "Aprende los estándares de calidad y metodologías para liderar procesos de acreditación y autoevaluación ante el MEN.",
    duration: "45 min",
    level: "Básico",
    icon: "📊",
    videoPreview: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    syllabus: [
      { title: "Lección 1: Indicadores de Calidad del MEN", time: "10:00", locked: false },
      { title: "Lección 2: Autoevaluación y planes de mejoramiento", time: "20:30", locked: true }
    ]
  },
  {
    id: "comunicacion-academica",
    title: "Comunicación Estratégica para Docentes",
    type: "Ruta de Aprendizaje",
    description: "Técnicas de oratoria, debate pedagógico y construcción de mensaje para directivos y líderes educativos.",
    modules: 6,
    level: "Avanzado",
    icon: "🎙️",
    videoPreview: "https://customer-54owv81v3950naxm.cloudflarestream.com/5f80fbc1401a35565576dfa1c7c1bb48/iframe",
    syllabus: [
      { title: "Módulo 1: Controlando el pánico escénico en el aula", time: "12:15", locked: false },
      { title: "Módulo 2: Estructura de discursos pedagógicos persuasivos", time: "25:00", locked: true },
      { title: "Módulo 3: Manejo de comunicación en crisis institucionales", time: "30:45", locked: true }
    ]
  }
];

import { supabase } from '@/lib/supabase';

export default function EducationSection() {
  const [educationResources, setEducationResources] = useState<any[]>(defaultEducationResources);
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const [buyerEmail, setBuyerEmail] = useState('');
  const [restoreEmail, setRestoreEmail] = useState('');
  const [showRestoreForm, setShowRestoreForm] = useState(false);
  const [isVerifyingRestore, setIsVerifyingRestore] = useState(false);

  // Load education resources and payment configurations from Supabase on mount
  useEffect(() => {
    const fetchEducationAndPayments = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'education_data')
          .maybeSingle();

        if (data?.content && Array.isArray(data.content)) {
          setEducationResources(data.content);
        }
      } catch (err) {
        console.warn('Could not load education resources from Supabase:', err);
      }

      try {
        const { data: payData } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'payment_config')
          .maybeSingle();

        if (payData?.content) {
          setPaymentConfig(payData.content);
        }
      } catch (err) {
        console.warn('Could not load payment configuration from Supabase:', err);
      }
    };

    fetchEducationAndPayments();
  }, []);

  // Check purchase status when course changes
  useEffect(() => {
    if (activeCourse) {
      const purchased = localStorage.getItem(`walther_bought_${activeCourse.id}`) === 'true';
      setIsPurchased(purchased);
    } else {
      setIsPurchased(false);
    }
  }, [activeCourse]);

  // Set up player state when course changes
  useEffect(() => {
    if (activeCourse) {
      setSelectedVideo(activeCourse.videoPreview);
      setShowPaywall(false);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [activeCourse]);

  // Auto-lock preview timer: 15 seconds watching limit (only if not purchased)
  useEffect(() => {
    if (timerActive && !showPaywall && !isPurchased) {
      const timer = setTimeout(() => {
        setShowPaywall(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [timerActive, selectedVideo, showPaywall, isPurchased]);

  const registerPurchaseInSupabase = async (
    email: string,
    courseId: string,
    amountCents: number,
    gateway: string,
    transactionId: string
  ) => {
    try {
      const { error } = await supabase.from('purchases').insert({
        email: email.trim().toLowerCase(),
        item_id: courseId,
        item_type: 'course',
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

  const handleVerifyPurchase = async () => {
    if (!activeCourse) return;
    const email = restoreEmail;
    if (!email || !email.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setIsVerifyingRestore(true);
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('item_id', activeCourse.id)
        .eq('status', 'approved');

      if (error) {
        alert('Ocurrió un error al verificar tu acceso. Intenta de nuevo.');
        console.error(error);
      } else if (data && data.length > 0) {
        localStorage.setItem(`walther_bought_${activeCourse.id}`, 'true');
        setIsPurchased(true);
        setShowPaywall(false);
        alert('¡Acceso verificado! Tu curso ha sido desbloqueado con éxito.');
      } else {
        alert('No encontramos ninguna compra aprobada asociada a este correo para este curso.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al verificar el acceso.');
    } finally {
      setIsVerifyingRestore(false);
    }
  };

  // Wompi Widget Load & Open Flow
  const loadWompiWidget = (amountInCents: number, reference: string, publicKey: string) => {
    if (typeof window === 'undefined') return;
    if (!(window as any).WidgetCheckout) {
      const script = document.createElement("script");
      script.src = "https://checkout.wompi.co/widget.js";
      script.async = true;
      script.onload = () => {
        openWompiWidget(amountInCents, reference, publicKey);
      };
      document.body.appendChild(script);
    } else {
      openWompiWidget(amountInCents, reference, publicKey);
    }
  };

  const openWompiWidget = (amountInCents: number, reference: string, publicKey: string) => {
    if (!activeCourse) return;
    const email = buyerEmail || '';
    const checkout = new (window as any).WidgetCheckout({
      currency: 'COP',
      amountInCents: amountInCents,
      reference: reference,
      publicKey: publicKey,
      redirectUrl: window.location.href, // Returns here
      customerEmail: email.trim().toLowerCase() || undefined
    });

    checkout.open(async (result: any) => {
      const transaction = result.transaction;
      if (transaction && (transaction.status === 'APPROVED' || transaction.status === 'SUCCESS')) {
        if (email) {
          await registerPurchaseInSupabase(email, activeCourse.id, amountInCents, 'wompi', transaction.id || '');
        }
        unlockCourse();
      }
    });
  };

  // PayPal SDK script load flow
  const loadPayPalScript = (clientId: string) => {
    if (typeof window === 'undefined') return;
    if ((window as any).paypal) {
      setPaypalLoaded(true);
      return;
    }
    
    const existingScript = document.getElementById("paypal-sdk-script");
    if (existingScript) return;

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
    if (paypalLoaded && showPaywall && !isPurchased && activeCourse) {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = ""; // Clear existing buttons
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
                description: `Curso: ${activeCourse.title}`,
                amount: {
                  value: "15.00" // Standard premium price in USD
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            if (order.status === "COMPLETED") {
              const email = buyerEmail || order.payer?.email_address || '';
              if (email) {
                await registerPurchaseInSupabase(email, activeCourse.id, 1500, 'paypal', order.id || '');
              }
              unlockCourse();
            }
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err);
          }
        }).render("#paypal-button-container");
      }
    }
  }, [paypalLoaded, showPaywall, activeCourse, isPurchased, buyerEmail]);

  const unlockCourse = () => {
    if (activeCourse) {
      localStorage.setItem(`walther_bought_${activeCourse.id}`, 'true');
      setIsPurchased(true);
      setShowPaywall(false);
      alert('¡Felicidades! Pago aprobado. Tu curso ha sido desbloqueado con éxito.');
    }
  };

  return (
    <section
      id="educacion"
      style={{
        padding: "7rem 1.5rem",
        background: "radial-gradient(circle at 50% 0%, rgba(9, 15, 30, 0.98), #060b13)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
      }}
    >
      {/* Background soft glow effects like Platzi */}
      <div style={{ position: "absolute", top: "10%", left: "70%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6, 182, 212, 0.05), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139, 92, 246, 0.03), transparent 70%)", pointerEvents: "none" }} />

      {/* --- COURSE DETAILED PAGE VIEW (Platzi Style) --- */}
      {activeCourse ? (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Back button */}
          <div style={{ marginBottom: "2rem" }}>
            <button 
              onClick={() => setActiveCourse(null)}
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
              ← Volver al catálogo de cursos
            </button>
          </div>

          {/* Course Detailed Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            
            {/* LEFT COLUMN: Hero details and Classes vertical timeline */}
            <div className="flex flex-col">
              
              {/* Platzi Style Course Hero Header */}
              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: "100px", backgroundColor: activeCourse.type === "Ruta de Aprendizaje" ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)", color: activeCourse.type === "Ruta de Aprendizaje" ? "#60a5fa" : "#34d399", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                  {activeCourse.type}
                </div>
                
                <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: "900", color: "white", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.8rem" }}>
                  {activeCourse.title}
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
                    📊 Nivel {activeCourse.level}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#cbd5e1", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: "6px" }}>
                    📚 {activeCourse.syllabus?.length || 0} clases estructuradas
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#cbd5e1", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 12px", borderRadius: "6px" }}>
                    ⏱️ {activeCourse.duration || "Acceso de por vida"}
                  </span>
                </div>

                <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "700px" }}>
                  {activeCourse.description}
                </p>
              </div>

              {/* Syllabus Classes Timeline (Platzi Vertical Style) */}
              <div style={{ background: "rgba(13, 21, 48, 0.25)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "2rem", backdropFilter: "blur(8px)" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "white", marginBottom: "2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Syllabus del Programa
                </h2>

                <div style={{ display: "flex", flexDirection: "column", position: "relative", paddingLeft: "32px" }}>
                  {/* Vertical Timeline line */}
                  <div style={{ position: "absolute", left: "10px", top: "8px", bottom: "8px", width: "2px", background: "linear-gradient(180deg, #10b981, rgba(255,255,255,0.05))" }}></div>

                  {activeCourse.syllabus?.map((item: any, idx: number) => {
                    const isLocked = !isPurchased && item.locked !== false;
                    const isActive = selectedVideo === item.videoUrl;
                    
                    return (
                      <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "24px", position: "relative" }}>
                        
                        {/* Circle Bullet with icon or number */}
                        <div 
                          style={{
                            position: "absolute",
                            left: "-32px",
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: isLocked ? "#1e293b" : "#10b981",
                            border: isLocked ? "2px solid rgba(255, 255, 255, 0.1)" : "2px solid #00e575",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.6rem",
                            fontWeight: "bold",
                            zIndex: 2
                          }}
                        >
                          {isLocked ? "🔒" : (idx + 1)}
                        </div>

                        {/* Class Details Card */}
                        <div
                          onClick={() => {
                            if (isLocked) {
                              setShowPaywall(true);
                            } else {
                              setSelectedVideo(item.videoUrl || activeCourse.videoPreview);
                              setShowPaywall(false);
                            }
                          }}
                          style={{
                            flex: 1,
                            background: isActive ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.01)",
                            border: isActive ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.04)",
                            borderRadius: "12px",
                            padding: "1rem",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          className="hover:bg-slate-900/60"
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ color: isActive ? "#34d399" : "white", fontWeight: "700", fontSize: "0.85rem", margin: 0 }}>
                                {item.title}
                              </p>
                              <p style={{ color: "#64748b", fontSize: "0.7rem", margin: "4px 0 0 0" }}>
                                Clase {idx + 1} • {item.time} min
                              </p>
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: isLocked ? "#64748b" : "#34d399" }}>
                              {isLocked ? "Bloqueado" : "Ver Clase"}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky video player and paywall card widget */}
            <div style={{ position: "sticky", top: "120px" }}>
              <div 
                style={{ 
                  background: "#0c1222", 
                  border: "1px solid rgba(255,255,255,0.06)", 
                  borderRadius: "20px", 
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
              >
                
                {/* Media Container (Cloudflare Stream Player) */}
                <div style={{ width: "100%", aspectRatio: "16/9", background: "black", position: "relative", overflow: "hidden" }}>
                  {!showPaywall ? (
                    <iframe
                      src={selectedVideo || activeCourse.videoPreview}
                      style={{ border: "none", position: "absolute", top: 0, left: 0, height: "100%", width: "100%" }}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                    />
                  ) : (
                    <div 
                      style={{ 
                        position: "absolute", 
                        inset: 0, 
                        background: "linear-gradient(135deg, rgba(8, 12, 24, 0.98), rgba(12, 18, 36, 0.99))",
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        padding: "1.5rem", 
                        textAlign: "center" 
                      }}
                      className="animate-fade-in"
                    >
                      <span style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</span>
                      <h4 style={{ color: "#d4a843", fontWeight: "900", fontSize: "1rem", marginBottom: "0.25rem" }}>
                        Módulo Bloqueado
                      </h4>
                      <p style={{ color: "#94a3b8", fontSize: "0.75rem", maxWidth: "280px", lineHeight: 1.4, margin: 0 }}>
                        Inscríbete hoy al programa para acceder a todas las lecciones y obtener tu certificación.
                      </p>
                    </div>
                  )}
                </div>

                {/* Purchase Widget Area */}
                <div style={{ padding: "1.5rem" }}>
                  
                  {isPurchased ? (
                    <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
                      <p style={{ color: "#34d399", fontWeight: "800", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                        🎉 ¡Acceso Completo Desbloqueado!
                      </p>
                      <p style={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.4 }}>
                        Ya puedes ver todas las clases y descargar el material de estudio.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Price Section */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
                        <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "700" }}>PAGO ÚNICO</span>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ color: "white", fontSize: "1.4rem", fontWeight: "900" }}>$59.000 COP</span>
                          <span style={{ color: "#64748b", fontSize: "0.75rem", display: "block" }}>o $15 USD</span>
                        </div>
                      </div>

                      {/* Payment Integration Panel */}
                      {!paypalLoaded ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          
                          {/* Email input field */}
                          <div style={{ textAlign: "left", marginBottom: "2px" }}>
                            <label style={{ display: "block", color: "#64748b", fontSize: "0.6rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>
                              Correo para registrar acceso:
                            </label>
                            <input
                              type="email"
                              placeholder="ejemplo@correo.com"
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                fontSize: "0.78rem",
                                background: "#050814",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "6px",
                                color: "white",
                                outline: "none"
                              }}
                              value={buyerEmail}
                              onChange={(e) => setBuyerEmail(e.target.value)}
                            />
                          </div>

                          {/* Purchase Buttons (COP / USD) */}
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => {
                                if (!buyerEmail || !buyerEmail.includes('@')) {
                                  alert('Por favor ingresa un correo electrónico válido para registrar tu acceso.');
                                  return;
                                }
                                const isTest = (paymentConfig?.paymentMode || 'test') === 'test';
                                const key = isTest 
                                  ? (paymentConfig?.wompiPublicKeyTest || 'pub_test_Q5y4q64D928v68S391A80860A3n21234')
                                  : (paymentConfig?.wompiPublicKeyLive || '');
                                loadWompiWidget(5900000, `curso-${activeCourse.id}-${Date.now()}`, key);
                              }}
                              style={{
                                flex: 1,
                                padding: "10px 8px",
                                fontSize: "0.75rem",
                                fontWeight: "800",
                                background: "#00b463", // Platzi signature green
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              className="hover:brightness-110"
                            >
                              🇨🇴 Wompi (COP)
                            </button>

                            <button
                              onClick={() => {
                                if (!buyerEmail || !buyerEmail.includes('@')) {
                                  alert('Por favor ingresa un correo electrónico válido para registrar tu acceso.');
                                  return;
                                }
                                const isTest = (paymentConfig?.paymentMode || 'test') === 'test';
                                const clientId = isTest 
                                  ? (paymentConfig?.paypalClientIdTest || 'test_client_id_sandbox')
                                  : (paymentConfig?.paypalClientIdLive || '');
                                loadPayPalScript(clientId);
                              }}
                              style={{
                                flex: 1,
                                padding: "10px 8px",
                                fontSize: "0.75rem",
                                fontWeight: "800",
                                background: "#f59e0b",
                                border: "none",
                                borderRadius: "6px",
                                color: "white",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              className="hover:brightness-110"
                            >
                              🌎 PayPal (USD)
                            </button>
                          </div>

                          {/* Restore Access Link */}
                          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", marginTop: "4px", textAlign: "center" }}>
                            {!showRestoreForm ? (
                              <button
                                onClick={() => setShowRestoreForm(true)}
                                style={{ background: "transparent", border: "none", color: "#06b6d4", fontSize: "0.72rem", textDecoration: "underline", cursor: "pointer" }}
                              >
                                ¿Ya compraste este curso? Restaurar acceso
                              </button>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <p style={{ color: "#64748b", fontSize: "0.68rem", margin: 0 }}>Correo de compra:</p>
                                <div style={{ display: "flex", gap: "6px", width: "100%" }}>
                                  <input
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    style={{
                                      flex: 1,
                                      padding: "6px 10px",
                                      fontSize: "0.75rem",
                                      background: "#050814",
                                      border: "1px solid rgba(255, 255, 255, 0.08)",
                                      borderRadius: "6px",
                                      color: "white",
                                      outline: "none"
                                    }}
                                    value={restoreEmail}
                                    onChange={(e) => setRestoreEmail(e.target.value)}
                                  />
                                  <button
                                    onClick={handleVerifyPurchase}
                                    disabled={isVerifyingRestore}
                                    style={{
                                      padding: "6px 12px",
                                      fontSize: "0.7rem",
                                      fontWeight: "bold",
                                      background: "#1e293b",
                                      border: "1px solid #334155",
                                      borderRadius: "6px",
                                      color: "white",
                                      cursor: "pointer"
                                    }}
                                  >
                                    {isVerifyingRestore ? "..." : "✓"}
                                  </button>
                                </div>
                                <button
                                  onClick={() => setShowRestoreForm(false)}
                                  style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "0.68rem", textDecoration: "underline", cursor: "pointer" }}
                                >
                                  Cancelar
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Dev simulation */}
                          <button
                            onClick={unlockCourse}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#475569",
                              fontSize: "0.65rem",
                              marginTop: "8px",
                              textDecoration: "underline",
                              cursor: "pointer"
                            }}
                          >
                            [Desarrollo] Desbloquear gratis
                          </button>

                        </div>
                      ) : (
                        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div id="paypal-button-container" style={{ width: "100%" }}></div>
                          <button 
                            onClick={() => setPaypalLoaded(false)}
                            style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: "0.72rem", marginTop: "8px", textDecoration: "underline", cursor: "pointer" }}
                          >
                            Volver
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </div>
            </div>

          </div>

        </div>
      ) : (
        /* --- COURSE CATALOG GRID VIEW (Platzi Style) --- */
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                background: "rgba(0, 180, 99, 0.1)",
                border: "1px solid rgba(0, 180, 99, 0.25)",
                borderRadius: "100px",
                color: "#00b463",
                fontSize: "0.7rem",
                fontWeight: "800",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              ACADEMIA DE FORMACIÓN
            </span>
            
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: "900",
                color: "#f8fafc",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Domina las habilidades de <span style={{ color: "#00b463" }}>Liderazgo Pedagógico</span>
            </h2>
            
            <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              Aprende sin límites con programas de consultoría, acreditación institucional y gestión moderna impartidos por expertos.
            </p>
          </div>

          {/* Platzi-style Catalog Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {educationResources.map((resource) => (
              <div
                key={resource.id}
                onClick={() => setActiveCourse(resource)}
                style={{
                  background: "#0c1222",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "16px",
                  padding: "1.2rem",
                  cursor: "pointer",
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  transition: "all 0.3s ease"
                }}
                className="hover:-translate-y-1 hover:border-[#00b463]/30 hover:shadow-[0_10px_30px_rgba(0,180,99,0.08)] group"
              >
                
                {/* Left Artwork Thumbnail */}
                <div 
                  style={{ 
                    position: "relative", 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "12px", 
                    background: resource.type === "Ruta de Aprendizaje" ? "linear-gradient(135deg, #1e3a8a, #3b82f6)" : "linear-gradient(135deg, #064e3b, #10b981)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <span style={{ fontSize: "2.2rem" }} className="group-hover:scale-110 transition-transform duration-300">
                    {resource.icon}
                  </span>
                  
                  {/* Hover Play Button Overlay */}
                  <div 
                    style={{ 
                      position: "absolute", 
                      inset: 0, 
                      borderRadius: "12px", 
                      background: "rgba(0,0,0,0.4)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s" 
                    }}
                    className="group-hover:opacity-100"
                  >
                    <span style={{ color: "white", fontSize: "1rem" }}>▶</span>
                  </div>
                </div>

                {/* Right Metadata Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
                    <span 
                      style={{ 
                        fontSize: "0.6rem", 
                        fontWeight: "800", 
                        padding: "2px 8px", 
                        borderRadius: "100px", 
                        backgroundColor: resource.type === "Ruta de Aprendizaje" ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
                        color: resource.type === "Ruta de Aprendizaje" ? "#60a5fa" : "#34d399",
                        textTransform: "uppercase"
                      }}
                    >
                      {resource.type}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "#64748b" }}>• {resource.level}</span>
                  </div>

                  <h3 
                    style={{ 
                      fontSize: "0.95rem", 
                      fontWeight: "800", 
                      color: "white", 
                      lineHeight: "1.3",
                      margin: "2px 0 4px 0"
                    }}
                    className="group-hover:text-[#00b463] transition-colors truncate"
                  >
                    {resource.title}
                  </h3>

                  <p style={{ color: "#64748b", fontSize: "0.75rem", margin: 0 }}>
                    Prof. Dr. Walther Parrado
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                    <span style={{ fontSize: "0.7rem", color: "#cbd5e1" }}>
                      ⏱️ {resource.duration || `${resource.syllabus?.length || 0} clases`}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}
    </section>
  );
}
