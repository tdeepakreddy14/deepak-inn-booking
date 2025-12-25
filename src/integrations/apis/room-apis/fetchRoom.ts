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


export const fetchRoomById = (roomId: string , token) => {

  return fetch(`http://localhost:8000/api/rooms/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // send token
    },
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch room");
      }

      // setRoom(data.data);
      return data; // return room object only
    })
    .catch((error) => {
      console.error("Error fetching room:", error);
      throw error;
    });
};