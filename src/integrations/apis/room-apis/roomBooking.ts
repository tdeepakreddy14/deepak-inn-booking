export const roomBookingAPI = (token: string, bookingData: object) => {

    return fetch("http://localhost:8000/api/bookings/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Booking response:", data);
            return data; // return to caller
        })
        .catch(err => {
            console.error("Error creating booking:", err);
            throw err;
        });
}


export const getBookingsListAPI = (
    token: string,
    status: string | null = null,
    page: number = 1,
    limit: number = 10
) => {
    // Build query params
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return fetch(`http://localhost:8000/api/bookings/?${params.toString()}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error("Error fetching bookings:", err);
            throw err;
        });
};


export const cancelBookingApi = (booking_id, token) => {

    return fetch(`http://localhost:8000/api/bookings/cancel_room/${booking_id}`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
    )
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error("Error fetching bookings:", err);
            throw err;
        });
}
