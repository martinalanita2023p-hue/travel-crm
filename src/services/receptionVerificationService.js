import supabase from "../supabase/client";

/* =========================================
   GET RECEPTION DATA FOR ONE DATE
========================================= */

async function getReceptionData(reportDate) {
  const { data, error } = await supabase
    .from("reception_daily_calls")
    .select(
      "agent_name, fresh_calls, dc_calls, cancellation_calls"
    )
    .eq("report_date", reportDate);

  if (error) {
    console.error(
      "Failed to load Reception verification data:",
      error
    );

    throw error;
  }

  return data || [];
}


/* =========================================
   GET AGENT DATA FOR ONE DATE
========================================= */

async function getAgentData(reportDate) {
  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select(
      "agent_name, fresh_calls, dc_calls, cancellation_calls"
    )
    .eq("report_date", reportDate);

  if (error) {
    console.error(
      "Failed to load Agent verification data:",
      error
    );

    throw error;
  }

  return data || [];
}


/* =========================================
   NORMALIZE NUMBER
========================================= */

function toNumber(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}


/* =========================================
   VERIFY RECEPTION VS AGENT
========================================= */

export async function getReceptionVerification(
  reportDate
) {
  if (!reportDate) {
    throw new Error("Report date is required.");
  }

  const [
    receptionData,
    agentData,
  ] = await Promise.all([
    getReceptionData(reportDate),
    getAgentData(reportDate),
  ]);


  /* ---------------------------------------
     Create agent map
  --------------------------------------- */

  const agentMap = new Map();

  agentData.forEach((report) => {
    const agentName =
      report.agent_name?.trim();

    if (!agentName) return;

    agentMap.set(
      agentName.toLowerCase(),
      report
    );
  });


  /* ---------------------------------------
     Compare Reception records
  --------------------------------------- */

  const verification = receptionData.map(
    (reception) => {

      const agentName =
        reception.agent_name?.trim();

      const agent =
        agentMap.get(
          agentName?.toLowerCase()
        );


      const receptionFresh =
        toNumber(reception.fresh_calls);

      const agentFresh =
        toNumber(agent?.fresh_calls);


      const receptionDC =
        toNumber(reception.dc_calls);

      const agentDC =
        toNumber(agent?.dc_calls);


      const receptionCancellation =
        toNumber(
          reception.cancellation_calls
        );

      const agentCancellation =
        toNumber(
          agent?.cancellation_calls
        );


      const freshDifference =
        agentFresh - receptionFresh;

      const dcDifference =
        agentDC - receptionDC;

      const cancellationDifference =
        agentCancellation -
        receptionCancellation;


      const freshVerified =
        freshDifference === 0;

      const dcVerified =
        dcDifference === 0;

      const cancellationVerified =
        cancellationDifference === 0;


      const fullyVerified =
        freshVerified &&
        dcVerified &&
        cancellationVerified;


      return {
        agent_name: agentName,

        reception_exists: true,
        agent_exists: Boolean(agent),

        reception: {
          fresh_calls: receptionFresh,
          dc_calls: receptionDC,
          cancellation_calls:
            receptionCancellation,
        },

        agent: {
          fresh_calls: agentFresh,
          dc_calls: agentDC,
          cancellation_calls:
            agentCancellation,
        },

        difference: {
          fresh_calls:
            freshDifference,

          dc_calls:
            dcDifference,

          cancellation_calls:
            cancellationDifference,
        },

        status:
          fullyVerified
            ? "Verified"
            : "Mismatch",

        metrics: {
          fresh_calls: {
            reception: receptionFresh,
            agent: agentFresh,
            difference:
              freshDifference,
            verified:
              freshVerified,
          },

          dc_calls: {
            reception: receptionDC,
            agent: agentDC,
            difference:
              dcDifference,
            verified:
              dcVerified,
          },

          cancellation_calls: {
            reception:
              receptionCancellation,

            agent:
              agentCancellation,

            difference:
              cancellationDifference,

            verified:
              cancellationVerified,
          },
        },
      };
    }
  );


  /* ---------------------------------------
     Find agents who submitted a report
     but have no Reception record
  --------------------------------------- */

  const receptionAgentNames =
    new Set(
      receptionData
        .map((item) =>
          item.agent_name
            ?.trim()
            .toLowerCase()
        )
        .filter(Boolean)
    );


  agentData.forEach((agent) => {

    const agentName =
      agent.agent_name?.trim();

    if (!agentName) return;

    const key =
      agentName.toLowerCase();

    if (
      receptionAgentNames.has(key)
    ) {
      return;
    }


    const agentFresh =
      toNumber(agent.fresh_calls);

    const agentDC =
      toNumber(agent.dc_calls);

    const agentCancellation =
      toNumber(
        agent.cancellation_calls
      );


    verification.push({
      agent_name: agentName,

      reception_exists: false,
      agent_exists: true,

      reception: {
        fresh_calls: 0,
        dc_calls: 0,
        cancellation_calls: 0,
      },

      agent: {
        fresh_calls: agentFresh,
        dc_calls: agentDC,
        cancellation_calls:
          agentCancellation,
      },

      difference: {
        fresh_calls: agentFresh,
        dc_calls: agentDC,
        cancellation_calls:
          agentCancellation,
      },

      status: "Mismatch",

      metrics: {
        fresh_calls: {
          reception: 0,
          agent: agentFresh,
          difference: agentFresh,
          verified: agentFresh === 0,
        },

        dc_calls: {
          reception: 0,
          agent: agentDC,
          difference: agentDC,
          verified: agentDC === 0,
        },

        cancellation_calls: {
          reception: 0,
          agent: agentCancellation,
          difference: agentCancellation,
          verified:
            agentCancellation === 0,
        },
      },
    });
  });


  /* ---------------------------------------
     Summary
  --------------------------------------- */

  const summary = {
    total_agents:
      verification.length,

    verified_agents:
      verification.filter(
        (item) =>
          item.status === "Verified"
      ).length,

    mismatch_agents:
      verification.filter(
        (item) =>
          item.status === "Mismatch"
      ).length,

    fresh_calls: {
      reception: verification.reduce(
        (total, item) =>
          total +
          item.reception.fresh_calls,
        0
      ),

      agent: verification.reduce(
        (total, item) =>
          total +
          item.agent.fresh_calls,
        0
      ),
    },

    dc_calls: {
      reception: verification.reduce(
        (total, item) =>
          total +
          item.reception.dc_calls,
        0
      ),

      agent: verification.reduce(
        (total, item) =>
          total +
          item.agent.dc_calls,
        0
      ),
    },

    cancellation_calls: {
      reception: verification.reduce(
        (total, item) =>
          total +
          item.reception
            .cancellation_calls,
        0
      ),

      agent: verification.reduce(
        (total, item) =>
          total +
          item.agent
            .cancellation_calls,
        0
      ),
    },
  };


  return {
    reportDate,
    verification,
    summary,
  };
}