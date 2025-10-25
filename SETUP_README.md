# unbias.ai - Research Platform

A full-stack research platform for theory validation, citation checking, and provenance tracking with a retro terminal-style interface.

## Features

### Backend (FastAPI)
- **Theory Ingestion**: Create and manage research theories
- **Citation Validation**: Validate citations using DeepSeek API
- **Redis Caching**: Fast caching layer for validation results
- **Provenance Tracking**: Complete audit trail of all theory changes
- **PostgreSQL**: Persistent storage for theories, citations, and metadata

### Frontend (React)
- **Retro Terminal UI**: Classic command-line aesthetic
- **Draggable Windows**: Multi-window interface with taskbar
- **Citation Validator**: Validate and score citations
- **Assumption Monitor**: Track theory assumptions
- **Contradiction Heat Map**: Visualize contradictions
- **Provenance Viewer**: Browse complete theory history

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/virtualframes/unbias.ai.git
cd unbias.ai

# Start all services
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API credentials

# Run the server
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local if needed

# Run the development server
npm run dev
```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/unbias
REDIS_URL=redis://localhost:6379/0
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

## Deployment to Render

### Backend (Web Service)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables from `.env.example`
5. Add PostgreSQL and Redis databases as Render services

### Frontend (Static Site)

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL

## API Endpoints

- `GET /api/theories` - List all theories
- `POST /api/theories` - Create a new theory
- `GET /api/theories/{id}` - Get theory details
- `PUT /api/theories/{id}` - Update a theory
- `DELETE /api/theories/{id}` - Delete a theory
- `POST /api/theories/{id}/citations` - Add citation to theory
- `POST /api/citations/validate` - Validate a citation
- `GET /api/theories/{id}/assumptions` - Get theory assumptions
- `GET /api/theories/{id}/contradictions` - Get theory contradictions
- `GET /api/theories/{id}/provenance` - Get theory provenance

Full API documentation available at `/docs` when running the backend.

## Technology Stack

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy - SQL toolkit and ORM
- PostgreSQL - Database
- Redis - Caching layer
- Pydantic - Data validation
- httpx - Async HTTP client for DeepSeek API

### Frontend
- React - UI library
- Vite - Build tool
- react-draggable - Draggable windows
- axios - HTTP client
- CSS3 - Retro terminal styling

## Development

### Running Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Code Style

Backend follows PEP 8 standards. Frontend uses ESLint configuration.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open a GitHub issue.
