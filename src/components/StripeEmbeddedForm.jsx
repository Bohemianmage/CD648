import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * StripeEmbeddedForm
 *
 * Formulario embebido para ingresar tarjeta y confirmar el pago.
 * Props:
 * - monto: cantidad en pesos (ej. 1200)
 * - descripcion: texto para el resumen
 * - onSuccess: callback que se llama cuando el pago fue exitoso
 */
export default function StripeEmbeddedForm({ monto, descripcion, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !cardComplete) return;

    setLoading(true);

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: monto * 100,
        description: descripcion,
      }),
    });

    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <CardElement
        className="p-3 border rounded-md bg-white"
        onChange={(event) => setCardComplete(event.complete)}
      />
      <button
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className={`w-full flex items-center justify-center gap-2 bg-[#1f3142] text-white font-semibold py-3 rounded hover:bg-[#2d4560] transition ${
          loading || !cardComplete ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        )}
        {loading ? t('reserva.procesando') : t('reserva.pagar')}
      </button>
    </form>
  );
}