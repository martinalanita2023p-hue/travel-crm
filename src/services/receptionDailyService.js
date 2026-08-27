import supabase from "../supabase/client";


/* =========================================
   GET ALL AGENTS
========================================= */

export async function getAgents() {

  const { data, error } = await supabase
    .from("users")
    .select("id, name, username, role")
    .eq("role", "Agent")
    .order("name", {
      ascending: true,
    });

  if (error) {

    console.error(
      "Failed to load agents:",
      error
    );

    throw error;
  }

  return data || [];
}


/* =========================================
   GET RECEPTION REPORT
   FOR ONE AGENT + ONE DATE
========================================= */

export async function getReceptionDailyCall(
  agentName,
  reportDate
) {

  const { data, error } = await supabase
    .from("reception_daily_calls")
    .select("*")
    .eq("agent_name", agentName)
    .eq("report_date", reportDate)
    .maybeSingle();

  if (error) {

    console.error(
      "Failed to load Reception call data:",
      error
    );

    throw error;
  }

  return data;
}


/* =========================================
   SAVE / UPDATE RECEPTION DAILY CALLS
========================================= */

export async function saveReceptionDailyCall(
  report
) {

  const reportData = {

    report_date:
      report.report_date,

    agent_name:
      report.agent_name,

    fresh_calls:
      Number(report.fresh_calls) || 0,

    dc_calls:
      Number(report.dc_calls) || 0,

    cancellation_calls:
      Number(report.cancellation_calls) || 0,

    fresh_disposed:
      Number(report.fresh_disposed) || 0,

    dc_disposed:
      Number(report.dc_disposed) || 0,

    cancellation_disposed:
      Number(
        report.cancellation_disposed
      ) || 0,

    remarks:
      report.remarks?.trim() || null,

    reception_user:
      report.reception_user || null,

  };


  const { data, error } = await supabase
    .from("reception_daily_calls")
    .upsert(
      reportData,
      {
        onConflict:
          "agent_name,report_date",
      }
    )
    .select()
    .single();


  if (error) {

    console.error(
      "Failed to save Reception daily calls:",
      error
    );

    throw error;
  }

  return data;
}


/* =========================================
   GET RECEPTION DATA FOR DATE
========================================= */

export async function getReceptionCallsForDate(
  reportDate
) {

  const { data, error } = await supabase
    .from("reception_daily_calls")
    .select("*")
    .eq("report_date", reportDate)
    .order("agent_name", {
      ascending: true,
    });

  if (error) {

    console.error(
      "Failed to load Reception daily calls:",
      error
    );

    throw error;
  }

  return data || [];
}


/* =========================================
   GET DISPOSED CALL REASONS
========================================= */

export async function getDisposedCallReasons(
  dailyCallId
) {

  const { data, error } = await supabase
    .from("reception_disposed_calls")
    .select("*")
    .eq(
      "reception_daily_call_id",
      dailyCallId
    )
    .order("id", {
      ascending: true,
    });

  if (error) {

    console.error(
      "Failed to load disposed call reasons:",
      error
    );

    throw error;
  }

  return data || [];
}


/* =========================================
   SAVE DISPOSED CALL REASONS
========================================= */

export async function saveDisposedCallReasons(
  dailyCallId,
  disposedCalls
) {

  /* ---------------------------------------
     Remove old reasons first
  --------------------------------------- */

  const { error: deleteError } =
    await supabase

      .from("reception_disposed_calls")

      .delete()

      .eq(
        "reception_daily_call_id",
        dailyCallId
      );


  if (deleteError) {

    console.error(
      "Failed to clear old disposed reasons:",
      deleteError
    );

    throw deleteError;
  }


  /* ---------------------------------------
     Nothing to save
  --------------------------------------- */

  if (
    !disposedCalls ||
    disposedCalls.length === 0
  ) {

    return [];

  }


  /* ---------------------------------------
     Prepare records
  --------------------------------------- */

  const records =
    disposedCalls.map((item) => ({

      reception_daily_call_id:
        dailyCallId,

      disposition_type:
        item.disposition_type,

      reason:
        item.reason.trim(),

    }));


  /* ---------------------------------------
     Insert new reasons
  --------------------------------------- */

  const { data, error } =
    await supabase

      .from("reception_disposed_calls")

      .insert(records)

      .select();


  if (error) {

    console.error(
      "Failed to save disposed call reasons:",
      error
    );

    throw error;
  }


  return data || [];
}