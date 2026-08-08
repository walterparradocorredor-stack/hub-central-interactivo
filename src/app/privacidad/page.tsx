import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad — WP Ecosystem (Walther Parrado)',
  description: 'Política global de Privacidad de WP Ecosystem y sus plataformas asociadas.',
};

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Protección de la privacidad y confidencialidad de nuestros usuarios en todo el ecosistema.
          </p>
        </div>

        <div className="space-y-6 text-gray-300 text-xs md:text-sm leading-relaxed bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Recolección de Información</h2>
            <p>
              Recopilamos información únicamente con el fin de proporcionar asesorías de calidad, inscripciones académicas y soporte en soluciones de Inteligencia Artificial.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Seguridad de los Datos</h2>
            <p>
              Toda la información se almacena en infraestructura propia protegida con cifrado SSL/HTTPS, firewalls WAF y cumpliendo con la normativa colombiana de protección de datos personales.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Contacto de Privacidad</h2>
            <p>
              Si tienes preguntas sobre nuestra política de privacidad, puedes contactarnos en <strong>Virtualidad@fundetec.edu.co</strong> o consultar nuestra sección de <Link href="/habeas-data" className="text-indigo-400 underline">Habeas Data</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
