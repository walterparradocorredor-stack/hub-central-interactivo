export interface AccountPUC {
  code: string;
  name: string;
  category: 'Activo' | 'Pasivo' | 'Patrimonio' | 'Ingresos' | 'Gastos' | 'Costos';
  nature: 'Débito' | 'Crédito';
  description: string;
}

export const PUC_DATABASE: AccountPUC[] = [
  // 1. ACTIVOS
  { code: '1105', name: 'Caja General', category: 'Activo', nature: 'Débito', description: 'Dinero en efectivo disponible inmediatamente en la empresa.' },
  { code: '1110', name: 'Bancos', category: 'Activo', nature: 'Débito', description: 'Depósitos y fondos disponibles en entidades financieras.' },
  { code: '1305', name: 'Clientes Nacionales', category: 'Activo', nature: 'Débito', description: 'Cuentas por cobrar a clientes por venta de bienes o servicios a crédito.' },
  { code: '1435', name: 'Inventario de Mercancías no Fabricadas', category: 'Activo', nature: 'Débito', description: 'Bienes adquiridos para la venta en el giro ordinario del negocio.' },
  { code: '1524', name: 'Equipo de Oficina', category: 'Activo', nature: 'Débito', description: 'Muebles, enseres y escritorios propiedad de la institución o empresa.' },
  { code: '1528', name: 'Equipo de Cómputo y Procesamiento', category: 'Activo', nature: 'Débito', description: 'Computadores, servidores y periféricos utilizados para la operación.' },

  // 2. PASIVOS
  { code: '2205', name: 'Proveedores Nacionales', category: 'Pasivo', nature: 'Crédito', description: 'Obligaciones por pagar a proveedores por compras a crédito.' },
  { code: '2335', name: 'Costos y Gastos por Pagar', category: 'Pasivo', nature: 'Crédito', description: 'Deudas acumuladas pendientes de pago por servicios o insumos recibidos.' },
  { code: '2365', name: 'Retención en la Fuente por Pagar', category: 'Pasivo', nature: 'Crédito', description: 'Impuestos retenidos a terceros a favor de la DIAN.' },
  { code: '2408', name: 'Impuesto Sobre las Ventas por Pagar (IVA)', category: 'Pasivo', nature: 'Crédito', description: 'IVA generado en ventas menos IVA descontable en compras.' },
  { code: '2505', name: 'Salarios por Pagar', category: 'Pasivo', nature: 'Crédito', description: 'Obligación laboral acumulada pendiente de desembolso a empleados.' },

  // 3. PATRIMONIO
  { code: '3115', name: 'Aportes Sociales', category: 'Patrimonio', nature: 'Crédito', description: 'Capital inicial entregado por los socios o propietarios para constituir la empresa.' },
  { code: '3605', name: 'Utilidad del Ejercicio', category: 'Patrimonio', nature: 'Crédito', description: 'Ganancia neta generada por las operaciones al cierre del período.' },
  { code: '3610', name: 'Pérdida del Ejercicio', category: 'Patrimonio', nature: 'Débito', description: 'Resultado negativo u operativo de pérdida en el período.' },

  // 4. INGRESOS
  { code: '4135', name: 'Comercio al por Mayor y al por Menor', category: 'Ingresos', nature: 'Crédito', description: 'Ingresos operacionales recibidos por venta de mercancías.' },
  { code: '4170', name: 'Otras Actividades de Servicios', category: 'Ingresos', nature: 'Crédito', description: 'Ingresos operacionales por matrícula y servicios educativos (Fundetec).' },

  // 5. GASTOS
  { code: '5105', name: 'Gastos de Personal (Sueldos y Prestaciones)', category: 'Gastos', nature: 'Débito', description: 'Nómina, seguridad social y prestaciones del personal administrativo.' },
  { code: '5120', name: 'Arrendamientos', category: 'Gastos', nature: 'Débito', description: 'Costo por alquiler de sedes, locales o equipos.' },
  { code: '5135', name: 'Servicios Públicos (Agua, Luz, Internet)', category: 'Gastos', nature: 'Débito', description: 'Gastos operacionales de energía, acueducto y conectividad.' },
  { code: '5205', name: 'Gastos de Ventas y Publicidad', category: 'Gastos', nature: 'Débito', description: 'Inversión en marketing, publicidad y mercadeo.' },

  // 6. COSTOS DE VENTA
  { code: '6135', name: 'Costo de Ventas de Mercancías', category: 'Costos', nature: 'Débito', description: 'Costo de adquisición de los bienes comercializados y vendidos.' }
];
