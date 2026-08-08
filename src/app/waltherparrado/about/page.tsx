import type { Metadata } from "next";
import NavBar from "../NavBar";
import AboutContent from "./AboutContent";
import { Footer } from "../Footer";

export const metadata: Metadata = {
  title: "Sobre Mí — Dr. Walther Parrado | Liderazgo y Gestión Educativa",
  description:
    "Conoce la trayectoria académica y profesional de José Walther Parrado Corredor. Más de 22 años de experiencia como Director de FUNDETEC y especialista en gerencia educativa.",
  openGraph: {
    title: "Sobre Mí — Dr. Walther Parrado",
    description: "Doctor en Gerencia Educativa, Magíster en Educación y Consultor Institucional.",
    images: [{ url: "/foto-de-perfil-de-walther-parrado.webp" }],
  },
};

export default function AboutPage() {
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
      <AboutContent />
      <Footer />
    </main>
  );
}
