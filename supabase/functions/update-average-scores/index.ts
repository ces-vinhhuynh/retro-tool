import { serve } from "https://deno.land/std/http/server.ts";
import { validateConfig } from "../_shared/config.ts";
import { ERROR_MESSAGES, HTTP_STATUS } from "../_shared/constants.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/database.ts";
import {
  Answers,
  AverageScore,
  ResponseType,
  UpdateAverageScorePayload,
} from "../_shared/type.ts";

// Initialize configuration
validateConfig();

export function calculateAverageScore(responses: ResponseType[]) {
  // Initialize scores object
  // sum is the total score for the question
  // count is the number of responses for the question
  const questionScores: Record<string, { sum: number; count: number }> = {};

  // Process each response
  responses.forEach((response) => {
    if (response.answers) {
      // For each question in the response
      Object.entries(response.answers as Answers).forEach(
        ([questionId, answer]) => {
          // Process rating
          if (answer.rating !== null && answer.rating !== undefined) {
            if (!questionScores[questionId]) {
              questionScores[questionId] = { sum: 0, count: 0 };
            }
            questionScores[questionId].sum += answer.rating;
            questionScores[questionId].count += 1;
          }
        }
      );
    }
  });

  // Calculate average for each question
  const calculatedAverages: AverageScore = {};

  Object.entries(questionScores).forEach(([questionId, { sum, count }]) => {
    if (count > 0) {
      calculatedAverages[questionId] = {
        average_score: sum / count,
      };
    }
  });

  return calculatedAverages;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as UpdateAverageScorePayload;

    // Validate required fields
    if (!payload.healthCheckId) {
      return new Response(
        JSON.stringify({ error: ERROR_MESSAGES.REQUIRED_FIELDS }),
        { status: HTTP_STATUS.BAD_REQUEST, headers: corsHeaders }
      );
    }

    const supabase = createSupabaseClient();

    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select("*")
      .eq("health_check_id", payload.healthCheckId);

    if (responsesError) {
      throw new Error(responsesError.message);
    }

    const calculatedAverages = calculateAverageScore(responses);

    const { data: updatedHealthCheck, error: updateError } = await supabase
      .from("health_checks")
      .update({ average_score: calculatedAverages })
      .eq("id", payload.healthCheckId)
      .select("*")
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return new Response(JSON.stringify(updatedHealthCheck), {
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
        error:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.UNEXPECTED_ERROR,
      }),
      { status, headers: corsHeaders }
    );
  }
});
