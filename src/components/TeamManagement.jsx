import { useEffect, useState } from "react";
import "../styles/teamManagement.css";

import {
  getAgentsWithTeams,
  assignAgentToTeam,
  removeAgentFromTeam,
} from "../services/agentTeamService";


function TeamManagement() {

  const [agents, setAgents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [savingAgent, setSavingAgent] =
    useState(null);

  const [search, setSearch] =
    useState("");


  /* ===================================================
     LOAD
  =================================================== */

  async function loadAgents() {

    try {

      setLoading(true);

      const data =
        await getAgentsWithTeams();

      setAgents(
        data || []
      );

    }

    catch (error) {

      console.error(error);

      alert(
        error?.message ||
        "Unable to load agents."
      );

    }

    finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadAgents();

  }, []);


  /* ===================================================
     ASSIGN
  =================================================== */

  async function handleAssign(
    agentId,
    managerName
  ) {

    try {

      setSavingAgent(agentId);

      await assignAgentToTeam(
        agentId,
        managerName
      );


      setAgents(
        (current) =>

          current.map(
            (agent) =>

              Number(agent.id) ===
              Number(agentId)

                ? {
                    ...agent,

                    manager_name:
                      managerName,
                  }

                : agent
          )
      );

    }

    catch (error) {

      console.error(error);

      alert(
        error?.message ||
        "Unable to update team."
      );

    }

    finally {

      setSavingAgent(null);

    }

  }


  /* ===================================================
     REMOVE
  =================================================== */

  async function handleRemove(
    agentId
  ) {

    try {

      setSavingAgent(agentId);

      await removeAgentFromTeam(
        agentId
      );


      setAgents(
        (current) =>

          current.map(
            (agent) =>

              Number(agent.id) ===
              Number(agentId)

                ? {
                    ...agent,

                    manager_name:
                      null,
                  }

                : agent
          )
      );

    }

    catch (error) {

      console.error(error);

      alert(
        error?.message ||
        "Unable to remove agent."
      );

    }

    finally {

      setSavingAgent(null);

    }

  }


  /* ===================================================
     FILTER
  =================================================== */

  const filteredAgents =
    agents.filter(
      (agent) =>

        agent.name
          ?.toLowerCase()
          .includes(
            search
              .trim()
              .toLowerCase()
          ) ||

        agent.username
          ?.toLowerCase()
          .includes(
            search
              .trim()
              .toLowerCase()
          )
    );


  const aaravAgents =
    filteredAgents.filter(
      (agent) =>
        agent.manager_name ===
        "Aarav"
    );


  const ericAgents =
    filteredAgents.filter(
      (agent) =>
        agent.manager_name ===
        "Eric"
    );


  const unassignedAgents =
    filteredAgents.filter(
      (agent) =>
        !agent.manager_name
    );


  /* ===================================================
     AGENT CARD
  =================================================== */

  function AgentCard({
    agent
  }) {

    const isSaving =
      Number(savingAgent) ===
      Number(agent.id);


    return (

      <div className="team-agent-card">

        <div className="team-agent-info">

          <strong>
            {agent.name}
          </strong>

          <span>
            {agent.username}
          </span>

        </div>


        <div className="team-agent-actions">

          <button
            type="button"
            className={
              agent.manager_name ===
              "Aarav"
                ? "team-btn active"
                : "team-btn"
            }
            disabled={isSaving}
            onClick={() =>
              handleAssign(
                agent.id,
                "Aarav"
              )
            }
          >

            Aarav

          </button>


          <button
            type="button"
            className={
              agent.manager_name ===
              "Eric"
                ? "team-btn active"
                : "team-btn"
            }
            disabled={isSaving}
            onClick={() =>
              handleAssign(
                agent.id,
                "Eric"
              )
            }
          >

            Eric

          </button>


          {agent.manager_name && (

            <button
              type="button"
              className="team-remove-btn"
              disabled={isSaving}
              onClick={() =>
                handleRemove(
                  agent.id
                )
              }
            >

              Remove

            </button>

          )}

        </div>

      </div>

    );

  }


  /* ===================================================
     PAGE
  =================================================== */

  return (

    <section className="team-management">

      <div className="team-management-header">

        <div>

          <h2>
            Team Management
          </h2>

          <p>
            Assign agents to Aarav or Eric
            before the team meeting.
          </p>

        </div>


        <input
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>


      {loading ? (

        <div className="team-loading">

          Loading agents...

        </div>

      ) : (

        <div className="team-columns">


          {/* ==========================================
              AARAV
          =========================================== */}

          <div className="team-column">

            <div className="team-column-header">

              <div>

                <h3>
                  Aarav Team
                </h3>

                <span>
                  {aaravAgents.length} agents
                </span>

              </div>

            </div>


            <div className="team-agent-list">

              {aaravAgents.length === 0 ? (

                <div className="team-empty">

                  No agents assigned.

                </div>

              ) : (

                aaravAgents.map(
                  (agent) => (

                    <AgentCard
                      key={agent.id}
                      agent={agent}
                    />

                  )
                )

              )}

            </div>

          </div>


          {/* ==========================================
              ERIC
          =========================================== */}

          <div className="team-column">

            <div className="team-column-header">

              <div>

                <h3>
                  Eric Team
                </h3>

                <span>
                  {ericAgents.length} agents
                </span>

              </div>

            </div>


            <div className="team-agent-list">

              {ericAgents.length === 0 ? (

                <div className="team-empty">

                  No agents assigned.

                </div>

              ) : (

                ericAgents.map(
                  (agent) => (

                    <AgentCard
                      key={agent.id}
                      agent={agent}
                    />

                  )
                )

              )}

            </div>

          </div>


          {/* ==========================================
              UNASSIGNED
          =========================================== */}

          <div className="team-column unassigned-column">

            <div className="team-column-header">

              <div>

                <h3>
                  Unassigned
                </h3>

                <span>
                  {unassignedAgents.length} agents
                </span>

              </div>

            </div>


            <div className="team-agent-list">

              {unassignedAgents.length === 0 ? (

                <div className="team-empty">

                  All agents assigned.

                </div>

              ) : (

                unassignedAgents.map(
                  (agent) => (

                    <AgentCard
                      key={agent.id}
                      agent={agent}
                    />

                  )
                )

              )}

            </div>

          </div>


        </div>

      )}

    </section>

  );

}


export default TeamManagement;