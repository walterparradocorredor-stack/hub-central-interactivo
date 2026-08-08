'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function AwardsSection() {
  const [awardsList, setAwardsList] = useState([
    { title: "Doctorado en Gerencia Educativa", entity: "Mención Cum Laude", year: "2019" },
    { title: "Reconocimiento a la Innovación", entity: "Ministerio TIC", year: "2021" },
    { title: "Premio Liderazgo Regional", entity: "Gobernación de Sucre", year: "2023" }
  ]);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const { data } = await supabase.from('cms_content').select('content').eq('id', 'about_data').single();
        if (data?.content?.awards && Array.isArray(data.content.awards)) {
          setAwardsList(data.content.awards);
        }
      } catch (e) {}
    };
    fetchAwards();
  }, []);

  return (
    <section id="reconocimientos" style={{ padding: "5rem 1.5rem", background: "var(--wp-navy-2)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 className="wl-serif" style={{ fontSize: "2rem", fontWeight: "500", color: "#f4f2ee", marginBottom: "3rem", textAlign: "center" }}>
          Premios y <span className="gradient-text-gold">Reconocimientos</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awardsList.map((award: any, i) => (
            <div key={i} className="glass-card-hover flex flex-col items-center" style={{ padding: "2rem", textAlign: "center", borderTop: "3px solid var(--wp-gold)", borderRadius: "16px" }}>
              {award.imageUrl || award.image ? (
                <div style={{ position: "relative", width: "100%", height: "180px", marginBottom: "1.2rem", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(212,168,67,0.3)", background: "#0f172a" }}>
                  <img
                    src={award.imageUrl || award.image}
                    alt={award.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏆</div>
              )}
              <h3 style={{ color: "#f4f2ee", fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>{award.title}</h3>
              <p style={{ color: "#a59f95", fontSize: "0.9rem" }}>{award.entity || award.issuer} · {award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
