'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import NavBar from '../NavBar';
import { Footer } from '../Footer';

export default function AulaVirtualPage() {
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [activeStudentEmail, setActiveStudentEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Classroom data
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [allSeminars, setAllSeminars] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Lesson & Player State
  const [activeBlockIndex, setActiveBlockIndex] = useState<number>(0);
  const [playerMode, setPlayerMode] = useState<'video' | 'audio'>('video');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);

  // Scoped Completed Blocks per Seminar Map: { [seminarId: string]: number[] }
  const [completedBlocksMap, setCompletedBlocksMap] = useState<Record<string, number[]>>({});

  // Interactive AI Assignment Submission State
  const [studentAnswersMap, setStudentAnswersMap] = useState<Record<string, string>>({}); // { "semId_blockIdx": text }
  const [evaluatingBlock, setEvaluatingBlock] = useState<boolean>(false);
  const [evaluationResultsMap, setEvaluationResultsMap] = useState<Record<string, any>>({}); // { "semId_blockIdx": { score, feedback, approved } }

  // Load saved student email & completed blocks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('walther_student_email');
    if (saved && saved.includes('@')) {
      setActiveStudentEmail(saved.trim().toLowerCase());
    }

    const savedProgress = localStorage.getItem('walther_completed_blocks_map');
    if (savedProgress) {
      try {
        setCompletedBlocksMap(JSON.parse(savedProgress));
      } catch (e) {
        console.warn("Could not parse saved progress", e);
      }
    }
    setLoading(false);
  }, []);

  // Load classroom data when activeStudentEmail changes
  useEffect(() => {
    if (!activeStudentEmail) {
      setPurchasedItems([]);
      setSelectedItem(null);
      return;
    }

    const fetchClassroomData = async () => {
      setLoading(true);
      try {
        const { data: cmsData } = await supabase
          .from('cms_content')
          .select('id, content');

        let seminars: any[] = [];
        let courses: any[] = [];

        if (cmsData) {
          const sem = cmsData.find(r => r.id === 'seminars_data');
          if (sem?.content) seminars = sem.content;

          const cour = cmsData.find(r => r.id === 'education_data');
          if (cour?.content) courses = cour.content;
        }

        setAllSeminars(seminars);
        setAllCourses(courses);

        const { data: purchases, error } = await supabase
          .from('purchases')
          .select('*')
          .eq('email', activeStudentEmail.trim().toLowerCase())
          .eq('status', 'approved');

        if (error) throw error;

        const matched: any[] = [];
        purchases?.forEach((p: any) => {
          if (p.item_type === 'seminar' || p.item_type === 'course' || !p.item_type || p.item_id === 'all_seminars') {
            if (p.item_id === 'all_seminars') {
              seminars.forEach(s => {
                if (!matched.some(m => m.id === s.id)) {
                  matched.push({ ...s, purchaseType: 'seminar', transactionId: p.transaction_id });
                }
              });
            } else {
              const foundSem = seminars.find(s => s.id === p.item_id);
              if (foundSem && !matched.some(m => m.id === foundSem.id)) {
                matched.push({ ...foundSem, purchaseType: 'seminar', transactionId: p.transaction_id });
              }
              const foundCour = courses.find(c => c.id === p.item_id);
              if (foundCour && !matched.some(m => m.id === foundCour.id)) {
                matched.push({ ...foundCour, purchaseType: 'course', transactionId: p.transaction_id });
              }
            }
          }
        });

        if (matched.length === 0 && purchases && purchases.length > 0) {
          seminars.forEach(s => {
            matched.push({ ...s, purchaseType: 'seminar' });
          });
        }

        setPurchasedItems(matched);
        if (matched.length > 0) {
          setSelectedItem(matched[0]);
        }
      } catch (err) {
        console.error('Error cargando datos del aula:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [activeStudentEmail]);

  // Sync selected video & audio when active block or selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      const blocks = selectedItem.blocks || selectedItem.modules || [];
      const currentBlock = blocks[activeBlockIndex] || blocks[0];

      if (currentBlock) {
        setSelectedVideo(currentBlock.videoUrl || selectedItem.videoUrl);
        setSelectedAudio(currentBlock.audioUrl || selectedItem.audioUrl || null);
      } else {
        setSelectedVideo(selectedItem.videoUrl);
        setSelectedAudio(selectedItem.audioUrl || null);
      }
    } else {
      setSelectedVideo(null);
      setSelectedAudio(null);
    }
  }, [selectedItem, activeBlockIndex]);

  // Login handler
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setMessage({ text: 'Por favor ingresa un correo electrónico válido.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('email', cleanEmail)
        .eq('status', 'approved');

      if (error) throw error;

      if (data && data.length > 0) {
        localStorage.setItem('walther_student_email', cleanEmail);
        setActiveStudentEmail(cleanEmail);
        setMessage({ text: '¡Bienvenido al Aula Virtual!', type: 'success' });
      } else {
        setMessage({
          text: 'No encontramos un acceso activo registrado con este correo. Si ya te inscribiste en FUNDETEC o adquiriste un seminario, solicita la habilitación a nuestro equipo.',
          type: 'error',
        });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ text: 'Ocurrió un error al verificar tu acceso. Intenta nuevamente.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('walther_student_email');
    setActiveStudentEmail(null);
    setPurchasedItems([]);
    setSelectedItem(null);
    setMessage({ text: 'Has cerrado sesión del Aula Virtual.', type: 'success' });
  };

  // Submit & Evaluate Student Assignment with AI Agent
  const handleEvaluateAssignment = async (blockIdx: number) => {
    if (!selectedItem || !activeStudentEmail) return;

    const semId = selectedItem.id;
    const blocks = selectedItem.blocks || [];
    const currentBlock = blocks[blockIdx];
    const key = `${semId}_${blockIdx}`;
    const studentAnswer = studentAnswersMap[key] || '';

    if (!studentAnswer || studentAnswer.trim().length < 10) {
      alert('Por favor escribe tu propuesta o solución detallada para que la IA la pueda evaluar.');
      return;
    }

    setEvaluatingBlock(true);

    try {
      const res = await fetch('/api/evaluate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentEmail: activeStudentEmail,
          seminarId: semId,
          seminarTitle: selectedItem.title,
          blockNum: currentBlock?.num || `Bloque ${blockIdx + 1}`,
          blockTitle: currentBlock?.title || 'Taller Práctico',
          studentAnswer
        })
      });

      const data = await res.json();
      setEvaluationResultsMap(prev => ({ ...prev, [key]: data }));

      if (data.approved) {
        // Mark block as completed for THIS seminar
        const currentCompleted = completedBlocksMap[semId] || [];
        if (!currentCompleted.includes(blockIdx)) {
          const updatedList = [...currentCompleted, blockIdx];
          const updatedMap = { ...completedBlocksMap, [semId]: updatedList };
          setCompletedBlocksMap(updatedMap);
          localStorage.setItem('walther_completed_blocks_map', JSON.stringify(updatedMap));
        }

        // Advance to next block if available
        if (blockIdx + 1 < blocks.length) {
          setTimeout(() => setActiveBlockIndex(blockIdx + 1), 2000);
        }
      }
    } catch (err: any) {
      alert('Error evaluando respuesta con IA: ' + err.message);
    } finally {
      setEvaluatingBlock(false);
    }
  };

  const getEmbedUrl = (url: string | null | undefined) => {
    if (!url) return null;
    const raw = url.trim();
    if (raw.includes('5f80fbc1401a35565576dfa1c7c1bb48')) return null;

    const vMatch = raw.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${vMatch[1]}?autoplay=0&rel=0`;
    }
    const pathMatch = raw.match(/(?:embed\/|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (pathMatch && pathMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${pathMatch[1]}?autoplay=0&rel=0`;
    }

    if (raw.includes('youtube.com') || raw.includes('youtu.be')) return null;

    const vimeoMatch = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return raw;
  };

  const currentSeminarId = selectedItem?.id || '';
  const currentBlocks = selectedItem?.blocks || [];
  const currentBlock = currentBlocks[activeBlockIndex] || null;
  const seminarCompletedBlocks = completedBlocksMap[currentSeminarId] || [];
  const progressPercent = currentBlocks.length > 0 ? Math.round((seminarCompletedBlocks.length / currentBlocks.length) * 100) : 0;
  const currentKey = `${currentSeminarId}_${activeBlockIndex}`;
  const currentEvalResult = evaluationResultsMap[currentKey] || null;

  return (
    <div className="min-h-screen bg-[#060b13] text-[#f0f4ff] flex flex-col font-sans">
      <NavBar />

      <main className="flex-grow pt-[100px] pb-[80px] px-6 max-w-[1240px] mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
            <p className="text-slate-400 text-sm">Cargando tu aula virtual...</p>
          </div>
        ) : !activeStudentEmail ? (
          /* --- LOGIN FORM --- */
          <div className="max-w-[480px] mx-auto mt-[40px]">
            <div className="bg-[#0d1530]/80 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <span className="text-5xl block">🎓</span>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Ingreso al Aula Virtual</h1>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Ingresa el correo electrónico registrado en <strong>FUNDETEC</strong> o <strong>Jowhalth Academy</strong> para acceder a tus seminarios y clases con IA.
                </p>
              </div>

              {message && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold text-center ${
                    message.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Correo Electrónico del Estudiante
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 flex justify-center items-center cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  ) : (
                    'Ingresar al Aula Virtual ➔'
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
                <p className="text-[11px] text-slate-400">¿Aún no tienes habilitado el acceso?</p>
                <a
                  href="https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20requiero%20habilitar%20mi%20acceso%20al%20Aula%20Virtual."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
                >
                  💬 Solicitar Acceso por WhatsApp con Admisiones
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* --- STUDENT CLASSROOM DASHBOARD --- */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
              {/* Student Profile Card */}
              <div className="bg-[#0d1530]/40 border border-cyan-500/10 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center font-extrabold text-cyan-400 text-sm">
                    {activeStudentEmail.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white text-xs font-bold truncate">{activeStudentEmail}</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Estudiante Acreditado</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs py-2 px-3 rounded-lg transition-all cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>

              {/* My Unlocked Contents */}
              <div className="bg-[#0d1530]/40 border border-cyan-500/10 rounded-xl p-5 backdrop-blur-sm">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Mis Seminarios Habilitados</h3>
                
                {purchasedItems.length === 0 ? (
                  <p className="text-slate-500 text-xs leading-relaxed py-2">
                    No encontramos contenidos asignados a tu cuenta. Contacta a soporte para habilitar tu curso.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {purchasedItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedItem(item);
                          setActiveBlockIndex(0);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 cursor-pointer ${
                          selectedItem?.id === item.id
                            ? 'bg-gradient-to-r from-cyan-500/15 to-transparent border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/5'
                            : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span className="text-xl shrink-0">{item.emoji || '🎓'}</span>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold truncate leading-tight">{item.title}</p>
                          <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-1">
                            Acceso Activo
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress Tracker Scoped to Active Seminar */}
              {selectedItem && (
                <div className="bg-[#0d1530]/40 border border-cyan-500/10 rounded-xl p-5 backdrop-blur-sm space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">Progreso del Seminario</span>
                    <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {seminarCompletedBlocks.length} de {currentBlocks.length} lecciones completadas.
                  </p>
                </div>
              )}
            </div>

            {/* Main Interactive Player & Multi-Lesson Curriculum */}
            <div className="flex-1 min-w-0">
              {selectedItem ? (
                <div className="bg-[#0d1530]/20 border border-cyan-500/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
                  {/* Seminar Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{selectedItem.emoji}</span>
                        <h2 className="text-xl font-extrabold text-white leading-tight">{selectedItem.title}</h2>
                      </div>
                      <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-[650px]">
                        {selectedItem.description}
                      </p>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                      🟢 Docente: Dr. Walther Parrado
                    </span>
                  </div>

                  {/* Mode Selector Tabs: Video HD vs Audio Podcast IA */}
                  <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPlayerMode('video')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          playerMode === 'video'
                            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>📺 Lección en Video HD</span>
                      </button>

                      <button
                        onClick={() => setPlayerMode('audio')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          playerMode === 'audio'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>🎧 Podcast Audio (Voz Dr. Walther)</span>
                      </button>
                    </div>

                    {currentBlock && (
                      <span className="text-[11px] font-mono text-cyan-400 px-3 hidden md:inline-block">
                        {currentBlock.num}: {currentBlock.title}
                      </span>
                    )}
                  </div>

                  {/* Media Player Container */}
                  {playerMode === 'video' ? (
                    selectedVideo ? (
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800/80">
                        {(() => {
                          const embedUrl = getEmbedUrl(selectedVideo);
                          if (embedUrl && (embedUrl.includes('youtube') || embedUrl.includes('vimeo') || embedUrl.endsWith('.mp4') || embedUrl.startsWith('http'))) {
                            if (embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm')) {
                              return (
                                <video
                                  src={embedUrl}
                                  controls
                                  controlsList="nodownload"
                                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                />
                              );
                            }
                            return (
                              <iframe
                                src={embedUrl}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          }

                          return (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
                              <span className="text-4xl mb-2">{selectedItem.emoji || '🎓'}</span>
                              <h4 className="text-white font-bold text-sm mb-1">{selectedItem.title}</h4>
                              <p className="text-slate-400 text-xs">Clase interactiva disponible</p>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 bg-slate-950/40">
                        <span className="text-3xl">🎥</span>
                        <p className="text-slate-500 text-xs">Video disponible próximamente para esta lección.</p>
                      </div>
                    )
                  ) : (
                    /* Audio Podcast Player View */
                    <div className="p-8 bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950 border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-20 h-20 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-4xl shadow-xl shadow-purple-500/10 animate-pulse">
                        🎙️
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">
                          Podcast Académico en Audio · Voz IA Dr. Walther Parrado
                        </span>
                        <h3 className="text-lg font-extrabold text-white">
                          {currentBlock ? `${currentBlock.num}: ${currentBlock.title}` : selectedItem.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-2 max-w-[500px]">
                          {currentBlock?.desc || 'Escucha la explicación magistral en formato podcast en audio de alta fidelidad.'}
                        </p>
                      </div>

                      {selectedAudio ? (
                        <audio controls src={selectedAudio} className="w-full max-w-[600px] rounded-lg shadow-md" />
                      ) : (
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs font-mono">
                          🎧 Audio Podcast de la lección disponible en la app. Escuchando explicación sintetizada.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Multi-Lesson Curriculum Cards Grid */}
                  {currentBlocks.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                          Programa de Lecciones del Seminario ({currentBlocks.length} Módulos)
                        </h3>
                        <span className="text-[11px] text-slate-500">Selecciona para avanzar</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentBlocks.map((blk: any, idx: number) => {
                          const isCurrent = activeBlockIndex === idx;
                          const isDone = seminarCompletedBlocks.includes(idx);

                          return (
                            <div
                              key={idx}
                              onClick={() => setActiveBlockIndex(idx)}
                              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                                isCurrent
                                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                                  : isDone
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                  isCurrent ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {blk.num || `Lección ${idx + 1}`}
                                </span>
                                {isDone && (
                                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                                    ✓ Completada
                                  </span>
                                )}
                              </div>

                              <h4 className="text-xs font-bold text-white leading-tight">{blk.title}</h4>
                              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{blk.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Interactive AI Assignment Evaluation Workshop */}
                  {currentBlock && (
                    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🤖</span>
                          <div>
                            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                              Taller Práctico Evaluado por Agente IA ({currentBlock.num})
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Resuelve el desafío técnico de esta lección para obtener la aprobación en tiempo real de nuestro Tutor IA.
                            </p>
                          </div>
                        </div>
                        {seminarCompletedBlocks.includes(activeBlockIndex) && (
                          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                            ✓ Módulo Aprobado
                          </span>
                        )}
                      </div>

                      {/* Prompt Challenge for Student */}
                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300">
                        <span className="font-bold text-white block">📌 Desafío de la Lección:</span>
                        <p className="leading-relaxed text-slate-300">
                          Para completar <strong>{currentBlock.title}</strong>, redacta tu propuesta o solución aplicando lo aprendido: {currentBlock.desc}
                        </p>
                      </div>

                      {/* Student Response Text Area */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Escribe tu Respuesta / Entrega del Trabajo:
                        </label>
                        <textarea
                          rows={4}
                          value={studentAnswersMap[currentKey] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStudentAnswersMap(prev => ({ ...prev, [currentKey]: val }));
                          }}
                          placeholder="Escribe aquí tu solución o desarrollo del taller para evaluación..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all font-sans"
                        />
                      </div>

                      {/* AI Evaluation Live Feedback Card */}
                      {currentEvalResult && (
                        <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                          currentEvalResult.approved
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                        }`}>
                          <div className="flex justify-between items-center font-bold">
                            <span>
                              {currentEvalResult.approved ? '🎉 ¡Trabajo Aprobado por el Tutor IA!' : '⚠️ Trabajo Requiere Correcciones'}
                            </span>
                            <span className="text-sm font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                              Calificación: {currentEvalResult.score} / 100
                            </span>
                          </div>
                          <p className="leading-relaxed text-slate-200">{currentEvalResult.feedback}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        onClick={() => handleEvaluateAssignment(activeBlockIndex)}
                        disabled={evaluatingBlock}
                        className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 flex justify-center items-center gap-2 cursor-pointer"
                      >
                        {evaluatingBlock ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                            <span>Agente IA Evaluando tu Trabajo en Vivo...</span>
                          </div>
                        ) : (
                          <span>🤖 Enviar Trabajo a Evaluación de Agente IA & Aprobar Lección ➔</span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Materials & Support */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">🎓 Actividad de Certificación</h4>
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedItem.activities || 'Envía tus evidencias al correo Virtualidad@fundetec.edu.co para expedir tu certificado oficial.'}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 flex-1">
                        <h4 className="text-xs font-bold text-[#d4a843] uppercase tracking-wider mb-3">📁 Material de Descarga</h4>
                        {selectedItem.presentationUrl && (
                          <a
                            href={selectedItem.presentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-semibold no-underline"
                          >
                            <span>📄 Descargar Diapositivas en PDF</span>
                            <span className="text-[#d4a843]">Descargar ➔</span>
                          </a>
                        )}
                      </div>

                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">💬 Soporte Académico</h4>
                        <a
                          href="https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20tengo%20una%20consulta%20sobre%20el%20Aula%20Virtual."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all no-underline block"
                        >
                          Escribir al Tutor por WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0d1530]/20 border border-cyan-500/5 rounded-2xl p-12 text-center backdrop-blur-md shadow-xl flex flex-col items-center justify-center min-h-[400px]">
                  <span className="text-5xl mb-4">🎓</span>
                  <h2 className="text-xl font-extrabold text-white mb-2">Bienvenido a Jowhalth Academy</h2>
                  <p className="text-slate-400 text-xs max-w-[340px] leading-relaxed">
                    Selecciona un programa del menú izquierdo para comenzar tu aprendizaje.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
