import { useEffect, useState } from "react";
import { getReportsByDate } from "../services/ManagerService";

export default function useManagerData(selectedDate) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);

        const data = await getReportsByDate(selectedDate);

        setReports(data || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [selectedDate]);

  return {
    reports,
    loading,
    error,
  };
}