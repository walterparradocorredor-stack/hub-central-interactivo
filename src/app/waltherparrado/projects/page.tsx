'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import projectsData from '../../../data/projects.json';
import NavBar from '../NavBar';


interface Project {
  id: string;
  title: string;
  description: string;
  extendedDescription: string;
  category: string;
  stack: string[];
  githubUrl: string;
  demoUrl?: string;
  author: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ProjectsExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [selectedStack, setSelectedStack] = useState<string | null>(null);
  
  // Selected project for modal
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  // Local Config States (Read from localStorage on client)
  const [githubUser, setGithubUser] = useState('');
  const [groqKey, setGroqKey] = useState('');

  // AI Chat & Analysis States
  const [analysisText, setAnalysisText] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [isSendingQuery, setIsSendingQuery] = useState(false);
  const [aiError, setAiError] = useState('');

  // Projects state initialized with local fallback
  const [projects, setProjects] = useState<Project[]>(projectsData as Project[]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Load configuration and projects on mount
  useEffect(() => {
    async function loadDynamicProjects() {
      try {
        const res = await fetch('/api/upload?type=cms_content&id=projects_data');
        if (res.ok) {
          const data = await res.json();
          if (data?.content && Array.isArray(data.content) && data.content.length > 0) {
            setProjects(data.content);
          }
        }
      } catch (err) {
        console.warn('Using fallback local projects:', err);
      } finally {
        setIsLoadingProjects(false);
      }
    }

    if (typeof window !== 'undefined') {
      setGithubUser(localStorage.getItem('walther_github_user') || '');
      setGroqKey(localStorage.getItem('walther_groq_key') || '');
    }
    loadDynamicProjects();
  }, []);

  // Reset chat states when modal project changes
  useEffect(() => {
    setAnalysisText('');
    setChatHistory([]);
    setAiError('');
    setUserQuery('');
  }, [activeProject]);

  // Get all unique categories
  const categories = useMemo(() => {
    const cats = projects.map((p) => p.category.toUpperCase());
    return ['TODAS', ...Array.from(new Set(cats))];
  }, [projects]);

  // Get all unique stacks/technologies
  const allStacks = useMemo(() => {
    const stacks = projects.flatMap((p) => p.stack);
    return Array.from(new Set(stacks)).sort();
  }, [projects]);

  // Filter projects based on search, category and stack
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.extendedDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.stack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'TODAS' ||
        project.category.toUpperCase() === selectedCategory;

      const matchesStack =
        !selectedStack || project.stack.includes(selectedStack);

      return matchesSearch && matchesCategory && matchesStack;
    });
  }, [projects, searchQuery, selectedCategory, selectedStack]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('TODAS');
    setSelectedStack(null);
  };

  // Helper to dynamically rewrite the GitHub URL if a custom user is configured
  const getRewrittenGithubUrl = (url: string) => {
    const targetUser = githubUser || 'walterparradocorredor-stack';
    // Replace madfer93 (source profile) with Walther's configured profile dynamically
    return url.replace('madfer93', targetUser);
  };

  // Trigger structured AI analysis
  const handleAnalyzeWithAI = async () => {
    if (!activeProject) return;

    setIsLoadingAnalysis(true);
    setAiError('');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (groqKey) {
        headers['Authorization'] = `Bearer ${groqKey}`;
      }

      const res = await fetch('/api/projects/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          projectTitle: activeProject.title,
          projectDescription: activeProject.description,
          projectExtendedDescription: activeProject.extendedDescription,
          projectStack: activeProject.stack,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener análisis de la IA.');
      }

      setAnalysisText(data.reply);
      // Initialize chat history with the analysis prompt/reply
      setChatHistory([
        { role: 'user', content: 'Genera un análisis técnico estructurado de este proyecto.' },
        { role: 'assistant', content: data.reply },
      ]);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Send a custom message in the chat
  const handleSendChatQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !userQuery.trim() || isSendingQuery) return;

    const currentQuery = userQuery;
    setUserQuery('');
    setAiError('');
    setIsSendingQuery(true);

    // Optimistically update frontend history
    const updatedHistory = [...chatHistory, { role: 'user' as const, content: currentQuery }];
    setChatHistory(updatedHistory);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (groqKey) {
        headers['Authorization'] = `Bearer ${groqKey}`;
      }

      const res = await fetch('/api/projects/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          projectTitle: activeProject.title,
          projectDescription: activeProject.description,
          projectExtendedDescription: activeProject.extendedDescription,
          projectStack: activeProject.stack,
          chatHistory: chatHistory, // Send previous history
          userMessage: currentQuery, // Send new query
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener respuesta de la IA.');
      }

      setChatHistory([...updatedHistory, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Ocurrió un error al enviar el mensaje.');
      // Remove the user's query from history on failure to keep consistency
      setChatHistory(chatHistory);
      setUserQuery(currentQuery); // Restore query input
    } finally {
      setIsSendingQuery(false);
    }
  };

  return (
    <main
      className="noise-overlay min-h-screen text-white relative"
      style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1530 50%, #0a0f1e 100%)',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* Dynamic Background Glows */}
      <div
        className="absolute top-[10%] left-[5%] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
          width: '500px',
          height: '500px',
        }}
      />
      <div
        className="absolute bottom-[20%] right-[5%] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 168, 67, 0.04) 0%, transparent 70%)',
          width: '500px',
          height: '500px',
        }}
      />

      {/* NAVBAR */}
      <NavBar />

      {/* HEADER SECTION */}
      <section className="pt-[140px] pb-[40px] px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto text-center space-y-4">
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: '100px',
              color: '#93c5fd',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.12em',
            }}
          >
            PROJECTS.MATRIX
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            PROJECTS <span className="gradient-text-blue">EXPLORER</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Explora {projects.length} guías y plantillas base de miniproyectos de código abierto. Filtra por stack o categoría, y chatea con la IA para analizarlos.
          </p>
        </div>
      </section>

      {/* EXPLORER INTERFACE */}
      <section className="pb-[100px] px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto space-y-8">
          {/* Controls Bar: Search & Categories */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">▶</span>
              <input
                type="text"
                placeholder="Buscar por IA, guías, plantillas, ciberseguridad, stacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm font-mono text-cyan-400 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white transition-colors"
                >
                  [BORRAR]
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Categoría:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedStack(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stack Tags */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Filtrar por Stack:</p>
              <div className="flex flex-wrap gap-1.5">
                {allStacks.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setSelectedStack(selectedStack === tech ? null : tech)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-mono transition-all border ${
                      selectedStack === tech
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/5'
                        : 'bg-slate-950/40 border-slate-900 text-gray-500 hover:border-slate-800 hover:text-gray-300'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Summary & Reset */}
            {(searchQuery || selectedCategory !== 'TODAS' || selectedStack) && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-900 text-xs">
                <p className="text-gray-400">
                  Mostrando <strong className="text-cyan-400 font-mono">{filteredProjects.length}</strong> resultados
                </p>
                <button
                  onClick={handleResetFilters}
                  className="text-amber-500 hover:text-amber-400 font-bold hover:underline transition-colors"
                >
                  [Restablecer Filtros]
                </button>
              </div>
            )}
          </div>

          {/* Grid Layout */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="glass-card-hover flex flex-col justify-between overflow-hidden relative group p-6"
                  style={{ minHeight: '260px' }}
                >
                  {/* Category & Author Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] tracking-wider px-2 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-gray-400 group-hover:text-blue-400 transition-colors">
                      {project.category}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold font-mono">
                      @{githubUser || 'walterparradocorredor-stack'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Footer (Stack & Action) */}
                  <div className="mt-6 pt-4 border-t border-slate-900/60 space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-950/80 text-gray-500 border border-slate-900"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 3 && (
                        <span className="text-[9px] font-mono text-gray-600 pl-1">
                          +{project.stack.length - 3} más
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveProject(project)}
                      className="w-full text-center py-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-300 hover:text-cyan-400 transition-all border border-slate-900 hover:border-cyan-500/20"
                    >
                      Analizar con IA / Código
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center space-y-4 max-w-lg mx-auto">
              <span className="text-3xl">🔍</span>
              <h3 className="text-lg font-bold text-white">No se encontraron proyectos</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No hay resultados que coincidan con tu búsqueda actual. Prueba buscando otro término o de restablecer los filtros.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-primary text-xs"
                style={{ padding: '8px 16px' }}
              >
                Restablecer Filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="relative z-10 py-10 px-6"
        style={{
          background: '#080c18',
          borderTop: '1px solid rgba(37, 99, 235, 0.1)',
        }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-white font-bold text-sm">Dr. José Walther Parrado Corredor</p>
            <p className="text-gray-600 text-xs mt-1">Ecosistema Digital · Bogotá, Colombia</p>
          </div>
          <div className="flex flex-wrap gap-6 items-center text-xs">
            <Link href="/" className="footer-link-item">
              Inicio
            </Link>
            <span className="text-slate-800">·</span>
            <Link href="/#contacto" className="footer-link-item">
              Contacto
            </Link>
            <span className="text-slate-800">·</span>
            <p className="text-gray-600">
              © {new Date().getFullYear()} Walther Parrado. Desarrollado por{' '}
              <a
                href="https://www.jymtechsolutions.online/es"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                J&M Tech Solutions
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* EXPANDED PROJECT MODAL (AI CONVERSATIONAL DETAIL) */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="glass-card w-full max-w-3xl overflow-hidden relative border-blue-500/30 shadow-2xl shadow-blue-900/30 my-8">
            {/* Colored top line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-500" />

            {/* Modal Header */}
            <div className="p-6 md:p-8 pb-4 flex justify-between items-start border-b border-slate-900/60 bg-slate-950/20">
              <div>
                <span className="text-[10px] tracking-widest px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 font-bold text-blue-400 uppercase font-mono">
                  {activeProject.category}
                </span>
                <h2 className="text-2xl font-black mt-3 text-slate-100">{activeProject.title}</h2>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  Propietario de Fork: <span className="text-cyan-400 font-semibold">@{githubUser || 'walterparradocorredor-stack'}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1 text-gray-500 hover:text-white font-bold transition-colors text-sm font-mono focus:outline-none"
              >
                [CERRAR ✕]
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
              {/* Project description */}
              <div className="space-y-2">
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">&gt; DESCRIPCIÓN:</p>
                <p className="text-slate-300 text-sm leading-relaxed">{activeProject.description}</p>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">&gt; STACK TECNOLÓGICO:</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-950 text-gray-400 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Analysis Interface */}
              <div className="space-y-4 pt-4 border-t border-slate-900/60">
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold flex justify-between items-center">
                  <span>&gt; ANÁLISIS IA CONVERSACIONAL:</span>
                  {groqKey ? (
                    <span className="text-[9px] text-emerald-400 font-semibold font-mono">● VIA GROQ (CMS KEY)</span>
                  ) : (
                    <span className="text-[9px] text-amber-500 font-semibold font-mono">● VIA GROQ (BACKUP KEY)</span>
                  )}
                </p>

                {/* Analysis Box */}
                {!analysisText && !isLoadingAnalysis && (
                  <button
                    onClick={handleAnalyzeWithAI}
                    className="w-full py-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 rounded-xl text-xs font-black text-blue-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/5"
                  >
                    <span>▶</span> ANALIZAR CON INTELIGENCIA ARTIFICIAL
                  </button>
                )}

                {/* Loading State */}
                {isLoadingAnalysis && (
                  <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-8 flex flex-col items-center justify-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-t-cyan-400 border-slate-800 animate-spin" />
                    <p className="text-[11px] font-mono text-cyan-400 animate-pulse">Llamando a Groq y analizando la plantilla...</p>
                  </div>
                )}

                {/* Error Message */}
                {aiError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-xs font-mono">
                    ⚠️ Error: {aiError}
                  </div>
                )}

                {/* Analysis Rendered Output */}
                {analysisText && (
                  <div className="space-y-4">
                    <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-5 text-sm leading-relaxed text-gray-300 font-mono space-y-4 overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin">
                      <div className="whitespace-pre-wrap font-sans text-xs md:text-sm text-slate-300">
                        {analysisText}
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="space-y-3">
                      <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider font-bold">Hacer pregunta de seguimiento:</p>
                      
                      {/* Chat History */}
                      {chatHistory.length > 2 && (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs">
                          {chatHistory.slice(2).map((msg, index) => (
                            <div key={index} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] text-gray-500 font-mono">
                                {msg.role === 'user' ? '@tú' : '@ia'}
                              </span>
                              <div
                                className={`px-3 py-2 rounded-lg max-w-[85%] leading-relaxed ${
                                  msg.role === 'user'
                                    ? 'bg-blue-600/20 text-blue-200 border border-blue-500/20'
                                    : 'bg-slate-900/60 text-slate-300 border border-slate-800'
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          ))}
                          {isSendingQuery && (
                            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                              IA está respondiendo...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Chat Input Field */}
                      <form onSubmit={handleSendChatQuery} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Pregúntale a la IA sobre este repositorio base..."
                          value={userQuery}
                          onChange={(e) => setUserQuery(e.target.value)}
                          disabled={isSendingQuery}
                          className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono"
                        />
                        <button
                          type="submit"
                          disabled={!userQuery.trim() || isSendingQuery}
                          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-900 text-white disabled:text-gray-600 font-mono text-xs font-bold transition-all border border-blue-500/20 cursor-pointer"
                        >
                          PREGUNTAR
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 md:p-8 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row justify-end gap-3 bg-slate-950/20">
              {activeProject.demoUrl && (
                <a
                  href={activeProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-center text-xs"
                  style={{ padding: '10px 20px' }}
                >
                  Ver en Vivo
                </a>
              )}
              <a
                href={getRewrittenGithubUrl(activeProject.githubUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-center text-xs"
                style={{ padding: '10px 24px' }}
              >
                Código Fuente
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
