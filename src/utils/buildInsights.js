export default function buildInsights(stats) {

  const insights = [];

  if (stats.freshCalls > 0) {

    insights.push({
      type: "success",
      title: "Fresh Calls",
      message: `${stats.freshCalls} fresh calls recorded.`,
    });

  }

  if (stats.freshTickets > 0) {

    insights.push({
      type: "success",
      title: "Fresh Tickets",
      message: `${stats.freshTickets} tickets issued.`,
    });

  }

  if (stats.insurance === 0) {

    insights.push({
      type: "warning",
      title: "Insurance",
      message: "No insurance sold today.",
    });

  }

  if (stats.missingAgents > 0) {

    insights.push({
      type: "danger",
      title: "Pending Reports",
      message: `${stats.missingAgents} agent(s) have not submitted today's report.`,
    });

  }

  if (stats.toa >= 500) {

    insights.push({
      type: "success",
      title: "TOA",
      message: `Outstanding TOA: $${stats.toa.toFixed(2)}`,
    });

  }

  return insights;

}