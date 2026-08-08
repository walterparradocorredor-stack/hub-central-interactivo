import type { Metadata } from "next";
import NavBar from "../NavBar";
import EducationSection from "../EducationSection";
import { Footer } from "../Footer";

export const metadata: Metadata = {
  title: "Academia & Cursos — Dr. Walther Parrado | Formación y Recursos",
  description:
    "Accede a rutas de aprendizaje y recursos interactivos sobre liderazgo institucional, acreditación de calidad educativa y automatización pedagógica.",
  openGraph: {
    title: "Academia & Recursos — Dr. Walther Parrado",
    description: "Cursos interactivos y cápsulas de conocimiento para directivos y líderes del sector educativo.",
  },
};

export default function EducationPage() {
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
      <EducationSection />
      <Footer />
    </main>
  );
}
