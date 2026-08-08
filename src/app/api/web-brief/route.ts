import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientName,
      company,
      contact,
      contactType,
      projectType,
      selectedFeatures,
      targetAudience,
      designStyle,
      estimatedBudget,
      additionalNotes,
      habeasDataConsent,
    } = body;

    if (!contact || !projectType) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para generar el brief." },
        { status: 400 }
      );
    }

    // AI GROQ BRIEF GENERATOR
    let aiTechnicalBrief = "";
    const groqApiKey = process.env.GROQ_API_KEY;

    if (groqApiKey && !groqApiKey.startsWith("gsk_3l956x2n6U")) {
      try {
        const systemPrompt = `Eres el Arquitecto Principal de Software e IA en J&M Tech Solutions & Walther Parrado.
Tu objetivo es analizar la solicitud del cliente y redactar un **Brief Técnico y Plan de Arquitectura Recomendado** para su proyecto web o SaaS.

Estructura tu análisis en español con markdown impecable y profesional:
1. **Resumen Ejecutivo del Proyecto**
2. **Arquitectura Tecnológica Recomendada** (Frontend, Backend, BD, Infraestructura)
3. **Módulos e Integraciones Clave** (Panel Admin, Chatbot IA, Facturación DIAN, Pasarelas, etc.)
4. **Recomendaciones de Seguridad & Escalabilidad**
5. **Próximos Pasos para la Cotización Formal**`;

        const userPrompt = `Cliente: ${clientName || "Empresa / Emprendedor"} (${company || "N/A"})
Contacto: ${contact} (${contactType || "WhatsApp"})
Tipo de Proyecto: ${projectType}
Módulos Seleccionados: ${Array.isArray(selectedFeatures) ? selectedFeatures.join(", ") : selectedFeatures}
Público Objetivo: ${targetAudience || "General"}
Estilo Visual Deseado: ${designStyle || "Moderno Premium Glassmorphism"}
Presupuesto / Alcance Estimado: ${estimatedBudget || "Por definir"}
Notas Adicionales: ${additionalNotes || "Ninguna"}`;

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.6,
            max_tokens: 1200,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          aiTechnicalBrief = data.choices?.[0]?.message?.content || "";
        }
      } catch (e) {
        console.warn("Groq Brief Generator Error:", e);
      }
    }

    if (!aiTechnicalBrief) {
      aiTechnicalBrief = `### Brief de Arquitectura Técnica — ${projectType}
**Cliente:** ${clientName || "Cliente Corporativo"} (${company || "Empresa"})
**Contacto:** ${contact}
**Módulos:** ${Array.isArray(selectedFeatures) ? selectedFeatures.join(", ") : selectedFeatures}

**Arquitectura Recomendada:**
- **Frontend:** Next.js (App Router), TailwindCSS, TypeScript.
- **Backend & BD:** Supabase (PostgreSQL), Node.js Microservices.
- **Servicios:** Panel Admin CMS, Chatbot IA conversacional, WAF de Ciberseguridad.`;
    }

    const newBrief = {
      id: `brief_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      clientName: clientName || "Cliente Corporativo",
      company: company || "Empresa",
      contact,
      contactType: contactType || "WhatsApp",
      projectType,
      selectedFeatures: selectedFeatures || [],
      targetAudience,
      designStyle,
      estimatedBudget,
      additionalNotes,
      aiTechnicalBrief,
      habeasDataConsent: habeasDataConsent ? "Otorgado (Ley 1581)" : "Pendiente",
      status: "Pendiente Cotización",
      createdAt: new Date().toISOString(),
    };

    // Save into Supabase cms_content (id = 'hub_web_briefs')
    try {
      const { data: existingRecord } = await supabase
        .from("cms_content")
        .select("content")
        .eq("id", "hub_web_briefs")
        .maybeSingle();

      let currentBriefs = existingRecord?.content || [];
      if (!Array.isArray(currentBriefs)) currentBriefs = [];

      currentBriefs.unshift(newBrief);

      await supabase.from("cms_content").upsert({
        id: "hub_web_briefs",
        content: currentBriefs,
        updated_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn("Error guardando brief en Supabase:", dbErr);
    }

    return NextResponse.json({
      success: true,
      brief: newBrief,
    });
  } catch (err: any) {
    console.error("Error procesando brief web:", err);
    return NextResponse.json(
      { error: err.message || "Error al generar brief." },
      { status: 500 }
    );
  }
}
