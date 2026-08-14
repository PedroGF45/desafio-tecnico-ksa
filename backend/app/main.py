from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database_connector import engine, Base
from app.api.v1 import tickets_endpoints

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema Interno de Registo e Acompanhamentos de Pedidos do GRUPO KSA",
    description="API para o sistema interno de registo e acompanhamento de pedidos",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # for production we need to only allow the specific origins that are allowed to access the API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(tickets_endpoints.router)

# health endpoint
@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}

@app.get("/")
def read_root():
    return {"message": "API de Tickets a funcionar!"}