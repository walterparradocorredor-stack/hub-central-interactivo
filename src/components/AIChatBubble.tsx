"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User, RefreshCw } from "lucide-react";

export default function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: '¡Hola! 🤖 Soy ErIkA, tu Asistente de Inteligencia Artificial Oficial de WP Ecosystem — Walther Parrado. Orientamos e impulsamos la tecnología de nuestras empresas líderes. ¿En cuál proyecto te gustaría recibir información hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const sendQueryText = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: userText.trim() }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Disculpa, tuve una breve interrupción de conexión. Puedes escribirnos directamente a Virtualidad@fundetec.edu.co para recibir atención personalizada.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    await sendQueryText(text);
  };

  const parseBold = (text: string, keyPrefix: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      return index % 2 === 1 ? (
        <strong key={`${keyPrefix}-b-${index}`} className="text-cyan-300 font-bold">
          {part}
        </strong>
      ) : (
        part
      );
    });
  };

  const formatMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    return content.split('\n').map((line, lineIdx) => {
      if (line.trim() === '') return <div key={lineIdx} className="h-1.5" />;

      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const rawText = isBullet ? line.replace(/^[-*]\s+/, '') : line;

      const renderInlineElements = (text: string) => {
        const elements: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;

        linkRegex.lastIndex = 0;
        while ((match = linkRegex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            elements.push(parseBold(text.substring(lastIndex, match.index), `text-${lineIdx}-${lastIndex}`));
          }

          const linkText = match[1];
          let linkUrl = match[2];

          linkUrl = linkUrl.replace(/^https?:\/\/localhost:\d+/i, '');

          const isActionBtn =
            linkText.includes('Cotiz') ||
            linkText.includes('Simulador') ||
            linkText.includes('Seminari') ||
            linkText.includes('WhatsApp') ||
            linkText.includes('Abrir') ||
            linkText.includes('Probar') ||
            linkText.includes('Ver');

          if (isActionBtn) {
            elements.push(
              <a
                key={`btn-${lineIdx}-${match.index}`}
                href={linkUrl}
                target={linkUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 my-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-[11px] no-underline shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
              >
                {linkText}
              </a>
            );
          } else {
            elements.push(
              <a
                key={`link-${lineIdx}-${match.index}`}
                href={linkUrl}
                target={linkUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="text-cyan-400 underline font-semibold"
              >
                {linkText}
              </a>
            );
          }

          lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
          elements.push(parseBold(text.substring(lastIndex), `text-${lineIdx}-${lastIndex}`));
        }

        return elements;
      };

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-4 mb-1 list-disc text-gray-200 text-xs leading-relaxed">
            {renderInlineElements(rawText)}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="mb-1 text-gray-200 text-xs leading-relaxed">
          {renderInlineElements(rawText)}
        </p>
      );
    });
  };

  const handleChipClick = async (chipLabel: string) => {
    if (loading) return;
    const promptText = `Cuéntame más sobre ${chipLabel}`;
    await sendQueryText(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer border border-white/20"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300"></span>
          </span>
          <Bot className="w-5 h-5 animate-bounce" />
          <span className="text-xs md:text-sm font-bold tracking-wide">Agente IA Atiende</span>
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[520px] bg-slate-950/95 border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-purple-900/90 p-4 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">ErIA - Agente de Soporte</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    En Vivo
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Asesoría Tecnológica & Proyectos</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gradient-to-tr from-indigo-500 to-cyan-400 text-slate-950'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none whitespace-pre-wrap'
                      : 'bg-slate-900 border border-indigo-500/20 text-gray-200 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.role === 'user' ? msg.content : formatMessageContent(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-900/60 p-3 rounded-2xl border border-indigo-500/10 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ErIA está procesando tu respuesta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick options */}
          <div className="px-4 py-2 bg-slate-900/40 border-t border-indigo-500/10 flex flex-wrap gap-1.5">
            {[
              "🎓 PreICFES App",
              "🏛️ Fundetec",
              "👑 Jowhalth",
              "⚡ Consultoría IA",
              "📍 Ubicación"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip)}
                className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/20 transition-all cursor-pointer hover:border-indigo-400"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-indigo-500/20 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta tecnológica..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
