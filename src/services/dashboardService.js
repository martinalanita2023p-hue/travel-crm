import supabase from "../supabase/client";

export async function getLast7DaysTickets() {
  const { data, error } = await supabase
    .from("daily_agent_reports")
    .select("report_date,fresh_tickets");

  if (error) throw error;

  const grouped = {};

  data.forEach((row) => {
    const date = row.report_date;

    if (!grouped[date])
      grouped[date] = 0;

    grouped[date] += Number(
      row.fresh_tickets || 0
    );
  });

  return Object.keys(grouped)
    .sort()
    .slice(-7)
    .map((date) => ({
      date,
      tickets: grouped[date],
    }));
}