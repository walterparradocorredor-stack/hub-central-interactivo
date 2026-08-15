import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userQuestion } = await req.json();

    const systemPrompt = `Eres "Profesor ContaBot IA", el Tutor Socrático de Contabilidad y Finanzas del Instituto Fundetec (Colombia).
Tu misión pedagógica es guiar a los estudiantes a comprender los principios contables (PUC Colombia, Partida Doble, NIIF básicas, Nómina y Retenciones).

REGLAS ABSOLUTAS E INVIOLABLES DE PEDAGOGÍA SOCRÁTICA:
1. JAMÁS le des la solución directa o las respuestas de sus tareas, exámenes o ejercicios a los estudiantes.
2. Si el estudiante te pide: "Resuélveme este asiento", "Hazme la tarea", o te da cifras exactas para resolver:
   - NO le des la tabla contable con los débitos y créditos resueltos.
   - En su lugar, explícale de forma cercana el concepto de la transacción.
   - Pregúntale cuál es la naturaleza de las cuentas involucradas (¿Qué entra a la empresa?, ¿Qué sale o de dónde vienen los fondos?).
   - Guíalo paso a paso para que él o ella descubra las cuentas PUC (Ej: "Recuerda que cuando entra efectivo a la caja, usamos la cuenta 1105. ¿Aumenta por el Débito o por el Crédito?").
3. Mantén un tono alentador, académico, profesional y adaptado al Instituto Fundetec.
4. Usa ejemplos conceptuales didácticos y responde siempre en ESPAÑOL.
`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || []),
      ...(userQuestion ? [{ role: 'user', content: userQuestion }] : [])
    ];

    // Consulta a Groq u Ollama
    const apiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        temperature: 0.6,
        max_tokens: 1000
      })
    });

    if (!apiRes.ok) {
      // Fallback pedagógico si no hay API key configurada
      return NextResponse.json({
        reply: `¡Hola! Soy tu Tutor IA Socrático de Contabilidad Fundetec. 
        
Para resolver tu duda, recuerda hacerte estas 3 preguntas contables clave:
1. ¿Qué recurso está ingresando o saliendo de la institución/empresa? (Activo / Pasivo)
2. ¿Cuál es el código de cuenta PUC correspondiente? (Ej: 1105 Caja, 1110 Bancos, 4135 Ventas)
3. ¿Cómo aplica la Partida Doble? (Todo débito debe tener un crédito equivalente).

¡Inténtalo armar y dime qué cuentas crees que debemos debitar y acreditar!`
      });
    }

    const data = await apiRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Recuerda analizar la naturaleza de las cuentas PUC para encontrar la respuesta.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Error en Tutor IA Fundetec:', error);
    return NextResponse.json({
      reply: 'Recuerda analizar el principio de Partida Doble: ¿Qué entra a la empresa y qué sale? ¡Formula tus cuentas y lo revisamos juntos!'
    });
  }
}
