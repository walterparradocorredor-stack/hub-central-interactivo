import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WP Ecosystem — Ecosistema Empresarial Walther Parrado',
  description: 'Plataforma oficial del holding de Walther Parrado',
};

import AIChatBubble from '@/components/AIChatBubble';

export default function EcosistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AIChatBubble />
    </>
  );
}
