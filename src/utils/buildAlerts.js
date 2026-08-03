export default function buildAlerts(stats) {

  const alerts = [];

  if (stats.missingAgents > 0) {

    alerts.push({

      type: "red",

      message:
        `${stats.missingAgents} agent(s) have not submitted today's report.`,

    });

  }

  if (stats.conversion < 80) {

    alerts.push({

      type: "yellow",

      message:
        `Conversion is ${stats.conversion}% (Target: 80%).`,

    });

  }

  if (
    stats.insurance >=
    stats.totalAgents * 2
  ) {

    alerts.push({

      type: "green",

      message:
        "Insurance target achieved.",

    });

  }

  return alerts;

}