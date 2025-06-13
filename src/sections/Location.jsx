import { useTranslation } from 'react-i18next';
import { LocationMap } from '../components/LocationMap';

export function Location() {
  const { t } = useTranslation();

  return (
    <section id="location" className="bg-white pt-4 pb-16 px-6 md:px-12">
      <div className="w-full max-w-8xl mx-auto">
        <LocationMap />
      </div>
    </section>
  );
}