import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { CONFIG } from "./config.ts";

export const createSupabaseClient = () => {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase configuration missing");
  }

  return createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE_KEY);
};

export async function findExistingUser(
  supabase: ReturnType<typeof createClient>,
  email: string
) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function findExistingInvite(
  supabase: ReturnType<typeof createClient>,
  workspaceId: string,
  email: string
) {
  const { data, error } = await supabase
    .from("workspace_users")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function getWorkspaceName(
  supabase: ReturnType<typeof createClient>,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("name")
    .eq("id", workspaceId)
    .single();

  if (error) {
    throw new Error(`Failed to get workspace name: ${error.message}`);
  }

  return data.name;
}

export async function getTeamName(
  supabase: ReturnType<typeof createClient>,
  teamId: string
) {
  const { data, error } = await supabase
    .from("teams")
    .select("name")
    .eq("id", teamId)
    .single();

  if (error) {
    throw new Error(`Failed to get team name: ${error.message}`);
  }

  return data.name;
}

export async function findExistingTeamInvite(
  supabase: ReturnType<typeof createClient>,
  teamId: string,
  email: string
) {
  const { data, error } = await supabase
    .from("team_users")
    .select("*")
    .eq("team_id", teamId)
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}
