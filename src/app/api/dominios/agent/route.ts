import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY || '';

    const systemPrompt = `Eres DominIA, la asistente experta de IA de WP Ecosystem para dominios, correo corporativo e infraestructura web.
Tu tarea es sugerir dominios perfectos, aconsejar las mejores extensiones (.com, .co, .online, .tech, .io, .ai), explicar precios y guiar sobre pagos seguros por Wompi (Nequi, PSE) y PayPal (Dólares USD).

REGLAS:
1. Sé súper amable, clara, entusiasta y directa.
2. Da sugerencias concretas de nombres de dominios con sus ventajas.
3. Para soporte o atención directa personalizada por WhatsApp, menciona el +57 301 764 0850.
4. Responde SIEMPRE en español en 1 o 2 párrafos concisos y bien estructurados.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-6),
      { role: 'user', content: message }
    ];

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: 0.6,
          max_tokens: 500
        })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ reply });
        }
      }
    } catch (apiErr) {
      console.error('Groq API Error, usando respuesta experta inteligente:', apiErr);
    }

    // Respuesta inteligente fallback si la API no responde
    let smartReply = '¡Excelente consulta! ';
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('software') || lowerMsg.includes('solfware') || lowerMsg.includes('tech') || lowerMsg.includes('app') || lowerMsg.includes('sistema')) {
      smartReply += 'Para tu empresa de software te recomiendo extensiones estratégicas como **.com** ($49.900 COP - Estándar global), **.co** ($54.900 COP - Marca Colombia) o **.tech** ($18.900 COP - Oferta para startups). Puedes usar la barra de búsqueda arriba para verificar disponibilidad en tiempo real o escribirnos al WhatsApp +57 301 764 0850.';
    } else if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('cuanto')) {
      smartReply += 'Nuestros dominios .COM están en oferta especial a **$49.900 COP/año** ($14.99 USD por PayPal), los .CO a **$54.900 COP/año** y extensiones promocionales desde **$12.900 COP/año** (.site, .online). Incluyen zona DNS y protección WHOIS gratis de por vida.';
    } else if (lowerMsg.includes('pago') || lowerMsg.includes('wompi') || lowerMsg.includes('nequi') || lowerMsg.includes('paypal')) {
      smartReply += 'Aceptamos pagos en Colombia en pesos COP por **Wompi** (Nequi, Bancolombia, PSE, Tarjetas) y pagos internacionales en Dólares USD por **PayPal**. Al completar la transacción tu dominio se activa e instala automáticamente.';
    } else {
      smartReply += `Para impulsar tu negocio con el dominio ideal, te sugiero probar opciones con **.com**, **.co** o **.online**. Escribe el nombre que imaginas en el buscador superior para comprobar si está libre, o contáctanos por WhatsApp al +57 301 764 0850 para asesoría directa.`;
    }

    return NextResponse.json({ reply: smartReply });
  } catch (error: any) {
    console.error('Error en /api/dominios/agent:', error);
    return NextResponse.json({
      reply: '¡Hola! Soy DominIA. Te asesoro en la elección y registro de tu dominio oficial (.com, .co, .online). ¡Usa la barra de búsqueda arriba para verificar disponibilidad o escríbenos al WhatsApp +57 301 764 0850!'
    });
  }
}
