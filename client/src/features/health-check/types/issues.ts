import { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type IssueInsert = TablesInsert<'issues'>;
export type IssueUpdate = TablesUpdate<'issues'>;
export type Issue = Tables<'issues'>;
