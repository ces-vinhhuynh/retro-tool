import { User } from '@supabase/supabase-js';

import supabaseClient from '@/lib/supabase/client';
import { GOOGLE_CALENDAR_SCOPES } from '@/utils/constant';

export type AuthResponse = {
  url: string;
} | null;

export const authService = {
  signInWithGoogle: async (next?: string): Promise<AuthResponse> => {
    const redirectTo = `${window.location.origin}/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ''
    }`;

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes: GOOGLE_CALENDAR_SCOPES,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return data;
  },

  logout: async (): Promise<void> => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();
    if (sessionError || !sessionData?.session) return null;

    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  },

  signUp: async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<User | null> => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    return data.user;
  },

  signInWithEmail: async (
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<User | null> => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');

      await supabaseClient.auth.refreshSession();
    } else {
      localStorage.removeItem('rememberMe');
    }

    return data.user;
  },

  forgotPassword: async (email: string): Promise<void> => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) throw error;
  },

  updatePassword: async (password: string): Promise<void> => {
    const { error } = await supabaseClient.auth.updateUser({
      password,
    });
    if (error) throw error;
  },
};
