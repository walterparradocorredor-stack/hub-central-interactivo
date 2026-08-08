import { NextResponse } from 'next/server';
import { TLD_PRICING } from '@/lib/namecheap';

export async function GET() {
  const formattedPricing = Object.entries(TLD_PRICING).map(([tld, data]) => ({
    tld: `.${tld}`,
    priceUsd: data.usd,
    priceCop: data.cop,
    popular: !!data.popular,
    label: data.label || ''
  }));

  return NextResponse.json({
    pricing: formattedPricing,
    currency: 'COP',
    updatedAt: new Date().toISOString()
  });
}
