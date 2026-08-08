import type { Metadata } from "next";
import NavBar from "../NavBar";
import SeminarsSection from "../SeminarsSection";
import { Footer } from "../Footer";

export const metadata: Metadata = {
  title: "Seminarios Virtuales de 4 Horas — Dr. Walther Parrado | Jowhalth Academy",
  description:
    "Capacitaciones intensivas del Dr. Walther Parrado y Jowhalth Academy: Claude Cowork, Composición de Menús con IA, Gemini y Bioseguridad en Uñas.",
  alternates: {
    canonical: "https://waltherparrado.com/seminars",
  },
  openGraph: {
    title: "Seminarios Virtuales de 4 Horas — Dr. Walther Parrado",
    description: "Aumenta tu productividad con IA, ingeniería de menús y protocolos de bioseguridad. Temarios interactivos disponibles.",
    url: "https://waltherparrado.com/seminars",
    type: "website",
    images: [{ url: "/android-chrome-192x192.png" }],
  },
};

export default function SeminarsPage() {
  return (
    <main
      style={{
        background: "#0a0f1e",
        minHeight: "100vh",
        color: "#f0f4ff",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        overflowX: "hidden",
        paddingTop: "70px",
      }}
    >
      <NavBar />
      <SeminarsSection />
      <Footer />
    </main>
  );
}
