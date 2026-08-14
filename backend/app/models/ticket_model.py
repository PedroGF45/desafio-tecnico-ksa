import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, Text
from app.database.database_connector import Base

class CategoryEnum(str, enum.Enum):
    IT = "TI"
    MAINTENANCE = "Manutenção"
    PURCHASES = "Compras"
    FINANCES = "Financeiro"
    CUSTOMER_SERVICE = "Customer_Service"
    PRODUCTION = "Produção"

class PriorityEnum(str, enum.Enum):
    LOW = "Baixa"
    MEDIUM = "Média"
    HIGH = "Alta"
    URGENT = "Urgente"

class LocationEnum(str, enum.Enum):
    ERMESINDE = "Ermesinde"
    MADEIRA = "Madeira"
    TANGER = "Tânger"

class StatusEnum(str, enum.Enum):
    NEW = "Novo"
    IN_PROGRESS = "Em Curso"
    CLOSED = "Resolvido"

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(CategoryEnum), nullable=False)
    priority = Column(Enum(PriorityEnum), nullable=False)
    location = Column(Enum(LocationEnum), nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.NEW, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)