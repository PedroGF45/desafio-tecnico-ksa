"""
Database connection setup and session management for KSA Ticket System.

This module initializes the SQLAlchemy engine, session factory, and declarative
base. Provides a FastAPI dependency for injecting database sessions into route
handlers.

Environment:
    DATABASE_URL: PostgreSQL connection string (postgresql://user:pass@host/db)
"""

import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger(__name__)

# Get database URL from environment or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")

try:
    # Create SQLAlchemy engine with connection pooling
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Test connections before using them
        pool_recycle=3600,   # Recycle connections after 1 hour
    )
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}", exc_info=True)
    raise

# Create session factory for dependency injection
try:
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info("Session factory created successfully")
except Exception as e:
    logger.error(f"Failed to create session factory: {e}", exc_info=True)
    raise

# Create declarative base for ORM models
Base = declarative_base()

def get_db():
    """
    FastAPI dependency for injecting database sessions into route handlers.

    Yields a new SQLAlchemy session for each request and ensures proper cleanup
    (closing) after the request completes, even if an error occurs.

    Usage:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()

    Yields:
        Session: SQLAlchemy session bound to the PostgreSQL connection.

    Raises:
        Any database connection error is logged and re-raised to the caller.
    """
    db = None
    try:
        db = SessionLocal()
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}", exc_info=True)
        if db:
            db.rollback()
        raise
    finally:
        if db:
            try:
                db.close()
            except Exception as e:
                logger.error(f"Error closing database session: {e}", exc_info=True)