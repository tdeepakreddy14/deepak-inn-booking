//delete Room ADMIIN req

export const deleteRoom = (roomId, token) => {
  return fetch(`http://localhost:8000/api/rooms/${roomId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw err; // throw API error
        });
      }
      return response.json(); // parse JSON
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error("Delete error:", error);
      throw error;
    });
};