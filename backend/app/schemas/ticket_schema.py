"""
Pydantic request/response schema definitions for the Ticket API.

Schemas validate incoming request data and define outgoing response formats.
Validation ensures data integrity at the API boundary before database operations.
"""

from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from app.models.ticket_model import CategoryEnum, PriorityEnum, LocationEnum, StatusEnum


class TicketBase(BaseModel):
    """
    Base schema with common ticket fields required for creation.

    All fields are validated by Pydantic. String fields have length limits
    to prevent data overflow and potential injection attacks.

    Attributes:
        title (str): Ticket subject, 5-255 characters.
        description (str): Detailed description, 10-5000 characters.
        category (CategoryEnum): Department/category for the ticket.
        priority (PriorityEnum): Urgency level.
        location (LocationEnum): Which KSA location submitted the ticket.
    """

    title: str = Field(..., min_length=5, max_length=255, description="Ticket subject line")
    description: str = Field(..., min_length=10, max_length=5000, description="Detailed description")
    category: CategoryEnum = Field(..., description="Ticket category/department")
    priority: PriorityEnum = Field(..., description="Priority level")
    location: LocationEnum = Field(..., description="Location that submitted the ticket")


class TicketCreate(TicketBase):
    """
    Schema for creating a new ticket via POST /v1/tickets/create.

    Inherits all validation from TicketBase. Status is auto-set to 'Novo'
    on the database side; created_at and updated_at are auto-generated.
    """

    pass


class TicketUpdateStatus(BaseModel):
    """
    Schema for updating a ticket's status via PATCH /v1/tickets/{id}/status.

    Attributes:
        status (StatusEnum): New status for the ticket (Novo/Em Curso/Resolvido).
    """

    status: StatusEnum = Field(..., description="New ticket status")


class TicketResponse(TicketBase):
    """
    Schema for API responses returning ticket data.

    Extends TicketBase with database-generated fields. Configured to read
    attributes directly from SQLAlchemy ORM model instances using
    `from_attributes=True` (formerly `orm_mode`).

    Attributes:
        id (int): Unique ticket identifier.
        status (StatusEnum): Current ticket status.
        created_at (datetime): When the ticket was created.
        updated_at (datetime): When the ticket was last updated.
    """

    id: int = Field(..., description="Unique ticket identifier")
    status: StatusEnum = Field(..., description="Current ticket status")
    created_at: datetime = Field(..., description="Ticket creation timestamp")
    updated_at: datetime = Field(..., description="Last modification timestamp")

    model_config = ConfigDict(from_attributes=True)
