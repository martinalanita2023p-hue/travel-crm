import supabase from "../supabase/client";

export async function getAllAgents() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name");

  if (error) throw error;

  return data;
}