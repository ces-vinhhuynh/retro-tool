import { User } from '@supabase/supabase-js';

import supabaseClient from '@/lib/supabase/client';

export type AuthResponse = {
  url: string;
} | null;

export const authService = {
  signInWithGoogle: async (): Promise<AuthResponse> => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
};
