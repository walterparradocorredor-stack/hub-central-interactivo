'use client';

import React, { useState, useEffect } from 'react';
import { PUC_DATABASE as INITIAL_PUC, AccountPUC } from '@/lib/pucData';
import { getDailyChallenges, RetoDiario } from '@/lib/fundetecRetosDiarios';

interface TransactionEntry {
  id: string;
  date: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

// --- HELPER CONVERSIÓN MONTO A LETRAS EN ESPAÑOL ---
function numberToWordsES(num: number): string {
  if (isNaN(num) || num === 0) return 'CERO PESOS M/CTE.';
  const units = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const tens = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  function convertGroup(n: number): string {
    let output = '';
    if (n === 100) return 'CIEN';
    if (n >= 100) {
      output += hundreds[Math.floor(n / 100)] + ' ';
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      output += teens[n - 10] + ' ';
      return output.trim();
    } else if (n >= 20 || n === 10) {
      output += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      output += units[n] + ' ';
    }
    return output.trim();
  }

  let integerPart = Math.floor(Math.abs(num));
  let result = '';

  if (integerPart >= 1000000) {
    const millions = Math.floor(integerPart / 1000000);
    integerPart %= 1000000;
    result += (millions === 1 ? 'UN MILLÓN ' : convertGroup(millions) + ' MILLONES ');
  }
  if (integerPart >= 1000) {
    const thousands = Math.floor(integerPart / 1000);
    integerPart %= 1000;
    result += (thousands === 1 ? 'MIL ' : convertGroup(thousands) + ' MIL ');
  }
  if (integerPart > 0) {
    result += convertGroup(integerPart) + ' ';
  }

  return (result.trim() + ' PESOS M/CTE.').toUpperCase();
}

export default function ContaLabFundetecProPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulador' | 'cuentasT' | 'estados' | 'nomina' | 'comprobantes' | 'retos' | 'tutorIA'>('dashboard');

