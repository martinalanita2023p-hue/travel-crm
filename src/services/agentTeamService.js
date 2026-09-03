import supabase from "../supabase/client";


/* =====================================================
   GET ALL AGENTS
===================================================== */

export async function getAllAgents() {

  const { data, error } = await supabase
  .from("users")
  .select("id,name,username,role,status")
  .eq("role", "Agent")
  .order("name", { ascending: true });


  if (error) {

    console.error(
      "Error loading agents:",
      error
    );

    throw error;

  }


  return data || [];

}


/* =====================================================
   GET TEAM ASSIGNMENTS
===================================================== */

export async function getAgentTeams() {

  const { data, error } = await supabase
    .from("agent_teams")
    .select(`
      id,
      agent_id,
      manager_name,
      created_at,
      updated_at
    `);


  if (error) {

    console.error(
      "Error loading team assignments:",
      error
    );

    throw error;

  }


  return data || [];

}


/* =====================================================
   ASSIGN AGENT TO TEAM
===================================================== */

export async function assignAgentToTeam(
  agentId,
  managerName
) {

  if (!agentId) {

    throw new Error(
      "Agent ID is required."
    );

  }


  if (
    managerName !== "Aarav" &&
    managerName !== "Eric"
  ) {

    throw new Error(
      "Invalid manager."
    );

  }


  const { data, error } = await supabase

    .from("agent_teams")

    .upsert(
      {
        agent_id: agentId,
        manager_name: managerName,
      },
      {
        onConflict: "agent_id",
      }
    )

    .select();


  if (error) {

    console.error(
      "Error assigning agent:",
      error
    );

    throw error;

  }


  return data?.[0] || null;

}


/* =====================================================
   REMOVE AGENT FROM TEAM
===================================================== */

export async function removeAgentFromTeam(
  agentId
) {

  const { error } = await supabase

    .from("agent_teams")

    .delete()

    .eq(
      "agent_id",
      agentId
    );


  if (error) {

    console.error(
      "Error removing agent:",
      error
    );

    throw error;

  }


  return true;

}


/* =====================================================
   MOVE AGENT
===================================================== */

export async function moveAgent(
  agentId,
  managerName
) {

  return assignAgentToTeam(
    agentId,
    managerName
  );

}


/* =====================================================
   GET AGENTS WITH THEIR TEAMS
===================================================== */

export async function getAgentsWithTeams() {

  const [
    agents,
    assignments
  ] = await Promise.all([

    getAllAgents(),

    getAgentTeams(),

  ]);


  const assignmentMap =
    new Map();


  assignments.forEach(
    (assignment) => {

      assignmentMap.set(
        Number(
          assignment.agent_id
        ),

        assignment.manager_name
      );

    }
  );


  return agents.map(
    (agent) => ({

      ...agent,

      manager_name:
        assignmentMap.get(
          Number(agent.id)
        ) || null,

    })
  );

}