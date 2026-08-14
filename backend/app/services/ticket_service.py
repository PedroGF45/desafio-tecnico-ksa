from sqlalchemy.orm import Session
import app.models.ticket_model as models
import app.schemas.ticket_schema as schemas

class TicketService:

    @staticmethod
    async def create_ticket(db: Session, ticket_data: schemas.TicketCreate) -> models.Ticket:
        db_ticket = models.Ticket(**ticket_data.model_dump())
        db.add(db_ticket)
        db.commit()
        db.refresh(db_ticket)
        return db_ticket

    @staticmethod
    async def get_tickets(db: Session) -> list[models.Ticket]:
        return db.query(models.Ticket).order_by(models.Ticket.created_at.desc()).all()

    @staticmethod
    async def update_ticket_status(db: Session, ticket_id: int, status: schemas.StatusEnum) -> models.Ticket | None:
        db_ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
        if db_ticket:
            db_ticket.status = status
            db.commit()
            db.refresh(db_ticket)
            return db_ticket
        return None