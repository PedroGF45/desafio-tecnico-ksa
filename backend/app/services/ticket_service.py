"""
Business logic service layer for ticket management operations.

TicketService contains the CRUD operations that are called by API endpoints.
All database operations are wrapped with error handling and logging.
"""

import logging
from sqlalchemy.orm import Session
import app.models.ticket_model as models
import app.schemas.ticket_schema as schemas

logger = logging.getLogger(__name__)


class TicketService:
    """
    Service class encapsulating ticket business logic.

    Provides static methods for creating, reading, and updating tickets
    in the database. All operations include error handling and logging.
    """

    @staticmethod
    async def create_ticket(db: Session, ticket_data: schemas.TicketCreate) -> models.Ticket:
        """
        Create a new ticket in the database.

        Creates a Ticket record from the provided schema, saves it to the database,
        and returns the created ticket with its auto-generated ID and timestamps.

        Args:
            db (Session): SQLAlchemy database session.
            ticket_data (schemas.TicketCreate): Validated ticket creation schema.

        Returns:
            models.Ticket: The created ticket with ID, created_at, and updated_at.

        Raises:
            SQLAlchemy exceptions if database insert fails (logged as ERROR).

        Example:
            ticket = await TicketService.create_ticket(
                db,
                schemas.TicketCreate(
                    title="Monitor broken",
                    description="...",
                    category="TI",
                    priority="Alta",
                    location="Ermesinde"
                )
            )
        """
        try:
            db_ticket = models.Ticket(**ticket_data.model_dump())
            db.add(db_ticket)
            db.commit()
            db.refresh(db_ticket)
            logger.info(f"Ticket created successfully: ID={db_ticket.id}, Title={db_ticket.title}")
            return db_ticket
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create ticket: {e}", exc_info=True)
            raise

    @staticmethod
    async def get_tickets(db: Session) -> list[models.Ticket]:
        """
        Retrieve all tickets from the database.

        Queries all tickets and returns them ordered by creation date (newest first).

        Args:
            db (Session): SQLAlchemy database session.

        Returns:
            list[models.Ticket]: List of all tickets, ordered by created_at descending.

        Raises:
            SQLAlchemy exceptions if database query fails (logged as ERROR).

        Example:
            tickets = await TicketService.get_tickets(db)
        """
        try:
            tickets = db.query(models.Ticket).order_by(models.Ticket.created_at.desc()).all()
            logger.info(f"Retrieved {len(tickets)} tickets from database")
            return tickets
        except Exception as e:
            logger.error(f"Failed to retrieve tickets: {e}", exc_info=True)
            raise

    @staticmethod
    async def update_ticket_status(
        db: Session, ticket_id: int, status: schemas.StatusEnum
    ) -> models.Ticket | None:
        """
        Update the status of an existing ticket.

        Finds the ticket by ID, updates its status field, and commits the change.
        The updated_at timestamp is automatically updated by the database.

        Args:
            db (Session): SQLAlchemy database session.
            ticket_id (int): ID of the ticket to update.
            status (schemas.StatusEnum): New status (Novo/Em Curso/Resolvido).

        Returns:
            models.Ticket | None: The updated ticket if found, None if ticket doesn't exist.

        Raises:
            SQLAlchemy exceptions if database operations fail (logged as ERROR).

        Example:
            updated = await TicketService.update_ticket_status(
                db, ticket_id=1, status=schemas.StatusEnum.IN_PROGRESS
            )
            if updated:
                print(f"Ticket {updated.id} updated to {updated.status}")
            else:
                print("Ticket not found")
        """
        try:
            db_ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
            if db_ticket:
                old_status = db_ticket.status
                db_ticket.status = status
                db.commit()
                db.refresh(db_ticket)
                logger.info(
                    f"Ticket {ticket_id} status updated: {old_status} → {status}"
                )
                return db_ticket
            else:
                logger.warning(f"Ticket {ticket_id} not found for status update")
                return None
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update ticket {ticket_id} status: {e}", exc_info=True)
            raise