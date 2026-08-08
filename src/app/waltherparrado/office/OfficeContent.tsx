'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const defaultOfficeImages = [
  { src: "/office/office-1.webp", title: "Salas de Reuniones Corporativas" },
  { src: "/office/office-2.webp", title: "Área de Coworking & Redes" },
  { src: "/office/office-3.webp", title: "Espacios de Cafetería & Relajación" },
  { src: "/office/office-4.webp", title: "Salón de Eventos & Talleres" },
  { src: "/office/office-5.webp", title: "Oficinas de Consultoría Privada" },
  { src: "/office/office-6.webp", title: "Áreas de Espera para Clientes" },
  { src: "/office/office-7.jpg", title: "Espacios Dinámicos y Flexibles" },
  { src: "/office/office-8.jpg", title: "Vista Panorámica del Sector Financiero" },
  { src: "/office/office-9.jpg", title: "Sede Entrada Principal WeWork" },
];

export default function OfficeContent() {
  const [officeTitle, setOfficeTitle] = useState('Nuestra Oficina de Asesoría en');
  const [officeHighlight, setOfficeHighlight] = useState('Bogotá');
  const [officeDesc, setOfficeDesc] = useState(
    'Ubicados en el corazón financiero y empresarial del norte de la capital, contamos con instalaciones premium en WeWork Calle 81. Un espacio estratégico para diseñar el futuro de la gestión educativa y recibir a rectores, directivos e inversionistas.'
  );
  const [officeAddress, setOfficeAddress] = useState('Calle 81 #11-08, Bogotá, Colombia');
  const [officeParking, setOfficeParking] = useState('CC Andino, CC Atlantis o Bahías WeWork');
  const [officeAccessReq, setOfficeAccessReq] = useState('Presentar documento de identidad en la recepción principal');
  const [officeMapUrl, setOfficeMapUrl] = useState(
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1545.313511206609!2d-74.05460397541741!3d4.664982078798632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfda1c4eb1d%3A0x33970f369a741c63!2sWeWork%20Espacio%20de%20Oficinas%20%26%20Coworking!5e0!3m2!1ses-419!2sco!4v1783549609494!5m2!1ses-419!2sco'
  );
  const [officeImages, setOfficeImages] = useState<any[]>(defaultOfficeImages);

  const [officeLocationTitle, setOfficeLocationTitle] = useState('¿Cómo llegar a nuestras instalaciones?');
  const [officeFacilityName, setOfficeFacilityName] = useState('Sede Bogotá');

  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'office_data')
          .single();

        if (data?.content) {
          const c = data.content;
          if (c.officeTitle) setOfficeTitle(c.officeTitle);
          if (c.officeHighlight) setOfficeHighlight(c.officeHighlight);
          if (c.officeDesc) setOfficeDesc(c.officeDesc);
          if (c.officeAddress) setOfficeAddress(c.officeAddress);
          if (c.officeParking) setOfficeParking(c.officeParking);
          if (c.officeAccessReq) setOfficeAccessReq(c.officeAccessReq);
          if (c.officeLocationTitle) setOfficeLocationTitle(c.officeLocationTitle);
          if (c.officeFacilityName) setOfficeFacilityName(c.officeFacilityName);
          if (c.officeMapUrl) {
            const raw = c.officeMapUrl.trim();
            const match = raw.match(/src=["']([^"']+)["']/i);
            setOfficeMapUrl(match && match[1] ? match[1] : raw);
          }
          if (c.officeImages && Array.isArray(c.officeImages)) setOfficeImages(c.officeImages);
          return;
        }
      } catch (err) {
        console.warn('Could not load office data from Supabase, trying localStorage...', err);
      }

      // LocalStorage fallback
      if (typeof window !== 'undefined') {
        const savedOffice = localStorage.getItem('walther_office_data');
        if (savedOffice) {
          try {
            const parsed = JSON.parse(savedOffice);
            if (parsed.officeTitle) setOfficeTitle(parsed.officeTitle);
            if (parsed.officeHighlight) setOfficeHighlight(parsed.officeHighlight);
            if (parsed.officeDesc) setOfficeDesc(parsed.officeDesc);
            if (parsed.officeAddress) setOfficeAddress(parsed.officeAddress);
            if (parsed.officeParking) setOfficeParking(parsed.officeParking);
            if (parsed.officeAccessReq) setOfficeAccessReq(parsed.officeAccessReq);
            if (parsed.officeMapUrl) setOfficeMapUrl(parsed.officeMapUrl);
            if (parsed.officeImages && Array.isArray(parsed.officeImages)) setOfficeImages(parsed.officeImages);
          } catch (e) {
            console.error('Error parsing office data from localStorage', e);
          }
        }
      }
    };

    fetchOfficeData();
  }, []);

  return (
    <>
      {/* Hero Header */}
      <section
        style={{
          position: "relative",
          padding: "6rem 1.5rem 3rem",
          background: "radial-gradient(circle at top, rgba(37, 99, 235, 0.1) 0%, transparent 60%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
              letterSpacing: "0.15em",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            SEDE CORPORATIVA
          </span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: "900",
              lineHeight: 1.1,
              color: "#f0f4ff",
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            {officeTitle}{" "}
            <span className="gradient-text-gold">{officeHighlight}</span>
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              color: "#94a3b8",
              lineHeight: 1.7,
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            {officeDesc}
          </p>
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <section style={{ padding: "2rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "#f0f4ff",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Recorrido por las <span className="gradient-text-blue">Instalaciones</span>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {officeImages.map((img, i) => (
              <div
                key={i}
                className="glass-card-hover group"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(13, 21, 48, 0.3)",
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
                  <Image
                    unoptimized
                    src={img.src}
                    alt={img.title || `Sede Bogotá - Oficina ${i + 1}`}
                    fill
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    className="group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                </div>
                <div style={{ padding: "1.2rem", textAlign: "left" }}>
                  <p style={{ color: "#f0f4ff", fontSize: "0.95rem", fontWeight: "700" }}>{img.title}</p>
                  <p style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "4px" }}>{officeFacilityName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map and Details Section */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "#0d1530/30",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
            }}
            className="lg:grid-cols-2"
          >
            {/* Left: Map */}
            <div
              style={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid rgba(34, 211, 238, 0.15)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                minHeight: "400px",
              }}
            >
              <iframe
                src={officeMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Right: Info Card */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left" }}>
              <span
                style={{
                  color: "#d4a843",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                UBICACIÓN Y ACCESO
              </span>
              <h3 style={{ fontSize: "2rem", fontWeight: "800", color: "#f0f4ff", marginBottom: "1.5rem" }}>
                {officeLocationTitle}
              </h3>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: "2rem" }}>
                Nuestras instalaciones están localizadas en la dirección <strong>{officeAddress}</strong>. 
                Un punto céntrico con parqueaderos cercanos y excelente seguridad.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.5rem" }}>📍</span>
                  <div>
                    <p style={{ color: "#f0f4ff", fontWeight: "700", fontSize: "0.95rem" }}>Dirección Principal</p>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>{officeAddress}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.5rem" }}>🚗</span>
                  <div>
                    <p style={{ color: "#f0f4ff", fontWeight: "700", fontSize: "0.95rem" }}>Parqueaderos Recomendados</p>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>{officeParking}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.5rem" }}>🛡️</span>
                  <div>
                    <p style={{ color: "#f0f4ff", fontWeight: "700", fontSize: "0.95rem" }}>Requisito de Ingreso</p>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>{officeAccessReq}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <div
          className="glass-card-hover"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "4rem 2rem",
            borderRadius: "32px",
            border: "1px solid rgba(37, 99, 235, 0.15)",
            background: "linear-gradient(135deg, rgba(13, 21, 48, 0.6) 0%, rgba(10, 15, 30, 0.9) 100%)",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#f0f4ff", marginBottom: "1rem" }}>
            Agenda una Asesoría Estratégica
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1rem", marginBottom: "2.5rem", maxWidth: "550px", margin: "0 auto 2.5rem" }}>
            Si deseas agendar una reunión presencial en nuestra oficina de Bogotá o una sesión virtual de consultoría, 
            escríbenos o agenda en línea.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20me%20gustar%C3%ADa%20agendar%20una%20cita%20presencial%20en%20su%20oficina."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyan"
              style={{ padding: "12px 28px" }}
            >
              Agendar Presencial
            </a>
            <Link
              href="/contact"
              className="btn-outline"
              style={{ padding: "12px 28px" }}
            >
              Agendar Online (Calendario)
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
