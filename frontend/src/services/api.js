/**
 * API client service for KSA Ticket Management System.
 *
 * Provides wrapper functions for all backend API calls with error handling
 * and logging. All functions return JSON data or throw errors.
 *
 * @module services/api
 */

import { getLogger } from '../utils/logger.js';

const logger = getLogger('api');
const API_URL = process.env.REACT_APP_API_URL || "/api/v1";

/**
 * Fetch all tickets from the backend API.
 *
 * Makes a GET request to retrieve the complete list of tickets from
 * the database, ordered by creation date (newest first).
 *
 * @async
 * @returns {Promise<Array>} Array of ticket objects
 * @throws {Error} If the API request fails or returns non-OK status
 *
 * @example
 *   try {
 *     const tickets = await fetchTickets();
 *     console.log(`Fetched ${tickets.length} tickets`);
 *   } catch (error) {
 *     console.error('Failed to fetch tickets:', error);
 *   }
 */
export async function fetchTickets() {
  try {
    logger.debug('Fetching tickets from API');
    const response = await fetch(`${API_URL}/tickets/list`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.detail || `HTTP ${response.status}`;
      logger.error(`Failed to fetch tickets: ${errorMsg}`);
      throw new Error(`Failed to fetch tickets: ${errorMsg}`);
    }

    const data = await response.json();
    logger.info(`Successfully fetched ${data.length} tickets`);
    return data;
  } catch (error) {
    logger.error('Error in fetchTickets', error);
    throw error;
  }
}

/**
 * Create a new ticket via the backend API.
 *
 * Sends a POST request with ticket data (title, description, category,
 * priority, location). The API validates the data and returns the created
 * ticket with auto-generated ID and timestamps.
 *
 * @async
 * @param {Object} ticketData - Ticket creation payload
 * @param {string} ticketData.title - Ticket subject (5-255 chars)
 * @param {string} ticketData.description - Detailed description (10-5000 chars)
 * @param {string} ticketData.category - Category enum value
 * @param {string} ticketData.priority - Priority enum value
 * @param {string} ticketData.location - Location enum value
 * @returns {Promise<Object>} Created ticket with ID, status, and timestamps
 * @throws {Error} If validation fails or API request fails
 *
 * @example
 *   const newTicket = {
 *     title: "Monitor broken",
 *     description: "Monitor in office 101 won't turn on",
 *     category: "TI",
 *     priority: "Alta",
 *     location: "Ermesinde"
 *   };
 *   const created = await createTicket(newTicket);
 *   console.log(`Ticket created with ID ${created.id}`);
 */
export async function createTicket(ticketData) {
  try {
    logger.info(`Creating new ticket: ${ticketData.title}`);

    const response = await fetch(`${API_URL}/tickets/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.detail || `HTTP ${response.status}`;
      logger.error(`Failed to create ticket: ${errorMsg}`);
      throw new Error(`Failed to create ticket: ${errorMsg}`);
    }

    const data = await response.json();
    logger.info(`Ticket created successfully with ID ${data.id}`);
    return data;
  } catch (error) {
    logger.error('Error in createTicket', error);
    throw error;
  }
}

/**
 * Update a ticket's status via the backend API.
 *
 * Sends a PATCH request to update a specific ticket's status.
 * Valid status values: "Novo", "Em Curso", "Resolvido".
 *
 * @async
 * @param {number} ticketId - ID of the ticket to update
 * @param {string} newStatus - New status value (must be valid enum)
 * @returns {Promise<Object>} Updated ticket with new status and timestamp
 * @throws {Error} If ticket not found (404) or API request fails
 *
 * @example
 *   const updated = await updateTicketStatus(1, "Em Curso");
 *   console.log(`Ticket 1 now has status: ${updated.status}`);
 */
export async function updateTicketStatus(ticketId, newStatus) {
  try {
    logger.info(`Updating ticket ${ticketId} status to ${newStatus}`);

    const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.detail || `HTTP ${response.status}`;
      logger.error(`Failed to update ticket ${ticketId}: ${errorMsg}`);
      throw new Error(`Failed to update ticket: ${errorMsg}`);
    }

    const data = await response.json();
    logger.info(`Ticket ${ticketId} status updated successfully to ${data.status}`);
    return data;
  } catch (error) {
    logger.error('Error in updateTicketStatus', error);
    throw error;
  }
}