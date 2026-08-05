export default function calculateStats(reports = [], agents = []) {

  const stats = {
    freshCalls: 0,
    freshTickets: 0,
    scCalls: 0,
    scSales: 0,
    nameCalls: 0,
    macCalls: 0,
    dcCalls: 0,
    managerCalls: 0,
    airportCalls: 0,
    insurance: 0,
    google: 0,
    trustpilot: 0,
    toa: 0,
    pnrs: 0,
    dcSales: 0,
    cancellationSales: 0,
    b2cSales: 0,
    decSales: 0,
    mmtTickets: 0,
    submittedAgents: 0,
    totalAgents: agents.length,
    missingAgents: 0,
  };

  reports.forEach((r) => {

    stats.freshCalls += Number(r.fresh_calls || 0);
    stats.freshTickets += Number(r.fresh_tickets || 0);

    stats.scCalls += Number(r.sc_calls || 0);
    stats.scSales += Number(r.sc_sales || 0);

    stats.nameCalls += Number(r.name_calls || 0);
    stats.macCalls += Number(r.mac_calls || 0);
    stats.dcCalls += Number(r.dc_calls || 0);
    stats.managerCalls += Number(r.manager_calls || 0);
    stats.airportCalls += Number(r.airport_calls || 0);

    stats.insurance += Number(r.insurance_sold || 0);

    stats.google += Number(r.google_reviews || 0);
    stats.trustpilot += Number(r.trustpilot_reviews || 0);

    stats.toa += Number(r.token_appreciation || 0);

    stats.pnrs += Number(r.pnrs_created || 0);

    stats.dcSales += Number(r.dc_sales || 0);
    stats.cancellationSales += Number(r.cancellation_sales || 0);
    stats.b2cSales += Number(r.b2c_sales || 0);
    stats.decSales += Number(r.dec_sales || 0);
    stats.mmtTickets += Number(r.mmt_tickets || 0);

  });

  stats.submittedAgents =
    new Set(
      reports.map(r => r.agent_name)
    ).size;

  stats.missingAgents =
    Math.max(
      stats.totalAgents - stats.submittedAgents,
      0
    );

  return stats;

}