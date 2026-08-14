from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.ticket_model import CategoryEnum, PriorityEnum, LocationEnum, StatusEnum

class TicketBase(BaseModel):
    title: str
    description: str
    category: CategoryEnum
    priority: PriorityEnum
    location: LocationEnum

class TicketCreate(TicketBase):
    pass

class TicketUpdateStatus(BaseModel):
    status: StatusEnum

class TicketResponse(TicketBase):
    id: int
    status: StatusEnum
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