  // --- BASE DE DATOS PUC EDITABLE ---
  const [pucList, setPucList] = useState<AccountPUC[]>(INITIAL_PUC);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [newAccCode, setNewAccCode] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccCat, setNewAccCat] = useState<AccountPUC['category']>('Activo');
  const [newAccNat, setNewAccNat] = useState<AccountPUC['nature']>('Débito');
  const [newAccDesc, setNewAccDesc] = useState('');

  // --- ASIENTOS CONTABLES EDITABLES ---
  const [entries, setEntries] = useState<TransactionEntry[]>([
    { id: '1', date: '2026-07-28', accountCode: '1105', accountName: 'Caja General', debit: 5000000, credit: 0, description: 'Aporte inicial en efectivo socios Fundetec' },
    { id: '2', date: '2026-07-28', accountCode: '3115', accountName: 'Aportes Sociales', debit: 0, credit: 5000000, description: 'Capital suscrito y pagado' },
    { id: '3', date: '2026-07-28', accountCode: '1435', accountName: 'Inventario de Mercancías no Fabricadas', debit: 2000000, credit: 0, description: 'Compra de kits educativos a crédito' },
    { id: '4', date: '2026-07-28', accountCode: '2205', accountName: 'Proveedores Nacionales', debit: 0, credit: 2000000, description: 'Deuda a 30 días con distribuidora' },
    { id: '5', date: '2026-07-28', accountCode: '1105', accountName: 'Caja General', debit: 1800000, credit: 0, description: 'Venta de matrículas en efectivo' },
    { id: '6', date: '2026-07-28', accountCode: '4170', accountName: 'Otras Actividades de Servicios', debit: 0, credit: 1800000, description: 'Ingresos por servicios educativos' }
  ]);

  // Modo edición de asiento
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPucCode, setEditPucCode] = useState('');
  const [editDebit, setEditDebit] = useState('');
  const [editCredit, setEditCredit] = useState('');
  const [editDetail, setEditDetail] = useState('');

  // Formulario nuevo asiento
  const [selectedPucCode, setSelectedPucCode] = useState<string>('1110');
  const [inputDebit, setInputDebit] = useState<string>('');
  const [inputCredit, setInputCredit] = useState<string>('');
  const [inputDetail, setInputDetail] = useState<string>('');
  const [pucFilter, setPucFilter] = useState<string>('');

  // --- ESTADO NÓMINA EDITABLE ---
  const [baseSalary, setBaseSalary] = useState<number>(1300000);
  const [comisiones, setComisiones] = useState<number>(0);
  const [horasExtras, setHorasExtras] = useState<number>(0);
  const [saludPct, setSaludPct] = useState<number>(4);
  const [pensionPct, setPensionPct] = useState<number>(4);
  const [includeTransport, setIncludeTransport] = useState<boolean>(true);
  const [transportAllowance, setTransportAllowance] = useState<number>(162000);

  // --- ESTADO GENERADOR DE COMPROBANTES CONTABLES EN PDF ---
  const [docType, setDocType] = useState<'egreso' | 'caja_menor' | 'nota_contable' | 'caja_general' | 'comprobante_nomina' | 'factura_venta'>('factura_venta');
  const [docNumber, setDocNumber] = useState<string>('FV-2026-001');
  const [docDate, setDocDate] = useState<string>('');
  const [docCity, setDocCity] = useState<string>('Sincelejo / Villavicencio');
  const [docTerceroName, setDocTerceroName] = useState<string>('Distribuidora Educativa del Caribe S.A.S.');
  const [docTerceroId, setDocTerceroId] = useState<string>('900.849.201-3');
  const [docConcepto, setDocConcepto] = useState<string>('Pago por adquisición de licencias y material pedagógico Fundetec');
  const [docMonto, setDocMonto] = useState<number>(2000000);
  const [docFormaPago, setDocFormaPago] = useState<string>('Transferencia Bancaria');
  const [docBancoCheque, setDocBancoCheque] = useState<string>('Bancolombia Cta Ahorros #910-48201-9');
  const [docRows, setDocRows] = useState<{ accountCode: string; accountName: string; debit: number; credit: number }[]>([
    { accountCode: '2205', accountName: 'Proveedores Nacionales', debit: 2000000, credit: 0 },
    { accountCode: '1110', accountName: 'Bancos Nacionales', debit: 0, credit: 2000000 }
  ]);
  const [docFirmaElaboro, setDocFirmaElaboro] = useState<string>('Auxiliar Contable Fundetec');
  const [docFirmaAprobo, setDocFirmaAprobo] = useState<string>('Director Financiero Fundetec');
  const [docFirmaRecibio, setDocFirmaRecibio] = useState<string>('Recibido Conforme Tercero');

  // --- RETOS Y TUTOR IA ---
  const [dailyChallenges, setDailyChallenges] = useState<RetoDiario[]>([]);
  const [retoSelectedDebit, setRetoSelectedDebit] = useState<{ [key: string]: string }>({});
  const [retoSelectedCredit, setRetoSelectedCredit] = useState<{ [key: string]: string }>({});
  const [retoResults, setRetoResults] = useState<{ [key: string]: boolean }>({});

  const [aiChatMessages, setAiChatMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    {
      sender: 'bot',
      text: '¡Hola! Soy tu Profesor IA Socrático de Contabilidad Fundetec. 👋🏻\n\n¿Tienes dudas sobre cómo debitar/acreditar una cuenta o sobre normas NIIF y DIAN? ¡Hazme una pregunta conceptual y te guiaré paso a paso!'
    }
  ]);
  const [inputAiQuestion, setInputAiQuestion] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // --- CARGAR Y GUARDAR PERSISTENCIA LOCAL EN LOCALSTORAGE ---
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('contalab_fundetec_state');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.entries && Array.isArray(parsed.entries) && parsed.entries.length > 0) setEntries(parsed.entries);
        if (parsed.pucList && Array.isArray(parsed.pucList) && parsed.pucList.length > 0) setPucList(parsed.pucList);
        if (parsed.docType) setDocType(parsed.docType);
        if (parsed.docNumber) setDocNumber(parsed.docNumber);
        if (parsed.docDate) setDocDate(parsed.docDate);
        if (parsed.docCity) setDocCity(parsed.docCity);
        if (parsed.docTerceroName) setDocTerceroName(parsed.docTerceroName);
        if (parsed.docTerceroId) setDocTerceroId(parsed.docTerceroId);
        if (parsed.docConcepto) setDocConcepto(parsed.docConcepto);
        if (parsed.docMonto !== undefined) setDocMonto(parsed.docMonto);
        if (parsed.docFormaPago) setDocFormaPago(parsed.docFormaPago);
        if (parsed.docBancoCheque) setDocBancoCheque(parsed.docBancoCheque);
        if (parsed.docRows && Array.isArray(parsed.docRows)) setDocRows(parsed.docRows);
        if (parsed.baseSalary !== undefined) setBaseSalary(parsed.baseSalary);
        if (parsed.comisiones !== undefined) setComisiones(parsed.comisiones);
        if (parsed.horasExtras !== undefined) setHorasExtras(parsed.horasExtras);
      }
    } catch (e) {
      console.error('Error cargando persistencia contable:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const dataToSave = {
        entries,
        pucList,
        docType,
        docNumber,
        docDate,
        docCity,
        docTerceroName,
        docTerceroId,
        docConcepto,
        docMonto,
        docFormaPago,
        docBancoCheque,
        docRows,
        baseSalary,
        comisiones,
        horasExtras,
        saludPct,
        pensionPct,
        includeTransport,
        transportAllowance
      };
      localStorage.setItem('contalab_fundetec_state', JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error guardando persistencia contable:', e);
    }
  }, [isLoaded, entries, pucList, docType, docNumber, docDate, docCity, docTerceroName, docTerceroId, docConcepto, docMonto, docFormaPago, docBancoCheque, docRows, baseSalary, comisiones, horasExtras, saludPct, pensionPct, includeTransport, transportAllowance]);

  const handleResetData = () => {
    if (confirm('¿Deseas restablecer el simulador a los datos iniciales de fábrica? Se borrarán todos los registros locales cargados.')) {
      localStorage.removeItem('contalab_fundetec_state');
      window.location.reload();
    }
  };

  useEffect(() => {
    setDailyChallenges(getDailyChallenges());
    // Inicializar fecha en cliente para evitar hydration mismatch (React #418)
    setDocDate(prev => prev || new Date().toISOString().split('T')[0]);
  }, []);

  // --- CÁLCULOS CONTABLES ---
  const totalDebit = entries.reduce((acc, curr) => acc + curr.debit, 0);
  const totalCredit = entries.reduce((acc, curr) => acc + curr.credit, 0);
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit;

  const calculateCategoryTotal = (cat: AccountPUC['category']) => {
    const codes = pucList.filter(a => a.category === cat).map(a => a.code);
    return entries.filter(e => codes.includes(e.accountCode)).reduce((acc, e) => {
      const isDebitNature = ['Activo', 'Gastos', 'Costos'].includes(cat);
      return isDebitNature ? acc + (e.debit - e.credit) : acc + (e.credit - e.debit);
    }, 0);
  };

  const totalActivos = Math.max(0, calculateCategoryTotal('Activo'));
  const totalPasivos = Math.max(0, calculateCategoryTotal('Pasivo'));
  const totalPatrimonio = Math.max(0, calculateCategoryTotal('Patrimonio'));
  const totalIngresos = Math.max(0, calculateCategoryTotal('Ingresos'));
  const totalGastos = Math.max(0, calculateCategoryTotal('Gastos'));
  const totalCostos = Math.max(0, calculateCategoryTotal('Costos'));

  const utilidadNeta = totalIngresos - (totalGastos + totalCostos);
  const razonCorriente = totalPasivos > 0 ? (totalActivos / totalPasivos).toFixed(2) : '10.0+';
  const nivelEndeudamiento = totalActivos > 0 ? ((totalPasivos / totalActivos) * 100).toFixed(1) : '0';

  // Cargar comprobante desde un asiento del libro diario
  const handleLoadDocFromEntry = (entry: TransactionEntry) => {
    const isSale = entry.credit > 0 && (entry.accountCode.startsWith('41') || entry.description.toLowerCase().includes('venta') || entry.description.toLowerCase().includes('matrícula'));
    const isIncome = entry.credit > 0 && ['1105', '1110'].includes(entry.accountCode);
    const newType = isSale ? 'factura_venta' : isIncome ? 'caja_general' : 'egreso';
    setDocType(newType);
    setDocNumber(isSale ? `FV-${Date.now().toString().slice(-4)}` : isIncome ? `RC-${Date.now().toString().slice(-4)}` : `CE-${Date.now().toString().slice(-4)}`);
    setDocDate(entry.date);
    setDocConcepto(entry.description);
    setDocMonto(entry.debit > 0 ? entry.debit : entry.credit);
    setDocTerceroName(isSale || isIncome ? 'Estudiante / Cliente Fundetec' : 'Proveedor / Tercero Contable');
    setDocTerceroId('228.490.100');
    setDocRows([
      {
        accountCode: entry.accountCode,
        accountName: entry.accountName,
        debit: entry.debit,
        credit: entry.credit
      }
    ]);
    setActiveTab('comprobantes');
  };

  // Cargar desprendible de nómina desde los cálculos actuales
  const handleLoadDocFromNomina = () => {
    setDocType('comprobante_nomina');
    setDocNumber(`NOM-${Date.now().toString().slice(-4)}`);
    setDocDate(new Date().toISOString().split('T')[0]);
    setDocConcepto('Pago de Nómina Mensual - Personal Docente / Administrativo Fundetec');
    setDocTerceroName('Docente / Colaborador Instituto Fundetec');
    setDocTerceroId('1.098.765.432');
    const auxT = includeTransport ? transportAllowance : 0;
    const deveng = baseSalary + comisiones + horasExtras + auxT;
    const salud = (baseSalary + comisiones + horasExtras) * (saludPct / 100);
    const pension = (baseSalary + comisiones + horasExtras) * (pensionPct / 100);
    const neto = deveng - (salud + pension);
    setDocMonto(neto);
    setDocRows([
      { accountCode: '510506', accountName: 'Sueldos Básicos', debit: baseSalary, credit: 0 },
      { accountCode: '510527', accountName: 'Auxilio de Transporte', debit: auxT, credit: 0 },
      { accountCode: '237005', accountName: 'Aportes a Salud Empleado (4%)', debit: 0, credit: salud },
      { accountCode: '238030', accountName: 'Fondos de Pensiones Empleado (4%)', debit: 0, credit: pension },
      { accountCode: '250505', accountName: 'Salarios por Pagar', debit: 0, credit: neto }
    ]);
    setActiveTab('comprobantes');
  };

  // --- ACCIONES ASIENTOS ---
  const handleAddEntry = () => {
    const foundAcc = pucList.find(a => a.code === selectedPucCode);
    if (!foundAcc) return;

    const debitVal = parseFloat(inputDebit) || 0;
    const creditVal = parseFloat(inputCredit) || 0;

    if (debitVal === 0 && creditVal === 0) {
      alert('Ingresa un valor en Débito o Crédito.');
      return;
    }

    const newEntry: TransactionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      accountCode: foundAcc.code,
      accountName: foundAcc.name,
      debit: debitVal,
      credit: creditVal,
      description: inputDetail || 'Movimiento contable pedagógico'
    };

    setEntries([...entries, newEntry]);
    setInputDebit('');
    setInputCredit('');
    setInputDetail('');
  };

  const handleStartEdit = (entry: TransactionEntry) => {
    setEditingId(entry.id);
    setEditPucCode(entry.accountCode);
    setEditDebit(entry.debit.toString());
    setEditCredit(entry.credit.toString());
    setEditDetail(entry.description);
  };

  const handleSaveEdit = (id: string) => {
    const foundAcc = pucList.find(a => a.code === editPucCode);
    if (!foundAcc) return;

    setEntries(entries.map(e => {
      if (e.id === id) {
        return {
          ...e,
          accountCode: foundAcc.code,
          accountName: foundAcc.name,
          debit: parseFloat(editDebit) || 0,
          credit: parseFloat(editCredit) || 0,
          description: editDetail
        };
      }
      return e;
    }));
    setEditingId(null);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleAddNewAccountPUC = () => {
    if (!newAccCode || !newAccName) {
      alert('Por favor completa código y nombre de la cuenta.');
      return;
    }
    const exists = pucList.some(a => a.code === newAccCode);
    if (exists) {
      alert('Ese código PUC ya existe.');
      return;
    }
    const newAcc: AccountPUC = {
      code: newAccCode,
      name: newAccName,
      category: newAccCat,
      nature: newAccNat,
      description: newAccDesc || 'Cuenta personalizada por el usuario'
    };
    setPucList([...pucList, newAcc]);
    setShowAddAccountForm(false);
    setNewAccCode('');
    setNewAccName('');
    setNewAccDesc('');
  };

  // --- IMPRESIÓN Y GENERACIÓN DE REPORTE PDF INSTITUCIONAL ---
  const handleExportPDF = () => {
    window.print();
  };

  // Exportar respaldo en JSON (opcional)
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ entries, pucList }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `contalab_fundetec_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleVerifyReto = (reto: RetoDiario) => {
    const userDb = retoSelectedDebit[reto.id];
    const userCr = retoSelectedCredit[reto.id];

    const correct = userDb === reto.expectedDebitCode && userCr === reto.expectedCreditCode;
    setRetoResults(prev => ({ ...prev, [reto.id]: correct }));
  };

  const handleSendAiQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAiQuestion.trim() || isAiLoading) return;

    const userText = inputAiQuestion;
    setInputAiQuestion('');
    setAiChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/fundetec/tutor-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: aiChatMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          userQuestion: userText
        })
      });

      const data = await res.json();
      setAiChatMessages(prev => [...prev, { sender: 'bot', text: data.reply || 'Recuerda analizar la Partida Doble.' }]);
    } catch (err) {
      setAiChatMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Analicemos la Ecuación Patrimonial: Activo = Pasivo + Patrimonio. ¿Cuál cuenta consideras que se afecta primero?'
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const auxTransportVal = includeTransport ? transportAllowance : 0;
  const totalDevengado = baseSalary + comisiones + horasExtras + auxTransportVal;
  const saludEmployee = (baseSalary + comisiones + horasExtras) * (saludPct / 100);
  const pensionEmployee = (baseSalary + comisiones + horasExtras) * (pensionPct / 100);
  const totalDeducciones = saludEmployee + pensionEmployee;
  const netoPagar = totalDevengado - totalDeducciones;

  const filteredPuc = pucList.filter(a =>
    a.code.includes(pucFilter) || a.name.toLowerCase().includes(pucFilter.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070b14',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      paddingBottom: '5rem'
    }}>
      {/* ESTILOS DE IMPRESIÓN OFICIAL PARA EXPORTAR EN PDF */}
      <style>{`
        .print-container {
          display: none;
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          header, nav, main, button, input, select, textarea, form, .no-print {
            display: none !important;
          }
          body, html, section, article, div, p, span, h1, h2, h3, h4, h5, h6, td, th {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            text-shadow: none !important;
            filter: none !important;
          }
          table, th, td {
            border: 1px solid #000000 !important;
            color: #000000 !important;
          }
          th {
            background-color: #e2e8f0 !important;
            color: #000000 !important;
            font-weight: bold !important;
          }
          .print-container {
            display: block !important;
            color: #000000 !important;
            background: #ffffff !important;
          }
        }
      `}</style>

      {/* HEADER PRINCIPAL CON LOGO OFICIAL FUNDETEC */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
        padding: '0.85rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        {/* FILA SUPERIOR: LOGO, TÍTULO Y BOTONES DE ACCIÓN */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              height: '44px',
              padding: '0.3rem 0.6rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <img
                src="https://fundetec.edu.co/assets/img/i-emp/logo_2026.webp"
                alt="Instituto Fundetec"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #38bdf8, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ContaLab Fundetec Pro
              </h1>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                Sistema Contable & ERP Educativo NIIF • Instituto Fundetec
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={handleExportPDF}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)'
              }}
            >
              📄 Exportar Informe PDF
            </button>

            <button
              onClick={handleExportJSON}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📥 Respaldar (JSON)
            </button>

            <button
              onClick={handleResetData}
              title="Restablecer datos iniciales de fábrica del laboratorio contable"
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔄 Reiniciar (Fábrica)
            </button>
          </div>
        </div>

        {/* FILA INFERIOR: BARRA DE NAVEGACIÓN Y PESTAÑAS */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(30, 41, 59, 0.7)',
          padding: '0.3rem',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {[
            { id: 'dashboard', label: '📈 Dashboard KPIs' },
            { id: 'simulador', label: '⚖️ Libro Diario & Asientos' },
            { id: 'cuentasT', label: '📊 Cuentas T' },
            { id: 'estados', label: '📑 Estados NIIF' },
            { id: 'nomina', label: '🧾 Nómina Editable' },
            { id: 'comprobantes', label: '📄 Comprobantes PDF' },
            { id: 'retos', label: '🗓️ Retos Diarios' },
            { id: 'tutorIA', label: '🤖 Tutor IA' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '99px',
                border: 'none',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* VISTA DE IMPRESIÓN PARA PDF INSTITUCIONAL */}
      <div className="print-container">
        {activeTab === 'comprobantes' ? (
          <div style={{ border: '2px solid #000', padding: '1.5rem', borderRadius: '8px', color: '#000', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' }}>
            {/* ENCABEZADO INSTITUCIONAL DE COMPROBANTE */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src="https://fundetec.edu.co/assets/img/i-emp/logo_2026.webp" alt="Fundetec" style={{ height: '55px', width: 'auto' }} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#000', fontWeight: 'bold' }}>INSTITUTO FUNDETEC</h2>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#333' }}>NIT: 800.192.839-4 • Educación Técnica & ERP Educativo</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>Sedes: Sincelejo (Sucre) / Villavicencio (Meta) • Colombia</p>
                </div>
              </div>
              <div style={{ textAlign: 'right', border: '2px solid #000', padding: '0.6rem 1rem', borderRadius: '6px', background: '#f8fafc' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {docType === 'factura_venta' && 'FACTURA DE VENTA / SERVICIOS'}
                  {docType === 'egreso' && 'COMPROBANTE DE PAGO O EGRESO'}
                  {docType === 'caja_menor' && 'RECIBO DE CAJA MENOR'}
                  {docType === 'nota_contable' && 'NOTA DE CONTABILIDAD'}
                  {docType === 'caja_general' && 'RECIBO DE CAJA GENERAL'}
                  {docType === 'comprobante_nomina' && 'COMPROBANTE DE NÓMINA'}
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#dc2626' }}>{docNumber}</strong>
              </div>
            </div>

            {/* DETALLES DE ENCABEZADO DE COMPROBANTE */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem', width: '18%', fontWeight: 'bold', background: '#f1f5f9' }}>CIUDAD Y FECHA:</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem', width: '32%' }}>{docCity}, {docDate}</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem', width: '18%', fontWeight: 'bold', background: '#f1f5f9' }}>VALOR $:</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem', width: '32%', fontWeight: 'bold', fontSize: '1rem' }}>${docMonto.toLocaleString('es-CO')}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem', fontWeight: 'bold', background: '#f1f5f9' }}>
                    {docType === 'factura_venta' || docType === 'caja_general' ? 'CLIENTE / COMPRADOR:' : docType === 'comprobante_nomina' ? 'EMPLEADO:' : 'PAGADO A:'}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{docTerceroName}</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem', fontWeight: 'bold', background: '#f1f5f9' }}>NIT / C.C.:</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{docTerceroId}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem', fontWeight: 'bold', background: '#f1f5f9' }}>LA SUMA DE (LETRAS):</td>
                  <td colSpan={3} style={{ border: '1px solid #ccc', padding: '0.4rem', fontStyle: 'italic', fontWeight: 'bold' }}>
                    {numberToWordsES(docMonto)}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '0.4rem', fontWeight: 'bold', background: '#f1f5f9' }}>POR CONCEPTO DE:</td>
                  <td colSpan={3} style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{docConcepto}</td>
                </tr>
                {docType !== 'nota_contable' && (
                  <tr>
                    <td style={{ border: '1px solid #ccc', padding: '0.4rem', fontWeight: 'bold', background: '#f1f5f9' }}>FORMA DE PAGO:</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{docFormaPago}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.4rem', fontWeight: 'bold', background: '#f1f5f9' }}>BANCO / REF:</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{docBancoCheque}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* TABLA DE IMPUTACIÓN CONTABLE PUC */}
            <h4 style={{ margin: '0.5rem 0 0.3rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Imputación Contable (Partida Doble NIIF)
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '2rem' }}>
              <thead>
                <tr style={{ background: '#e2e8f0', border: '1px solid #000' }}>
                  <th style={{ border: '1px solid #000', padding: '0.4rem', textAlign: 'left' }}>CÓDIGO PUC</th>
                  <th style={{ border: '1px solid #000', padding: '0.4rem', textAlign: 'left' }}>CUENTA CONTABLE</th>
                  <th style={{ border: '1px solid #000', padding: '0.4rem', textAlign: 'right' }}>DÉBITO ($)</th>
                  <th style={{ border: '1px solid #000', padding: '0.4rem', textAlign: 'right' }}>CRÉDITO ($)</th>
                </tr>
              </thead>
              <tbody>
                {docRows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #ccc', padding: '0.35rem', fontWeight: 'bold' }}>{r.accountCode}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.35rem' }}>{r.accountName}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.35rem', textAlign: 'right' }}>{r.debit > 0 ? `$${r.debit.toLocaleString('es-CO')}` : '-'}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.35rem', textAlign: 'right' }}>{r.credit > 0 ? `$${r.credit.toLocaleString('es-CO')}` : '-'}</td>
                  </tr>
                ))}
                <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                  <td colSpan={2} style={{ border: '1px solid #000', padding: '0.4rem', textAlign: 'right' }}>TOTALES COMPROBANTE:</td>
                  <td style={{ border: '1px solid #000', padding: '0.4rem', textAlign: 'right' }}>
                    ${docRows.reduce((a, b) => a + b.debit, 0).toLocaleString('es-CO')}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '0.4rem', textAlign: 'right' }}>
                    ${docRows.reduce((a, b) => a + b.credit, 0).toLocaleString('es-CO')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* SECCIÓN DE FIRMAS Y VALIDEZ LEGAL */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '3rem' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem', textAlign: 'center', fontSize: '0.75rem' }}>
                <strong>ELABORADO POR:</strong>
                <p style={{ margin: '0.2rem 0 0 0', color: '#444' }}>{docFirmaElaboro}</p>
              </div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem', textAlign: 'center', fontSize: '0.75rem' }}>
                <strong>APROBADO POR:</strong>
                <p style={{ margin: '0.2rem 0 0 0', color: '#444' }}>{docFirmaAprobo}</p>
              </div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem', textAlign: 'center', fontSize: '0.75rem' }}>
                <strong>RECIBIDO CONFORME / TERCERO:</strong>
                <p style={{ margin: '0.2rem 0 0 0', color: '#444' }}>{docFirmaRecibio}</p>
                <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.65rem', color: '#666' }}>C.C. / NIT: __________________</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <img src="https://fundetec.edu.co/assets/img/i-emp/logo_2026.webp" alt="Fundetec" style={{ height: '60px', marginBottom: '0.5rem' }} />
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#000' }}>INSTITUTO FUNDETEC - COLOMBIA</h2>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.1rem', color: '#333' }}>Informe Financiero & Estados Contables NIIF</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Fecha de Emisión: {new Date().toLocaleDateString('es-CO')} | Laboratorio Contable ContaLab Pro</p>
            </div>

            {/* RESUMEN KPIS EN PDF */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ border: '1px solid #ccc', padding: '0.75rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#555' }}>Total Activos</span>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#059669' }}>${totalActivos.toLocaleString('es-CO')}</strong>
              </div>
              <div style={{ border: '1px solid #ccc', padding: '0.75rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#555' }}>Total Pasivos</span>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#dc2626' }}>${totalPasivos.toLocaleString('es-CO')}</strong>
              </div>
              <div style={{ border: '1px solid #ccc', padding: '0.75rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#555' }}>Patrimonio Neto</span>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0284c7' }}>${totalPatrimonio.toLocaleString('es-CO')}</strong>
              </div>
              <div style={{ border: '1px solid #ccc', padding: '0.75rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#555' }}>Utilidad Operacional Neta</span>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#d97706' }}>${utilidadNeta.toLocaleString('es-CO')}</strong>
              </div>
            </div>

            {/* TABLA LIBRO DIARIO EN PDF */}
            <h4 style={{ borderBottom: '1px solid #000', paddingBottom: '0.3rem', marginTop: '1.5rem' }}>Libro Diario de Transacciones</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '2rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #000' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Código / Cuenta PUC</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Detalle</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem' }}>Débito ($)</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem' }}>Crédito ($)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}><strong>{e.accountCode}</strong> - {e.accountName}</td>
                    <td style={{ padding: '0.5rem' }}>{e.description}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>{e.debit > 0 ? `$${e.debit.toLocaleString('es-CO')}` : '-'}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>{e.credit > 0 ? `$${e.credit.toLocaleString('es-CO')}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* FIRMAS EN PDF */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '1rem' }}>
              <div style={{ borderTop: '1px solid #000', width: '40%', textAlign: 'center', fontSize: '0.85rem' }}>
                Firma del Estudiante / Contador
              </div>
              <div style={{ borderTop: '1px solid #000', width: '40%', textAlign: 'center', fontSize: '0.85rem' }}>
                Firma Docente / Instituto Fundetec
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL WEB */}
      <main className="no-print" style={{ maxWidth: '1350px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* ==================== MÓDULO 1: DASHBOARD CON GRÁFICAS FINANCIERAS ==================== */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Total Activos</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>${totalActivos.toLocaleString('es-CO')}</div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Bienes y derechos de la institución</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '18px', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Total Pasivos</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>${totalPasivos.toLocaleString('es-CO')}</div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Obligaciones pendientes</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '18px', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Patrimonio Neto</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>${totalPatrimonio.toLocaleString('es-CO')}</div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Capital y reservas</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '18px', border: '1px solid rgba(250, 204, 21, 0.3)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Utilidad Operacional Neta</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: utilidadNeta >= 0 ? '#facc15' : '#ef4444' }}>
                  ${utilidadNeta.toLocaleString('es-CO')}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Ingresos - (Gastos + Costos)</span>
              </div>
            </div>

            {/* SECCIÓN DE GRÁFICAS FINANCIERAS INTERACTIVAS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📊</span> Comparativo: Ingresos vs. Gastos y Costos
                </h3>

                <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '1.5rem', paddingTop: '2rem', borderBottom: '2px solid #334155' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginBottom: '0.3rem' }}>${(totalIngresos / 1000).toFixed(0)}k</span>
                    <div style={{
                      width: '100%',
                      maxWidth: '60px',
                      height: `${Math.min(100, (totalIngresos / (Math.max(totalIngresos, totalGastos + totalCostos, 1))) * 160)}px`,
                      background: 'linear-gradient(180deg, #34d399 0%, #059669 100%)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.5s ease'
                    }} />
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.5rem' }}>Ingresos</span>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700, marginBottom: '0.3rem' }}>${(totalGastos / 1000).toFixed(0)}k</span>
                    <div style={{
                      width: '100%',
                      maxWidth: '60px',
                      height: `${Math.min(100, (totalGastos / (Math.max(totalIngresos, totalGastos + totalCostos, 1))) * 160)}px`,
                      background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.5s ease'
                    }} />
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.5rem' }}>Gastos</span>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700, marginBottom: '0.3rem' }}>${(totalCostos / 1000).toFixed(0)}k</span>
                    <div style={{
                      width: '100%',
                      maxWidth: '60px',
                      height: `${Math.min(100, (totalCostos / (Math.max(totalIngresos, totalGastos + totalCostos, 1))) * 160)}px`,
                      background: 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.5s ease'
                    }} />
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.5rem' }}>Costos</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🍩</span> Distribución de Ecuación Patrimonial
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '220px' }}>
                  <svg width="180" height="180" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="3.8"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="3.8"
                      strokeDasharray="60, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="3.8"
                      strokeDasharray="25, 100"
                      strokeDashoffset="-60"
                    />
                  </svg>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#34d399' }} />
                      <span>Activos: ${totalActivos.toLocaleString('es-CO')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f87171' }} />
                      <span>Pasivos: ${totalPasivos.toLocaleString('es-CO')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#38bdf8' }} />
                      <span>Patrimonio: ${totalPatrimonio.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MÓDULO 2: SIMULADOR Y EDICIÓN COMPLETA ==================== */}
        {activeTab === 'simulador' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
            <div>
              <div style={{
                background: isBalanced ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: isBalanced ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1.25rem',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: isBalanced ? '#34d399' : '#f87171' }}>
                    {isBalanced ? '✅ Principio de Partida Doble Cumplido' : '⚠️ Asiento Descuadrado'}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                    Total Débitos = ${totalDebit.toLocaleString('es-CO')} | Total Créditos = ${totalCredit.toLocaleString('es-CO')}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Diferencia</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isBalanced ? '#34d399' : '#f87171' }}>
                    ${Math.abs(totalDebit - totalCredit).toLocaleString('es-CO')}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📖</span> Libro Diario de Transacciones (Totalmente Editable)
                </h2>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Código / Cuenta PUC</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Detalle</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem' }}>Débito ($)</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem' }}>Crédito ($)</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(e => {
                      const isEditing = editingId === e.id;
                      return (
                        <tr key={e.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {isEditing ? (
                            <>
                              <td style={{ padding: '0.5rem' }}>
                                <select
                                  value={editPucCode}
                                  onChange={(ev) => setEditPucCode(ev.target.value)}
                                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #38bdf8' }}
                                >
                                  {pucList.map(a => (
                                    <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={{ padding: '0.5rem' }}>
                                <input
                                  type="text"
                                  value={editDetail}
                                  onChange={(ev) => setEditDetail(ev.target.value)}
                                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                                />
                              </td>
                              <td style={{ padding: '0.5rem' }}>
                                <input
                                  type="number"
                                  value={editDebit}
                                  onChange={(ev) => setEditDebit(ev.target.value)}
                                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', background: '#0f172a', color: '#34d399', border: '1px solid #10b981', textAlign: 'right' }}
                                />
                              </td>
                              <td style={{ padding: '0.5rem' }}>
                                <input
                                  type="number"
                                  value={editCredit}
                                  onChange={(ev) => setEditCredit(ev.target.value)}
                                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', background: '#0f172a', color: '#38bdf8', border: '1px solid #0284c7', textAlign: 'right' }}
                                />
                              </td>
                              <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                                <button onClick={() => handleSaveEdit(e.id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, marginRight: '0.2rem' }}>
                                  ✓
                                </button>
                                <button onClick={() => setEditingId(null)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}>
                                  ✕
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '0.85rem' }}>
                                <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700, padding: '0.2rem 0.4rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '6px', marginRight: '0.5rem' }}>
                                  {e.accountCode}
                                </span>
                                <span>{e.accountName}</span>
                              </td>
                              <td style={{ padding: '0.85rem', color: '#cbd5e1', fontSize: '0.85rem' }}>{e.description}</td>
                              <td style={{ padding: '0.85rem', textAlign: 'right', color: e.debit > 0 ? '#34d399' : '#64748b', fontWeight: e.debit > 0 ? 700 : 400 }}>
                                {e.debit > 0 ? `$${e.debit.toLocaleString('es-CO')}` : '-'}
                              </td>
                              <td style={{ padding: '0.85rem', textAlign: 'right', color: e.credit > 0 ? '#38bdf8' : '#64748b', fontWeight: e.credit > 0 ? 700 : 400 }}>
                                {e.credit > 0 ? `$${e.credit.toLocaleString('es-CO')}` : '-'}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button onClick={() => handleLoadDocFromEntry(e)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.9rem', marginRight: '0.4rem' }} title="Generar Comprobante PDF">
                                  📄
                                </button>
                                <button onClick={() => handleStartEdit(e)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.9rem', marginRight: '0.4rem' }} title="Editar Asiento">
                                  ✏️
                                </button>
                                <button onClick={() => handleRemoveEntry(e.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }} title="Eliminar Asiento">
                                  🗑️
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>➕ Registrar Nuevo Movimiento Contable</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Seleccionar Cuenta PUC</label>
                    <select
                      value={selectedPucCode}
                      onChange={(e) => setSelectedPucCode(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    >
                      {pucList.map(acc => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} - {acc.name} ({acc.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Descripción / Concepto</label>
                    <input
                      type="text"
                      placeholder="Ej: Pago de servicios públicos"
                      value={inputDetail}
                      onChange={(e) => setInputDetail(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#34d399', marginBottom: '0.4rem' }}>Monto Débito ($)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={inputDebit}
                      onChange={(e) => setInputDebit(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#0f172a', border: '1px solid #10b981', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#38bdf8', marginBottom: '0.4rem' }}>Monto Crédito ($)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={inputCredit}
                      onChange={(e) => setInputCredit(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#0f172a', border: '1px solid #0284c7', color: '#fff' }}
                    />
                  </div>

                  <button
                    onClick={handleAddEntry}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Agregar Cuenta
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🔍</span> Plan Único Cuentas
                  </h3>
                  <button
                    onClick={() => setShowAddAccountForm(!showAddAccountForm)}
                    style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '0.75rem', borderRadius: '6px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    {showAddAccountForm ? 'Cancelar' : '+ Crear Cuenta'}
                  </button>
                </div>

                {showAddAccountForm && (
                  <div style={{ background: '#0f172a', padding: '0.85rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <input type="text" placeholder="Código PUC (ej: 1306)" value={newAccCode} onChange={(e) => setNewAccCode(e.target.value)} style={{ padding: '0.4rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                    <input type="text" placeholder="Nombre de la Cuenta" value={newAccName} onChange={(e) => setNewAccName(e.target.value)} style={{ padding: '0.4rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                    <select value={newAccCat} onChange={(e) => setNewAccCat(e.target.value as any)} style={{ padding: '0.4rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}>
                      <option value="Activo">Activo</option>
                      <option value="Pasivo">Pasivo</option>
                      <option value="Patrimonio">Patrimonio</option>
                      <option value="Ingresos">Ingresos</option>
                      <option value="Gastos">Gastos</option>
                      <option value="Costos">Costos</option>
                    </select>
                    <button onClick={handleAddNewAccountPUC} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                      Guardar Nueva Cuenta PUC
                    </button>
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  value={pucFilter}
                  onChange={(e) => setPucFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.85rem', marginBottom: '1rem' }}
                />

                <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filteredPuc.map(acc => (
                    <div
                      key={acc.code}
                      onClick={() => setSelectedPucCode(acc.code)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: '8px',
                        background: selectedPucCode === acc.code ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                        border: selectedPucCode === acc.code ? '1px solid #38bdf8' : '1px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700 }}>
                        <span style={{ color: '#38bdf8' }}>{acc.code} - {acc.name}</span>
                        <span style={{ color: '#94a3b8' }}>{acc.nature}</span>
                      </div>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#cbd5e1' }}>{acc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MÓDULO 3: CUENTAS T EN VIVO ==================== */}
        {activeTab === 'cuentasT' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1.5rem 0' }}>
              📊 Cuentas T (Libro Mayor Educativo NIIF)
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {Array.from(new Set(entries.map(e => e.accountCode))).map(code => {
                const accInfo = pucList.find(a => a.code === code);
                const accEntries = entries.filter(e => e.accountCode === code);
                const sumDebit = accEntries.reduce((a, b) => a + b.debit, 0);
                const sumCredit = accEntries.reduce((a, b) => a + b.credit, 0);
                const saldo = sumDebit - sumCredit;

                return (
                  <div
                    key={code}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{ textAlign: 'center', borderBottom: '2px solid #38bdf8', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>{accInfo?.category} ({code})</span>
                      <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>{accInfo?.name || code}</strong>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', minHeight: '120px' }}>
                      <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '0.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700 }}>DÉBITO (DEBE)</div>
                        {accEntries.map((e, idx) => e.debit > 0 && (
                          <div key={idx} style={{ fontSize: '0.85rem', color: '#34d399', marginBottom: '0.2rem' }}>
                            ${e.debit.toLocaleString('es-CO')}
                          </div>
                        ))}
                      </div>

                      <div style={{ paddingLeft: '0.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700 }}>CRÉDITO (HABER)</div>
                        {accEntries.map((e, idx) => e.credit > 0 && (
                          <div key={idx} style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '0.2rem' }}>
                            ${e.credit.toLocaleString('es-CO')}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.15)', marginTop: '1rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#94a3b8' }}>Saldo Final:</span>
                      <strong style={{ color: saldo >= 0 ? '#34d399' : '#f87171' }}>
                        ${Math.abs(saldo).toLocaleString('es-CO')} ({saldo >= 0 ? 'Débito' : 'Crédito'})
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== MÓDULO 4: ESTADOS FINANCIEROS NIIF ==================== */}
        {activeTab === 'estados' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 0, color: '#38bdf8' }}>🏛️ Estado de Situación Financiera (Balance General)</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#34d399', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.4rem' }}>
                  <span>TOTAL ACTIVOS</span>
                  <span>${totalActivos.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#f87171', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.4rem' }}>
                  <span>TOTAL PASIVOS</span>
                  <span>${totalPasivos.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#38bdf8', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.4rem' }}>
                  <span>PATRIMONIO NETO</span>
                  <span>${totalPatrimonio.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: (totalPasivos + totalPatrimonio) === totalActivos ? '#34d399' : '#f87171', paddingTop: '0.5rem' }}>
                  <span>PASIVO + PATRIMONIO</span>
                  <span>${(totalPasivos + totalPatrimonio).toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 0, color: '#facc15' }}>📈 Estado de Resultados Integral</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>(+) Ingresos Operacionales:</span>
                  <span>${totalIngresos.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb923c' }}>
                  <span>(-) Costos de Ventas:</span>
                  <span>-${totalCostos.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                  <span>(-) Gastos de Administración y Ventas:</span>
                  <span>-${totalGastos.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ borderTop: '2px solid #facc15', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: utilidadNeta >= 0 ? '#facc15' : '#ef4444' }}>
                  <span>(=) RESULTADO NETO DEL EJERCICIO:</span>
                  <span>${utilidadNeta.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MÓDULO 5: NÓMINA TOTALMENTE EDITABLE ==================== */}
        {activeTab === 'nomina' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 0, color: '#38bdf8' }}>🧾 Liquidador de Nómina Editable (Colombia)</h2>

              {/* DEVENGADOS: SALARIO, COMISIONES Y HORAS EXTRAS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Salario Base ($)</label>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Comisiones ($)</label>
                  <input
                    type="number"
                    value={comisiones}
                    onChange={(e) => setComisiones(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#facc15', marginBottom: '0.4rem' }}>Horas Extras ($)</label>
                  <input
                    type="number"
                    value={horasExtras}
                    onChange={(e) => setHorasExtras(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #eab308', color: '#fef08a', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* DEDUCCIONES: SALUD Y PENSIÓN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>% Salud Empleado</label>
                  <input
                    type="number"
                    value={saludPct}
                    onChange={(e) => setSaludPct(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>% Pensión Empleado</label>
                  <input
                    type="number"
                    value={pensionPct}
                    onChange={(e) => setPensionPct(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                </div>
              </div>

              {/* AUXILIO DE TRANSPORTE */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeTransport}
                    onChange={(e) => setIncludeTransport(e.target.checked)}
                  />
                  Incluir Auxilio de Transporte ($)
                </label>
                {includeTransport && (
                  <input
                    type="number"
                    value={transportAllowance}
                    onChange={(e) => setTransportAllowance(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', marginTop: '0.4rem', padding: '0.5rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                )}
              </div>

              {/* RESUMEN DESGLOSADO DE LIQUIDACIÓN DE NÓMINA */}
              <div style={{ background: '#0f172a', padding: '1.1rem', borderRadius: '14px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Salario Básico:</span>
                  <span>${baseSalary.toLocaleString('es-CO')}</span>
                </div>
                {comisiones > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Comisiones:</span>
                    <span>${comisiones.toLocaleString('es-CO')}</span>
                  </div>
                )}
                {horasExtras > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#facc15', fontWeight: 700 }}>
                    <span>⚡ Horas Extras / Recargos:</span>
                    <span>+${horasExtras.toLocaleString('es-CO')}</span>
                  </div>
                )}
                {includeTransport && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Auxilio de Transporte:</span>
                    <span>${transportAllowance.toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px dashed #334155', paddingTop: '0.4rem', margin: '0.2rem 0', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#f8fafc' }}>
                  <span>Total Devengado:</span>
                  <span>${totalDevengado.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                  <span>Deducción Salud ({saludPct}%):</span>
                  <span>-${saludEmployee.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                  <span>Deducción Pensión ({pensionPct}%):</span>
                  <span>-${pensionEmployee.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ borderTop: '2px solid #38bdf8', paddingTop: '0.5rem', marginTop: '0.3rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#34d399', fontSize: '1.05rem' }}>
                  <span>Neto a Pagar al Empleado:</span>
                  <span>${netoPagar.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <button
                onClick={handleLoadDocFromNomina}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)'
                }}
              >
                📄 Generar Comprobante de Nómina (PDF)
              </button>
            </div>

            {/* TABLA DE PARAMETRIZACIÓN FISCAL Y HORAS EXTRAS CST */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 0, color: '#38bdf8' }}>🏛️ Parametrización Fiscal DIAN & Código Sustantivo del Trabajo</h2>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
                Todos los parámetros de devengados, horas extras y aportes de seguridad social se adaptan a la legislación laboral colombiana (CST).
              </p>

              <h4 style={{ fontSize: '0.9rem', color: '#facc15', margin: '0 0 0.75rem 0' }}>⚡ Tabla Referencial Recargos Horas Extras (Colombia):</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', background: '#0f172a', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.3rem' }}>
                  <span>Hora Extra Diurna (HED):</span>
                  <strong style={{ color: '#34d399' }}>+25% (Factor 1.25)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.3rem' }}>
                  <span>Hora Extra Nocturna (HEN):</span>
                  <strong style={{ color: '#38bdf8' }}>+75% (Factor 1.75)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.3rem' }}>
                  <span>Recargo Nocturno Ordinario (RN):</span>
                  <strong style={{ color: '#cbd5e1' }}>+35% (Factor 0.35)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.3rem' }}>
                  <span>Hora Extra Dominical / Festiva Diurna:</span>
                  <strong style={{ color: '#facc15' }}>+100% (Factor 2.00)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hora Extra Dominical / Festiva Nocturna:</span>
                  <strong style={{ color: '#f87171' }}>+150% (Factor 2.50)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MÓDULO GENERADOR DE COMPROBANTES Y RECIBOS EN PDF ==================== */}
        {activeTab === 'comprobantes' && (
          <div>
            {/* BARRA DE SELECCIÓN DE COMPROBANTE */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📄</span> Generador Institucional de Comprobantes PDF
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                    Diseñado para las 6 tipologías contables requeridas por el Instituto Fundetec (incluyendo Ventas y Facturación) con conversión automática de montos a letras e impresión oficial DIAN/NIIF.
                  </p>
                </div>

                <button
                  onClick={handleExportPDF}
                  style={{
                    padding: '0.7rem 1.4rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  📄 Exportar / Imprimir PDF
                </button>
              </div>

              {/* BOTONES PESTAÑAS DE DOCUMENTO */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {[
                  { id: 'factura_venta', label: '🧾 Factura / Comprobante de Venta', prefix: 'FV-2026-001' },
                  { id: 'egreso', label: '💳 Comprobante de Pagos / Egreso', prefix: 'CE-2026-001' },
                  { id: 'caja_general', label: '💵 Recibo de Caja General', prefix: 'RC-2026-001' },
                  { id: 'caja_menor', label: '🪙 Recibo de Caja Menor', prefix: 'RCM-2026-001' },
                  { id: 'nota_contable', label: '📝 Nota de Contabilidad', prefix: 'NC-2026-001' },
                  { id: 'comprobante_nomina', label: '🧾 Comprobante de Nómina', prefix: 'NOM-2026-001' }
                ].map(typeItem => (
                  <button
                    key={typeItem.id}
                    onClick={() => {
                      setDocType(typeItem.id as any);
                      setDocNumber(typeItem.prefix);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: docType === typeItem.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                      background: docType === typeItem.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                      color: docType === typeItem.id ? '#38bdf8' : '#cbd5e1',
                      fontWeight: docType === typeItem.id ? 800 : 500,
                      fontSize: '0.85rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {typeItem.label}
                  </button>
                ))}
              </div>
            </div>

            {/* EDICIÓN E INTERACCIÓN DEL DOCUMENTO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* FORMULARIO EDITABLE EN VIVO */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>✏️</span> Datos del Documento Contable
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Consecutivo N°</label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Fecha de Emisión</label>
                    <input
                      type="date"
                      value={docDate}
                      onChange={(e) => setDocDate(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                      {docType === 'factura_venta' || docType === 'caja_general' ? 'Cliente / Comprador (Tercero)' : docType === 'comprobante_nomina' ? 'Nombre del Empleado' : 'Pagado a (Beneficiario)'}
                    </label>
                    <input
                      type="text"
                      value={docTerceroName}
                      onChange={(e) => setDocTerceroName(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>NIT o C.C. Tercero</label>
                    <input
                      type="text"
                      value={docTerceroId}
                      onChange={(e) => setDocTerceroId(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Por Concepto de</label>
                  <textarea
                    rows={2}
                    value={docConcepto}
                    onChange={(e) => setDocConcepto(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#34d399', marginBottom: '0.3rem' }}>Monto Valor Total ($)</label>
                    <input
                      type="number"
                      value={docMonto}
                      onChange={(e) => setDocMonto(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #10b981', color: '#fff', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Ciudad</label>
                    <input
                      type="text"
                      value={docCity}
                      onChange={(e) => setDocCity(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    />
                  </div>
                </div>

                {docType !== 'nota_contable' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Forma de Pago</label>
                      <select
                        value={docFormaPago}
                        onChange={(e) => setDocFormaPago(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                        <option value="Cheque Bancario">Cheque Bancario</option>
                        <option value="Consignación Directa">Consignación Directa</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Banco / N° Cheque / Ref</label>
                      <input
                        type="text"
                        value={docBancoCheque}
                        onChange={(e) => setDocBancoCheque(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                      />
                    </div>
                  </div>
                )}

                {/* FILAS DE CUENTAS PUC EN DOCUMENTO */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Imputación Contable PUC (PDF)</label>
                    <button
                      onClick={() => setDocRows([...docRows, { accountCode: '1105', accountName: 'Caja General', debit: 0, credit: 0 }])}
                      style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      + Fila PUC
                    </button>
                  </div>

                  {docRows.map((r, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px 100px 30px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Código"
                        value={r.accountCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          const foundAcc = pucList.find(p => p.code === val);
                          const newRows = [...docRows];
                          newRows[idx] = {
                            ...newRows[idx],
                            accountCode: val,
                            accountName: foundAcc ? foundAcc.name : newRows[idx].accountName
                          };
                          setDocRows(newRows);
                        }}
                        style={{ padding: '0.4rem', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Nombre Cuenta"
                        value={r.accountName}
                        onChange={(e) => {
                          const newRows = [...docRows];
                          newRows[idx].accountName = e.target.value;
                          setDocRows(newRows);
                        }}
                        style={{ padding: '0.4rem', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.8rem' }}
                      />
                      <input
                        type="number"
                        placeholder="Débito"
                        value={r.debit || ''}
                        onChange={(e) => {
                          const newRows = [...docRows];
                          newRows[idx].debit = parseFloat(e.target.value) || 0;
                          setDocRows(newRows);
                        }}
                        style={{ padding: '0.4rem', borderRadius: '6px', background: '#0f172a', border: '1px solid #10b981', color: '#34d399', textAlign: 'right', fontSize: '0.8rem' }}
                      />
                      <input
                        type="number"
                        placeholder="Crédito"
                        value={r.credit || ''}
                        onChange={(e) => {
                          const newRows = [...docRows];
                          newRows[idx].credit = parseFloat(e.target.value) || 0;
                          setDocRows(newRows);
                        }}
                        style={{ padding: '0.4rem', borderRadius: '6px', background: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', textAlign: 'right', fontSize: '0.8rem' }}
                      />
                      <button
                        onClick={() => setDocRows(docRows.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* PERSONAS QUE FIRMAN */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Elaboró</label>
                    <input type="text" value={docFirmaElaboro} onChange={(e) => setDocFirmaElaboro(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.75rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Aprobó</label>
                    <input type="text" value={docFirmaAprobo} onChange={(e) => setDocFirmaAprobo(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.75rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Recibió Conforme</label>
                    <input type="text" value={docFirmaRecibio} onChange={(e) => setDocFirmaRecibio(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.75rem' }} />
                  </div>
                </div>
              </div>

              {/* VISTA PREVIA DEL DOCUMENTO IMPRESO EN VIVO */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid #000', padding: '1.5rem', color: '#000', fontFamily: 'Arial, sans-serif', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="https://fundetec.edu.co/assets/img/i-emp/logo_2026.webp" alt="Instituto Fundetec" style={{ height: '48px', width: 'auto' }} />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#000', fontWeight: 'bold' }}>INSTITUTO FUNDETEC</h3>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#333' }}>NIT: 800.192.839-4 • Educación Técnica Laboral</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', border: '2px solid #000', padding: '0.4rem 0.85rem', borderRadius: '6px', background: '#f8fafc' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {docType === 'factura_venta' && 'FACTURA DE VENTA / SERVICIOS'}
                      {docType === 'egreso' && 'COMPROBANTE DE EGRESO'}
                      {docType === 'caja_menor' && 'RECIBO DE CAJA MENOR'}
                      {docType === 'nota_contable' && 'NOTA DE CONTABILIDAD'}
                      {docType === 'caja_general' && 'RECIBO DE CAJA GENERAL'}
                      {docType === 'comprobante_nomina' && 'COMPROBANTE DE NÓMINA'}
                    </span>
                    <strong style={{ fontSize: '1rem', color: '#dc2626' }}>{docNumber}</strong>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem', fontWeight: 'bold', background: '#f1f5f9' }}>CIUDAD / FECHA:</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem' }}>{docCity}, {docDate}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem', fontWeight: 'bold', background: '#f1f5f9' }}>VALOR $:</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem', fontWeight: 'bold', fontSize: '0.95rem' }}>${docMonto.toLocaleString('es-CO')}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem', fontWeight: 'bold', background: '#f1f5f9' }}>
                        {docType === 'factura_venta' || docType === 'caja_general' ? 'CLIENTE / COMPRADOR:' : docType === 'comprobante_nomina' ? 'EMPLEADO:' : 'PAGADO A:'}
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem' }}>{docTerceroName}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem', fontWeight: 'bold', background: '#f1f5f9' }}>NIT / C.C.:</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem' }}>{docTerceroId}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem', fontWeight: 'bold', background: '#f1f5f9' }}>MONTO EN LETRAS:</td>
                      <td colSpan={3} style={{ border: '1px solid #ccc', padding: '0.35rem', fontStyle: 'italic', fontWeight: 'bold', fontSize: '0.75rem' }}>
                        {numberToWordsES(docMonto)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '0.35rem', fontWeight: 'bold', background: '#f1f5f9' }}>CONCEPTO:</td>
                      <td colSpan={3} style={{ border: '1px solid #ccc', padding: '0.35rem' }}>{docConcepto}</td>
                    </tr>
                  </tbody>
                </table>

                {/* TABLA PUC RESUMEN */}
                <h5 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Imputación Contable PUC</h5>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', border: '1px solid #000' }}>
                      <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'left' }}>PUC</th>
                      <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'left' }}>CUENTA</th>
                      <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'right' }}>DÉBITO</th>
                      <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'right' }}>CRÉDITO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docRows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ border: '1px solid #ccc', padding: '0.25rem', fontWeight: 'bold' }}>{r.accountCode}</td>
                        <td style={{ border: '1px solid #ccc', padding: '0.25rem' }}>{r.accountName}</td>
                        <td style={{ border: '1px solid #ccc', padding: '0.25rem', textAlign: 'right' }}>{r.debit > 0 ? `$${r.debit.toLocaleString('es-CO')}` : '-'}</td>
                        <td style={{ border: '1px solid #ccc', padding: '0.25rem', textAlign: 'right' }}>{r.credit > 0 ? `$${r.credit.toLocaleString('es-CO')}` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* FIRMAS EN VISTA PREVIA */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '2rem' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.3rem', textAlign: 'center', fontSize: '0.65rem' }}>
                    <strong>ELABORÓ:</strong>
                    <p style={{ margin: 0 }}>{docFirmaElaboro}</p>
                  </div>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.3rem', textAlign: 'center', fontSize: '0.65rem' }}>
                    <strong>APROBÓ:</strong>
                    <p style={{ margin: 0 }}>{docFirmaAprobo}</p>
                  </div>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.3rem', textAlign: 'center', fontSize: '0.65rem' }}>
                    <strong>RECIBIÓ CONFORME:</strong>
                    <p style={{ margin: 0 }}>{docFirmaRecibio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MÓDULO 6: RETOS DIARIOS ANTI-SUPLANTACIÓN ==================== */}
        {activeTab === 'retos' && (
          <div>
            <div style={{ marginBottom: '1.5rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1rem', borderRadius: '14px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#38bdf8' }}>🗓️ Retos Contables del Día (Generados por Semilla Diaria)</h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
                Estos ejercicios cambian automáticamente cada día para garantizar que cada jornada académica del Instituto Fundetec responda a casos prácticos únicos.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {dailyChallenges.map(r => (
                <div
                  key={r.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '1.5rem'
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1rem' }}>{r.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', background: '#0f172a', padding: '0.75rem', borderRadius: '8px' }}>{r.scenario}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#34d399', marginBottom: '0.2rem' }}>Cuenta a Debitar</label>
                      <select
                        value={retoSelectedDebit[r.id] || ''}
                        onChange={(e) => setRetoSelectedDebit({ ...retoSelectedDebit, [r.id]: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                      >
                        <option value="">-- Seleccionar Cuenta Débito --</option>
                        {pucList.map(a => (
                          <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '0.2rem' }}>Cuenta a Acreditar</label>
                      <select
                        value={retoSelectedCredit[r.id] || ''}
                        onChange={(e) => setRetoSelectedCredit({ ...retoSelectedCredit, [r.id]: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                      >
                        <option value="">-- Seleccionar Cuenta Crédito --</option>
                        {pucList.map(a => (
                          <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleVerifyReto(r)}
                      style={{
                        alignSelf: 'end',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '8px',
                        background: '#0284c7',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Evaluar Reto
                    </button>
                  </div>

                  {retoResults[r.id] !== undefined && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: retoResults[r.id] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: retoResults[r.id] ? '1px solid #10b981' : '1px solid #ef4444',
                      fontSize: '0.85rem'
                    }}>
                      <strong>{retoResults[r.id] ? '🎉 ¡Excelente! Asiento Correcto' : '❌ Revisa las Cuentas seleccionadas'}</strong>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#cbd5e1' }}>{r.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== MÓDULO 7: TUTOR IA SOCRÁTICO ==================== */}
        {activeTab === 'tutorIA' && (
          <div style={{ maxWidth: '850px', margin: '0 auto', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                🤖
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Profesor IA Socrático Fundetec</h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#38bdf8' }}>● En línea • Mentor de Aprendizaje Guiado</p>
              </div>
            </div>

            <div style={{ height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(30, 41, 59, 0.8)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {isAiLoading && (
                <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '0.85rem' }}>
                  El Profesor IA está formulando una guía socrática... 💭
                </div>
              )}
            </div>

            <form onSubmit={handleSendAiQuestion} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Hazle una pregunta conceptual al Profesor IA..."
                value={inputAiQuestion}
                onChange={(e) => setInputAiQuestion(e.target.value)}
                style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.9rem' }}
              />
              <button
                type="submit"
                disabled={isAiLoading}
                style={{ padding: '0.85rem 1.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                Enviar
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
