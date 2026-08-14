# KSA Ticket Management System

## 📋 Project Overview

This is a full-stack ticket management system built for **Grupo KSA** — a textile company with operations across Portugal (Ermesinde), Madeira, and Morocco (Tangier). 

The system enables employees across all three locations to:
- **Submit tickets** for IT support, maintenance, purchases, financials, customer service, and production issues
- **Track ticket status** in real-time (New → In Progress → Resolved)
- **Filter and search** tickets by status, category, priority, and location
- **Update ticket status** as work progresses

**Context**: KSA is transitioning from email/Excel-based ticket tracking to a centralized, multi-location system to reduce manual work and improve operational visibility.

---

## 📁 Folder Structure

```
desafio-tecnico-ksa/
├── backend/
│   ├── Dockerfile                          # Build image for backend container
│   ├── requirements.txt                    # Python dependencies
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                        # FastAPI app initialization, middleware setup
│   │   ├── logging_config.py              # Centralized logging configuration
│   │   ├── models/
│   │   │   └── ticket_model.py            # SQLAlchemy Ticket model + Enums
│   │   ├── schemas/
│   │   │   └── ticket_schema.py           # Pydantic request/response schemas
│   │   ├── services/
│   │   │   └── ticket_service.py          # Business logic (CRUD operations)
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── tickets_endpoints.py   # REST endpoints (/v1/tickets/*)
│   │   └── database/
│   │       └── database_connector.py      # Database session & engine setup
│   
├── frontend/
│   ├── Dockerfile                          # Build image for frontend (nginx)
│   ├── nginx.conf                          # Nginx reverse proxy configuration
│   ├── package.json                        # Node dependencies
│   ├── postcss.config.js                   # PostCSS config for Tailwind
│   ├── tailwind.config.js                  # Tailwind CSS customization
│   ├── public/
│   │   └── index.html                      # Static HTML entry point
│   └── src/
│       ├── App.jsx                         # Main React component, state management
│       ├── index.jsx                       # React app bootstrap
│       ├── index.css                       # Global styles
│       ├── utils/
│       │   └── logger.js                   # Unified logging utility
│       ├── services/
│       │   └── api.js                      # API client (fetch wrapper)
│       ├── components/
│       │   ├── Header.jsx                  # App header/branding
│       │   ├── Sidebar.jsx                 # Filters & ticket summary
│       │   └── TicketModal.jsx             # New ticket form
│       └── constants/
│           └── ticketConstants.js          # Categories, priorities, locations, statuses
│
├── docker-compose.yml                      # Multi-container orchestration config
├── .env                                    # Environment variables (GITIGNORE'd)
├── .env.example                            # Template for .env
├── README.md                               # This file
└── Desafio.pdf                            # Original challenge specification
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Docker & Docker Compose** (recommended for consistent environment)
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version && docker-compose --version`

- **OR** Local development setup:
  - Python 3.9+ (backend)
  - Node.js 16+ (frontend)
  - PostgreSQL 15+ (database)

### Quick Start (Docker — Recommended)

1. **Clone repository**
   ```bash
   git clone git@github.com:PedroGF45/desafio-tecnico-ksa.git
   cd desafio-tecnico-ksa
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
   - Database: postgres://localhost:5432

4. **Verify setup**
   ```bash
   # Check backend is running
   curl http://localhost:8000/health
   # Expected response: {"status":"ok"}
   ```

5. **View logs**
   ```bash
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f db
   ```

### Local Development Setup

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database connection
export DATABASE_URL="postgresql://ksa_user:ksa_password@localhost:5432/ksa_tickets"

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Database Configuration
POSTGRES_USER=ksa_user              # PostgreSQL username
POSTGRES_PASSWORD=ksa_password      # PostgreSQL password (change in production!)
POSTGRES_DB=ksa_tickets             # Database name
POSTGRES_PORT=5432                  # Database port

# Connection String
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:${POSTGRES_PORT}/${POSTGRES_DB}

# Service Ports
BACKEND_PORT=8000                   # FastAPI server port
FRONTEND_PORT=80                    # Nginx reverse proxy port
```

---

## 🏃 Running the Application

### Development Mode (Docker)
```bash
docker-compose up -d
# All services start in the background
# Logs: docker-compose logs -f
# Stop: docker-compose down
```

### Production Mode (Docker)
```bash
# Build optimized images
docker-compose -f docker-compose.yml build --no-cache

# Run with restart policy
docker-compose up -d

# Monitor health
docker-compose ps
curl http://localhost:3000/health  # Frontend health check
curl http://localhost:8000/health  # Backend health check
```

### Stop Services
```bash
docker-compose down  # Stop and remove containers
docker-compose down -v  # Also remove volumes (deletes data!)
```

---

## 📊 Logging & Monitoring

### Backend Logging
- **Format**: `[TIMESTAMP] [LEVEL] [MODULE] - MESSAGE`
- **Output**: Console (development) and files (production-ready)
- **Configuration**: `backend/app/logging_config.py`
- **Usage**: All modules import `get_logger(__name__)` and log errors/info

**Example**:
```python
from app.logging_config import get_logger

logger = get_logger(__name__)
logger.info("Ticket created successfully")
logger.error("Database connection failed", exc_info=True)
```

### Frontend Logging
- **Format**: Same as backend — `[TIMESTAMP] [LEVEL] [MODULE] - MESSAGE`
- **Output**: Browser console (development)
- **Configuration**: `frontend/src/utils/logger.js`
- **Usage**: All components import `getLogger(componentName)` and log events/errors

**Example**:
```javascript
import { getLogger } from '../utils/logger';

const logger = getLogger('TicketModal');
logger.info('Ticket created', { ticketId: 42 });
logger.error('Failed to create ticket', error);
```

### Monitoring in Production
- Logs should be aggregated to ELK Stack, DataDog, or CloudWatch
- Set up alerts for ERROR and CRITICAL level logs
- Track metrics: response time, error rate, database latency