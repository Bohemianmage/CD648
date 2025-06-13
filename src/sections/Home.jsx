import { Navbar } from '../components/Navbar';
import Hero from '../sections/Hero';
import Sobre from '../sections/Sobre';
import SmartRooms from '../sections/SmartRooms';
import { Cabanas } from '../sections/Cabanas';
import { Reglamento } from '../sections/Reglamento';
import { Footer } from '../sections/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Reserva from '../sections/Reserva';

export default function Home() {
  return (
    <div className="font-sans text-[#1c1c1c] bg-[#dedbd5] relative">
      <Navbar />
      <Hero />
      <Sobre />
      <SmartRooms />
      <Cabanas />
      <Reserva />
      <Reglamento />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}