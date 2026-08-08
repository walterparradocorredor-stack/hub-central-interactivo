import type { Metadata } from "next";
import NavBar from "../NavBar";
import { Footer } from "../Footer";
import OfficeContent from "./OfficeContent";

export const metadata: Metadata = {
  title: "Nuestra Oficina Bogotá — Dr. Walther Parrado | WeWork Calle 81",
  description:
    "Conoce nuestra oficina de consultoría y estrategia en WeWork Calle 81, Bogotá. Espacios de primer nivel diseñados para el desarrollo educativo nacional.",
  openGraph: {
    title: "Nuestra Oficina Bogotá — Dr. Walther Parrado",
    description: "Sede de consultoría y gerencia educativa en WeWork Calle 81, Bogotá.",
    images: [{ url: "/office/office-1.webp" }],
  },
};

export default function OfficePage() {
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
      <OfficeContent />
      <Footer />
    </main>
  );
}
