import { useEffect, useMemo, useState } from "react";

import {
  getReportsBetweenDates,
} from "../services/managerService";

import { getUser } from "../services/authService";

import {
  getBostonDate,
  getBostonMonthStart,
} from "../utils/bostonTime";


/* =====================================================
   HOOK
===================================================== */

export default function useAgentPerformance() {

  const user = getUser();

  const agentName =
    user?.name || "";


  /* ===================================================
     CURRENT BOSTON DATE
  =================================================== */

  const today =
    getBostonDate();


  /* ===================================================
     FIRST DAY OF CURRENT BOSTON MONTH
  =================================================== */

  const monthStart =
    useMemo(() => {

      return getBostonMonthStart(today);

    }, [today]);


  /* ===================================================
     DATE RANGE
  =================================================== */

  const [fromDate, setFromDate] =
    useState(monthStart);


  const [toDate, setToDate] =
    useState(today);


  /* ===================================================
     REPORTS
  =================================================== */

  const [reports, setReports] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState(null);


  /* ===================================================
     RESET RANGE WHEN MONTH CHANGES
  =================================================== */

  useEffect(() => {

    setFromDate(monthStart);

    setToDate(today);

  }, [
    monthStart,
    today,
  ]);


  /* ===================================================
     LOAD REPORTS
  =================================================== */

  useEffect(() => {

    async function loadReports() {

      if (
        !agentName ||
        !fromDate ||
        !toDate ||
        fromDate > toDate
      ) {

        setReports([]);

        setLoading(false);

        return;

      }


      try {

        setLoading(true);

        setError(null);


        const data =
          await getReportsBetweenDates(
            fromDate,
            toDate
          );


        const agentReports =
          (data || []).filter(
            (report) =>
              report.agent_name
                ?.trim()
                .toLowerCase() ===
              agentName
                .trim()
                .toLowerCase()
          );


        setReports(
          agentReports
        );


      }

      catch (err) {

        console.error(
          "Failed to load agent performance:",
          err
        );


        setError(
          err?.message ||
          "Failed to load agent performance."
        );


        setReports([]);

      }

      finally {

        setLoading(false);

      }

    }


    loadReports();

  }, [
    agentName,
    fromDate,
    toDate,
  ]);


  /* ===================================================
     TOTALS
  =================================================== */

  const stats = useMemo(() => {

    return reports.reduce(
      (total, report) => {

        /* =============================================
           CORE PERFORMANCE
        ============================================= */

        total.freshCalls +=
          Number(
            report.fresh_calls || 0
          );


        total.freshTickets +=
          Number(
            report.fresh_tickets || 0
          );


        total.insurance +=
          Number(
            report.insurance_sold || 0
          );


        /* =============================================
           SALES & PERFORMANCE
        ============================================= */

        total.dcCalls +=
          Number(
            report.dc_calls || 0
          );


        total.dcSales +=
          Number(
            report.dc_sales || 0
          );


        total.b2cSales +=
          Number(
            report.b2c_sales || 0
          );


        total.macCalls +=
          Number(
            report.mac_calls || 0
          );


        total.pnrs +=
          Number(
            report.pnrs_created || 0
          );


        total.toa +=
          Number(
            report.token_appreciation || 0
          );


        total.google +=
          Number(
            report.google_reviews || 0
          );


        total.trustpilot +=
          Number(
            report.trustpilot_reviews || 0
          );


        /* =============================================
           ADDITIONAL PERFORMANCE
        ============================================= */

        total.nameCalls +=
          Number(
            report.name_calls || 0
          );


        total.scCalls +=
          Number(
            report.sc_calls || 0
          );


        total.managerCalls +=
          Number(
            report.manager_calls || 0
          );


        total.airportCalls +=
          Number(
            report.airport_calls || 0
          );


        total.cancellationCalls +=
          Number(
            report.cancellation_calls || 0
          );


        total.cancellationSales +=
          Number(
            report.cancellation_sales || 0
          );


        return total;

      },
      {
        freshCalls: 0,
        freshTickets: 0,
        insurance: 0,

        dcCalls: 0,
        dcSales: 0,
        b2cSales: 0,
        macCalls: 0,
        pnrs: 0,
        toa: 0,
        google: 0,
        trustpilot: 0,

        nameCalls: 0,
        scCalls: 0,
        managerCalls: 0,
        airportCalls: 0,
        cancellationCalls: 0,
        cancellationSales: 0,
      }
    );

  }, [reports]);


  /* ===================================================
     CONVERSION
  =================================================== */

  const conversion =
    stats.freshCalls === 0
      ? 0
      : (
          stats.freshTickets /
          stats.freshCalls
        ) * 100;


  /* ===================================================
     RETURN
  =================================================== */

  return {

    agentName,

    reports,

    stats,

    conversion,

    fromDate,
    setFromDate,

    toDate,
    setToDate,

    loading,

    error,

  };

}