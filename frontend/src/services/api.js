const API_URL = process.env.REACT_APP_API_URL || "/api/v1";

export async function fetchTickets() {
    const response = await fetch(`${API_URL}/tickets/list`);

    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }

    return response.json();
}

export async function createTicket(ticketData) {
    const response = await fetch(`${API_URL}/tickets/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
        throw new Error("Failed to create ticket");
    }
    return response.json();
}

export async function updateTicketStatus(ticketId, newStatus) {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
        throw new Error("Failed to update ticket status");
    }
    return response.json();
}