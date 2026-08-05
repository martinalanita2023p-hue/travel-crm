import "./TeamStatus.css";

export default function TeamStatus({
    reports = [],
    agents = [],
}) {

    const submitted = reports.map(
        report => report.agent_name
    );

    return (

        <div className="team-status">

            <div className="status-header">

                <h2>👥 Team Status</h2>

                <div className="status-counts">

                    <span className="submitted">

                        🟢 {submitted.length} Submitted

                    </span>

                    <span className="pending">

                        🔴 {agents.length - submitted.length} Pending

                    </span>

                </div>

            </div>

            <div className="status-list">

                {agents.map(agent=>{

                    const done = submitted.includes(agent.username);

                    return(

                        <div
                            key={agent.id}
                            className="status-item"
                        >

                            <span>

                                {done ? "🟢" : "🔴"}

                            </span>

                            <span>

                                {agent.username}

                            </span>

                        </div>

                    )

                })}

            </div>

        </div>

    );

}