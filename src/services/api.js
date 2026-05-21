const scriptURL =
  "https://script.google.com/macros/s/AKfycbx9Aa69CGSydRNGtrYD_SXH0hStkuvMZvZFARXbItPwXDFxRdEyVPqvKLapxaoyXYI6/exec";

// LOGIN API

export async function loginUser(username, password) {
  const response = await fetch(scriptURL, {
    method: "POST",

    body: JSON.stringify({
      action: "login",

      username,

      password,
    }),
  });

  return await response.json();
}

// GET LOGS

export async function getLogs() {
  const response = await fetch(scriptURL, {
    method: "POST",

    body: JSON.stringify({
      action: "getLogs",
    }),
  });

  return await response.json();
}

// SAVE LOG

export async function saveLog(data) {
  const response = await fetch(scriptURL, {
    method: "POST",

    body: JSON.stringify({
      action: "saveLog",

      ...data,
    }),
  });

  return await response.json();
}

// GET USERS

export async function getUsers() {
  const response = await fetch(scriptURL, {
    method: "POST",

    body: JSON.stringify({
      action: "getUsers",
    }),
  });

  return await response.json();
}

// CREATE USER

export async function createUser(data) {
  const response = await fetch(scriptURL, {
    method: "POST",

    body: JSON.stringify({
      action: "createUser",

      ...data,
    }),
  });

  return await response.json();
}

// RESET PASSWORD

export async function resetPassword(data) {
  const response = await fetch(scriptURL, {
    method: "POST",

    body: JSON.stringify({
      action: "resetPassword",

      ...data,
    }),
  });

  return await response.json();
}

// UPDATE STATUS

export async function updateStatus(data) {
  const response = await fetch(scriptURL, {
    method: "POST",

    body: JSON.stringify({
      action: "updateStatus",

      ...data,
    }),
  });

  return await response.json();
}

// UPDATE USER

export async function updateUser(data) {
  const response = await fetch(scriptURL, {
    method: "POST",

    body: JSON.stringify({
      action: "updateUser",

      ...data,
    }),
  });

  return await response.json();
}
