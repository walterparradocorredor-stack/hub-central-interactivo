'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, CheckCircle2, XCircle, ShieldCheck, Globe, Server, ArrowRight, Sparkles, RefreshCw, ShoppingCart, Lock, Mail, Bot, CreditCard, Send, ArrowRightLeft, Gauge, Calculator, Download, Check } from 'lucide-react';
import { RESELLER_SERVICES } from '@/lib/servicesCatalog';

interface DomainCheckResult {
  domain: string;
  tld: string;
  available: boolean;
  isPremium: boolean;
  priceUsd: number;
  priceCop: number;
  currency: string;
}

interface AISuggestion {
  name: string;
  tld: string;
  fullDomain: string;
  reason: string;
  available: boolean;
  priceCop: number;
}

interface WhoisData {
  domain: string;
  aRecords: string[];
  mxRecords: Array<{ exchange: string; priority: number }>;
  txtRecords: string[];
  nsRecords: string[];
}

interface SpeedTestData {
  url: string;
  isHttps: boolean;
  responseTimeMs: number;
  speedRating: string;
  speedScore: number;
  recommendation: string;
}

const FEATURED_TLDS = [
  { tld: '.com', priceCop: 49900, originalPriceCop: 69900, priceUsd: 14.99, originalPriceUsd: 19.99, discount: '28% OFF', label: 'Estándar Global', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { tld: '.co', priceCop: 54900, originalPriceCop: 79900, priceUsd: 16.99, originalPriceUsd: 24.99, discount: '31% OFF', label: 'Marca Colombia', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { tld: '.online', priceCop: 14900, originalPriceCop: 39900, priceUsd: 4.99, originalPriceUsd: 14.99, discount: '62% OFF', label: 'Oferta Especial', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { tld: '.tech', priceCop: 18900, originalPriceCop: 49900, priceUsd: 5.99, originalPriceUsd: 19.99, discount: '62% OFF', label: 'Para Startups', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { tld: '.store', priceCop: 14900, originalPriceCop: 39900, priceUsd: 4.99, originalPriceUsd: 14.99, discount: '62% OFF', label: 'Tiendas & E-commerce', badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  { tld: '.net', priceCop: 59900, originalPriceCop: 84900, priceUsd: 17.99, originalPriceUsd: 24.99, discount: '29% OFF', label: 'Redes & SaaS', badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { tld: '.org', priceCop: 64900, originalPriceCop: 89900, priceUsd: 18.99, originalPriceUsd: 25.99, discount: '28% OFF', label: 'Organizaciones', badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
  { tld: '.site', priceCop: 12900, originalPriceCop: 34900, priceUsd: 3.99, originalPriceUsd: 11.99, discount: '63% OFF', label: 'Sitios Modernos', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { tld: '.io', priceCop: 149900, originalPriceCop: 199900, priceUsd: 49.99, originalPriceUsd: 64.99, discount: '25% OFF', label: 'Tech Enterprise', badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
  { tld: '.ai', priceCop: 299900, originalPriceCop: 389900, priceUsd: 99.99, originalPriceUsd: 129.99, discount: '23% OFF', label: 'Inteligencia Artificial', badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' }
];

export default function DominiosPage() {
  const [activeTab, setActiveTab] = useState<'dominios' | 'combo' | 'speed' | 'subdomain' | 'whois' | 'transfer' | 'ai-generator' | 'agent' | 'email' | 'hosting' | 'ssl'>('dominios');

  // Buscador de dominios
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [primaryResult, setPrimaryResult] = useState<DomainCheckResult | null>(null);
  const [suggestions, setSuggestions] = useState<DomainCheckResult[]>([]);

  // Combo Builder state
  const [comboDomain, setComboDomain] = useState(true);
  const [comboEmail, setComboEmail] = useState(true);
  const [comboSsl, setComboSsl] = useState(true);
  const [comboHosting, setComboHosting] = useState(false);

  // Speed Test state
  const [speedUrl, setSpeedUrl] = useState('');
  const [speedLoading, setSpeedLoading] = useState(false);
  const [speedData, setSpeedData] = useState<SpeedTestData | null>(null);

  // Subdomain state
  const [subName, setSubName] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subResult, setSubResult] = useState<any>(null);

  // Auditoría WHOIS
  const [whoisQuery, setWhoisQuery] = useState('');
  const [whoisLoading, setWhoisLoading] = useState(false);
  const [whoisData, setWhoisData] = useState<WhoisData | null>(null);

  // Transferencia de dominios
  const [transferDomain, setTransferDomain] = useState('');
  const [authCode, setAuthCode] = useState('');

  // Generador de IA
  const [businessIdea, setBusinessIdea] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);

  // Chat Conversacional con Agente DominIA
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    { sender: 'agent', text: '¡Hola! Soy DominIA, tu asistente experto en dominios, marcas, pasarela Wompi y configuración de registros DNS en el servidor VPS. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [agentTyping, setAgentTyping] = useState(false);

  // Wompi Checkout Modal
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutServiceTitle, setCheckoutServiceTitle] = useState('');
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [checkoutDomain, setCheckoutDomain] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setPrimaryResult(null);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/dominios/check?domain=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'No se pudo consultar la API de Namecheap');

      setPrimaryResult(data.primaryResult);
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al consultar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeedTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speedUrl.trim()) return;

    setSpeedLoading(true);
    setSpeedData(null);

    try {
      const res = await fetch(`/api/dominios/speed-test?url=${encodeURIComponent(speedUrl.trim())}`);
      const data = await res.json();
      setSpeedData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSpeedLoading(false);
    }
  };

  const handleCreateSubdomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    setSubLoading(true);
    setSubResult(null);

    try {
      const res = await fetch('/api/dominios/subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subName })
      });
      const data = await res.json();
      setSubResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleWhoisAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whoisQuery.trim()) return;

    setWhoisLoading(true);
    setWhoisData(null);

    try {
      const res = await fetch(`/api/dominios/whois?domain=${encodeURIComponent(whoisQuery.trim())}`);
      const data = await res.json();
      setWhoisData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setWhoisLoading(false);
    }
  };

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessIdea.trim()) return;

    setAiLoading(true);
    setAiSuggestions([]);

    try {
      const res = await fetch('/api/dominios/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: businessIdea })
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendAgentMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAgentTyping(true);

    try {
      const res = await fetch('/api/dominios/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: chatMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })) })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'agent', text: data.reply || '¡Con gusto te asesoro! ¿Qué otra duda tienes?' }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'agent', text: '¡Con gusto! Puedes consultar disponibilidad o contratar servicios en las pestañas arriba.' }]);
    } finally {
      setAgentTyping(false);
    }
  };

  const handleInitiateWompi = async (title: string, amount: number, domain: string = '') => {
    setCheckoutServiceTitle(title);
    setCheckoutAmount(amount);
    setCheckoutDomain(domain);
    setCheckoutModalOpen(true);
  };

  const handleOrderWhatsApp = (title: string, amount: number, domain: string = '') => {
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573017640850';
    const text = `¡Hola Walther Parrado! 👋 Deseo contratar el servicio *${title}* ${domain ? `para el dominio *${domain}*` : ''} por un valor de *$${amount.toLocaleString('es-CO')} COP*. ¿Me ayudan con la activación?`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadInvoicePdf = () => {
    const invoiceContent = `COTIZACIÓN OFICIAL DE SERVICIOS WEB\n===================================\nWP Ecosystem / Hub Central Interactivo\nFecha: ${new Date().toLocaleDateString('es-CO')}\n\nServicio: ${checkoutServiceTitle}\nDominio: ${checkoutDomain || 'N/A'}\nTotal a Pagar: ${formatCop(checkoutAmount)}\n\nMétodos de Pago: Wompi (PSE, Nequi, Tarjetas) / WhatsApp +57 301 764 0850\nGracias por confiar en WP Ecosystem.`;
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cotizacion_${checkoutServiceTitle.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
  };

  const formatCop = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
  };

  // Cálculo de Combo Builder
  const rawComboTotal = (comboDomain ? 49900 : 0) + (comboEmail ? 69900 : 0) + (comboSsl ? 39900 : 0) + (comboHosting ? 139900 : 0);
  const comboDiscount = Math.round(rawComboTotal * 0.15);
  const finalComboTotal = rawComboTotal - comboDiscount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-24">
      {/* Background Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Navigation Breadcrumb & Account link */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
            ← Volver al Hub Central
          </Link>

          <Link
            href="/panel/dominios"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-lg"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Mi Panel de Usuario
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Infraestructura Cloud & Registro de Dominios WP Ecosystem
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Servicios Web, Dominios y <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Certificados SSL</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Registra tu marca, configura correos corporativos y protege tu sitio con el respaldo de la Infraestructura Cloud VPS de WP Ecosystem.
          </p>
        </div>

        {/* Tab Navigation (Responsive without scrollbars) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-5xl mx-auto px-2">
          <button
            onClick={() => setActiveTab('dominios')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'dominios'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Globe className="w-4 h-4" />
            Buscador
          </button>

          <button
            onClick={() => setActiveTab('combo')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'combo'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Calculator className="w-4 h-4" />
            Calculadora Combo (15% OFF)
          </button>

          <button
            onClick={() => setActiveTab('speed')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'speed'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md border border-rose-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Gauge className="w-4 h-4" />
            Test de Velocidad
          </button>

          <button
            onClick={() => setActiveTab('subdomain')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'subdomain'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md border border-violet-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Server className="w-4 h-4" />
            Subdominios Gratis
          </button>

          <button
            onClick={() => setActiveTab('whois')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'whois'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md border border-amber-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Search className="w-4 h-4" />
            Auditoría DNS
          </button>

          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'transfer'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md border border-cyan-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Transferir
          </button>

          <button
            onClick={() => setActiveTab('ai-generator')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'ai-generator'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Bot className="w-4 h-4" />
            Generador IA
          </button>

          <button
            onClick={() => setActiveTab('agent')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'agent'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md border border-indigo-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Bot className="w-4 h-4 text-indigo-300" />
            Asistente IA
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'email'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Mail className="w-4 h-4" />
            Correos
          </button>

          <button
            onClick={() => setActiveTab('ssl')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'ssl'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Lock className="w-4 h-4" />
            SSL Pro
          </button>

          <button
            onClick={() => setActiveTab('hosting')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'hosting'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md border border-indigo-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Server className="w-4 h-4" />
            Hosting
          </button>
        </div>

        {/* TAB 1: BUSCADOR DE DOMINIOS */}
        {activeTab === 'dominios' && (
          <div>
            <div className="max-w-2xl mx-auto mb-10">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-6 h-6 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Busca tu dominio (ej: miempresa, miempresa.com)..."
                    className="w-full pl-13 pr-36 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white placeholder-slate-500 text-lg shadow-2xl backdrop-blur-xl outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading || !searchTerm.trim()}
                    className="absolute right-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Buscar'}
                  </button>
                </div>
              </form>
            </div>

            {/* Resultado Principal */}
            {primaryResult && (
              <div className="max-w-3xl mx-auto mb-12 space-y-8">
                <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all shadow-2xl ${primaryResult.available ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'
                  }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {primaryResult.available ? <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" /> : <XCircle className="w-8 h-8 text-red-400 shrink-0" />}
                      <div>
                        <h3 className="text-2xl font-bold text-white">{primaryResult.domain}</h3>
                        <p className={`text-sm font-medium ${primaryResult.available ? 'text-emerald-400' : 'text-red-400'}`}>
                          {primaryResult.available ? '¡Dominio Disponible para Registro!' : 'Dominio Ocupado'}
                        </p>
                      </div>
                    </div>

                    {primaryResult.available && (
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                        <div className="text-right">
                          <div className="text-2xl font-extrabold text-white">{formatCop(primaryResult.priceCop)}</div>
                          <div className="text-xs text-slate-400">~ ${primaryResult.priceUsd} USD / año</div>
                        </div>
                        <button
                          onClick={() => handleInitiateWompi(primaryResult.domain, primaryResult.priceCop, primaryResult.domain)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                        >
                          <CreditCard className="w-4 h-4" /> Pagar con Wompi
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sugerencias de otras extensiones */}
                {suggestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-200 mb-4">Otras extensiones recomendadas para tu marca:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {suggestions.map((item) => (
                        <div
                          key={item.domain}
                          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-all shadow-md"
                        >
                          <div>
                            <div className="font-bold text-white text-base">{item.domain}</div>
                            <div className="text-xs text-slate-400">
                              {item.available ? (
                                <span className="text-emerald-400 font-medium">Disponible</span>
                              ) : (
                                <span className="text-red-400 font-medium">No disponible</span>
                              )}
                            </div>
                          </div>

                          {item.available && (
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="font-extrabold text-white text-sm">{formatCop(item.priceCop)}</div>
                                <div className="text-[10px] text-slate-500">/año</div>
                              </div>
                              <button
                                onClick={() => handleInitiateWompi(item.domain, item.priceCop, item.domain)}
                                className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all"
                                title="Registrar con Wompi"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tarifario Completo de Dominios */}
            <div className="mt-16">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Tarifario de Dominios Populares</h2>
                <p className="text-slate-400 text-sm">Transparencia total. Registro e instalación en servidor sin cobros ocultos.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {FEATURED_TLDS.map((card) => (
                  <div key={card.tld} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 backdrop-blur-xl transition-all shadow-xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-16 h-16 bg-emerald-500/10 rounded-full blur-lg pointer-events-none" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-black text-white">{card.tld}</span>
                      <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {card.discount}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mb-1">{card.label}</div>
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-xs text-slate-500 line-through">{formatCop(card.originalPriceCop)}</span>
                      <span className="text-lg font-extrabold text-white">{formatCop(card.priceCop)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mb-4">
                      <span className="line-through text-slate-600 mr-1">${card.originalPriceUsd}</span>
                      <span className="text-emerald-400 font-bold">${card.priceUsd} USD</span>
                    </div>
                    <button
                      onClick={() => {
                        setSearchTerm(`miempresa${card.tld}`);
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                      }}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white font-medium text-xs transition-all"
                    >
                      Consultar {card.tld}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CALCULADORA COMBO 15% OFF */}
        {activeTab === 'combo' && (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl mb-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-emerald-400" /> Armador de Paquete "Todo en Uno"
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">Selecciona tus componentes y recibe un 15% de Descuento Extra en Combo.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  15% EXTRA OFF
                </span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={comboDomain} onChange={(e) => setComboDomain(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded" />
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        Registro de Dominio (.com / .co)
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">28% OFF</span>
                      </div>
                      <div className="text-xs text-slate-400">1 año de propiedad oficial</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 line-through block sm:inline mr-2">$69.900</span>
                    <span className="font-bold text-white text-sm">$49.900 COP</span>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={comboEmail} onChange={(e) => setComboEmail(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded" />
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        Correo Corporativo (Private Email 5 GB)
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded font-bold">30% OFF</span>
                      </div>
                      <div className="text-xs text-slate-400">Buzón profesional (usuario@tudominio.com)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 line-through block sm:inline mr-2">$99.900</span>
                    <span className="font-bold text-white text-sm">$69.900 COP</span>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={comboSsl} onChange={(e) => setComboSsl(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded" />
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        Certificado SSL Enterprise HTTPS (VPS Pro)
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-bold">33% OFF</span>
                      </div>
                      <div className="text-xs text-slate-400">Candado de seguridad de 256 bits</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 line-through block sm:inline mr-2">$59.900</span>
                    <span className="font-bold text-white text-sm">$39.900 COP</span>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={comboHosting} onChange={(e) => setComboHosting(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded" />
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        Hosting Cloud Stellar (20 GB SSD NVMe)
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">30% OFF</span>
                      </div>
                      <div className="text-xs text-slate-400">Servidor rápido para tu sitio web</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 line-through block sm:inline mr-2">$199.900</span>
                    <span className="font-bold text-white text-sm">$139.900 COP</span>
                  </div>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal Servicios:</span>
                  <span>{formatCop(rawComboTotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400 font-bold">
                  <span>Descuento Combo (15% OFF):</span>
                  <span>-{formatCop(comboDiscount)}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-extrabold text-white">
                  <span>Total Final:</span>
                  <span className="text-emerald-400">{formatCop(finalComboTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => handleInitiateWompi('Paquete Combo Todo en Uno (15% OFF)', finalComboTotal)}
                disabled={finalComboTotal <= 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" /> Pagar Combo con Wompi
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TEST DE VELOCIDAD */}
        {activeTab === 'speed' && (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Gauge className="w-6 h-6 text-rose-400" /> Test de Velocidad & Auditoría SSL
              </h2>
              <p className="text-slate-400 text-sm mb-6">Mide el tiempo de respuesta en milisegundos y el estado de seguridad de cualquier sitio web.</p>

              <form onSubmit={handleSpeedTest} className="flex gap-3">
                <input
                  type="text"
                  required
                  value={speedUrl}
                  onChange={(e) => setSpeedUrl(e.target.value)}
                  placeholder="ej: miempresa.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none text-sm focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={speedLoading || !speedUrl.trim()}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {speedLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Auditar Velocidad'}
                </button>
              </form>
            </div>

            {speedData && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-white">Resultados para: {speedData.url}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Tiempo de Respuesta</div>
                    <div className="text-2xl font-black text-white">{speedData.responseTimeMs} ms</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Calificación</div>
                    <div className="text-2xl font-black text-rose-400">{speedData.speedRating}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Seguridad SSL</div>
                    <div className="text-2xl font-black text-emerald-400">{speedData.isHttps ? 'HTTPS Activo' : 'Sin HTTPS'}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-white">Recomendación:</strong> {speedData.recommendation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SUBDOMINIOS GRATIS */}
        {activeTab === 'subdomain' && (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Server className="w-6 h-6 text-violet-400" /> Subdominios Gratuitos de Prueba (*.waltherparrado.com)
              </h2>
              <p className="text-slate-400 text-sm mb-6">Crea un subdominio gratis en nuestro Servidor VPS para realizar pruebas antes de comprar tu dominio definitivo.</p>

              <form onSubmit={handleCreateSubdomain} className="space-y-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="ej: mi-proyecto-demo"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none text-sm focus:border-violet-500"
                  />
                  <span className="text-sm font-bold text-slate-400">.waltherparrado.com</span>
                </div>

                <button
                  type="submit"
                  disabled={subLoading || !subName.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {subLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Crear Subdominio Gratis'}
                </button>
              </form>
            </div>

            {subResult && (
              <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                  <CheckCircle2 className="w-6 h-6" /> {subResult.message}
                </div>
                <div className="text-xs text-slate-400">Subdominio: <span className="text-white font-mono">{subResult.subdomain}</span></div>
                <div className="text-xs text-slate-400">IP VPS: <span className="text-white font-mono">{subResult.ip}</span></div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: AUDITORÍA WHOIS & DNS */}
        {activeTab === 'whois' && (
          <div className="max-w-3xl mx-auto">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Search className="w-6 h-6 text-amber-400" /> Auditoría WHOIS & Diagnóstico DNS
              </h2>
              <p className="text-slate-400 text-sm mb-6">Consulta los registros A, MX, TXT y Nameservers públicos de cualquier dominio en Internet.</p>

              <form onSubmit={handleWhoisAudit} className="flex gap-3">
                <input
                  type="text"
                  required
                  value={whoisQuery}
                  onChange={(e) => setWhoisQuery(e.target.value)}
                  placeholder="ej: google.com, fundetec.edu.co"
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none text-sm focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={whoisLoading || !whoisQuery.trim()}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  {whoisLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Auditar DNS'}
                </button>
              </form>
            </div>

            {whoisData && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-white">Resultados DNS para: {whoisData.domain}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-semibold text-amber-400 uppercase mb-2">Registros A (Dirección IP)</div>
                    {whoisData.aRecords.length > 0 ? (
                      whoisData.aRecords.map((ip, i) => (
                        <div key={i} className="font-mono text-sm text-white">{ip}</div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">No se encontraron registros A</div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-semibold text-blue-400 uppercase mb-2">Servidores NS (Nameservers)</div>
                    {whoisData.nsRecords.length > 0 ? (
                      whoisData.nsRecords.map((ns, i) => (
                        <div key={i} className="font-mono text-xs text-slate-300">{ns}</div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">No se encontraron registros NS</div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-purple-400 uppercase mb-2">Registros MX (Servidor de Correo)</div>
                  {whoisData.mxRecords.length > 0 ? (
                    whoisData.mxRecords.map((mx, i) => (
                      <div key={i} className="font-mono text-xs text-slate-300">
                        {mx.exchange} <span className="text-slate-500">(Prioridad: {mx.priority})</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">No hay servidores de correo configurados</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: TRANSFERENCIA DE DOMINIO */}
        {activeTab === 'transfer' && (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <ArrowRightLeft className="w-6 h-6 text-cyan-400" /> Transferir tu Dominio Existente
              </h2>
              <p className="text-slate-400 text-sm mb-6">Migra tu dominio desde cualquier proveedor o registrador actual hacia nuestra infraestructura conservando tu tiempo restante.</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (transferDomain) handleInitiateWompi(`Transferencia de ${transferDomain}`, 49900, transferDomain);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nombre del Dominio a Migrar</label>
                  <input
                    type="text"
                    required
                    value={transferDomain}
                    onChange={(e) => setTransferDomain(e.target.value)}
                    placeholder="ej: miempresa-existente.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none text-sm focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Código de Autorización (AuthCode / EPPKey)</label>
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Proporcionado por tu proveedor actual"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none text-sm focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!transferDomain.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  Iniciar Transferencia ($49.900 COP / incluye 1 año adicional)
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 7: GENERADOR DE IA */}
        {activeTab === 'ai-generator' && (
          <div className="max-w-3xl mx-auto">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Bot className="w-6 h-6 text-purple-400" /> Generador de Marcas & Dominios con IA
              </h2>
              <p className="text-slate-400 text-sm mb-6">Describe brevemente la idea de tu proyecto o empresa y nuestra IA inventará marcas únicas verificando su disponibilidad.</p>

              <form onSubmit={handleGenerateAI} className="space-y-4">
                <textarea
                  rows={3}
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="Ej: Quiero abrir un taller especializado en mantenimiento de motos deportivas en Villavicencio con servicio a domicilio..."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none text-sm focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !businessIdea.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generar Sugerencias de Marcas con IA
                </button>
              </form>
            </div>

            {aiSuggestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Marcas Sugeridas por la IA:</h3>
                {aiSuggestions.map((item) => (
                  <div key={item.fullDomain} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-white">{item.fullDomain}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.reason}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-emerald-400 text-sm">{formatCop(item.priceCop)}</div>
                        <div className="text-[10px] text-slate-500">/año</div>
                      </div>
                      <button
                        onClick={() => handleInitiateWompi(item.fullDomain, item.priceCop, item.fullDomain)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: ASISTENTE CONVERSACIONAL IA DOMINIA */}
        {activeTab === 'agent' && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">DominIA — Asesor Experto en Dominios & DNS</h3>
                    <p className="text-xs text-blue-100">Resuelve dudas sobre marcas, registros DNS, pasarela Wompi e infraestructura VPS.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 h-96 overflow-y-auto space-y-4 bg-slate-950/60">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl text-sm max-w-[85%] ${msg.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-900 border border-slate-800 text-slate-200'
                    }`}>
                    {msg.text}
                  </div>
                ))}
                {agentTyping && <div className="text-slate-500 italic text-xs">DominIA está redactando su respuesta...</div>}
              </div>

              <form onSubmit={handleSendAgentMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu consulta sobre dominios, DNS, correos o pagos..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 9, 10, 11: CORREO CORPORATIVO, HOSTING & SSL */}
        {(activeTab === 'email' || activeTab === 'hosting' || activeTab === 'ssl') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESELLER_SERVICES.filter(s => s.category === activeTab).map((plan) => (
              <div key={plan.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 backdrop-blur-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    {plan.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mb-6">{plan.description}</p>
                  <div className="space-y-2.5 mb-8">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="border-t border-slate-800 pt-4 mb-4">
                    <div className="text-2xl font-black text-white">{formatCop(plan.priceCopYear)}</div>
                    <div className="text-xs text-slate-500">Facturación anual (~ ${plan.priceUsdYear} USD)</div>
                  </div>

                  <button
                    onClick={() => handleInitiateWompi(plan.name, plan.priceCopYear)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <CreditCard className="w-4 h-4" /> Pagar con Wompi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Wompi Checkout Modal con Descarga de Cotización */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1">Pasarela Wompi Colombia</h3>
              <p className="text-slate-400 text-xs">Paga de forma segura con PSE, Nequi, Bancolombia o Tarjeta de Crédito.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Servicio:</span>
                <span className="font-bold text-white">{checkoutServiceTitle}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monto Total:</span>
                <span className="font-extrabold text-emerald-400 text-base">{formatCop(checkoutAmount)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const titleLower = (checkoutDomain || checkoutServiceTitle).toLowerCase();
                  let link = process.env.NEXT_PUBLIC_WOMPI_LINK_DOM_COM || 'https://checkout.wompi.co/l/wusjSO';

                  if (titleLower.includes('ssl')) {
                    link = process.env.NEXT_PUBLIC_WOMPI_LINK_SSL_VPS || 'https://checkout.wompi.co/l/x9OaDV';
                  } else if (!titleLower.endsWith('.com')) {
                    // Para dominios .co, .online, .tech, etc., usar el link generico para ingresar el monto exacto
                    link = process.env.NEXT_PUBLIC_WOMPI_LINK_GENERIC || 'https://checkout.wompi.co/l/VPOS_MtK6nj';
                  }

                  const domainRef = (checkoutDomain || checkoutServiceTitle).replace(/[^a-zA-Z0-9]/g, '-');
                  const finalLink = `${link}?reference=DOM_${domainRef}_${Date.now()}`;
                  window.open(finalLink, '_blank');
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <CreditCard className="w-4 h-4" /> Pagar en Pesos COP con Wompi (Nequi / PSE)
              </button>

              <button
                onClick={async () => {
                  try {
                    let amountUsd = 14.99;
                    if (checkoutServiceTitle.toLowerCase().includes('.com')) amountUsd = 14.99;
                    else if (checkoutServiceTitle.toLowerCase().includes('.co')) amountUsd = 16.99;
                    else if (checkoutServiceTitle.toLowerCase().includes('.online')) amountUsd = 4.99;
                    else if (checkoutServiceTitle.toLowerCase().includes('.tech')) amountUsd = 5.99;
                    else if (checkoutServiceTitle.toLowerCase().includes('.io')) amountUsd = 49.99;
                    else if (checkoutServiceTitle.toLowerCase().includes('.ai')) amountUsd = 99.99;

                    const res = await fetch('/api/paypal/create-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        domainOrService: checkoutDomain || checkoutServiceTitle,
                        amountUsd: amountUsd
                      })
                    });
                    const data = await res.json();
                    if (data?.approveUrl) {
                      window.open(data.approveUrl, '_blank');
                    } else {
                      alert('Error inicializando PayPal: ' + (data.error || 'Intente nuevamente'));
                    }
                  } catch (err: any) {
                    alert('Error conectando con PayPal: ' + err.message);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
              >
                <CreditCard className="w-4 h-4 text-slate-900" /> Pagar en Dólares USD con PayPal (Internacional)
              </button>

              <button
                onClick={() => {
                  const domainRef = (checkoutDomain || checkoutServiceTitle).replace(/[^a-zA-Z0-9]/g, '-');
                  const genericLink = process.env.NEXT_PUBLIC_WOMPI_LINK_GENERIC || 'https://checkout.wompi.co/l/VPOS_MtK6nj';
                  window.open(`${genericLink}?reference=DOM_${domainRef}_${Date.now()}`, '_blank');
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700"
              >
                <CreditCard className="w-4 h-4 text-purple-400" /> Link Genérico Wompi (Digitar Monto Manual)
              </button>

              <button
                onClick={() => handleOrderWhatsApp(checkoutServiceTitle, checkoutAmount, checkoutDomain)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                Atención Directa por WhatsApp
              </button>

              <button
                onClick={handleDownloadInvoicePdf}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Descargar Cotización en Texto
              </button>

              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="w-full py-2.5 text-slate-400 hover:text-white text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
