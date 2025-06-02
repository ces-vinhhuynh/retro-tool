import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { validateConfig } from "../_shared/config.ts";
import { handleTeamInvitation } from "../_shared/invitation.ts";
import { TeamInvitePayload } from "../_shared/type.ts";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  INVITATION_STATUS,
} from "../_shared/constants.ts";

validateConfig();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as TeamInvitePayload;

    if (!payload.email || !payload.team_id || !payload.workspace_id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: ERROR_MESSAGES.REQUIRED_FIELDS,
        }),
        { status: HTTP_STATUS.BAD_REQUEST, headers: corsHeaders }
      );
    }

    const result = await handleTeamInvitation(payload);
    return new Response(JSON.stringify({ success: true, ...result }), {
      status: HTTP_STATUS.OK,
      headers: corsHeaders,
    });
  } catch (error) {
    const status =
      error instanceof Error && error.message.includes("required")
        ? HTTP_STATUS.BAD_REQUEST
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.UNEXPECTED_ERROR,
      }),
      { status, headers: corsHeaders }
    );
  }
});
