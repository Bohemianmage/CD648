import { useEffect } from 'react';
import Layout from '../components/Layout';
import { useTranslation, Trans } from 'react-i18next';
import useRevealOnScroll from '../hooks/useRevealOnScroll';

export default function Reglamento() {
  const { t } = useTranslation();
  useRevealOnScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const puntos = [
    'punto1', 'punto2', 'punto3', 'punto4', 'punto5',
    'punto6', 'punto7', 'punto8', 'punto9', 'punto10',
    'punto11', 'punto12'
  ];

  const extras = ['reservaciones', 'cancelaciones'];

  return (
    <Layout>
      <div className="bg-white min-h-screen relative">
        <section className="max-w-3xl mx-auto px-4 py-12 text-justify">
          {/* Título principal */}
          <h1 className="text-3xl font-bold mb-8 reveal text-[#1c1c1c]">
            {t('reglamento.titulo')}
          </h1>

          {/* Reglas principales */}
          <div className="space-y-6">
            {puntos.map((clave, idx) => (
              <div
                key={clave}
                className="flex items-start gap-4 reveal opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                <span className="text-[#9c968b] font-semibold w-8 flex-shrink-0 text-sm mt-[1px]">
                  {`${(idx + 1).toString().padStart(2, '0')}.`}
                </span>
                <p className="text-sm leading-relaxed text-gray-800">
                  <Trans i18nKey={`reglamento.${clave}`} components={{ strong: <strong /> }} />
                </p>
              </div>
            ))}
          </div>

          {/* Línea divisoria */}
          <hr className="my-10 border-gray-200" />

          {/* Título sin numeración */}
<h2 className="text-xl sm:text-xl font-bold tracking-wide text-[#1c1c1c] mb-6 reveal uppercase">
  {t('reglamento.suplementarios')}
</h2>

          {/* Reglas suplementarias con nueva numeración */}
          <div className="space-y-6">
            {extras.map((clave, i) => (
              <div
                key={clave}
                className="flex items-start gap-4 reveal opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${(puntos.length + i + 2) * 60}ms` }}
              >
                <span className="text-[#9c968b] font-semibold w-8 flex-shrink-0 text-sm mt-[1px]">
                  {`${(i + 1).toString().padStart(2, '0')}.`}
                </span>
                <p className="text-sm leading-relaxed text-gray-800">
                  <Trans i18nKey={`reglamento.${clave}`} components={{ strong: <strong /> }} />
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}