import supabase from "../supabase/client";

export async function getAgentTrend(agentName, limit = 30) {

  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("*")
    .eq("agent_name", agentName)
    .order("report_date", {
      ascending: true,
    })
    .limit(limit);

  if (error) throw error;

  return data ?? [];

}