import supabase from "../supabase/client";


function toNumber(value) {
  return Number(value || 0);
}


export async function getReceptionVerification(reportDate) {

  const [
    { data: receptionData, error: receptionError },
    { data: agentData, error: agentError },
  ] = await Promise.all([

    supabase
      .from("reception_daily_calls")
      .select(
        "agent_name, fresh_calls, dc_calls, cancellation_calls"
      )
      .eq("report_date", reportDate),

    supabase
      .from("daily_agent_reports")
      .select(
        "agent_name, fresh_calls, dc_calls, cancellation_calls"
      )
      .eq("report_date", reportDate),

  ]);


  if (receptionError) {
    console.error(
      "Failed to load Reception verification data:",
      receptionError
    );

    throw receptionError;
  }


  if (agentError) {
    console.error(
      "Failed to load Agent verification data:",
      agentError
    );

    throw agentError;
  }


  const receptionMap = new Map();

  (receptionData || []).forEach((record) => {

    const key =
      record.agent_name
        ?.trim()
        .toLowerCase();

    if (!key) return;

    receptionMap.set(key, record);

  });


  const agentMap = new Map();

  (agentData || []).forEach((record) => {

    const key =
      record.agent_name
        ?.trim()
        .toLowerCase();

    if (!key) return;

    agentMap.set(key, record);

  });


  const agentNames = new Set([
    ...receptionMap.keys(),
    ...agentMap.keys(),
  ]);


  const verification = [];


  agentNames.forEach((key) => {

    const reception =
      receptionMap.get(key);

    const agent =
      agentMap.get(key);


    const receptionMetrics = {
      fresh_calls:
        toNumber(reception?.fresh_calls),

      dc_calls:
        toNumber(reception?.dc_calls),

      cancellation_calls:
        toNumber(reception?.cancellation_calls),
    };


    const agentMetrics = {
      fresh_calls:
        toNumber(agent?.fresh_calls),

      dc_calls:
        toNumber(agent?.dc_calls),

      cancellation_calls:
        toNumber(agent?.cancellation_calls),
    };


    const differences = {
      fresh_calls:
        agentMetrics.fresh_calls -
        receptionMetrics.fresh_calls,

      dc_calls:
        agentMetrics.dc_calls -
        receptionMetrics.dc_calls,

      cancellation_calls:
        agentMetrics.cancellation_calls -
        receptionMetrics.cancellation_calls,
    };


    const freshVerified =
      !reception ||
      !agent ||
      receptionMetrics.fresh_calls ===
        agentMetrics.fresh_calls;


    const dcVerified =
      !reception ||
      !agent ||
      receptionMetrics.dc_calls ===
        agentMetrics.dc_calls;


    const cancellationVerified =
      !reception ||
      !agent ||
      receptionMetrics.cancellation_calls ===
        agentMetrics.cancellation_calls;


    const hasMismatch =
      reception &&
      agent &&
      (
        !freshVerified ||
        !dcVerified ||
        !cancellationVerified
      );


    verification.push({

      agent_name:
        reception?.agent_name ||
        agent?.agent_name ||
        key,

      reception_exists:
        Boolean(reception),

      agent_exists:
        Boolean(agent),

      reception: receptionMetrics,

      agent: agentMetrics,

      differences,

      status:
        hasMismatch
          ? "Mismatch"
          : "Verified",

      metrics: {

        fresh_calls: {
          reception:
            receptionMetrics.fresh_calls,

          agent:
            agentMetrics.fresh_calls,

          difference:
            differences.fresh_calls,

          status:
            freshVerified
              ? "Verified"
              : "Mismatch",
        },

        dc_calls: {
          reception:
            receptionMetrics.dc_calls,

          agent:
            agentMetrics.dc_calls,

          difference:
            differences.dc_calls,

          status:
            dcVerified
              ? "Verified"
              : "Mismatch",
        },

        cancellation_calls: {
          reception:
            receptionMetrics.cancellation_calls,

          agent:
            agentMetrics.cancellation_calls,

          difference:
            differences.cancellation_calls,

          status:
            cancellationVerified
              ? "Verified"
              : "Mismatch",
        },

      },

    });

  });


  const verifiedAgents =
    verification.filter(
      (item) =>
        item.reception_exists &&
        item.agent_exists &&
        item.status === "Verified"
    );


  const mismatchAgents =
    verification.filter(
      (item) =>
        item.reception_exists &&
        item.agent_exists &&
        item.status === "Mismatch"
    );


  const summary = {

    total_agents:
      verification.length,

    verified_agents:
      verifiedAgents.length,

    mismatch_agents:
      mismatchAgents.length,

    reception_totals: {

      fresh_calls:
        (receptionData || []).reduce(
          (sum, item) =>
            sum + toNumber(item.fresh_calls),
          0
        ),

      dc_calls:
        (receptionData || []).reduce(
          (sum, item) =>
            sum + toNumber(item.dc_calls),
          0
        ),

      cancellation_calls:
        (receptionData || []).reduce(
          (sum, item) =>
            sum + toNumber(item.cancellation_calls),
          0
        ),

    },

    agent_totals: {

      fresh_calls:
        (agentData || []).reduce(
          (sum, item) =>
            sum + toNumber(item.fresh_calls),
          0
        ),

      dc_calls:
        (agentData || []).reduce(
          (sum, item) =>
            sum + toNumber(item.dc_calls),
          0
        ),

      cancellation_calls:
        (agentData || []).reduce(
          (sum, item) =>
            sum + toNumber(item.cancellation_calls),
          0
        ),

    },

  };


  return {
    report_date: reportDate,
    verification,
    summary,
  };
}