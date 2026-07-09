import supabase from "../supabase/client";

export async function getReportsByDate(date) {
  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("*")
    .eq("report_date", date);

  if (error) throw error;

  return data;
}

export async function updateAgentReport(id, report) {
  

  const {

    id: _,

    created_at,

    ...updatedReport

  } = report;

  const { data, error } = await supabase
    .from("daily_agent_reports")
    .update(updatedReport)
    .eq("id", id);

  if (error) throw error;

  return data;

}

export async function deleteAgentReport(id) {

  const { error } = await supabase
    .from("daily_agent_reports")
    .delete()
    .eq("id", id);

  if (error) throw error;

}

export const testExport = "hello";


