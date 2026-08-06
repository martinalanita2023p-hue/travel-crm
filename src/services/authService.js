import supabase from "../supabase/client";

export async function login(username, password) {

  console.clear();

  console.log("========== LOGIN ==========");

  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    console.error("Supabase Error:", error);
    throw error;
  }

  const user = data.find(
    (u) =>
      u.username.toLowerCase() === username.trim().toLowerCase() &&
      u.password === password.trim()
  );

  console.log("Matched User:", user);
  console.log("Role From Database:", user?.role);

  if (!user) {
    throw new Error("Invalid Username or Password");
  }

  return user;
}

export function saveUser(user) {
  localStorage.setItem(
    "travelUser",
    JSON.stringify(user)
  );
}

export function getUser() {
  return JSON.parse(
    localStorage.getItem("travelUser")
  );
}

export function logout() {
  localStorage.removeItem("travelUser");
}