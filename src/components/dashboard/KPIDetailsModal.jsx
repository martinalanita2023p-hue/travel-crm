import "./KPIDetailsModal.css";

export default function KPIDetailsModal({
  title,
  data,
  onClose,
}) {
  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <div className="modal-header">

          <h2>{title}</h2>

          <button onClick={onClose}>
            ✖
          </button>

        </div>

        <table>

          <thead>

            <tr>

              <th>Agent</th>

              <th>Value</th>

            </tr>

          </thead>

          <tbody>

            {data.map((item,index)=>(

              <tr key={index}>

                <td>{item.agent}</td>

                <td>{item.value}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}