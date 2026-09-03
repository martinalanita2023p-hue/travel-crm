import supabase from "../supabase/client";

/* =======================================
   GET CURRENT EASTERN DATE
======================================= */

function getEasternDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}


/* =======================================
   SUBMIT / UPDATE AGENT REPORT
======================================= */

export async function submitAgentReport(report) {

  console.log("Sending to Supabase:", report);

  const { data, error } = await supabase
    .from("daily_agent_reports")
    .upsert([report], {
      onConflict: "agent_name,report_date",
    })
    .select();

  console.log("Supabase Error:", error);
  console.log("Supabase Data:", data);

  if (error) throw error;

  return data;
}


/* =======================================
   GET TODAY'S REPORT
======================================= */

export async function getTodayReport(agentName) {

  const today = getEasternDate();

  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("*")
    .eq("agent_name", agentName)
    .eq("report_date", today)
    .maybeSingle();

  if (error) throw error;

  return data;
}


/* =======================================
   GET REPORT HISTORY
======================================= */

export async function getLastReports(agentName, limit = 30) {
  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("*")
    .eq("agent_name", agentName)
    .order("report_date", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return data || [];
}