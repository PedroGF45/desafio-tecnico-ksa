from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database_connector import get_db
from app.services.ticket_service import TicketService
import app.schemas.ticket_schema as schemas

router = APIRouter(
    prefix="/v1/tickets",
    tags=["tickets"],
    responses={404: {"description": "Not found"}},
)

@router.post("/create", response_model=schemas.TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(ticket_in: schemas.TicketCreate, db: Session = Depends(get_db)):
    return TicketService.create_ticket(db=db, ticket_data=ticket_in)

@router.get("/list", response_model=List[schemas.TicketResponse])
async def list_tickets(
    db: Session = Depends(get_db)
):
    return TicketService.get_tickets(db=db)

@router.patch("/{ticket_id}/status", response_model=schemas.TicketResponse)
async def update_ticket_status(
    ticket_id: int, 
    status_in: schemas.TicketUpdateStatus, 
    db: Session = Depends(get_db)
):
    updated_ticket = TicketService.update_ticket_status(db=db, ticket_id=ticket_id, status=status_in.status)
    if not updated_ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado")
    return updated_ticket