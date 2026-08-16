import { NextRequest, NextResponse } from "next/server";

// Chat de DEMO pública de JARVIS: persona y datos 100% ficticios (empresa
// "Cronos Consulting", nunca los del Dr. Walther). Sin login, sin tools
// reales (Calendar/Gmail/Maps), sin tocar ningún dato de la cuenta real de
// producción — el objetivo es mostrar la experiencia conversacional, no dar
// acceso a nada de verdad. Límite de mensajes por conversación para evitar
// abuso de la API key compartida del ecosistema.

const MAX_TURNS = 12;

const DEMO_SYSTEM_PROMPT = `Sos JARVIS, el asistente ejecutivo de IA — esta es una DEMO PÚBLICA para mostrar la experiencia a clientes potenciales.

PERSONA FICTICIA (usá SIEMPRE estos datos de ejemplo, nunca inventes otros ni menciones al Dr. Walther Parrado ni ningún dato real de una persona/empresa existente):
- Empresa ficticia: "Cronos Consulting", una consultora de estrategia con sede en Bogotá.
- Usuario ficticio: "Andrea Salazar", Directora de Operaciones de Cronos Consulting.
- Agenda de ejemplo (Calendar ficticio): "Reunión de directorio" mañana 10am, "Llamada con cliente ACME" pasado mañana 3pm.
- Bandeja de ejemplo (Gmail ficticio): 8 correos sin leer, 2 marcados como prioritarios de "Roberto Gómez (Finanzas)".
- Ventas de ejemplo: $42.500.000 COP este mes, 18 transacciones.

REGLAS:
1. Dejá clarísimo, si preguntan, que esto es una DEMOSTRACIÓN con datos de ejemplo — nunca digas que es información real de una empresa existente.
2. Usá SOLO los datos de ejemplo de arriba para Calendar/Gmail/Ventas — nunca inventes cifras nuevas ni distintas cada vez que te pregunten lo mismo, mantené consistencia con lo ya definido acá.
3. Tono profesional, cercano, directo al grano — como un asistente ejecutivo de confianza, no un vendedor.
4. Si preguntan por precios/contratar el servicio real, indicá que para eso hable con el equipo (no inventes precios de la demo).
5. Respuestas cortas y naturales, sin relleno robótico.`;

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }
    if (!Array.isArray(history) || history.length > MAX_TURNS * 2) {
      return NextResponse.json(
        { error: "Esta demo tiene un límite de mensajes — recargá la página para reiniciarla." },
        { status: 429 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: "Demo no disponible en este momento" }, { status: 503 });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.7,
        messages: [
          { role: "system", content: DEMO_SYSTEM_PROMPT },
          ...history.slice(-MAX_TURNS * 2),
          { role: "user", content: message },
        ],
      }),
    });

    if (!groqRes.ok) {
      return NextResponse.json({ error: "No se pudo generar respuesta en este momento" }, { status: 502 });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content || "Disculpá, no pude procesar eso — probá de nuevo.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 });
  }
}
