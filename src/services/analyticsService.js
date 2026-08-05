import supabase from "../supabase/client";

export async function getAgentTrend(agentName, days = 7) {

  const end = new Date();

  const start = new Date();

  start.setDate(end.getDate() - (days - 1));

  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("report_date,fresh_calls,fresh_tickets")
    .eq("agent_name", agentName)
    .gte("report_date", start.toISOString().split("T")[0])
    .lte("report_date", end.toISOString().split("T")[0])
    .order("report_date");

  if (error) throw error;

  return data || [];

}