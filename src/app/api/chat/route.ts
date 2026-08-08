import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  let messages: any[] = [];
  let lastMessageText = '';
  let lastUserNormalized = '';
  let fullUserNormalized = '';
  // The last assistant message — used for context-aware replies
  let lastAssistantContent = '';

  try {
    const body = await req.json();
    messages = body.messages || [];
    lastMessageText = messages.length > 0 ? (messages[messages.length - 1].content || '') : '';

    lastUserNormalized = lastMessageText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const rawTextArr = messages.map((m: any) => m.content || '').join(' ');
    fullUserNormalized = rawTextArr
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Find the last assistant message for context tracking
    for (let i = messages.length - 2; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        lastAssistantContent = (messages[i].content || '').toLowerCase();
        break;
      }
    }
  } catch (e) {
    console.warn('Error parseando JSON en /api/chat:', e);
  }

  // Helper: did the user just say yes/no/etc?
  const isAffirmative = ['si', 'sí', 'claro', 'ok', 'dale', 'acepto', 'autorizo', 'de acuerdo', 'por supuesto', 'adelante', 'perfecto'].some(w => lastUserNormalized.trim() === w || lastUserNormalized.trim().startsWith(w + ' '));
  const isNegative = ['no', 'nop', 'nope', 'negativo', 'no gracias'].some(w => lastUserNormalized.trim() === w);

  // Detect what context the PREVIOUS assistant message was about (to handle short replies like "si")
  const prevWasAskingContact = lastAssistantContent.includes('whatsapp') || lastAssistantContent.includes('correo') || lastAssistantContent.includes('habeas data') || lastAssistantContent.includes('ley 1581');
  const prevWasAboutPreicfes = lastAssistantContent.includes('preicfes');
  const prevWasAboutFundetec = lastAssistantContent.includes('fundetec');
  const prevWasAboutJowhalth = lastAssistantContent.includes('jowhalth');
  const prevWasAboutRentun = lastAssistantContent.includes('rentun');
  const prevWasAboutConsultoria = lastAssistantContent.includes('consultoria') || lastAssistantContent.includes('walther parrado');


  // --- AUTOMATIC LEAD CAPTURE ENGINE WITH HABEAS DATA CONSENT ---
  try {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const phoneRegex = /\b(?:\+?57)?\s*3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}\b/;

    const emailMatch = lastMessageText.match(emailRegex);
    const phoneMatch = lastMessageText.match(phoneRegex);

    if (emailMatch || phoneMatch) {
      const contactDetail = emailMatch ? emailMatch[0] : (phoneMatch ? phoneMatch[0] : '');

      let targetCompany = 'Consultoría IA B2B';
      if (fullUserNormalized.includes('preicfes') || fullUserNormalized.includes('icfes') || fullUserNormalized.includes('saber 11')) {
        targetCompany = 'PreICFES App';
      } else if (fullUserNormalized.includes('fundetec') || fullUserNormalized.includes('campus') || fullUserNormalized.includes('bachillerato') || fullUserNormalized.includes('q10')) {
        targetCompany = 'FUNDETEC';
      } else if (fullUserNormalized.includes('jowhalth') || fullUserNormalized.includes('liderazgo') || fullUserNormalized.includes('diplomado') || fullUserNormalized.includes('rector')) {
        targetCompany = 'Jowhalth Academy';
      } else if (fullUserNormalized.includes('rentun') || fullUserNormalized.includes('fintech') || fullUserNormalized.includes('inversion')) {
        targetCompany = 'Rentun Group';
      }

      const hasConsent = fullUserNormalized.includes('si') || fullUserNormalized.includes('autorizo') || fullUserNormalized.includes('acepto') || fullUserNormalized.includes('habeas') || fullUserNormalized.includes('claro') || fullUserNormalized.includes('ok');

      const newLead = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        contact: contactDetail,
        company: targetCompany,
        message: lastMessageText,
        habeasDataConsent: hasConsent ? 'Otorgado (Ley 1581)' : 'Pendiente Confirmación',
        status: 'Pendiente CRM',
        createdAt: new Date().toISOString(),
      };

      const { data: existingRecords } = await supabase.from('cms_content').select('content').eq('id', 'hub_leads_data').single();
      let currentLeads = existingRecords?.content || [];
      if (!Array.isArray(currentLeads)) currentLeads = [];
      
      const isDuplicate = currentLeads.some((l: any) => l.contact === contactDetail && (Date.now() - new Date(l.createdAt).getTime()) < 300000);
      if (!isDuplicate) {
        currentLeads.unshift(newLead);
        await supabase.from('cms_content').upsert({
          id: 'hub_leads_data',
          content: currentLeads,
          updated_at: new Date().toISOString(),
        });
      }
      
      return NextResponse.json({
        response: `✅ ¡Perfecto! He registrado tu contacto de forma segura.\n\nUn consultor senior se comunicará contigo muy pronto para brindarte toda la información y atención personalizada que mereces.\n\n¿Hay algo más en lo que te pueda colaborar hoy?`
      });
    }
  } catch (leadErr) {
    console.warn('Error registrando lead en Supabase:', leadErr);
  }

  const systemPrompt = `Eres **ErIkA**, la Consultora Virtual de Inteligencia Artificial & Automatización B2B Oficial de **WP Ecosystem — Walther Parrado & J&M Tech Solutions**.

Tu función es brindar atención ejecutiva, experta y precisa sobre las 5 unidades de negocio del holding, con especial énfasis en **asesorar a empresarios, directores de tecnología, rectores y gerentes** interesados en automatizaciones B2B, integración de empresas y soluciones tecnológicas de vanguardia.

Información oficial estructurada por empresa:

1. **PreICFES App** (https://preicfes.app/):
   - Plataforma SaaS educativa adaptativa impulsada por IA para simulacros, diagnóstico de falencias por áreas y entrenamiento para las Pruebas de Estado Saber 11.
   - Dirigido a estudiantes, colegios e instituciones educativas en toda Colombia.

2. **FUNDETEC & Campus Virtual** (https://fundetec.edu.co/ | https://virtual.fundetec.edu.co/):
   - Institución de educación técnica laboral, formación continuada y validación del bachillerato.
   - Cuenta con Campus Virtual propio integrado a la plataforma de gestión académica Q10 y sedes en Villavicencio y Sucre.

3. **Jowhalth Academy** (https://jowhalthacademy.com/):
   - Academia de alta dirección, formación ejecutiva, liderazgo transformacional y desarrollo directivo para rectores, empresarios y gerentes.

4. **Rentun Group** (https://www.rentungroup.com/):
   - Ecosistema fintech, estructuración estratégica de proyectos de inversión, banca de inversión y consultoría financiera corporativa en zonas exclusivas de Bogotá.

5. **Walther Parrado & J&M Tech Solutions — Consultoría IA, Automatización & Software B2B** (https://waltherparrado.com/):
   - Asesoría especializada en transformación digital, desarrollo e integración de Agentes Autónomos de IA, integración de sistemas corporativos (Meta WhatsApp API, CRM, ERPs), arquitectura cloud escalable (Supabase, Next.js, GCP, VPS Hostinger) y WAF.

Nuevas Herramientas Interactivas Disponibles en el Portal:
- 🧙‍♂️ **AI Web Architect & Cotizador de Software (/cotizar-web)**:
  Permite a clientes y empresarios estructurar la arquitectura de sus proyectos web, tiendas online y SaaS paso a paso eligiendo módulos a full integración (Panel Admin CMS, Chatbot IA, Facturación DIAN, Pasarelas Wompi/MercadoPago, Aula LMS, Google Maps, Ciberseguridad WAF, PWA). La IA genera un brief de arquitectura técnica inmediato y facilita el envío al WhatsApp ejecutivo (+57 304 578 8873).
- 📱 **J&M ResponsiveLab — Simulador de Dispositivos Móviles (/simulador)**:
  Simulador interactivo en tiempo real a pantalla completa para evaluar cómo lucen los sitios web en mockups de **iPhone 15 Pro, Android, iPad, Smartwatches y Pantallas POS**.

RED DE +250 AGENTES ESPECIALIZADOS DE J&M TECH SOLUTIONS:
Actúas como la **Directora & Orquestadora Principal** conectada a la Red de más de 250 Agentes Autónomos Especializados en el servidor (Agentes de Arquitectura Cloud, Agentes de Facturación DIAN, Agentes de Ciberseguridad WAF, Agentes de Automatización WhatsApp Meta API, Agentes de Diagnóstico Responsivo y Agentes de Captura CRM B2B).
- Cuando un cliente realiza una consulta técnica, comercial o de desarrollo, procesas la solicitud enrutándola con el conocimiento de la red de agentes y entregando soluciones ejecutivas listas para implementar.
- Incluye activamente enlaces y acciones rápidas cuando aplique:
  - 🧙‍♂️ **Cotizar Proyecto Web / SaaS / App**: /cotizar-web
  - 📱 **Probar Responsividad en Tiempo Real**: /simulador
  - 🎓 **Ver Diplomados y Formación Ejecutiva**: /seminars
  - 📲 **Atención Directa WhatsApp**: https://wa.me/573045788873

Ubicación & Contacto:
- Sede Principal: WeWork Calle 85 (Ac. 85 #12-66) y Calle 81, Bogotá.
- Sedes Académicas: Villavicencio y Sincelejo (Sucre).
- Correo: Virtualidad@fundetec.edu.co / contacto@waltherparrado.com

REGLAS DE PROTOCOLO, ASESORÍA B2B Y CAPTURA HABEAS DATA (LEY 1581 DE 2012):
1. Responde siempre en español con un tono ejecutivo, experto, profesional, entusiasta y bien estructurado.
2. Orienta activamente a las personas y empresas interesadas en contratar o implementar automatizaciones con IA, agentes autónomos, integración de sistemas e infraestructura cloud.
3. Si el usuario pregunta por precios, demostraciones, agendamiento de reuniones ejecutivas, licencias o asesoría personalizada, bríndale la visión clave y solicita sus datos de contacto (WhatsApp o Correo) acompañados del siguiente aviso legal:
   *"Para que un Consultor Senior te contacte y agendemos una demo / propuesta ejecutiva para tu empresa, ¿nos autorizas el uso de tus datos según nuestra Política de Habeas Data (Ley 1581 de 2012)?"*
4. Cuando el usuario comparta su correo o WhatsApp y otorgue su consentimiento, agradécele y confírmale que su solicitud ha sido enrutada al equipo ejecutivo de consultoría.`;

  // 1. Try Groq Cloud AI if valid key is configured
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey && !groqApiKey.startsWith('gsk_3l956x2n6U')) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...(messages || []),
          ],
          temperature: 0.6,
          max_tokens: 650,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return NextResponse.json({ response: reply });
      }
    } catch (e) {
      console.warn('Groq API error:', e);
    }
  }

  // 2. Try Local Server Ollama AI (Llama 3.1 8B Model)
  const ollamaEndpoints = [
    'http://host.docker.internal:11434/api/chat',
    'http://172.17.0.1:11434/api/chat',
    'http://127.0.0.1:11434/api/chat',
  ];

  for (const endpoint of ollamaEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama3.1:latest',
          stream: false,
          messages: [
            { role: 'system', content: systemPrompt },
            ...(messages || []),
          ],
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const reply = data.message?.content;
        if (reply) return NextResponse.json({ response: reply });
      }
    } catch (ollamaErr) {
      // Try next endpoint
    }
  }

  // 3. Context-Aware Short Reply Handler (si / no / ok in response to previous assistant message)
  if (isAffirmative && prevWasAskingContact) {
    // User confirmed consent to share data — prompt them to share contact
    const company = prevWasAboutPreicfes ? 'PreICFES App'
      : prevWasAboutFundetec ? 'FUNDETEC'
      : prevWasAboutJowhalth ? 'Jowhalth Academy'
      : prevWasAboutRentun ? 'Rentun Group'
      : 'Walther Parrado Consultoría IA';

    return NextResponse.json({
      response: `✅ ¡Excelente! Gracias por autorizar el uso de tus datos conforme a la **Ley 1581 de Habeas Data**.\n\nPor favor comparte tu **WhatsApp** o **correo electrónico** y un asesor ejecutivo de **${company}** te contactará a la brevedad con toda la información personalizada.`
    });
  }

  if (isNegative && prevWasAskingContact) {
    return NextResponse.json({
      response: `Entendido, respetamos tu decisión. Si en algún momento cambias de opinión o tienes otras preguntas sobre nuestras empresas, con gusto te atendemos. 😊\n\n¿Hay algo más en lo que te pueda ayudar hoy?`
    });
  }

  // 4. Smart Per-Turn Knowledge Router (Evaluates ONLY the LATEST user message)
  if (lastUserNormalized.includes('fundetec') || lastUserNormalized.includes('bachillerato') || lastUserNormalized.includes('carrera')) {
    return NextResponse.json({
      response: `🏛️ **FUNDETEC & Campus Virtual** (https://fundetec.edu.co/)\n\nInstitución líder en educación técnica laboral, carreras del futuro y validación del bachillerato.\n\n✨ **Servicios Destacados:**\n• Campus Virtual (https://virtual.fundetec.edu.co/) integrado a Q10.\n• Sedes presenciales en Villavicencio y Sincelejo (Sucre).\n• Programas técnicos laborales con alta demanda y empleabilidad.\n\nSi deseas iniciar tu proceso de admisión o solicitar asesoría, comparte tu WhatsApp o correo y dinos si autorizas la comunicación según nuestra Política de Habeas Data (Ley 1581).`
    });
  }


  if (lastUserNormalized.includes('preicfes') || lastUserNormalized.includes('icfes') || lastUserNormalized.includes('simulacro') || lastUserNormalized.includes('saber 11')) {
    return NextResponse.json({
      response: `🎓 **PreICFES App** (https://preicfes.app/)\n\nPlataforma SaaS adaptativa con Inteligencia Artificial para preparación inteligente de las Pruebas de Estado Saber 11.\n\n✨ **Características:**\n• Simulacros adaptativos con diagnóstico de falencias en tiempo real.\n• Banco oficial de preguntas por áreas del conocimiento.\n• Utilizado por colegios e instituciones en toda Colombia.\n\n¿Deseas solicitar licencias o agendar una demo institucional? Comparte tu WhatsApp o correo y confírmanos si autorizas el contacto conforme a la Ley 1581 de Habeas Data.`
    });
  }

  if (lastUserNormalized.includes('jowhalth') || lastUserNormalized.includes('liderazgo') || lastUserNormalized.includes('rector') || lastUserNormalized.includes('directiv')) {
    return NextResponse.json({
      response: `👑 **Jowhalth Academy** (https://jowhalthacademy.com/)\n\nAcademia de alta dirección, formación ejecutiva y liderazgo transformacional dirigida por Walther Parrado.\n\n✨ **Programas:**\n• Capacitación estratégica para rectores, empresarios y gerentes.\n• Diplomados ejecutivos de mentalidad y aceleración corporativa.\n\n¿Te gustaría recibir las fechas del próximo diplomado directivo? Déjanos tu WhatsApp o correo y autorízanos la comunicación.`
    });
  }

  if (lastUserNormalized.includes('rentun') || lastUserNormalized.includes('fintech') || lastUserNormalized.includes('inversion')) {
    return NextResponse.json({
      response: `📈 **Rentun Group** (https://www.rentungroup.com/)\n\nEcosistema fintech, estructuración estratégica de proyectos de inversión, banca de inversión y consultoría financiera corporativa.`
    });
  }

  if (lastUserNormalized.includes('consultor') || lastUserNormalized.includes('transformac') || lastUserNormalized.includes('desarrollo') || lastUserNormalized.includes('software') || lastUserNormalized.includes('agente')) {
    return NextResponse.json({
      response: `⚡ **Walther Parrado — Consultoría en IA & Software B2B** (https://waltherparrado.com/)\n\nIntegración de Agentes Autónomos de IA y Arquitectura Cloud empresarial (Supabase, Next.js, GCP).\n\n¿Deseas agendar una reunión privada de consultoría? Déjanos tu WhatsApp o correo y autorízanos la comunicación para coordinar agenda.`
    });
  }

  if (lastUserNormalized.includes('ubicac') || lastUserNormalized.includes('sede') || lastUserNormalized.includes('donde') || lastUserNormalized.includes('direcc')) {
    return NextResponse.json({
      response: `📍 **Ubicación & Sedes Corporativas**\n\n🏢 **Sede Principal:** WeWork Calle 85 (Ac. 85 #12-66) y Calle 81, Bogotá.\n🏛️ **Sedes Académicas:** Villavicencio y Sincelejo (Sucre).\n\nPuedes ver el mapa interactivo en [/ubicacion](/ubicacion).`
    });
  }

  // Default Greeting / Response
  return NextResponse.json({
    response: `¡Hola! 🤖 Soy **ErIkA**, tu Asistente de Inteligencia Artificial Oficial de **WP Ecosystem — Walther Parrado**.\n\n¿En cuál de nuestras soluciones o proyectos te gustaría recibir orientación hoy?\n\n• 🎓 **PreICFES App:** Entrenamiento Saber 11 con IA.\n• 🏛️ **FUNDETEC:** Educación técnica & Campus Virtual Q10.\n• 👑 **Jowhalth Academy:** Formación ejecutiva & Liderazgo.\n• 📈 **Rentun Group:** Fintech & Proyectos de Inversión.\n• ⚡ **Walther Parrado:** Consultoría en IA & Software B2B.`
  });
}


