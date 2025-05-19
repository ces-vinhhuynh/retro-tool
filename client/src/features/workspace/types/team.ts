import { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type Team = Tables<'teams'>;
export type TeamUser = Tables<'team_users'>;
export type TeamInsert = TablesInsert<'teams'>;
export type TeamUpdate = TablesUpdate<'teams'>;