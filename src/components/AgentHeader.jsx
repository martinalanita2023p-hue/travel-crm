import { useEffect, useState } from "react";

import { getUser } from "../services/authService";
import { getLastReports } from "../services/agentService";


function AgentHeader() {

  const user = getUser();

  const [daysPresent, setDaysPresent] =
    useState(0);

  const [loadingAttendance, setLoadingAttendance] =
    useState(true);


  /* =====================================================
     CURRENT DATE
  ===================================================== */

  const today = new Date();


  /* =====================================================
     CURRENT MONTH
  ===================================================== */

  const currentYear =
    today.getFullYear();

  const currentMonth =
    today.getMonth();


  /* =====================================================
     LOAD CURRENT MONTH DAYS PRESENT
  ===================================================== */

  useEffect(() => {

    async function loadDaysPresent() {

      if (!user?.name) {

        setDaysPresent(0);
        setLoadingAttendance(false);

        return;

      }


      try {

        setLoadingAttendance(true);


        const reports =
          await getLastReports(
            user.name,
            1000
          );


        const uniqueDates =
          new Set();


        (reports || []).forEach(
          (report) => {

            if (!report?.report_date) {
              return;
            }


            /*
             * report_date is stored as:
             *
             * YYYY-MM-DD
             *
             * Example:
             * 2026-08-11
             */

            const reportDate =
              new Date(
                `${report.report_date}T00:00:00`
              );


            const reportYear =
              reportDate.getFullYear();

            const reportMonth =
              reportDate.getMonth();


            /*
             * Only count reports from
             * the current month.
             */

            if (
              reportYear === currentYear &&
              reportMonth === currentMonth
            ) {

              uniqueDates.add(
                report.report_date
              );

            }

          }
        );


        setDaysPresent(
          uniqueDates.size
        );


      }

      catch (error) {

        console.error(
          "Failed to load current month attendance:",
          error
        );

        setDaysPresent(0);

      }

      finally {

        setLoadingAttendance(false);

      }

    }


    loadDaysPresent();

  }, [
    user?.name,
    currentYear,
    currentMonth,
  ]);


  /* =====================================================
     RENDER
  ===================================================== */

  return (
  <div className="agent-header-card">

    {/* =================================================
        AGENT NAME
    ================================================= */}

    <div className="agent-profile">

      <div className="avatar">
        {user?.name
          ?.charAt(0)
          ?.toUpperCase()}
      </div>

      <div className="agent-name">
        <h2>{user?.name}</h2>
      </div>

    </div>


    {/* =================================================
        DATE / DAY / ATTENDANCE
    ================================================= */}

    <div className="agent-header-info-row">

      <div className="header-item">

        <span>Report Date</span>

        <strong>
          {today.toLocaleDateString("en-US")}
        </strong>

      </div>


      <div className="header-item">

        <span>Day</span>

        <strong>
          {today.toLocaleDateString(
            "en-US",
            {
              weekday: "long",
            }
          )}
        </strong>

      </div>


      <div className="header-item">

        <span>Days Present</span>

        <strong>
          {loadingAttendance
            ? "..."
            : daysPresent}
        </strong>

      </div>

    </div>

  </div>
);

}


export default AgentHeader;