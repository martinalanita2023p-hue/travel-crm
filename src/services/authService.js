import supabase from "../supabase/client";

export async function login(username, password) {

  console.log("Username Entered:", username);
  console.log("Password Entered:", password);

  const { data, error } = await supabase
    .from("users")
    .select("*");

  console.log("ALL USERS:", data);
  console.log("SUPABASE ERROR:", error);

  const user = data?.find(
    (u) =>
      u.username === username.trim().toLowerCase() &&
      u.password === password.trim()
  );

  console.log("FOUND USER:", user);

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