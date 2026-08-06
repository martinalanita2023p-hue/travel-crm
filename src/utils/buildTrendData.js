export default function buildTrendData(reports = [], metric) {

  return reports.map((report) => ({

    label: new Date(report.report_date)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),

    value: Number(report[metric] || 0),

  }));

}