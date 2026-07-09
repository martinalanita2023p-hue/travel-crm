import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../styles/reports.css";

function Reports() {

  return (

    <Layout title="Reports">

      <div className="reports-container">

        <h2>📊 Reports Center</h2>

        <p>
          View Daily, Weekly and Monthly Performance
        </p>

      </div>

    </Layout>

  );

}

export default Reports;