export const BlockedDatesApi = (type:string, token:string) => {
    return fetch(`http://localhost:8000/api/bookings/blocked_dates/${type}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },

    }).then((response) => {
        if (response.ok) {
            return response.json()
        }
    }).then((resp) => {
        return resp
    }).catch(error => {
        console.error("Error fetching rooms:", error);
        throw error;
    });
}