import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import apiClient from '../apiclient/apiClient';
import type { ApiResponseWithData } from '../types/api';

// Ensure you have your Stripe public key in your environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  plan: 'monthly' | 'yearly';
}

interface SignUpResult {
  loading: boolean;
  error: string | null;
  createCheckoutSession: (data: SignUpData) => Promise<void>;
}

const useSignUp = (): SignUpResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (data: SignUpData) => {
    setLoading(true);
    setError(null);
    try {
      const { plan, ...userData } = data;
      const response = await apiClient.post<{ sessionId: string }>(
        `api/payment/create-checkout-session?plan=${plan}`,
        userData
      );

      if (response && response.sessionId) {
        const sessionId = response.sessionId;

        if (sessionId) {
          const stripe = await stripePromise;
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
              setError(error.message || 'Failed to redirect to Stripe.');
            }
          } else {
            setError('Stripe.js has not loaded yet.');
          }
        } else {
          setError('Failed to retrieve a session ID.');
        }
      } else {
        setError('Failed to create checkout session.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createCheckoutSession };
};

export default useSignUp;

