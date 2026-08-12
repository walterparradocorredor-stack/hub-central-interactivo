'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Globe, Server, Lock, Plus, RefreshCw, LogOut, CheckCircle2, AlertCircle, Edit3, Save, X, ExternalLink } from 'lucide-react';

interface DNSRecord {
  id: string;
  type: 'A' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  value: string;
  ttl: number;
}

interface UserDomain {
  id: string;
  domainName: string;
  status: 'active' | 'expiring_soon' | 'expired';
  expiryDate: string;
  sslActive: boolean;
}

export default function PanelDominiosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<UserDomain[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<UserDomain | null>(null);
  const [isDnsModalOpen, setIsDnsModalOpen] = useState(false);
  const [editingDns, setEditingDns] = useState<DNSRecord[]>([]);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [dnsError, setDnsError] = useState<string | null>(null);
  const [savingDns, setSavingDns] = useState(false);
  const [dnsSuccessMessage, setDnsSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login?redirect=/panel/dominios');
      } else {
        setUser(data.session.user);
        setAccessToken(data.session.access_token);
      }
      setLoading(false);
    }
    checkSession();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    async function fetchDomains() {
      setDomainsLoading(true);
      const { data, error } = await supabase
        .from('domain_purchases')
        .select('id, domain_name, dns_status, expires_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: UserDomain[] = data.map((row: any) => {
          const expiry = row.expires_at ? new Date(row.expires_at) : null;
          const daysLeft = expiry ? Math.floor((expiry.getTime() - Date.now()) / 86400000) : null;
          let status: UserDomain['status'] = 'active';
          if (daysLeft !== null) {
            if (daysLeft < 0) status = 'expired';
            else if (daysLeft <= 30) status = 'expiring_soon';
          }
          return {
            id: row.id,
            domainName: row.domain_name,
            status,
            expiryDate: row.expires_at || 'N/A',
            sslActive: row.dns_status === 'connected'
          };
        });
        setDomains(mapped);
      }
      setDomainsLoading(false);
    }

    fetchDomains();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleOpenDnsModal = async (dom: UserDomain) => {
    setSelectedDomain(dom);
    setIsDnsModalOpen(true);
    setDnsSuccessMessage(null);
    setDnsError(null);
    setDnsLoading(true);
    setEditingDns([]);

    try {
      const res = await fetch(`/api/dominios/dns?domainId=${dom.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const json = await res.json();

      if (!res.ok) {
        setDnsError(json.error || 'No se pudieron cargar los registros DNS');
      } else {
        const records: DNSRecord[] = (json.records || []).map((r: any) => ({
          id: r.id,
          type: r.type,
          name: r.name,
          value: r.content,
          ttl: r.ttl
        }));
        setEditingDns(records);
      }
    } catch (err: any) {
      setDnsError(err.message);
    } finally {
      setDnsLoading(false);
    }
  };

  const handleAddDnsRecord = () => {
    const newRecord: DNSRecord = {
      id: `new-${Date.now()}`,
      type: 'A',
      name: '',
      value: '',
      ttl: 3600
    };
    setEditingDns([...editingDns, newRecord]);
  };

  const handleRemoveDnsRecord = (id: string) => {
    setEditingDns(editingDns.filter(r => r.id !== id));
  };

  const handleSaveDns = async () => {
    if (!selectedDomain) return;
    setSavingDns(true);
    setDnsSuccessMessage(null);
    setDnsError(null);

    try {
      const res = await fetch('/api/dominios/dns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          domainId: selectedDomain.id,
          records: editingDns.map(r => ({ id: r.id, type: r.type, name: r.name, content: r.value, ttl: r.ttl }))
        })
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setDnsError((json.errors || [json.error]).filter(Boolean).join('; ') || 'Error al guardar los registros DNS');
      } else {
        setDnsSuccessMessage('¡Registros DNS actualizados y propagados con éxito!');
        setTimeout(() => setIsDnsModalOpen(false), 1200);
      }
    } catch (err: any) {
      setDnsError(err.message);
    } finally {
      setSavingDns(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          Verificando credenciales de acceso...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-extrabold text-white">
              <span className="text-blue-500">WP</span> Ecosystem
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold text-sm">Panel de Dominios & DNS</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{user?.email}</span>
              <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3" /> Cliente Autenticado
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-500/30 transition-all text-xs flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Mis Dominios & Servicios Cloud</h1>
            <p className="text-slate-400 text-sm">Administra la Zona DNS, Certificados SSL e Infraestructura asignada a tus nombres de dominio.</p>
          </div>

          <Link
            href="/dominios"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Comprar Nuevo Dominio
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs font-semibold uppercase">
              <span>Dominios Activos</span>
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{domains.length}</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs font-semibold uppercase">
              <span>SSL VPS Pro Activos</span>
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {domains.filter(d => d.sslActive).length}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs font-semibold uppercase">
              <span>Servidor VPS Asociado</span>
              <Server className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white">31.97.145.8</div>
            <div className="text-[10px] text-slate-500 mt-1">Hostinger KVM 8 High-Speed</div>
          </div>
        </div>

        {/* Domains List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Dominios Asignados</h2>

          {domainsLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-sm py-8">
              <RefreshCw className="w-4 h-4 animate-spin" /> Cargando tus dominios...
            </div>
          )}

          {!domainsLoading && domains.length === 0 && (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <Globe className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold mb-1">Todavía no tienes dominios registrados con este correo.</p>
              <p className="text-slate-500 text-sm">Si acabas de comprar uno, puede tardar unos minutos en aparecer aquí.</p>
            </div>
          )}

          {domains.map((dom) => (
            <div key={dom.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{dom.domainName}</h3>
                    {dom.status === 'active' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Activo
                      </span>
                    )}
                    {dom.status === 'expiring_soon' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Por vencer
                      </span>
                    )}
                    {dom.status === 'expired' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Vencido
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span>Vence: <strong className="text-slate-200">{dom.expiryDate}</strong></span>
                    <span>
                      DNS / SSL:{' '}
                      <strong className={dom.sslActive ? 'text-emerald-400' : 'text-amber-400'}>
                        {dom.sslActive ? 'Conectado (Cloudflare)' : 'Pendiente de conectar'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleOpenDnsModal(dom)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Gestionar Registros DNS
                </button>

                <a
                  href={`https://${dom.domainName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visitar Sitio
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* DNS Management Modal */}
      {isDnsModalOpen && selectedDomain && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Zona DNS: {selectedDomain.domainName}</h3>
                <p className="text-xs text-slate-400">Edita los registros A, CNAME, MX y TXT apuntados a tu infraestructura.</p>
              </div>
              <button onClick={() => setIsDnsModalOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {dnsSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {dnsSuccessMessage}
              </div>
            )}

            {dnsError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {dnsError}
              </div>
            )}

            {dnsLoading ? (
              <div className="flex items-center gap-3 text-slate-400 text-sm py-8 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" /> Consultando registros reales en Cloudflare...
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {editingDns.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs">
                    <select
                      value={rec.type}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setEditingDns(editingDns.map(r => r.id === rec.id ? { ...r, type: val } : r));
                      }}
                      className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 font-bold outline-none"
                    >
                      <option value="A">A</option>
                      <option value="CNAME">CNAME</option>
                      <option value="MX">MX</option>
                      <option value="TXT">TXT</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Host (ej: @, www)"
                      value={rec.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingDns(editingDns.map(r => r.id === rec.id ? { ...r, name: val } : r));
                      }}
                      className="w-24 bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Valor / IP (ej: 31.97.145.8)"
                      value={rec.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingDns(editingDns.map(r => r.id === rec.id ? { ...r, value: val } : r));
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 outline-none font-mono text-[11px]"
                    />

                    <button
                      onClick={() => handleRemoveDnsRecord(rec.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={handleAddDnsRecord}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Agregar Registro
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDnsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSaveDns}
                  disabled={savingDns || dnsLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                  {savingDns ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar Cambios DNS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
