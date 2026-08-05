import { useEffect, useState } from "react";
import { getReports } from "../services/managerService";

export default function useManagerData(selectedDate, viewMode) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);

        const data = await getReports(
          selectedDate,
          viewMode
        );

        setReports(data || []);
        setError("");
      } catch (err) {
        console.error("Failed to load reports:", err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [selectedDate, viewMode]);

  return {
    reports,
    loading,
    error,
  };
}