import { loadStripe, type Stripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

let serverClient: Stripe | null = null;

function getServerClient(): Stripe {
  if (serverClient) return serverClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  serverClient = new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover' as any,
    typescript: true,
  });

  return serverClient;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getServerClient();
    const value = Reflect.get(client as object, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export const getStripe = (publishableKey: string) => {
  return loadStripe(publishableKey);
};
