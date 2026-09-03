import supabase from "../supabase/client";


/* =========================================================
   GET RECEPTION USERS

   Reception needs to see both:
   - Agents
   - Managers

   Aarav and Eric are Managers but they can also
   receive/take calls.
========================================================= */

export async function getAgents() {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name, username, role"
    )
    .in("role", [
      "Agent",
      "Manager",
    ])
    .order(
      "name",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Failed to load Reception users:",
      error
    );

    throw error;
  }

  return data || [];
}


/* =========================================================
   GET ONE RECEPTION DAILY RECORD
========================================================= */

export async function getReceptionDailyCall(
  agentName,
  reportDate
) {
  const { data, error } =
    await supabase
      .from(
        "reception_daily_calls"
      )
      .select("*")
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
      "Failed to load Reception call data:",
      error
    );

    throw error;
  }

  return data;
}


/* =========================================================
   SAVE RECEPTION DAILY CALL
========================================================= */

export async function saveReceptionDailyCall(
  report
) {

  /*
   * reception_user is BIGINT in Supabase.
   *
   * The frontend should send the numeric users.id.
   *
   * This extra protection also handles the case where an
   * older version of Reception.jsx sends the receptionist
   * name instead.
   */

  let receptionUserId =
    report.reception_user ||
    null;


  /* -------------------------------------------------------
     If a numeric ID was supplied, keep it.
  ------------------------------------------------------- */

  if (
    receptionUserId !== null &&
    receptionUserId !== "" &&
    !Number.isNaN(
      Number(receptionUserId)
    )
  ) {
    receptionUserId =
      Number(receptionUserId);
  }


  /* -------------------------------------------------------
     If a name was supplied accidentally, find the ID.
  ------------------------------------------------------- */

  else if (
    receptionUserId !== null &&
    receptionUserId !== ""
  ) {

    const {
      data: receptionUser,
      error: userError,
    } = await supabase
      .from("users")
      .select("id")
      .eq(
        "name",
        String(
          receptionUserId
        ).trim()
      )
      .maybeSingle();


    if (userError) {
      console.error(
        "Failed to find Reception user:",
        userError
      );

      throw userError;
    }


    receptionUserId =
      receptionUser?.id ||
      null;
  }


  /* =======================================================
     BUILD DATABASE RECORD
  ======================================================= */

  const reportData = {

    report_date:
      report.report_date,

    agent_name:
      report.agent_name,


    /* -----------------------------------------------------
       Call categories
    ----------------------------------------------------- */

    dc:
      Number(report.dc) || 0,

    ex_ind:
      Number(report.ex_ind) || 0,

    ex_usa:
      Number(report.ex_usa) || 0,

    maccall:
      Number(report.maccall) || 0,

    managercall:
      Number(report.managercall) || 0,

    namecall:
      Number(report.namecall) || 0,

    sc:
      Number(report.sc) || 0,


    /* -----------------------------------------------------
       Cancellation Calls

       Blank is stored as 0 in the database.
       The UI can still display it as blank/—
       when appropriate.
    ----------------------------------------------------- */

    cancellation_calls:
      report.cancellation_calls ===
        null ||
      report.cancellation_calls ===
        ""
        ? 0
        : Number(
            report.cancellation_calls
          ) || 0,


    /* -----------------------------------------------------
       Grand Total
    ----------------------------------------------------- */

    grand_total:
      Number(
        report.grand_total
      ) || 0,


    /* -----------------------------------------------------
       Reception user

       IMPORTANT:
       This is the numeric users.id,
       NOT the receptionist name.
    ----------------------------------------------------- */

    reception_user:
      receptionUserId,
  };


  /* =======================================================
     SAVE / UPSERT
  ======================================================= */

  const {
    data,
    error,
  } = await supabase
    .from(
      "reception_daily_calls"
    )
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


/* =========================================================
   GET RECEPTION CALLS FOR DATE
========================================================= */

export async function getReceptionCallsForDate(
  reportDate
) {

  const {
    data,
    error,
  } = await supabase
    .from(
      "reception_daily_calls"
    )
    .select("*")
    .eq(
      "report_date",
      reportDate
    )
    .order(
      "agent_name",
      {
        ascending: true,
      }
    );


  if (error) {
    console.error(
      "Failed to load Reception daily calls:",
      error
    );

    throw error;
  }


  return data || [];
}


/* =========================================================
   GET DISPOSED CALL REASONS
========================================================= */

export async function getDisposedCallReasons(
  dailyCallId
) {

  const {
    data,
    error,
  } = await supabase
    .from(
      "reception_disposed_calls"
    )
    .select("*")
    .eq(
      "reception_daily_call_id",
      dailyCallId
    )
    .order(
      "id",
      {
        ascending: true,
      }
    );


  if (error) {
    console.error(
      "Failed to load disposed reasons:",
      error
    );

    throw error;
  }


  return data || [];
}


/* =========================================================
   SAVE DISPOSED CALL REASONS
========================================================= */

export async function saveDisposedCallReasons(
  dailyCallId,
  disposedCalls
) {

  /* -------------------------------------------------------
     Remove existing reasons first
  ------------------------------------------------------- */

  const {
    error: deleteError,
  } = await supabase
    .from(
      "reception_disposed_calls"
    )
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


  /* -------------------------------------------------------
     Nothing to save
  ------------------------------------------------------- */

  if (
    !disposedCalls ||
    disposedCalls.length === 0
  ) {
    return [];
  }


  /* -------------------------------------------------------
     Build records
  ------------------------------------------------------- */

  const records =
    disposedCalls.map(
      (item) => ({

        reception_daily_call_id:
          dailyCallId,

        disposition_type:
          item.disposition_type,

        reason:
          item.reason?.trim() ||
          "",
      })
    );


  /* -------------------------------------------------------
     Insert
  ------------------------------------------------------- */

  const {
    data,
    error,
  } = await supabase
    .from(
      "reception_disposed_calls"
    )
    .insert(records)
    .select();


  if (error) {
    console.error(
      "Failed to save disposed reasons:",
      error
    );

    throw error;
  }


  return data || [];
}