import type { Metadata } from "next";
import NavBar from "../NavBar";
import SchedulingSection from "../SchedulingSection";
import ContactContent from "./ContactContent";
import { Footer } from "../Footer";

export const metadata: Metadata = {
  title: "Agendar Cita & Contacto — Dr. Walther Parrado | Consultoría Élite",
  description:
    "Reserva una sesión estratégica 1-a-1 de consultoría en gerencia educativa o ponte en contacto directo para proyectos institucionales.",
  openGraph: {
    title: "Contacto & Agendamiento — Dr. Walther Parrado",
    description: "Espacio exclusivo de consultoría y asesoría estratégica de modelos pedagógicos en Colombia.",
  },
};

export default function ContactPage() {
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
      <SchedulingSection />
      <ContactContent />
      <Footer />
    </main>
  );
}
