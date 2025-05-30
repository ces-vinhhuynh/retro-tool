import { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type Team = Tables<'teams'>;
export type TeamUser = Tables<'team_users'>;
export type TeamUserInsert = TablesInsert<'team_users'>;
export type TeamUserUpdate = TablesUpdate<'team_users'>;
export type TeamInsert = TablesInsert<'teams'>;
export type TeamUpdate = TablesUpdate<'teams'>;
