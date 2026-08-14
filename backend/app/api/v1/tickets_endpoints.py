"""
REST API endpoints for ticket management.

Defines HTTP routes for creating, listing, and updating tickets.
All endpoints include error handling and structured logging.

Routes:
    POST   /v1/tickets/create      — Create a new ticket
    GET    /v1/tickets/list        — List all tickets (ordered by creation date)
    PATCH  /v1/tickets/{id}/status — Update a ticket's status
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database_connector import get_db
from app.services.ticket_service import TicketService
import app.schemas.ticket_schema as schemas

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/v1/tickets",
    tags=["tickets"],
    responses={404: {"description": "Not found"}},
)


@router.post("/create", response_model=schemas.TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(ticket_in: schemas.TicketCreate, db: Session = Depends(get_db)):
    """
    Create a new ticket.

    Accepts ticket data (title, description, category, priority, location),
    validates it, stores it in the database, and returns the created ticket
    with auto-generated ID and timestamps.

    Args:
        ticket_in (schemas.TicketCreate): Validated ticket creation request.
        db (Session): Database session (dependency-injected).

    Returns:
        schemas.TicketResponse: Created ticket with ID and timestamps.

    Raises:
        HTTPException 400: If validation fails (invalid enum values, string length).
        HTTPException 500: If database insert fails.

    Example:
        POST /v1/tickets/create
        {
            "title": "Monitor broken",
            "description": "Monitor in room 101 won't power on",
            "category": "TI",
            "priority": "Alta",
            "location": "Ermesinde"
        }

        Response (201):
        {
            "id": 1,
            "title": "Monitor broken",
            "description": "...",
            "category": "TI",
            "priority": "Alta",
            "location": "Ermesinde",
            "status": "Novo",
            "created_at": "2026-08-14T14:23:45.123456",
            "updated_at": "2026-08-14T14:23:45.123456"
        }
    """
    try:
        logger.info(f"Creating ticket: {ticket_in.title}")
        return await TicketService.create_ticket(db=db, ticket_data=ticket_in)
    except ValueError as e:
        logger.warning(f"Validation error while creating ticket: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating ticket: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create ticket. Please try again later."
        )


@router.get("/list", response_model=List[schemas.TicketResponse])
async def list_tickets(db: Session = Depends(get_db)):
    """
    List all tickets from the database.

    Retrieves all tickets ordered by creation date (newest first).
    No filtering applied here; filtering should be done on the frontend.

    Args:
        db (Session): Database session (dependency-injected).

    Returns:
        List[schemas.TicketResponse]: List of all tickets.

    Raises:
        HTTPException 500: If database query fails.

    Example:
        GET /v1/tickets/list

        Response (200):
        [
            {
                "id": 1,
                "title": "Monitor broken",
                "description": "...",
                "category": "TI",
                "priority": "Alta",
                "location": "Ermesinde",
                "status": "Novo",
                "created_at": "2026-08-14T14:23:45.123456",
                "updated_at": "2026-08-14T14:23:45.123456"
            },
            ...
        ]
    """
    try:
        logger.debug("Fetching all tickets")
        tickets = await TicketService.get_tickets(db=db)
        logger.info(f"Successfully retrieved {len(tickets)} tickets")
        return tickets
    except Exception as e:
        logger.error(f"Error retrieving tickets: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tickets. Please try again later."
        )


@router.patch("/{ticket_id}/status", response_model=schemas.TicketResponse)
async def update_ticket_status(
    ticket_id: int,
    status_in: schemas.TicketUpdateStatus,
    db: Session = Depends(get_db)
):
    """
    Update the status of an existing ticket.

    Finds the ticket by ID and updates its status to the provided value.
    Valid status values: "Novo", "Em Curso", "Resolvido".

    Args:
        ticket_id (int): ID of the ticket to update.
        status_in (schemas.TicketUpdateStatus): New status value.
        db (Session): Database session (dependency-injected).

    Returns:
        schemas.TicketResponse: Updated ticket with new status and timestamp.

    Raises:
        HTTPException 404: If ticket with the given ID doesn't exist.
        HTTPException 400: If status value is invalid.
        HTTPException 500: If database update fails.

    Example:
        PATCH /v1/tickets/1/status
        {
            "status": "Em Curso"
        }

        Response (200):
        {
            "id": 1,
            "title": "Monitor broken",
            "description": "...",
            "category": "TI",
            "priority": "Alta",
            "location": "Ermesinde",
            "status": "Em Curso",
            "created_at": "2026-08-14T14:23:45.123456",
            "updated_at": "2026-08-14T14:23:46.654321"
        }
    """
    try:
        logger.info(f"Updating ticket {ticket_id} status to {status_in.status}")
        updated_ticket = await TicketService.update_ticket_status(
            db=db, ticket_id=ticket_id, status=status_in.status
        )
        if not updated_ticket:
            logger.warning(f"Ticket {ticket_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ticket with ID {ticket_id} not found"
            )
        logger.info(f"Ticket {ticket_id} status updated successfully")
        return updated_ticket
    except HTTPException:
        raise
    except ValueError as e:
        logger.warning(f"Validation error updating ticket {ticket_id}: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating ticket {ticket_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update ticket status. Please try again later."
        )