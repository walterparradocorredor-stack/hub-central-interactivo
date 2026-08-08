'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget() {
  const pathname = usePathname();

  // Config state from Supabase CMS
  const [botName, setBotName] = useState('Walpa IA');
  const [botSubtitle, setBotSubtitle] = useState('Dr. Walther Parrado · En línea 24/7');
  const [botGreeting, setBotGreeting] = useState(
    '¡Hola! Soy **Walpa IA**, el asistente inteligente oficial del **Dr. Walther Parrado Corredor**. ¿En qué te puedo ayudar hoy? Puedo resolver tus dudas sobre nuestros seminarios, gestión educativa o guiarte en tus cuestionarios.'
  );
  const [botAvatarUrl, setBotAvatarUrl] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hide widget on admin and standalone form pages
  const shouldHide = pathname?.startsWith('/admin') || pathname?.startsWith('/form');

  // Load config from Supabase on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'ai_chat_config')
          .single();

        if (data?.content) {
          const c = data.content;
          if (c.aiChatName) setBotName(c.aiChatName);
          if (c.aiChatSubtitle) setBotSubtitle(c.aiChatSubtitle);
          if (c.aiChatGreeting) setBotGreeting(c.aiChatGreeting);
          if (c.aiChatAvatarUrl) setBotAvatarUrl(c.aiChatAvatarUrl);
        }
      } catch (err) {
        // Fallback to defaults
      }
    };
    loadConfig();
  }, []);

  // Initialize initial greeting message once config is loaded or default
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: botGreeting,
      },
    ]);
  }, [botGreeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Session ID
  useEffect(() => {
    let sid = sessionStorage.getItem('walther_ai_session_id');
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem('walther_ai_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  if (shouldHide) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const msgsForApi = [...messages, { role: 'user', content: userMessage }].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/qa-bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: msgsForApi,
          session_id: sessionId,
          user_message: userMessage,
        }),
      });

      if (!res.ok) throw new Error('Error de conexión con IA');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Sin cuerpo en respuesta');

      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      let assistantMessage = '';
      let streamBuffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split('\n');
        streamBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ') && trimmed.length > 6) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.t) {
                assistantMessage += data.t;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = assistantMessage;
                  return updated;
                });
              }
            } catch (err) {
              // Ignore invalid chunk parse
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Lo siento, hubo un inconveniente al conectar con el servidor. Por favor, intenta de nuevo o escríbenos directamente a nuestro WhatsApp.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseBold = (text: string, keyPrefix: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      return index % 2 === 1 ? (
        <strong key={`${keyPrefix}-b-${index}`} style={{ color: '#bfac83', fontWeight: 'bold' }}>
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
      if (line.trim() === '') return <div key={lineIdx} style={{ height: '6px' }} />;

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
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  margin: '4px 2px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
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
                style={{
                  color: '#38bdf8',
                  textDecoration: 'underline',
                  fontWeight: '600',
                }}
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
          <li
            key={lineIdx}
            style={{
              marginLeft: '16px',
              marginBottom: '6px',
              listStyleType: 'disc',
              color: '#f4f2ee',
              fontSize: '0.85rem',
              lineHeight: '1.45',
            }}
          >
            {renderInlineElements(rawText)}
          </li>
        );
      }

      return (
        <p key={lineIdx} style={{ margin: '0 0 6px 0', lineHeight: '1.45', color: '#f4f2ee', fontSize: '0.85rem' }}>
          {renderInlineElements(rawText)}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #bfac83, #8a734e)',
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.4)',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), boxShadow 0.3s ease',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label="Abrir asistente de IA"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c2b3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : botAvatarUrl ? (
          <img
            src={botAvatarUrl}
            alt={botName}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1c2b3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          className="walther-ai-chat-window"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '540px',
            maxHeight: 'calc(100vh - 120px)',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #162434, #0b141f)',
            border: '1px solid rgba(191, 172, 131, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(191, 172, 131, 0.1)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-outfit), system-ui, sans-serif',
            animation: 'wpChatSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(191, 172, 131, 0.15)',
              background: 'rgba(22, 36, 52, 0.9)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(191, 172, 131, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(191, 172, 131, 0.35)',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {botAvatarUrl ? (
                  <img src={botAvatarUrl} alt={botName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.4rem' }}>🤖</span>
                )}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', lineHeight: 1.2 }}>
                  {botName}
                </h3>
                <p style={{ margin: 0, color: '#bfac83', fontSize: '0.72rem', fontWeight: '500' }}>{botSubtitle}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(5, 8, 15, 0.4)',
            }}
          >
            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: isAssistant ? 'flex-start' : 'flex-end',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '12px 16px',
                      borderRadius: isAssistant ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                      background: isAssistant
                        ? 'linear-gradient(135deg, rgba(22, 36, 52, 0.9), rgba(11, 20, 31, 0.9))'
                        : 'linear-gradient(135deg, #bfac83, #9e875d)',
                      border: isAssistant ? '1px solid rgba(191, 172, 131, 0.2)' : 'none',
                      color: isAssistant ? '#f4f2ee' : '#0b141f',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    }}
                  >
                    {isAssistant ? (
                      formatMessageContent(msg.content)
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.45', fontWeight: '600' }}>
                        {msg.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(22, 36, 52, 0.9)',
                    border: '1px solid rgba(191, 172, 131, 0.2)',
                    color: '#bfac83',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span className="animate-pulse">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form / Input bar */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '14px',
              borderTop: '1px solid rgba(191, 172, 131, 0.15)',
              background: '#0b141f',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta al Dr. Walther..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                background: 'rgba(22, 36, 52, 0.6)',
                border: '1px solid rgba(191, 172, 131, 0.25)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#bfac83')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(191, 172, 131, 0.25)')}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #bfac83, #8a734e)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: !input.trim() || isLoading ? 0.5 : 1,
                transition: 'all 0.2s',
                outline: 'none',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b141f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Global CSS for Animations & Mobile Responsiveness */}
      <style jsx global>{`
        @keyframes wpChatSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 640px) {
          .walther-ai-chat-window {
            right: 16px !important;
            bottom: 86px !important;
            width: calc(100vw - 32px) !important;
            height: calc(100vh - 110px) !important;
            max-height: 560px !important;
          }
        }
      `}</style>
    </>
  );
}
