import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Navbar({ onOpenReserva }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [aboutMobileOpen, setAboutMobileOpen] = useState(false); // 🔄 Nuevo estado
  const langDropdownRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const aboutTimeout = useRef();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
    if (window.innerWidth >= 768) setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(event.target)
      ) {
        setAboutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleScrollOrNavigate = (id) => {
    if (location.pathname === '/') {
      scrollToSection(id);
    } else {
      setTimeout(() => {
        sessionStorage.setItem('scrollTo', id);
        navigate('/');
      }, 50);
    }
    setMenuOpen(false);
    setAboutDropdownOpen(false);
    setAboutMobileOpen(false);
  };

  const handleCatalogClick = () => {
    navigate('/catalog');
    setMenuOpen(false);
  };

  const flagSrc = {
    es: '/icons/flags/es.svg',
    en: '/icons/flags/us.svg',
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center h-24 px-6 md:px-12">
        {/* 🏨 Logo */}
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            if (location.pathname === '/') {
              const el = document.getElementById('hero');
              if (el) {
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            } else {
              sessionStorage.setItem('scrollTo', 'hero');
              navigate('/');
            }
          }}
        >
          <img
            src="/img/cd648-logo.png"
            alt="CD648 Logo"
            className="h-16 md:h-20 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
          />
        </Link>

        {/* 🌐 Menú principal */}
        <div className="flex items-center gap-6 relative">
          {/* 📱 Menú hamburguesa */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-800"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* 🔤 Menú Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {/* 🔽 About Dropdown */}
            <div
              className="relative"
              ref={aboutDropdownRef}
              onMouseEnter={() => {
                clearTimeout(aboutTimeout.current);
                setAboutDropdownOpen(true);
              }}
              onMouseLeave={() => {
                aboutTimeout.current = setTimeout(() => setAboutDropdownOpen(false), 200);
              }}
            >
              <button className="transition-transform hover:scale-105 flex items-center gap-1">
                {t('navbar.about')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`absolute left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[160px] py-2 text-sm transition-all duration-200 ease-out transform ${aboutDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <button onClick={() => handleScrollOrNavigate('sobre')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  {t('navbar.about')}
                </button>
                <button onClick={() => handleScrollOrNavigate('galeria')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  {t('navbar.pictures')}
                </button>
                <button onClick={() => handleScrollOrNavigate('concierge')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  {t('navbar.concierge')}
                </button>
                <button onClick={() => handleScrollOrNavigate('location')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  {t('navbar.location')}
                </button>
              </div>
            </div>

            <button onClick={handleCatalogClick} className="transition-transform hover:scale-105">
              {t('navbar.catalog')}
            </button>
            <button onClick={() => { navigate('/rules'); setMenuOpen(false); }} className="transition-transform hover:scale-105">
              {t('navbar.rules')}
            </button>
            <button
              onClick={onOpenReserva}
              className="bg-[#1f3142] text-white px-4 py-2 text-sm md:text-base rounded hover:bg-[#2d4560] transition-all duration-200 ease-in-out transform hover:scale-105 font-semibold shadow-lg animate-pulse-strong"
            >
              {t('navbar.book')}
            </button>

            {/* 🌍 Idioma */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded transition"
              >
                <img
                  src={flagSrc[i18n.language] || flagSrc.en}
                  alt="Idioma actual"
                  className="h-5 w-5 object-cover rounded-full"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[140px] py-1 text-sm transition-all duration-200 ease-out transform ${langDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <button onClick={() => handleLanguageChange('es')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left">
                  <img src="/icons/flags/es.svg" alt="Español" className="h-5 w-5 object-cover rounded-full" />
                  <span>Español</span>
                </button>
                <button onClick={() => handleLanguageChange('en')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left">
                  <img src="/icons/flags/us.svg" alt="English" className="h-5 w-5 object-cover rounded-full" />
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Menú móvil */}
      {menuOpen && (
  <nav className="md:hidden flex flex-col items-center gap-4 py-4 bg-white border-t border-gray-200 text-base">
    <div className="flex flex-col gap-2 w-full px-4 items-center">
      {/* 📌 Botón About centrado con dropdown */}
      <div className="w-full max-w-xs">
        <button
          onClick={() => setAboutMobileOpen(!aboutMobileOpen)}
          className="w-full text-center px-2 py-1 hover:bg-gray-100 rounded flex justify-between items-center"
        >
          <span className="mx-auto">{t('navbar.about')}</span>
          <span className={`transition-transform ${aboutMobileOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {aboutMobileOpen && (
          <div className="mt-1 flex flex-col gap-1 items-center">
            <button
              onClick={() => handleScrollOrNavigate('galeria')}
              className="text-center w-full px-2 py-1 hover:bg-gray-100 rounded"
            >
              {t('navbar.pictures')}
            </button>
            <button
              onClick={() => handleScrollOrNavigate('concierge')}
              className="text-center w-full px-2 py-1 hover:bg-gray-100 rounded"
            >
              {t('navbar.concierge')}
            </button>
            <button
              onClick={() => handleScrollOrNavigate('location')}
              className="text-center w-full px-2 py-1 hover:bg-gray-100 rounded"
            >
              {t('navbar.location')}
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Resto del menú... */}
    <button onClick={handleCatalogClick} className="transition-transform hover:scale-105">
      {t('navbar.catalog')}
    </button>
    <button onClick={() => { navigate('/rules'); setMenuOpen(false); }} className="transition-transform hover:scale-105">
      {t('navbar.rules')}
    </button>
    <button
      onClick={onOpenReserva}
      className="min-w-[120px] bg-[#1f3142] text-white px-4 py-2 text-base rounded hover:bg-[#2d4560] transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg animate-pulse-strong"
    >
      {t('navbar.book')}
    </button>

    {/* 🌍 Idioma móvil */}
    <div className="flex gap-4 items-center">
      <button onClick={() => handleLanguageChange('es')}>
        <img src="/icons/flags/es.svg" alt="Español" className={`h-6 w-6 object-cover rounded-full transition hover:scale-110 ${i18n.language === 'es' ? 'opacity-100' : 'opacity-50'}`} />
      </button>
      <button onClick={() => handleLanguageChange('en')}>
        <img src="/icons/flags/us.svg" alt="English" className={`h-6 w-6 object-cover rounded-full transition hover:scale-110 ${i18n.language === 'en' ? 'opacity-100' : 'opacity-50'}`} />
      </button>
    </div>
  </nav>
)}
    </header>
  );
}