import { useEffect, useState } from "react";

import {
  getReportsByDate,
  getReportsBetweenDates,
} from "../services/managerService";


export default function useManagerData(
  selectedDate,
  viewMode
) {

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {

    let cancelled = false;


    async function loadData() {

      if (!selectedDate) {

        setReports([]);
        setLoading(false);

        return;

      }


      try {

        setLoading(true);
        setError(null);


        /* =================================================
           DAY
        ================================================= */

        if (viewMode === "day") {

          const data =
            await getReportsByDate(
              selectedDate
            );


          if (!cancelled) {

            setReports(
              data || []
            );

          }


          return;

        }


        /* =================================================
           SELECTED DATE
        ================================================= */

        const selected =
          new Date(
            `${selectedDate}T00:00:00`
          );


        let startDate;
        let endDate;


        /* =================================================
           WEEK

           Selected date = END DATE

           Example:

           Selected: August 12

           Range:

           August 6 → August 12
        ================================================= */

        if (viewMode === "week") {

          endDate =
            new Date(selected);


          startDate =
            new Date(selected);


          startDate.setDate(
            startDate.getDate() - 6
          );

        }


        /* =================================================
           MONTH

           Selected date = END DATE

           Example:

           Selected: August 12

           Range:

           August 1 → August 12
        ================================================= */

        if (viewMode === "month") {

          endDate =
            new Date(selected);


          startDate =
            new Date(
              selected.getFullYear(),
              selected.getMonth(),
              1
            );

        }


        /* =================================================
           SAFETY CHECK
        ================================================= */

        if (
          !startDate ||
          !endDate
        ) {

          if (!cancelled) {

            setReports([]);

          }

          return;

        }


        /* =================================================
           FORMAT DATE
        ================================================= */

        function formatDate(date) {

          const year =
            date.getFullYear();


          const month =
            String(
              date.getMonth() + 1
            ).padStart(2, "0");


          const day =
            String(
              date.getDate()
            ).padStart(2, "0");


          return `${year}-${month}-${day}`;

        }


        const fromDate =
          formatDate(
            startDate
          );


        const toDate =
          formatDate(
            endDate
          );


        console.log(
          `[Manager] ${viewMode.toUpperCase()} range:`,
          fromDate,
          "→",
          toDate
        );


        /* =================================================
           FETCH RANGE
        ================================================= */

        const data =
          await getReportsBetweenDates(
            fromDate,
            toDate
          );


        if (!cancelled) {

          setReports(
            data || []
          );

        }


      } catch (err) {

        console.error(
          "Failed to load manager data:",
          err
        );


        if (!cancelled) {

          setError(
            err?.message ||
            "Failed to load manager data."
          );


          setReports([]);

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    }


    loadData();


    return () => {

      cancelled = true;

    };


  }, [
    selectedDate,
    viewMode,
  ]);


  return {
    reports,
    loading,
    error,
  };

}