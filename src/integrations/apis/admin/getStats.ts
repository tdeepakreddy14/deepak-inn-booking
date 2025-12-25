export const fetchAdminStats = (token: string) => {
  return fetch("http://localhost:8000/api/admin/stats", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching admin stats:", error);
      throw error; // allow upper layers to handle
    });
};
