import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { amount, description } = req.body;

  if (!amount || !description) {
    console.error('Faltan parámetros:', { amount, description });
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: { name: description },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://cd648.com?success=true',
      cancel_url: 'https://cd648.com?cancelled=true',
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creando sesión:', error);
    return res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
}