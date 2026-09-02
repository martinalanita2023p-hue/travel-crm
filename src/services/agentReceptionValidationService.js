import supabase from "../supabase/client";


/*
 * Check whether Reception has already entered
 * today's call counts for this agent.
 *
 * If Reception has not entered anything yet,
 * the agent is allowed to submit.
 *
 * If Reception has entered the numbers,
 * the agent's Fresh Calls, DC Calls and
 * Cancellation Calls must match.
 */

export async function validateAgentAgainstReception(
  agentName,
  reportDate,
  agentReport
) {
  const { data: receptionRecord, error } = await supabase
    .from("reception_daily_calls")
    .select(
      `
        fresh_calls,
        dc_calls,
        cancellation_calls
      `
    )
    .eq("agent_name", agentName)
    .eq("report_date", reportDate)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to check Reception data:",
      error
    );

    throw new Error(
      "Unable to verify your report against Reception. Please try again."
    );
  }


  /*
   * Reception has not entered today's numbers yet.
   *
   * Agent is allowed to submit.
   */
  if (!receptionRecord) {
    return {
      allowed: true,
      receptionExists: false,
      mismatches: [],
    };
  }


  const agentFreshCalls =
    Number(agentReport.fresh_calls || 0);

  const agentDcCalls =
    Number(agentReport.dc_calls || 0);

  const agentCancellationCalls =
    Number(agentReport.cancellation_calls || 0);


  const receptionFreshCalls =
    Number(receptionRecord.fresh_calls || 0);

  const receptionDcCalls =
    Number(receptionRecord.dc_calls || 0);

  const receptionCancellationCalls =
    Number(receptionRecord.cancellation_calls || 0);


  const mismatches = [];


  if (
    agentFreshCalls !==
    receptionFreshCalls
  ) {
    mismatches.push({
      metric: "Fresh Calls",
      agent: agentFreshCalls,
      reception: receptionFreshCalls,
    });
  }


  if (
    agentDcCalls !==
    receptionDcCalls
  ) {
    mismatches.push({
      metric: "DC Calls",
      agent: agentDcCalls,
      reception: receptionDcCalls,
    });
  }


  if (
    agentCancellationCalls !==
    receptionCancellationCalls
  ) {
    mismatches.push({
      metric: "Cancellation Calls",
      agent: agentCancellationCalls,
      reception: receptionCancellationCalls,
    });
  }


  return {
    allowed: mismatches.length === 0,
    receptionExists: true,
    mismatches,
  };
}