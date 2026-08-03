export function calculatePerformanceScore(report) {
  const tickets = Number(report.fresh_tickets || 0);
  const insurance = Number(report.insurance_sold || 0);
  const freshCalls = Number(report.fresh_calls || 0);
  const google = Number(report.google_reviews || 0);
  const trustpilot = Number(report.trustpilot_reviews || 0);
  const toa = Number(report.token_appreciation || 0);

  const conversion =
    freshCalls === 0
      ? 0
      : (tickets / freshCalls) * 100;

  let score = 0;

  // Tickets (50 pts)
  score += Math.min((tickets / 15) * 50, 50);

  // Insurance (25 pts)
  score += Math.min((insurance / 5) * 25, 25);

  // Conversion (15 pts)
  score += Math.min((conversion / 80) * 15, 15);

  // Google Reviews (5 pts)
  score += Math.min((google / 3) * 5, 5);

  // Trustpilot (3 pts)
  score += Math.min((trustpilot / 2) * 3, 3);

  // TOA (2 pts)
  score += Math.min((toa / 100) * 2, 2);

  return Math.round(score);
}