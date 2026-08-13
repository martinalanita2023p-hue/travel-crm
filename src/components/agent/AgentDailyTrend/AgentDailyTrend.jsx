import "./AgentDailyTrend.css";

export default function AgentDailyTrend({
  reports = [],
  fromDate,
  toDate,
}) {

  const dailyData = reports.reduce((acc, report) => {

    const date = report.report_date;

    if (!date) {
      return acc;
    }

    if (!acc[date]) {
      acc[date] = {
        date,
        freshCalls: 0,
        freshTickets: 0,
      };
    }

    acc[date].freshCalls +=
      Number(report.fresh_calls || 0);

    acc[date].freshTickets +=
      Number(report.fresh_tickets || 0);

    return acc;

  }, {});


  const days = Object.values(dailyData)
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    );


  const maxValue = Math.max(
    ...days.map(day =>
      Math.max(
        day.freshCalls,
        day.freshTickets
      )
    ),
    1
  );


  return (
    <section className="agent-daily-trend">

      <div className="agent-daily-trend-header">

        <div>

          <h3>
            Daily Performance Trend
          </h3>

          <p>
            {fromDate} → {toDate}
          </p>

        </div>

      </div>


      {days.length === 0 ? (

        <div className="agent-daily-empty">
          No performance data for this period.
        </div>

      ) : (

        <div className="agent-daily-list">

          {days.map((day) => {

            const callsWidth =
              (day.freshCalls / maxValue) * 100;

            const ticketsWidth =
              (day.freshTickets / maxValue) * 100;


            const formattedDate =
              new Date(
                `${day.date}T00:00:00`
              ).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              );


            return (

              <div
                className="agent-daily-row"
                key={day.date}
              >

                <div className="agent-daily-date">
                  {formattedDate}
                </div>


                <div className="agent-daily-bars">

                  <div className="agent-daily-line">

                    <span className="agent-daily-label">
                      Calls
                    </span>

                    <div className="agent-daily-track">

                      <div
                        className="agent-daily-bar agent-calls-bar"
                        style={{
                          width: `${callsWidth}%`,
                        }}
                      />

                    </div>

                    <strong>
                      {day.freshCalls}
                    </strong>

                  </div>


                  <div className="agent-daily-line">

                    <span className="agent-daily-label">
                      Tickets
                    </span>

                    <div className="agent-daily-track">

                      <div
                        className="agent-daily-bar agent-tickets-bar"
                        style={{
                          width: `${ticketsWidth}%`,
                        }}
                      />

                    </div>

                    <strong>
                      {day.freshTickets}
                    </strong>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </section>
  );
}