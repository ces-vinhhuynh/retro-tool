import { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type AgreementInsert = TablesInsert<'agreements'>;
export type AgreementUpdate = TablesUpdate<'agreements'>;
export type Agreement = Tables<'agreements'>;
