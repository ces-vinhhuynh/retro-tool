import { User } from '@/features/health-check/types/health-check';
import supabaseClient from '@/lib/supabase/client';

class UsersService {
  async getUsers(): Promise<User[] | null> {
    const { data, error } = await supabaseClient.from('users').select('*');
    if (error) throw error;
    return data;
  }
}

export const usersService = new UsersService();
