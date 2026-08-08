import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso — WP Ecosystem (Walther Parrado)',
  description: 'Términos de servicio, condiciones de uso y propiedad intelectual de WP Ecosystem.',
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 py-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-wider transition-all"
        >
          ← Volver a WP Ecosystem
        </Link>

        <div className="space-y-4 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Condiciones generales que rigen el acceso y uso de las plataformas, servicios y consultorías de WP Ecosystem.
          </p>
        </div>

        <div className="space-y-6 text-gray-300 text-xs md:text-sm leading-relaxed bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Aceptación de los Términos</h2>
            <p>
              Al acceder o utilizar los sitios web, aplicaciones SaaS (PreICFES App, Campus Virtual FUNDETEC, Jowhalth Academy) y servicios de consultoría tecnológica de WP Ecosystem, usted acepta estar vinculado por estos Términos y Condiciones.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Propiedad Intelectual & Marcas</h2>
            <p>
              Todos los contenidos, marcas corporativas, código fuente, modelos de Inteligencia Artificial, imágenes, diseños y logotipos exhibidos en este portal son propiedad exclusiva de **Walther Parrado**, **J&M Tech Solutions**, **FUNDETEC** y **Rentun Group**. Queda prohibida la reproducción no autorizada.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Servicios de Consultoría & Soluciones SaaS</h2>
            <p>
              Las asesorías en transformación digital e integración de agentes autónomos de IA se prestan bajo acuerdos ejecutivos específicos con cada cliente o institución educativa.
            </p>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-4">
            <p className="text-xs text-gray-500 text-center">
              Última actualización: Julio de 2026. WP Ecosystem.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
