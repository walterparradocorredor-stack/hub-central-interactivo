import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Habeas Data y Protección de Datos — WP Ecosystem (Walther Parrado)',
  description: 'Política oficial de Protección de Datos Personales y ejercicio de derechos ARCO conforme a la Ley 1581 de 2012 de Colombia.',
};

export default function HabeasDataPage() {
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
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            ⚖️ Ley 1581 de 2012 — República de Colombia
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
            Política de Habeas Data y Tratamiento de Datos Personales
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Garantía de privacidad, protección de datos y ejercicio de los derechos ARCO en todo el ecosistema de WP Ecosystem — Walther Parrado.
          </p>
        </div>

        <div className="space-y-6 text-gray-300 text-xs md:text-sm leading-relaxed bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">1.</span> Identificación del Responsable del Tratamiento
            </h2>
            <p>
              **WP Ecosystem (Walther Parrado & J&M Tech Solutions)**, en coordinación con la institución educativa **FUNDETEC**, **Jowhalth Academy**, **Rentun Group** y sus plataformas tecnológicas asociadas, actúa como Responsable del Tratamiento de los datos personales suministrados por estudiantes, docentes, rectores, clientes y usuarios del ecosistema.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li><strong>Sede Principal Bogotá:</strong> WeWork Calle 85 (Ac. 85 #12-66) y Calle 81.</li>
              <li><strong>Sede Académica:</strong> FUNDETEC (Sincelejo / Villavicencio).</li>
              <li><strong>Correo electrónico habilitado:</strong> Virtualidad@fundetec.edu.co / contacto@waltherparrado.com</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">2.</span> Finalidades del Tratamiento de Datos
            </h2>
            <p>Los datos personales recolectados a través de nuestros portales web y plataformas SaaS son procesados para las siguientes finalidades:</p>
            <ol className="list-decimal pl-5 space-y-1 text-gray-400">
              <li>Gestión de matrícula, certificaciones académicas y acceso a campus virtuales (PreICFES App, Q10, Fundetec Virtual).</li>
              <li>Prestación de servicios de consultoría estratégica, arquitectura de software e integración de Agentes de IA.</li>
              <li>Envío de comunicaciones oficiales, invitaciones a seminarios de 4 horas, boletines educativos y ofertas académicas.</li>
              <li>Cumplimiento de obligaciones legales, fiscales y requerimientos del Ministerio de Educación Nacional (MEN).</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">3.</span> Derechos de los Titulares de los Datos (Derechos ARCO)
            </h2>
            <p>De conformidad con el Artículo 8 de la Ley 1581 de 2012, usted como titular cuenta con los siguientes derechos:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <strong className="text-indigo-400">Acceso & Conocimiento:</strong> Conocer, actualizar y rectificar sus datos personales frente a los Responsables.
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <strong className="text-emerald-400">Prueba de Autorización:</strong> Solicitar prueba de la autorización otorgada para el tratamiento.
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <strong className="text-amber-400">Revocatoria & Supresión:</strong> Revocar la autorización y/o solicitar la supresión del dato cuando no se respeten los principios legales.
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <strong className="text-cyan-400">Quejas ante la SIC:</strong> Presentar ante la Superintendencia de Industria y Comercio (SIC) quejas por infracciones a la ley.
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">4.</span> Procedimiento para Ejercer los Derechos
            </h2>
            <p>
              Para consultar, actualizar o solicitar la supresión de sus datos, el titular debe enviar una solicitud formal al correo <strong>Virtualidad@fundetec.edu.co</strong> indicando su nombre completo, documento de identidad y la descripción clara de la consulta o reclamo. Las solicitudes serán atendidas en un plazo máximo de diez (10) días hábiles para consultas y quince (15) días hábiles para reclamos.
            </p>
          </section>

          <section className="space-y-3 border-t border-white/10 pt-4">
            <p className="text-xs text-gray-500 text-center">
              Última actualización de la Política de Habeas Data: Julio de 2026. Ecosistema Walther Parrado & J&M Tech Solutions.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
