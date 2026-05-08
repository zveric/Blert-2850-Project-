// used Gemini to understand how to send form data to the backend and how to store and send tokens
export async function login(username, password) {
  const res = await fetch("/api/login/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${username}&password=${password}`,
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("token");
}

export async function register(username, password) {
  const res = await fetch("/api/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.ok;
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function getReadings(
  limit = 10,
  livestock = null,
  startDate = null,
  endDate = null,
) {
  let url = `/api/readings/?limit=${limit}`;

  if (livestock) {
    url += `&livestock=${livestock}`;
  }

  if (startDate) {
    url += `&start_time=${startDate.toISOString()}`;
  }

  if (endDate) {
    url += `&end_time=${endDate.toISOString()}`;
  }

  const res = await fetch(url, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  const data = await res.json();

  if (data.alerts != null) {
    const alert = await fetch(data.alert, {
      headers: { Authorization: `Token ${getToken()}` },
    });
    data["alert"] = alert;

    console.log(data);
  }
  return data;
}
