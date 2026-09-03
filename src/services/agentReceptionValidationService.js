import supabase from "../supabase/client";


/* =====================================================
   GET RECEPTION RECORD FOR ONE AGENT / DATE
===================================================== */

export async function getReceptionRecordForAgent(
  agentName,
  reportDate
) {

  const { data, error } = await supabase

    .from("reception_daily_calls")

    .select(`
  ex_usa,
  ex_ind,
  dc,
  cancellation_calls
`)

    .eq(
      "agent_name",
      agentName
    )

    .eq(
      "report_date",
      reportDate
    )

    .maybeSingle();


  if (error) {

    console.error(
      "Failed to load Reception data:",
      error
    );

    throw new Error(
      "Unable to verify your report against Reception. Please try again."
    );

  }


  return data || null;

}


/* =====================================================
   VALIDATE AGENT REPORT AGAINST RECEPTION
===================================================== */

export async function validateAgentAgainstReception(
  agentName,
  reportDate,
  agentReport
) {

  const receptionRecord =
    await getReceptionRecordForAgent(
      agentName,
      reportDate
    );


  /* ===================================================
     RECEPTION HAS NOT ENTERED ANYTHING YET

     Agent is allowed to submit.
  =================================================== */

  if (!receptionRecord) {

    return {

      allowed: true,

      receptionExists: false,

      mismatches: [],

    };

  }


  /* ===================================================
     AGENT VALUES
  =================================================== */

  const agentExUsa =
    Number(
      agentReport?.ex_usa || 0
    );


  const agentExInd =
    Number(
      agentReport?.ex_ind || 0
    );


  const agentFreshCalls =
    agentExUsa +
    agentExInd;


  const agentDcCalls =
    Number(
      agentReport?.dc_calls || 0
    );


  const agentCancellationCalls =
    Number(
      agentReport?.cancellation_calls || 0
    );


  /* ===================================================
     RECEPTION VALUES
  =================================================== */

  const receptionExUsa =
    Number(
      receptionRecord.ex_usa || 0
    );


  const receptionExInd =
    Number(
      receptionRecord.ex_ind || 0
    );


  const receptionFreshCalls =
    receptionExUsa +
    receptionExInd;


 const receptionDcCalls =
  Number(
    receptionRecord.dc || 0
  );


  const receptionCancellationCalls =
    Number(
      receptionRecord.cancellation_calls || 0
    );


  /* ===================================================
     FIND MISMATCHES
  =================================================== */

  const mismatches = [];


  /* ===================================================
     EX-USA
  =================================================== */

  if (
    agentExUsa !==
    receptionExUsa
  ) {

    mismatches.push({

      metric: "EX-USA",

      field: "ex_usa",

      agent: agentExUsa,

      reception: receptionExUsa,

    });

  }


  /* ===================================================
     EX-IND
  =================================================== */

  if (
    agentExInd !==
    receptionExInd
  ) {

    mismatches.push({

      metric: "EX-IND",

      field: "ex_ind",

      agent: agentExInd,

      reception: receptionExInd,

    });

  }


  /* ===================================================
     TOTAL FRESH CALLS
  =================================================== */

  if (
    agentFreshCalls !==
    receptionFreshCalls
  ) {

    mismatches.push({

      metric: "Fresh Calls",

      field: "fresh_calls",

      agent: agentFreshCalls,

      reception: receptionFreshCalls,

    });

  }


  /* ===================================================
     DC CALLS
  =================================================== */

  if (
    agentDcCalls !==
    receptionDcCalls
  ) {

    mismatches.push({

      metric: "DC Calls",

      field: "dc_calls",

      agent: agentDcCalls,

      reception: receptionDcCalls,

    });

  }


  /* ===================================================
     CANCELLATION CALLS
  =================================================== */

  if (
    agentCancellationCalls !==
    receptionCancellationCalls
  ) {

    mismatches.push({

      metric: "Cancellation Calls",

      field: "cancellation_calls",

      agent: agentCancellationCalls,

      reception: receptionCancellationCalls,

    });

  }


  /* ===================================================
     RESULT
  =================================================== */

  return {

    allowed:
      mismatches.length === 0,

    receptionExists:
      true,

    mismatches,

  };

}