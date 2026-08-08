import React from 'react';

export function Footer() {
  return (
    <footer
      id="footer-walther"
      style={{
        padding: "2.5rem 1.5rem",
        background: "var(--wp-navy-2)",
        borderTop: "1px solid rgba(182, 146, 85, 0.15)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <p className="wl-serif" style={{ color: "var(--wp-text)", fontWeight: "500", fontSize: "1.1rem" }}>
            Dr. José Walther Parrado Corredor
          </p>
          <p className="wl-sans" style={{ color: "var(--wp-muted)", fontSize: "0.75rem", marginTop: "4px" }}>
            Dirección Ejecutiva en TIC y Gestión Pública | Bogotá, Colombia
          </p>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a
            id="footer-whatsapp"
            href="https://api.whatsapp.com/send?phone=573017640850"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link-item"
          >
            WhatsApp
          </a>
          <span style={{ color: "var(--wp-border)" }}>·</span>
          <a
            id="footer-blog"
            href="#blog"
            className="footer-link-item"
          >
            Columnas
          </a>
          <span style={{ color: "var(--wp-border)" }}>·</span>
          <div style={{ textAlign: "right" }}>
            <p className="wl-sans" style={{ color: "var(--wp-muted)", fontSize: "0.75rem" }}>
              © 2026 Dr. Walther Parrado. Todos los derechos reservados.
            </p>
            <p className="wl-sans" style={{ color: "var(--wp-muted)", fontSize: "0.75rem", marginTop: "2px" }}>
              Desarrollado por{" "}
              <a
                href="https://www.jymtechsolutions.online/es"
                hrefLang="es"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline", color: "inherit" }}
              >
                J&M Tech Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

