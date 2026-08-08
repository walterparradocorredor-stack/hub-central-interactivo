'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactContent() {
  const [phone, setPhone] = useState('+57 301 764 0850');
  const [location, setLocation] = useState('Emprendu Calle 85 (Ac. 85 #12-66, Bogotá)');

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'office_data')
          .single();

        if (data?.content) {
          const c = data.content;
          const name = c.officeFacilityName || 'Emprendu Calle 85';
          const addr = c.officeAddress || 'Ac. 85 #12-66';
          const city = c.officeCity || 'Bogotá';
          setLocation(`${name} (${addr}, ${city})`);
          return;
        }
      } catch (err) {
        console.warn('Could not load office data from Supabase', err);
      }
    };

    fetchContactData();
  }, []);

  const rawPhone = phone.replace(/[^0-9]/g, '');

  return (
    <section
      id="contacto"
      style={{
        padding: "7rem 1.5rem",
        background: "linear-gradient(180deg, #0d1530 0%, #0a0f1e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        {/* Label */}
        <span
          style={{
            display: "inline-block",
            padding: "4px 14px",
            background: "rgba(37, 99, 235, 0.12)",
            border: "1px solid rgba(37, 99, 235, 0.25)",
            borderRadius: "100px",
            color: "#93c5fd",
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.1em",
            marginBottom: "1.5rem",
          }}
        >
          CONTACTO
        </span>

        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: "800",
            color: "#f0f4ff",
            marginBottom: "1.2rem",
            lineHeight: 1.15,
          }}
        >
          ¿Tienes algo que{" "}
          <span className="gradient-text-blue">quieras compartir?</span>
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            lineHeight: 1.7,
            marginBottom: "3rem",
            maxWidth: "500px",
            margin: "0 auto 3rem",
          }}
        >
          Me interesa conocer las metas y desafíos de tu institución. Escríbeme
          directamente por WhatsApp o déjanos un mensaje para agendar una sesión exploratoria.
        </p>

        {/* Contact cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
            textAlign: "left",
          }}
        >
          {[
            {
              icon: "📱",
              title: "WhatsApp",
              value: phone,
              href: `https://api.whatsapp.com/send?phone=${rawPhone || '573017640850'}&text=Hola%20Dr.%20Walther%2C%20me%20comunico%20desde%20su%20sitio%20web.`,
              id: "contact-whatsapp",
            },
            {
              icon: "📍",
              title: "Ubicación (Oficina)",
              value: location,
              href: `https://maps.google.com/?q=${encodeURIComponent(location)}`,
              id: "contact-location-bogota",
            },
          ].map((item) => (
            <a
              key={item.title}
              id={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-hover"
              style={{
                padding: "1.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontSize: "1.8rem",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(37, 99, 235, 0.1)",
                  borderRadius: "12px",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <div>
                <p style={{ color: "#64748b", fontSize: "0.7rem", fontWeight: "600", marginBottom: "3px" }}>
                  {item.title}
                </p>
                <p style={{ color: "#f0f4ff", fontSize: "0.85rem", fontWeight: "600" }}>
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Main CTA */}
        <a
          id="contact-cta-whatsapp"
          href={`https://api.whatsapp.com/send?phone=${rawPhone || '573017640850'}&text=Hola%20Dr.%20Walther%2C%20me%20gustar%C3%ADa%20compartir%20algo%20con%20usted.`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          style={{ fontSize: "1rem", padding: "16px 40px" }}
        >
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  );
}
