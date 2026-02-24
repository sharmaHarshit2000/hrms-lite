const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.detail || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  listEmployees: () => request("/employees"),
  addEmployee: (payload) =>
    request("/employees", { method: "POST", body: JSON.stringify(payload) }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: "DELETE" }),

  markAttendance: (id, payload) =>
    request(`/employees/${id}/attendance`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listAttendance: (id) => request(`/employees/${id}/attendance`),
};