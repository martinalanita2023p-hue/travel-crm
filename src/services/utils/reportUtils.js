// Convert anything to a safe number
export function num(value) {
  return Number(value || 0);
}

// Conversion %
export function getConversion(freshCalls, freshTickets) {
  freshCalls = num(freshCalls);
  freshTickets = num(freshTickets);

  if (freshCalls === 0) return 0;

  return Number(
    ((freshTickets / freshCalls) * 100).toFixed(2)
  );
}

// Total Reviews
export function getReviews(report) {
  return (
    num(report.google_reviews) +
    num(report.trustpilot_reviews)
  );
}

// Total Sales
export function getSales(report) {
  return (
    num(report.fresh_tickets) +
    num(report.dc_sales) +
    num(report.cancellation_sales) +
    num(report.b2c_sales)
  );
}

// Total Calls
export function getCalls(report) {
  return (
    num(report.fresh_calls) +
    num(report.mac_calls) +
    num(report.dc_calls) +
    num(report.cancellation_calls) +
    num(report.manager_calls) +
    num(report.airport_calls)
  );
}

export function calculateDashboardStats(reports = []) {

  const stats = {

    freshCalls: 0,
    macCalls: 0,
    dcCalls: 0,
    cancellationCalls: 0,
    managerCalls: 0,
    airportCalls: 0,

    freshTickets: 0,
    dcSales: 0,
    cancellationSales: 0,
    b2cSales: 0,

    pnrs: 0,

    insurance: 0,

    google: 0,
    trustpilot: 0,

    toa: 0,

  };

  reports.forEach((r) => {

    stats.freshCalls += num(r.fresh_calls);
    stats.macCalls += num(r.mac_calls);
    stats.dcCalls += num(r.dc_calls);
    stats.cancellationCalls += num(r.cancellation_calls);
    stats.managerCalls += num(r.manager_calls);
    stats.airportCalls += num(r.airport_calls);

    stats.freshTickets += num(r.fresh_tickets);
    stats.dcSales += num(r.dc_sales);
    stats.cancellationSales += num(r.cancellation_sales);
    stats.b2cSales += num(r.b2c_sales);

    stats.pnrs += num(r.pnrs_created);

    stats.insurance += num(r.insurance_sold);

    stats.google += num(r.google_reviews);
    stats.trustpilot += num(r.trustpilot_reviews);

    stats.toa += num(r.token_appreciation);

  });

  stats.conversion = getConversion(
    stats.freshCalls,
    stats.freshTickets
  );

  return stats;
}