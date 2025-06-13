import { loadStripe } from '@stripe/stripe-js';

// Clave pública (modo test)
const stripePromise = loadStripe('pk_test_51RYCZiCyooQFv5CYoJPGLMgU08zDZrjir8tIPhKycK4d6UxrFzWkPcmrFmUM2afDCuimbNMYaKtCSNoNNqqwOSTX00jffGmOUy');

/**
 * iniciarPagoStripe
 *
 * Función que inicia el pago con Stripe (usa una sesión generada en backend).
 * Parámetros:
 * - monto: número en pesos mexicanos
 * - descripcion: texto visible en Stripe
 * - habitacionId: ID de la habitación seleccionada (1, 2, 3)
 * - cantidadPersonas: número total de personas (adultos + niños)
 */
export default async function iniciarPagoStripe({ monto, descripcion, habitacionId, cantidadPersonas }) {
  const stripe = await stripePromise;

  if (!stripe) {
    alert('Stripe no está disponible.');
    return;
  }

  try {
    const response = await fetch('https://www.cd648.com/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: monto * 100,
        description: descripcion,
        habitacionId,
        cantidadPersonas,
      }),
    });

    const { id: sessionId } = await response.json();

    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      console.error(result.error.message);
      alert('Error al redirigir a Stripe');
    }
  } catch (err) {
    console.error(err);
    alert('Hubo un problema al iniciar el pago.');
  }
}