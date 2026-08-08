import { NextResponse } from 'next/server';
import { RESELLER_SERVICES } from '@/lib/servicesCatalog';

export async function GET() {
  return NextResponse.json({
    services: RESELLER_SERVICES,
    currency: 'COP',
    updatedAt: new Date().toISOString()
  });
}
