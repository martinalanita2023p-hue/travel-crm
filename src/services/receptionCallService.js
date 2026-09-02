import supabase from "../supabase/client";

export async function getAllReceptionCalls() {
  const { data, error } = await supabase
    .from("reception_calls")
    .select("*")
    .order("call_date", { ascending: false })
    .order("call_time", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getReceptionCallsByDate(callDate) {
  const { data, error } = await supabase
    .from("reception_calls")
    .select("*")
    .eq("call_date", callDate)
    .order("call_time", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getReceptionAgents() {
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      username,
      role,
      status,
      agent_teams (
        manager_name
      )
    `)
    .eq("role", "Agent")
    .order("name", { ascending: true });

  if (error) throw error;

  return (data || []).map((agent) => ({
    ...agent,
    manager_name:
      agent.agent_teams?.[0]?.manager_name || null,
  }));
}

export async function createReceptionCall(call) {
  const { data, error } = await supabase
    .from("reception_calls")
    .insert({
      call_date: call.call_date,
      call_time: call.call_time || null,
      customer_name: call.customer_name?.trim() || null,
      phone_number: call.phone_number?.trim() || null,
      email: call.email?.trim() || null,
      call_type: call.call_type,
      travel_type: call.travel_type || null,
      assigned_agent: call.assigned_agent || null,
      manager_name: call.manager_name || null,
      disposition: call.disposition || "Active",
      disposed_reason:
        call.disposed_reason?.trim() || null,
      remarks: call.remarks?.trim() || null,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateReceptionCall(id, updates) {
  const { data, error } = await supabase
    .from("reception_calls")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteReceptionCall(id) {
  const { error } = await supabase
    .from("reception_calls")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}