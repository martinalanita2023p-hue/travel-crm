export default function aggregateReports(reports = []) {

  const grouped = {};

  reports.forEach((report) => {

    const agent = report.agent_name;

    if (!grouped[agent]) {

      grouped[agent] = {
        ...report,

        fresh_calls: 0,
        fresh_tickets: 0,
        sc_calls: 0,
        mac_calls: 0,
        dc_calls: 0,
        manager_calls: 0,
        airport_calls: 0,
        pnrs_created: 0,
        insurance_sold: 0,
        google_reviews: 0,
        trustpilot_reviews: 0,
        token_appreciation: 0,
        dc_sales: 0,
        cancellation_sales: 0,
        b2c_sales: 0,
        dec_sales: 0,
        mmt_tickets: 0,
        name_calls: 0,
      };

    }

    grouped[agent].fresh_calls += Number(report.fresh_calls || 0);
    grouped[agent].fresh_tickets += Number(report.fresh_tickets || 0);
    grouped[agent].sc_calls += Number(report.sc_calls || 0);
    grouped[agent].mac_calls += Number(report.mac_calls || 0);
    grouped[agent].dc_calls += Number(report.dc_calls || 0);
    grouped[agent].manager_calls += Number(report.manager_calls || 0);
    grouped[agent].airport_calls += Number(report.airport_calls || 0);
    grouped[agent].pnrs_created += Number(report.pnrs_created || 0);
    grouped[agent].insurance_sold += Number(report.insurance_sold || 0);
    grouped[agent].google_reviews += Number(report.google_reviews || 0);
    grouped[agent].trustpilot_reviews += Number(report.trustpilot_reviews || 0);
    grouped[agent].token_appreciation += Number(report.token_appreciation || 0);
    grouped[agent].dc_sales += Number(report.dc_sales || 0);
    grouped[agent].cancellation_sales += Number(report.cancellation_sales || 0);
    grouped[agent].b2c_sales += Number(report.b2c_sales || 0);
    grouped[agent].dec_sales += Number(report.dec_sales || 0);
    grouped[agent].mmt_tickets += Number(report.mmt_tickets || 0);
    grouped[agent].name_calls += Number(report.name_calls || 0);

  });

  return Object.values(grouped);

}