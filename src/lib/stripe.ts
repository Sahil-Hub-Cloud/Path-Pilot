import { loadStripe } from '@stripe/stripe-js';
import type { Stripe as StripeClient } from '@stripe/stripe-js';
import StripeServer from 'stripe';

let serverClient: StripeServer | null = null;

function getServerClient(): StripeServer {
  if (serverClient) return serverClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  serverClient = new StripeServer(secretKey, {
    apiVersion: '2025-12-15.clover' as any,
    typescript: true,
  });

  return serverClient;
}

export const stripe = new Proxy({} as StripeServer, {
  get(_target, prop) {
    const client = getServerClient();
    const value = Reflect.get(client as object, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export const getStripe = (publishableKey: string): Promise<StripeClient | null> => {
  return loadStripe(publishableKey);
};
