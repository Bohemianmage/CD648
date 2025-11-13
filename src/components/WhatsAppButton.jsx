import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">

      {/* Botón de WhatsApp */}
      <a
        href="https://wa.me/5215540582192"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce"
      >
        <FaWhatsapp className="text-white text-2xl" />
      </a>
    </div>
  );
}