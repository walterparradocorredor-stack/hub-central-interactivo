export interface RetoDiario {
  id: string;
  title: string;
  scenario: string;
  companyName: string;
  amount: number;
  expectedDebitCode: string;
  expectedCreditCode: string;
  explanation: string;
}

// Función pseudo-aleatoria basada en semilla diaria
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function getDailyChallenges(dateString?: string): RetoDiario[] {
  const todayStr = dateString || new Date().toISOString().split('T')[0];
  
  // Convertir fecha YYYY-MM-DD a un número semilla entero
  let seedNum = 0;
  for (let i = 0; i < todayStr.length; i++) {
    seedNum += todayStr.charCodeAt(i);
  }

  const empresas = [
    'Comercializadora Fundetec S.A.S.',
    'Dotaciones del Caribe Ltda.',
    'Inversiones Sabana Meta E.U.',
    'Distribuidora J&M Tech S.A.S.',
    'Soluciones Educativas Sucre S.A.S.',
    'Suministros del Llano S.A.'
  ];

  const empIndex = Math.floor(seededRandom(seedNum + 1) * empresas.length);
  const company = empresas[empIndex];

  const mult = Math.floor(seededRandom(seedNum + 2) * 50) + 10;
  const val1 = mult * 100000; // Ej: 3.500.000
  const val2 = (mult + 5) * 80000;
  const val3 = (mult + 2) * 120000;

  return [
    {
      id: `reto-1-${todayStr}`,
      title: '📌 Reto 1: Consignación Inicial en Banco',
      companyName: company,
      amount: val1,
      scenario: `La empresa ${company} realiza una consignación en efectivo tomada de la Caja General hacia la cuenta de Banco Colombia por un monto de $${val1.toLocaleString('es-CO')}.`,
      expectedDebitCode: '1110', // Bancos
      expectedCreditCode: '1105', // Caja General
      explanation: 'Ingresa dinero a la cuenta de Bancos (Activo aumenta en el Débito - 1110) y sale dinero de la Caja General (Activo disminuye en el Crédito - 1105).'
    },
    {
      id: `reto-2-${todayStr}`,
      title: '🛒 Reto 2: Compra de Mercancía a Crédito',
      companyName: company,
      amount: val2,
      scenario: `La empresa ${company} compra mercancía no fabricada por la empresa por valor de $${val2.toLocaleString('es-CO')} a crédito con 30 días de plazo al proveedor nacional.`,
      expectedDebitCode: '1435', // Inventario
      expectedCreditCode: '2205', // Proveedores
      explanation: 'Aumenta el inventario de mercancías (Activo al Débito - 1435) y se adquiere una obligación con Proveedores Nacionales (Pasivo al Crédito - 2205).'
    },
    {
      id: `reto-3-${todayStr}`,
      title: '💰 Reto 3: Venta de Servicios Educativos en Efectivo',
      companyName: company,
      amount: val3,
      scenario: `La empresa ${company} presta un servicio de capacitación técnica por $${val3.toLocaleString('es-CO')} recibiendo el pago total de inmediato en efectivo en Caja.`,
      expectedDebitCode: '1105', // Caja
      expectedCreditCode: '4170', // Servicios
      explanation: 'Ingresa el dinero a la Caja (Activo al Débito - 1105) y se reconoce un ingreso por servicios operacionales (Ingreso al Crédito - 4170).'
    },
    {
      id: `reto-4-${todayStr}`,
      title: '💻 Reto 4: Adquisición de Equipo de Cómputo',
      companyName: company,
      amount: 4500000 + (seedNum % 7) * 250000,
      scenario: `Se adquiere un computador de última tecnología para la administración por $${(4500000 + (seedNum % 7) * 250000).toLocaleString('es-CO')} pagado directamente desde la cuenta bancaria.`,
      expectedDebitCode: '1528', // Equipo de Cómputo
      expectedCreditCode: '1110', // Bancos
      explanation: 'Ingresa una propiedad y equipo (Activo Equipo de Cómputo al Débito - 1528) y disminuye el saldo bancario (Activo Bancos al Crédito - 1110).'
    },
    {
      id: `reto-5-${todayStr}`,
      title: '🏢 Reto 5: Pago de Arrendamiento de Sede',
      companyName: company,
      amount: 1800000 + (seedNum % 5) * 150000,
      scenario: `Se paga el valor del arriendo mensual del local comercial por $${(1800000 + (seedNum % 5) * 150000).toLocaleString('es-CO')} mediante transferencia electrónica de Bancos.`,
      expectedDebitCode: '5120', // Arrendamientos
      expectedCreditCode: '1110', // Bancos
      explanation: 'Se reconoce el gasto operacional de arrendamiento (Gasto al Débito - 5120) y sale el dinero de la cuenta de Bancos (Activo al Crédito - 1110).'
    }
  ];
}
