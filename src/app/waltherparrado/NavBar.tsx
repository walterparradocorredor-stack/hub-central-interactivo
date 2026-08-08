'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: 'Cotizar', href: '/cotizar-web' },
    { label: 'Sobre mí', href: '/about' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Seminarios', href: '/seminars' },
    { label: 'Oficinas', href: '/office' },
    { label: 'Aula Virtual', href: '/aula' },
    { label: 'Contacto', href: '/contact' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      const [_, hash] = href.split('#');
      const element = document.getElementById(hash);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${hash}`);
      }
    }
  };

  React.useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    handleHashScroll();
    
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [pathname]);

  return (
    <nav
      id="navbar-walther"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(28, 43, 58, 0.90)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(182, 146, 85, 0.15)',
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 h-[70px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          className="flex items-center gap-2.5 no-underline shrink-0"
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/icon-white-transparent.png"
              alt="Logo Walther Parrado"
              fill
              style={{ objectFit: 'contain' }}
              sizes="36px"
            />
          </div>
          <div>
            <p className="wl-serif whitespace-nowrap" style={{ color: '#f4f2ee', fontWeight: '500', fontSize: '1.15rem', lineHeight: 1.1 }}>
              <span className="block md:hidden">W. Parrado</span>
              <span className="hidden md:block">Walther Parrado</span>
            </p>
            <p className="wl-sans whitespace-nowrap" style={{ color: '#bfac83', fontSize: '0.52rem', letterSpacing: '0.22em', fontWeight: '400', marginTop: '2px' }}>
              <span className="block md:hidden">CONSULTOR · IA</span>
              <span className="hidden md:block">INGENIERO · CONSULTOR · IA</span>
            </p>
          </div>
        </Link>


        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3.5 xl:gap-5 shrink">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/ /g, '-')}`}
              className="nav-link whitespace-nowrap"
              style={{ fontSize: '0.78rem', padding: '4px 2px' }}
              onClick={(e) => handleClick(e, item.href)}
            >
              {item.label}
            </Link>
          ))}
          <a
            id="nav-whatsapp"
            href="https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20me%20comunico%20desde%20su%20sitio%20web."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary whitespace-nowrap shrink-0"
            style={{ padding: '7px 16px', fontSize: '0.78rem' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="mr-1 inline-block">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Mobile Hamburguer Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden flex-col justify-center items-center w-8 h-8 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white transition-all focus:outline-none"
          aria-label="Abrir menú"
        >
          <span
            className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current transition-all duration-300 my-0.5 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-slate-800/40 ${
          isOpen ? 'max-h-[450px] border-b border-t mt-1' : 'max-h-0 border-b-0'
        }`}
        style={{
          background: 'rgba(8, 12, 24, 0.95)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        <div className="flex flex-col px-6 py-4 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                setIsOpen(false);
                handleClick(e, item.href);
              }}
              className="text-gray-400 hover:text-white text-sm font-semibold tracking-wide transition-colors py-1"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://api.whatsapp.com/send?phone=573017640850&text=Hola%20Dr.%20Walther%2C%20me%20comunico%20desde%20su%20sitio%20web."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center justify-center text-xs w-full py-2.5 mt-2"
          >
            Escríbeme por WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
