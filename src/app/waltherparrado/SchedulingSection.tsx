"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SchedulingSection() {
  const [step, setStep] = useState(1); // Steps: 1 (Qualifying Survey), 2 (Calendar/Time), 3 (Final Contact Details), 4 (Success / Redirect recommendation)
  
  // Qualification state
  const [qualData, setQualData] = useState({
    role: "",
    needs: "",
    budget: "",
  });

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const getUpcomingDates = () => {
    const dates: string[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1); // Start tomorrow

    while (dates.length < 5) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0) { // Monday through Saturday
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
      }
      d.setDate(d.getDate() + 1);
    }
    return dates;
  };

  const availableDates = getUpcomingDates();
  const availableTimes = ["09:00 AM", "11:00 AM", "02:00 PM", "04:30 PM"];

  // Handle Qualification Logic
  const handleQualify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualData.role || !qualData.needs || !qualData.budget) return;

    // Direct to calendar only if they represent institutional leads (Rector, Vicerrector, Director, Consultor) 
    // AND have corporate/premium budget. Otherwise, redirect to Academy recommendation step.
    const isDirectivo = ["rector", "vicerrector", "director"].includes(qualData.role);
    const hasBudget = ["corporate", "premium"].includes(qualData.budget);

    if (isDirectivo || hasBudget) {
      setStep(2); // Qualified -> Calendar
    } else {
      setStep(5); // Unqualified -> Show soft rejection with Jowhalth Academy recommendation
    }
  };

  const handleNextToContact = () => {
    if (selectedDate && selectedTime) setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedDate === "Contacto General") {
        // Save in public.form_submissions
        const { error } = await supabase.from('form_submissions').insert({
          name: formData.name,
          email: formData.email,
          message: `Mensaje de contacto general desde agendamiento. Razón: ${formData.reason}. Teléfono: ${formData.phone}`,
          form_type: 'Contacto General'
        });
        if (error) throw error;
      } else {
        // Parse the date and time. selectedDate is YYYY-MM-DD, selectedTime is HH:MM AM/PM
        let dateObj = new Date();
        if (selectedDate && selectedTime) {
          // Parse e.g. "2026-06-25 11:00 AM"
          const timeParts = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (timeParts) {
            let hours = parseInt(timeParts[1], 10);
            const minutes = parseInt(timeParts[2], 10);
            const ampm = timeParts[3].toUpperCase();
            if (ampm === "PM" && hours < 12) hours += 12;
            if (ampm === "AM" && hours === 12) hours = 0;

            const [year, month, day] = selectedDate.split('-').map(Number);
            dateObj = new Date(year, month - 1, day, hours, minutes);
          }
        }

        const { error } = await supabase.from('appointments').insert({
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          appointment_date: dateObj.toISOString(),
          reason: formData.reason,
          status: 'Pendiente'
        });
        if (error) throw error;
      }
      setStep(4); // Success step
    } catch (err: any) {
      alert('Error guardando en base de datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="agendamiento"
      style={{
        padding: "7rem 1.5rem",
        background: "#0a0f1e",
        position: "relative",
        borderTop: "1px solid rgba(37, 99, 235, 0.1)",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem", textAlign: "center" }}>
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
            }}
          >
            CONSULTORÍA ELITE
          </span>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: "800",
              color: "#f0f4ff",
              marginBottom: "1rem",
            }}
          >
            Agenda Cita de <span className="gradient-text-blue">Gerencia & Consultoría</span>
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Espacio de asesoría estratégica 1-a-1 exclusivo para instituciones educativas y profesionales de alta gerencia.
          </p>
        </div>

        <div
          className="p-6 sm:p-12"
          style={{
            background: "#0f172a",
            borderRadius: "24px",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {/* STEP 1: QUALIFYING SURVEY */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 style={{ color: "#f0f4ff", fontSize: "1.25rem", fontWeight: "700", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
                📋 Cuestionario de Calificación
              </h3>
              
              <form onSubmit={handleQualify} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Role selection */}
                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: "600" }}>
                    ¿Cuál es tu cargo o rol dentro de tu organización? *
                  </label>
                  <select
                    required
                    value={qualData.role}
                    onChange={(e) => setQualData({ ...qualData, role: e.target.value })}
                    style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  >
                    <option value="" disabled style={{ background: "#0f172a" }}>Selecciona una opción</option>
                    <option value="rector" style={{ background: "#0f172a" }}>Rector / Director de Institución Educativa</option>
                    <option value="vicerrector" style={{ background: "#0f172a" }}>Vicerrector / Coordinador Académico</option>
                    <option value="director" style={{ background: "#0f172a" }}>Director de Operaciones / Tecnología</option>
                    <option value="consultor" style={{ background: "#0f172a" }}>Consultor, Conferencista o Coach Independiente</option>
                    <option value="profesional" style={{ background: "#0f172a" }}>Profesional / Estudiante Independiente</option>
                  </select>
                </div>

                {/* Needs selection */}
                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: "600" }}>
                    ¿Qué necesidad principal deseas solucionar? *
                  </label>
                  <select
                    required
                    value={qualData.needs}
                    onChange={(e) => setQualData({ ...qualData, needs: e.target.value })}
                    style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  >
                    <option value="" disabled style={{ background: "#0f172a" }}>Selecciona una opción</option>
                    <option value="acreditacion" style={{ background: "#0f172a" }}>Acreditación y Calidad Educativa ante el MEN</option>
                    <option value="digitalizacion" style={{ background: "#0f172a" }}>Crear y Estructurar Programas Académicos (LMS)</option>
                    <option value="ia" style={{ background: "#0f172a" }}>Automatización de Procesos Educativos con IA</option>
                    <option value="capacitacion" style={{ background: "#0f172a" }}>Capacitación y Formación Ejecutiva de Equipos</option>
                  </select>
                </div>

                {/* Budget selection */}
                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: "600" }}>
                    ¿Cuál es el presupuesto aproximado asignado para este proyecto? *
                  </label>
                  <select
                    required
                    value={qualData.budget}
                    onChange={(e) => setQualData({ ...qualData, budget: e.target.value })}
                    style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  >
                    <option value="" disabled style={{ background: "#0f172a" }}>Selecciona una opción</option>
                    <option value="inicial" style={{ background: "#0f172a" }}>Escala Inicial (Menos de $1,000 USD)</option>
                    <option value="corporate" style={{ background: "#0f172a" }}>Escala Corporativa ($1,000 - $5,000 USD)</option>
                    <option value="premium" style={{ background: "#0f172a" }}>Escala Premium (Más de $5,000 USD)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #06b6d4, #0891b2)", // Cyan
                    color: "#0a0f1e",
                    fontWeight: "700",
                    marginTop: "1rem",
                  }}
                >
                  Validar Perfil & Continuar
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: CALENDAR AND TIME SLOTS */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 style={{ color: "#f0f4ff", fontSize: "1.2rem", fontWeight: "700", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
                📅 1. Selecciona Fecha y Hora
              </h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
                {/* Fechas */}
                <div>
                  <p style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: "600", marginBottom: "1rem" }}>Fechas Disponibles</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {availableDates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        style={{
                          padding: "1rem",
                          background: selectedDate === date ? "rgba(6, 182, 212, 0.15)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${selectedDate === date ? "#22d3ee" : "rgba(255,255,255,0.05)"}`,
                          borderRadius: "8px",
                          color: selectedDate === date ? "#22d3ee" : "#94a3b8",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {new Date(date).toLocaleDateString("es-CO", { weekday: 'long', month: 'long', day: 'numeric' })}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horas */}
                <div style={{ opacity: selectedDate ? 1 : 0.4, pointerEvents: selectedDate ? "auto" : "none", transition: "opacity 0.3s" }}>
                  <p style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: "600", marginBottom: "1rem" }}>Horas Disponibles</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: "1rem 0.5rem",
                          background: selectedTime === time ? "rgba(6, 182, 212, 0.15)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${selectedTime === time ? "#22d3ee" : "rgba(255,255,255,0.05)"}`,
                          borderRadius: "8px",
                          color: selectedTime === time ? "#22d3ee" : "#94a3b8",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontWeight: "600"
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "3rem", display: "flex", justifyContent: "space-between" }}>
                <button type="button" onClick={() => setStep(1)} className="btn-outline">Volver</button>
                <button
                  onClick={handleNextToContact}
                  disabled={!selectedDate || !selectedTime}
                  className="btn-primary"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                    color: "#0a0f1e",
                    opacity: (!selectedDate || !selectedTime) ? 0.5 : 1,
                    cursor: (!selectedDate || !selectedTime) ? "not-allowed" : "pointer"
                  }}
                >
                  Continuar
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT FORM */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
                <h3 style={{ color: "#f0f4ff", fontSize: "1.2rem", fontWeight: "700", margin: 0 }}>
                  👤 2. Datos de Contacto
                </h3>
                <span style={{ color: "#22d3ee", fontSize: "0.85rem", fontWeight: "600" }}>
                  {new Date(selectedDate!).toLocaleDateString("es-CO", { month: 'short', day: 'numeric' })} - {selectedTime}
                </span>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Nombre Completo *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Correo Electrónico *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Teléfono de Contacto (WhatsApp) *</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Descríbenos brevemente tu proyecto/necesidad *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                    style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "white", resize: "none" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                  <button type="button" onClick={() => setStep(2)} className="btn-outline">Volver</button>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white" }}>
                    {loading ? "Registrando..." : "Confirmar Cita Directiva"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: SUCCESS STEP */}
          {step === 4 && (
            <div className="animate-fade-in" style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ width: "80px", height: "80px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                <svg width="40" height="40" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ color: "#f0f4ff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>¡Cita Estratégica Programada!</h3>
              <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "400px", margin: "0 auto", lineHeight: 1.6 }}>
                Tu perfil de consultoría fue aprobado con éxito. Hemos registrado tu espacio para el <strong>{selectedDate}</strong> a las <strong>{selectedTime}</strong>. 
                Te enviaremos a <strong>{formData.email}</strong> y a tu WhatsApp el enlace de Teams para la sesión exploratoria.
              </p>
              <button onClick={() => {setStep(1); setSelectedDate(null); setSelectedTime(null); setFormData({name:"",email:"",phone:"",reason:""})}} className="btn-outline" style={{ marginTop: "2rem" }}>
                Agendar nueva sesión
              </button>
            </div>
          )}

          {/* STEP 5: REDIRECT TO ACADEMY (SOFT REJECTION) */}
          {step === 5 && (
            <div className="animate-fade-in" style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ width: "70px", height: "70px", background: "rgba(212, 168, 67, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <span style={{ fontSize: "2rem" }}>💡</span>
              </div>
              <h3 style={{ color: "#f0f4ff", fontSize: "1.35rem", fontWeight: "700", marginBottom: "1rem" }}>Te sugerimos Jowhalth Academy</h3>
              
              <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 2rem" }}>
                Las consultorías 1-a-1 están reservadas para directores e instituciones en proceso de acreditación de gran escala. 
                Para construir tu proyecto educativo digital de forma autónoma con tutoría IA, te recomendamos iniciar con la escalera de cursos del 
                <strong> Método WALDOR</strong> en nuestra academia digital.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "350px", margin: "0 auto" }}>
                <a
                  href="https://jowhalthacademy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                >
                  🚀 Ingresar a Jowhalth Academy
                </a>
                <button
                  onClick={() => {
                    // Go to contact details anyway but as a regular contact message, not scheduling
                    setStep(3);
                    setSelectedDate("Contacto General");
                    setSelectedTime("N/A");
                  }}
                  className="btn-outline"
                  style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                >
                  Prefiero enviar mensaje de contacto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
