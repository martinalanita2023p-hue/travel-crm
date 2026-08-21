import supabase from "../supabase/client";


/* =======================================
   LOGIN
======================================= */

export async function login(username, password) {

  const cleanUsername =
    username?.trim().toLowerCase();

  const cleanPassword =
    password?.trim();


  console.clear();

  console.log(
    "========== LOGIN =========="
  );

  console.log(
    "Username entered:",
    cleanUsername
  );

  console.log(
    "Password length:",
    cleanPassword?.length
  );


  /* =====================================
     GET USERS
  ===================================== */

  const {
    data,
    error,
  } = await supabase
    .from("users")
    .select("*");


  if (error) {

    console.error(
      "Supabase Error:",
      error
    );

    throw error;

  }


  console.log(
    "Users returned:",
    data?.length
  );


  /* =====================================
     FIND USER
     
     Trim + lowercase username on BOTH
     sides because the database may contain
     accidental spaces/capitalization.
  ===================================== */

  const user = data?.find(
    (u) => {

      const databaseUsername =
        String(
          u.username ?? ""
        )
        .trim()
        .toLowerCase();


      console.log(
        "Checking username:",
        JSON.stringify(
          databaseUsername
        )
      );


      return (
        databaseUsername ===
        cleanUsername
      );

    }
  );


  /* =====================================
     USER NOT FOUND
  ===================================== */

  if (!user) {

    console.error(
      "USERNAME NOT FOUND:",
      cleanUsername
    );

    throw new Error(
      "Invalid Username or Password"
    );

  }


  console.log(
    "USERNAME MATCHED:",
    user.username
  );

  console.log(
    "Name:",
    user.name
  );

  console.log(
    "Role:",
    user.role
  );


  /* =====================================
     PASSWORD CHECK
     
     Trim the database value as well.
  ===================================== */

  const storedPassword =
    String(
      user.password ?? ""
    ).trim();


  console.log(
    "Stored password length:",
    storedPassword.length
  );

  console.log(
    "Entered password length:",
    cleanPassword?.length
  );


  if (
    storedPassword !==
    cleanPassword
  ) {

    console.error(
      "PASSWORD DID NOT MATCH"
    );

    throw new Error(
      "Invalid Username or Password"
    );

  }


  /* =====================================
     SUCCESS
  ===================================== */

  console.log(
    "========== LOGIN SUCCESS =========="
  );


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

  }

  catch {

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