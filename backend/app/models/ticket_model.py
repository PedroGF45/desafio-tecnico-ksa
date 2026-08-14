"""
SQLAlchemy ORM models for the KSA Ticket Management System.

Defines the Ticket database model and enumeration classes for categories,
priorities, locations, and statuses. All enums enforce valid values at the
database schema level using PostgreSQL ENUM types.
"""

import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, Text
from app.database.database_connector import Base


class CategoryEnum(str, enum.Enum):
    """
    Enumeration of ticket categories.

    Represents the type/department of a ticket:
    - TI: Information Technology support
    - MAINTENANCE: Equipment or facility maintenance
    - PURCHASES: Procurement and purchasing requests
    - FINANCES: Financial/accounting inquiries
    - CUSTOMER_SERVICE: Customer-facing support issues
    - PRODUCTION: Production floor issues
    """

    IT = "TI"
    MAINTENANCE = "Manutenção"
    PURCHASES = "Compras"
    FINANCES = "Financeiro"
    CUSTOMER_SERVICE = "Customer_Service"
    PRODUCTION = "Produção"


class PriorityEnum(str, enum.Enum):
    """
    Enumeration of ticket priority levels.

    Indicates urgency and importance:
    - LOW: Can be handled at normal pace
    - MEDIUM: Should be handled within normal business hours
    - HIGH: Should be prioritized, affects operations
    - URGENT: Critical issue, needs immediate attention
    """

    LOW = "Baixa"
    MEDIUM = "Média"
    HIGH = "Alta"
    URGENT = "Urgente"


class LocationEnum(str, enum.Enum):
    """
    Enumeration of company locations.

    Represents the three operational sites of Grupo KSA:
    - ERMESINDE: Portugal Continental headquarters
    - MADEIRA: Madeira operations
    - TANGER: Morocco operations (Tangier)
    """

    ERMESINDE = "Ermesinde"
    MADEIRA = "Madeira"
    TANGER = "Tânger"


class StatusEnum(str, enum.Enum):
    """
    Enumeration of ticket lifecycle statuses.

    Tracks ticket progression through workflow:
    - NEW: Ticket just created, not yet assigned
    - IN_PROGRESS: Work has started on the ticket
    - CLOSED: Ticket is resolved and completed
    """

    NEW = "Novo"
    IN_PROGRESS = "Em Curso"
    CLOSED = "Resolvido"


class Ticket(Base):
    """
    SQLAlchemy ORM model representing a support ticket.

    Each ticket tracks a request from an employee across one of KSA's
    three locations. Fields enforce data integrity through enum
    constraints, not-null requirements, and automatic timestamps.

    Attributes:
        id (int): Unique ticket identifier (primary key, auto-increment).
        title (str): Short subject line, max 255 characters.
        description (str): Detailed explanation of the issue.
        category (CategoryEnum): Type/department of the ticket.
        priority (PriorityEnum): Urgency level (Baixa/Média/Alta/Urgente).
        location (LocationEnum): Which location submitted the ticket.
        status (StatusEnum): Current lifecycle state (Novo/Em Curso/Resolvido).
        created_at (datetime): Timestamp when ticket was created (auto-set).
        updated_at (datetime): Timestamp of last modification (auto-set).
    """

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