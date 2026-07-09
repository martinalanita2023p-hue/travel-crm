function DcSalesCard({ report, handleChange }) {

  return (

    <div className="info-card dc-card">

      <h2>🔄 Date Change</h2>

      <div className="split-container">

        <div className="split-half">

          <label>DC Calls</label>

          <input
            type="number"
            name="dc_calls"
            value={report.dc_calls || 0}
            onChange={handleChange}
          />

        </div>

        <div className="divider"></div>

        <div className="split-half">

          <label>DC Sales</label>

          <input
            type="number"
            name="dc_sales"
            value={report.dc_sales || 0}
            onChange={handleChange}
          />

        </div>

      </div>

    </div>

  );

}

export default DcSalesCard;