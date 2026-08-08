'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { REALISTIC_SAMPLE_POSTS, generateRealisticAIImage, sanitizeText } from '@/lib/realisticImages';
import { supabase } from '@/lib/supabase';

const sanitizePostList = (posts: any[]): any[] => {
  if (!Array.isArray(posts)) return [];
  return posts.map((post) => {
    const title = sanitizeText(post.title || '');
    const excerpt = sanitizeText(post.excerpt || '');
    const content = sanitizeText(post.content || '');
    const category = post.category || 'IA & Automatización';
    const image = post.image && !post.image.includes('default') ? post.image : generateRealisticAIImage(title, category);
    return {
      ...post,
      title,
      excerpt,
      content,
      category,
      image
    };
  });
};

const defaultBlogPosts = sanitizePostList(REALISTIC_SAMPLE_POSTS);

export default function BlogContent() {
  const [blogPosts, setBlogPosts] = useState(defaultBlogPosts);
  const [activePost, setActivePost] = useState<any>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSynthesizingAudio, setIsSynthesizingAudio] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioObj) {
        audioObj.pause();
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      }
    };
  }, [audioObj]);

  const handleAudioPlayback = async (post: any) => {
    if (isPlayingAudio) {
      if (audioObj) audioObj.pause();
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsSynthesizingAudio(true);

    const fullSpeechText = `${post.title}. ${post.excerpt}. ${post.content || ''}`.replace(/[*#]/g, '');

    // Intentar sintesis de voz con servidor Edge-TTS
    try {
      const res = await fetch('/api/voice-clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'synthesize_podcast',
          text: fullSpeechText.substring(0, 1500),
          seminarId: post.id || 'blog-audio',
          targetVoice: 'es-CO-GonzaloNeural'
        })
      });

      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        setAudioObj(audio);
        audio.onended = () => setIsPlayingAudio(false);
        await audio.play();
        setIsSynthesizingAudio(false);
        setIsPlayingAudio(true);
        return;
      }
    } catch (e) {
      console.warn('Fallo síntesis del servidor, usando SpeechSynthesis navegador...', e);
    }

    // Fallback nativo navegador
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fullSpeechText.substring(0, 1000));
      utterance.lang = 'es-CO';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsSynthesizingAudio(false);
      setIsPlayingAudio(true);
    } else {
      setIsSynthesizingAudio(false);
    }
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content')
          .eq('id', 'blog_data')
          .single();

        if (data?.content && Array.isArray(data.content)) {
          setBlogPosts(sanitizePostList(data.content));
          return;
        }
      } catch (err) {
        console.warn('Could not load from Supabase, trying localStorage...', err);
      }

      if (typeof window !== 'undefined') {
        const savedBlog = localStorage.getItem('walther_blog_data');
        if (savedBlog) {
          try {
            const parsed = JSON.parse(savedBlog);
            if (Array.isArray(parsed)) {
              setBlogPosts(sanitizePostList(parsed));
            }
          } catch (e) {
            console.error('Error parsing blog data from localStorage', e);
          }
        }
      }
    };

    fetchBlogPosts();
  }, []);

  const getShareUrl = (post: any) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/waltherparrado/blog?post=${encodeURIComponent(post.id || post.title)}`;
    }
    return `https://waltherparrado.com/waltherparrado/blog`;
  };

  const copyToClipboard = (post: any) => {
    const url = getShareUrl(post);
    navigator.clipboard.writeText(url);
    setCopiedPostId(post.id || post.title);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const renderShareBar = (post: any, compact = false) => {
    const shareUrl = getShareUrl(post);
    const shareText = `🚀 ${post.title}\n\n${post.excerpt}`;

    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    const handleInstagramShare = () => {
      copyToClipboard(post);
      window.open('https://www.instagram.com/', '_blank');
    };

    if (compact) {
      return (
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Compartir en LinkedIn"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(10, 102, 194, 0.15)",
              border: "1px solid rgba(10, 102, 194, 0.3)",
              color: "#0a66c2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              textDecoration: "none"
            }}
          >
            in
          </a>
          <a
            href={threadsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Compartir en Threads"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            @
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Compartir en WhatsApp"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(37, 211, 102, 0.15)",
              border: "1px solid rgba(37, 211, 102, 0.3)",
              color: "#25d366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              textDecoration: "none"
            }}
          >
            💬
          </a>
          <button
            onClick={handleInstagramShare}
            title="Compartir en Instagram"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              border: "none",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              cursor: "pointer"
            }}
          >
            📷
          </button>
          <button
            onClick={() => copyToClipboard(post)}
            title="Copiar enlace"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              cursor: "pointer"
            }}
          >
            {copiedPostId === (post.id || post.title) ? '✓' : '🔗'}
          </button>
        </div>
      );
    }

    return (
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
        padding: "1rem 1.25rem",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        margin: "1.5rem 0"
      }}>
        <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: "600", marginRight: "6px" }}>
          Compartir publicación:
        </span>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            background: "#0a66c2",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>in</span> LinkedIn
        </a>
        <a
          href={threadsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            background: "#000000",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>@</span> Threads
        </a>
        <button
          onClick={handleInstagramShare}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>📷</span> Instagram
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            background: "#25d366",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>💬</span> WhatsApp
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            background: "#1d9bf0",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>𝕏</span> X (Twitter)
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            background: "#1877f2",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>f</span> Facebook
        </a>
        <button
          onClick={() => copyToClipboard(post)}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#f8fafc",
            fontSize: "0.8rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          🔗 {copiedPostId === (post.id || post.title) ? '¡Copiado!' : 'Copiar Enlace'}
        </button>
      </div>
    );
  };

  return (
    <section
      id="blog"
      style={{
        padding: "7rem 1.5rem",
        background: "linear-gradient(180deg, #0a0f1e 0%, #0d1530 100%)",
        minHeight: "80vh"
      }}
    >
      {activePost ? (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Back button */}
          <div style={{ marginBottom: "2rem" }}>
            <button 
              onClick={() => {
                setActivePost(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                padding: "0.65rem 1.3rem",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#cbd5e1",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s"
              }}
              className="hover:bg-slate-800"
            >
              ← Volver al Blog
            </button>
          </div>

          {/* Full Article Content */}
          <article className="animate-fade-up" style={{ color: "#cbd5e1" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ 
                fontSize: "0.7rem", 
                fontWeight: "700", 
                padding: "4px 12px", 
                borderRadius: "100px",
                backgroundColor: "rgba(212, 168, 67, 0.1)",
                color: "#d4a843",
                border: "1px solid rgba(212, 168, 67, 0.2)"
              }}>
                {activePost.category}
              </span>
              <span style={{ color: "#64748b", fontSize: "0.8rem" }}>{activePost.date} • Lectura de {activePost.readTime}</span>
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", color: "#f8fafc", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              {activePost.title}
            </h1>

            {/* Author box + Share bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", padding: "1rem 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1e293b", overflow: "hidden", position: "relative" }}>
                  <img
                    src="/foto-de-perfil-de-walther-parrado.webp"
                    alt="Dr. Walther Parrado"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/foto-de-perfil-de-walther-parrado.webp";
                    }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <p style={{ color: "#e2e8f0", fontSize: "0.85rem", fontWeight: "700" }}>Dr. José Walther Parrado Corredor</p>
                  <p style={{ color: "#64748b", fontSize: "0.75rem" }}>Autor & Consultor</p>
                </div>
              </div>

              {/* Share icons on the right of author */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: "600" }}>Compartir:</span>
                {renderShareBar(activePost, true)}
              </div>
            </div>

            {/* AI Audio Player Bar */}
            <div style={{
              margin: "1.5rem 0",
              padding: "1rem 1.25rem",
              borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
              border: "1px solid rgba(212, 168, 67, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={() => handleAudioPlayback(activePost)}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: isPlayingAudio ? "#ef4444" : "linear-gradient(135deg, #d4a843 0%, #b38728 100%)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(212, 168, 67, 0.3)",
                    transition: "all 0.2s"
                  }}
                >
                  {isSynthesizingAudio ? '⏳' : isPlayingAudio ? '⏸' : '▶'}
                </button>
                <div>
                  <p style={{ color: "#f8fafc", fontSize: "0.88rem", fontWeight: "700" }}>
                    {isSynthesizingAudio ? 'Sintetizando locución con voz del Dr. Walther...' : isPlayingAudio ? 'Reproduciendo audio-publicación...' : 'Escuchar Publicación en Audio (Voz de IA)'}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                    Voz oficial en Español de Colombia • {activePost.readTime || '4 min'}
                  </p>
                </div>
              </div>
              <span style={{
                fontSize: "0.7rem",
                fontWeight: "700",
                color: "#d4a843",
                padding: "3px 10px",
                borderRadius: "100px",
                background: "rgba(212, 168, 67, 0.1)",
                border: "1px solid rgba(212, 168, 67, 0.2)"
              }}>
                🎙️ PODCAST HD
              </span>
            </div>

            {/* Article Image */}
            <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "16px", overflow: "hidden", marginBottom: "2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
              <img
                src={activePost.image || '/Portada-colunmnas-2.webp'}
                alt={activePost.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/Portada-colunmnas-2.webp";
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Article Text Paragraphs */}
            <div style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#cbd5e1" }} className="space-y-6">
              {(activePost.content || activePost.excerpt || "")
                .replace(/\\n/g, '\n')
                .replace(/(#{1,6}\s*)/g, '\n\n$1')
                .split(/\n\s*\n/)
                .filter((p: string) => p.trim().length > 0)
                .map((paragraph: string, i: number) => {
                  const cleanText = paragraph.replace(/^#{1,6}\s*/, '').trim();
                  
                  if (/^#{1,6}\s*/.test(paragraph.trim())) {
                    return (
                      <h3 key={i} style={{
                        fontSize: "1.35rem",
                        fontWeight: "800",
                        color: "#d4a843",
                        marginTop: "2rem",
                        marginBottom: "0.75rem",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3
                      }}>
                        {cleanText}
                      </h3>
                    );
                  }

                  return (
                    <p key={i} style={{ marginBottom: "1.2rem", lineHeight: 1.8 }}>
                      {cleanText.split(/(\*\*.*?\*\*)/g).map((part: string, idx: number) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={idx} style={{ color: "#f8fafc", fontWeight: "700" }}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                })}
            </div>

            {/* Social Share Bar Bottom */}
            {renderShareBar(activePost)}

            {/* Sign off / CTA */}
            <div style={{ marginTop: "2.5rem", padding: "2.5rem 2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", textAlign: "center" }}>
              <h4 style={{ color: "#f8fafc", fontWeight: "700", marginBottom: "0.5rem" }}>¿Te interesa profundizar en este tema?</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Agenda una cita de consultoría estratégica y hablemos sobre cómo transformar tu institución educativa.</p>
              <button 
                onClick={() => {
                  const msg = `Hola Dr. Walther Parrado, leí su publicación "${activePost.title}" y me interesa agendar una consultoría estratégica sobre este tema.`;
                  window.open(`https://api.whatsapp.com/send?phone=573000000000&text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="btn-gold" 
                style={{ display: "inline-flex", gap: "8px", alignItems: "center", cursor: "pointer" }}
              >
                💬 Agendar Consultoría por WhatsApp
              </button>
            </div>
          </article>
        </div>
      ) : (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  background: "rgba(212, 168, 67, 0.1)",
                  border: "1px solid rgba(212, 168, 67, 0.25)",
                  borderRadius: "100px",
                  color: "#d4a843",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                }}
              >
                PUBLICACIONES & ARTÍCULOS
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: "800",
                  color: "#f0f4ff",
                }}
              >
                Publicaciones & <span className="gradient-text-gold">Análisis</span>
              </h2>
            </div>
          </div>

          {/* Blog grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {blogPosts.map((post) => (
              <article
                key={post.id}
                id={`blog-card-${post.id}`}
                className="glass-card-hover"
                style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                {/* Cover image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "220px",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: "#0f172a"
                  }}
                >
                  <img
                    src={post.image || generateRealisticAIImage(post.title, post.category)}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.4s ease"
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = generateRealisticAIImage(post.title, post.category);
                    }}
                  />
                  {/* Category badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "4px 12px",
                      background: "rgba(10, 15, 30, 0.85)",
                      border: "1px solid rgba(37, 99, 235, 0.4)",
                      borderRadius: "100px",
                      color: "#93c5fd",
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      letterSpacing: "0.08em",
                      backdropFilter: "blur(8px)",
                      zIndex: 2
                    }}
                  >
                    {post.category}
                  </div>
                  {/* Read time */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 12px",
                      background: "rgba(10, 15, 30, 0.85)",
                      borderRadius: "100px",
                      color: "#94a3b8",
                      fontSize: "0.68rem",
                      backdropFilter: "blur(8px)",
                      zIndex: 2
                    }}
                  >
                    {post.readTime}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem", flex: 1 }}>
                  <p style={{ color: "#475569", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.06em" }}>
                    {post.date}
                  </p>
                  <h3
                    style={{
                      color: "#f0f4ff",
                      fontWeight: "700",
                      fontSize: "1.05rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.7, flex: 1 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <button
                      onClick={() => {
                        setActivePost(post);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="blog-read-link"
                      style={{ 
                        background: "none", 
                        border: "none", 
                        cursor: "pointer", 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        textAlign: "left",
                        padding: 0
                      }}
                    >
                      Leer publicación completa
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>

                    {renderShareBar(post, true)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
