export default function performanceScore(report) {

  let score = 0;

  // Fresh Calls
  score += Math.min(Number(report.fresh_calls || 0) * 3, 15);

  // Fresh Tickets
  score += Math.min(Number(report.fresh_tickets || 0) * 4, 20);

  // SC Calls
  score += Math.min(Number(report.sc_calls || 0) * 2, 10);

  // SC Sales
  score += Math.min(Number(report.sc_sales || 0) * 3, 10);

  // DC Sales
  score += Math.min(Number(report.dc_sales || 0) * 3, 10);

  // Insurance
  score += Math.min(Number(report.insurance_sold || 0) * 3, 10);

  // Reviews
  score += Math.min(
    (
      Number(report.google_reviews || 0) +
      Number(report.trustpilot_reviews || 0)
    ) * 2,
    10
  );

  // TOA
  score += Math.min(
    Number(report.token_appreciation || 0) / 10,
    10
  );

  // Attendance
  score += Math.min(Number(report.days_present || 0), 5);

  return Math.round(score);
}