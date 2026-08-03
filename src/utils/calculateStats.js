export default function calculateStats(reports, agents) {

  let stats = {
    freshCalls: 0,
    nameCalls: 0,
    macCalls: 0,
    dcCalls: 0,
    cancellationCalls: 0,
    managerCalls: 0,
    airportCalls: 0,
    freshTickets: 0,
    insurance: 0,
    google: 0,
    trustpilot: 0,
    toa: 0,
  };

  reports.forEach((r) => {

    stats.freshCalls += Number(r.fresh_calls || 0);
    stats.nameCalls += Number(r.name_calls || 0);
    stats.macCalls += Number(r.mac_calls || 0);
    stats.dcCalls += Number(r.dc_calls || 0);
    stats.cancellationCalls += Number(r.cancellation_calls || 0);
    stats.managerCalls += Number(r.manager_calls || 0);
    stats.airportCalls += Number(r.airport_calls || 0);

    stats.freshTickets += Number(r.fresh_tickets || 0);

    stats.insurance += Number(r.insurance_sold || 0);

    stats.google += Number(r.google_reviews || 0);

    stats.trustpilot += Number(r.trustpilot_reviews || 0);

    stats.toa += Number(r.token_appreciation || 0);

  });

  stats.conversion =
    stats.freshCalls === 0
      ? 0
      : Number(
          (
            (stats.freshTickets / stats.freshCalls) *
            100
          ).toFixed(1)
        );

  stats.submittedAgents =
    new Set(
      reports.map((r) => r.agent_name)
    ).size;

  stats.totalAgents = agents.length;

  stats.missingAgents =
    Math.max(
      stats.totalAgents - stats.submittedAgents,
      0
    );

  return stats;

}