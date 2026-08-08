import type { Metadata } from "next";
import NavBar from "../NavBar";
import BlogContent from "./BlogContent";
import { Footer } from "../Footer";

export const metadata: Metadata = {
  title: "Columnas de Opinión — Dr. Walther Parrado | Desde el Corazón de Sucre",
  description:
    "Lee las últimas reflexiones e investigaciones de Walther Parrado sobre gestión pedagógica, financiamiento de la educación y calidad escolar en Sincelejo y la región Caribe.",
  openGraph: {
    title: "Columnas de Opinión — Dr. Walther Parrado",
    description: "Espacio de debate, ideas e innovación en la gestión educativa colombiana.",
    images: [{ url: "/Portada-colunmnas-2.webp" }],
  },
};

export default function BlogPage() {
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
      <BlogContent />
      <Footer />
    </main>
  );
}
