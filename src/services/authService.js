import supabase from "../supabase/client";


/* =======================================
   LOGIN
======================================= */

export async function login(username, password) {

  const cleanUsername =
    username?.trim().toLowerCase();

  const cleanPassword =
    password?.trim();


  console.log("========== LOGIN ==========");
  console.log("Username:", cleanUsername);


  const { data, error } = await supabase
    .from("users")
    .select("*");


  if (error) {

    console.error(
      "Supabase Error:",
      error
    );

    throw error;

  }


  const user = data.find(
    (u) =>
      u.username?.trim().toLowerCase() ===
        cleanUsername &&
      u.password ===
        cleanPassword
  );


  console.log(
    "Matched User:",
    user
      ? {
          name: user.name,
          username: user.username,
          role: user.role,
        }
      : "NONE"
  );


  if (!user) {

    throw new Error(
      "Invalid Username or Password"
    );

  }


  return user;

}


/* =======================================
   SAVE USER
======================================= */

export function saveUser(user) {

  localStorage.setItem(
    "travelUser",
    JSON.stringify(user)
  );

}


/* =======================================
   GET CURRENT USER
======================================= */

export function getUser() {

  const storedUser =
    localStorage.getItem(
      "travelUser"
    );


  if (!storedUser) {
    return null;
  }


  try {

    return JSON.parse(
      storedUser
    );

  } catch {

    return null;

  }

}


/* =======================================
   LOGOUT
======================================= */

export function logout() {

  localStorage.removeItem(
    "travelUser"
  );

}