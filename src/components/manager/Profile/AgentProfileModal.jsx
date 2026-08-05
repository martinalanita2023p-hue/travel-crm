import "./AgentProfileModal.css";

export default function AgentProfileModal({
    report,
    onClose,
}) {

    if (!report) return null;

    return (

        <div className="profile-overlay">

            <div className="profile-modal">

                <div className="profile-header">

                    <h2>{report.agent_name}</h2>

                    <button onClick={onClose}>
                        ✕
                    </button>

                </div>

                <div className="profile-grid">

                    <div className="profile-card">
                        <h3>📞 Fresh Calls</h3>
                        <h1>{report.fresh_calls}</h1>
                    </div>

                    <div className="profile-card">
                        <h3>🎫 Fresh Tickets</h3>
                        <h1>{report.fresh_tickets}</h1>
                    </div>

                    <div className="profile-card">
                        <h3>🛡 Insurance</h3>
                        <h1>{report.insurance_sold}</h1>
                    </div>

                    <div className="profile-card">
                        <h3>💰 TOA</h3>
                        <h1>
                            $
                            {Number(
                                report.token_appreciation || 0
                            ).toFixed(2)}
                        </h1>
                    </div>

                </div>

            </div>

        </div>

    );

}