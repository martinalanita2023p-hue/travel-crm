import supabase from "../supabase/client";

/**
 * Get all reports for a specific date
 */
export async function getReportsByDate(date) {
  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("*")
    .eq("report_date", date);

  if (error) throw error;

  return data ?? [];
}

/**
 * Update an existing report
 */
export async function updateAgentReport(id, report) {
  const {
    id: _,
    created_at,
    ...updatedReport
  } = report;

  const { data, error } = await supabase
    .from("daily_agent_reports")
    .update(updatedReport)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete a report
 */
export async function deleteAgentReport(id) {
  const { error } = await supabase
    .from("daily_agent_reports")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Get all reports
 */
export async function getAllReports() {
  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("*")
    .order("report_date", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/**
 * Get reports for one agent
 */
export async function getReportsByAgent(agentName) {
  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("*")
    .eq("agent_name", agentName)
    .order("report_date", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/**
 * Get reports between two dates
 */
export async function getReportsBetweenDates(startDate, endDate) {
  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("*")
    .gte("report_date", startDate)
    .lte("report_date", endDate)
    .order("report_date", { ascending: true });

  if (error) throw error;

  return data ?? [];
}