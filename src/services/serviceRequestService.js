import supabase from "../supabase/client";

export async function saveServiceRequest(request) {
  const { data, error } = await supabase
    .from("service_requests")
    .insert([request])
    .select();

  if (error) {
    throw error;
  }

  return data;
}