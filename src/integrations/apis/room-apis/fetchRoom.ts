  export const fetchRooms = (token) => {

    return fetch("http://localhost:8000/api/rooms/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error("Error fetching rooms:", error);
        throw error;
      });
  };