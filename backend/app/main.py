"""
KSA Ticket Management System — FastAPI Backend Application.

This module initializes the FastAPI application, configures middleware (CORS, logging),
sets up database tables, and includes all API route handlers.

Architecture:
    - FastAPI serves as the REST API framework
    - SQLAlchemy ORM manages database interactions
    - Pydantic validates all request/response schemas
    - Python logging logs all operations and errors
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database_connector import engine, Base
from app.api.v1 import tickets_endpoints
from app.logging_config import setup_logging, get_logger

# Initialize logging
setup_logging()
logger = get_logger(__name__)

# Create the database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database tables: {e}", exc_info=True)
    raise

# Initialize FastAPI application
app = FastAPI(
    title="Sistema Interno de Registo e Acompanhamentos de Pedidos do GRUPO KSA",
    description="API para o sistema interno de registo e acompanhamento de pedidos",
    version="1.0.0",
)

# Configure CORS middleware
# TODO: allow_origins=["*"] is for development only.
try:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info("CORS middleware configured")
except Exception as e:
    logger.error(f"Failed to configure CORS: {e}", exc_info=True)
    raise

# Include API routers
try:
    app.include_router(tickets_endpoints.router)
    logger.info("API routers registered successfully")
except Exception as e:
    logger.error(f"Failed to register API routers: {e}", exc_info=True)
    raise


@app.get("/health", tags=["health"])
def health_check():
    """
    Health check endpoint for monitoring application status.

    Returns:
        dict: Status indicator confirming API is running.

    Returns:
        {"status": "ok"} if the API is operational.
    """
    try:
        logger.debug("Health check endpoint called")
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        return {"status": "error", "detail": str(e)}


@app.get("/")
def read_root():
    """
    Root endpoint providing API welcome message.

    Returns:
        dict: Welcome message indicating API is operational.
    """
    try:
        logger.debug("Root endpoint called")
        return {"message": "API de Tickets a funcionar!"}
    except Exception as e:
        logger.error(f"Root endpoint error: {e}", exc_info=True)
        return {"message": "API error", "detail": str(e)}