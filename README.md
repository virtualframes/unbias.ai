# unbias.ai

A full-stack research platform for theory validation, citation checking, and provenance tracking with a retro terminal-style interface.

![unbias.ai Screenshot](https://github.com/user-attachments/assets/f124a66b-ca9d-4d51-932e-c280e4cba568)

## 🎮 Features

### Backend (FastAPI)
- **Theory Ingestion**: Create and manage research theories with full CRUD operations
- **Citation Validation**: Validate citations using DeepSeek API with intelligent analysis
- **Redis Caching**: Lightning-fast caching layer for validation results
- **Provenance Tracking**: Complete audit trail of all theory changes and events
- **PostgreSQL**: Robust persistent storage for theories, citations, and metadata
- **RESTful API**: Well-documented API with automatic OpenAPI/Swagger docs

### Frontend (React)
- **Retro Terminal UI**: Classic command-line aesthetic with scanline effects
- **Draggable Windows**: Multi-window interface with taskbar navigation
- **Citation Validator**: Real-time citation validation with confidence scores
- **Assumption Monitor**: Track and analyze theory assumptions
- **Contradiction Heat Map**: Visual representation of theory contradictions
- **Provenance Viewer**: Browse complete theory history with event timeline

## 🚀 Quick Start

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

# Run the development server
npm run dev
```

## 📝 Configuration

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

## 🌐 Deployment to Render

This project is configured for easy deployment to Render using the included `render.yaml`.

### One-Click Deploy
1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new Blueprint instance pointing to your fork
4. Render will automatically create:
   - PostgreSQL database
   - Redis instance
   - Backend web service
   - Frontend static site

### Manual Configuration

See [SETUP_README.md](SETUP_README.md) for detailed deployment instructions.

## 📚 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

- `GET /api/theories` - List all theories
- `POST /api/theories` - Create a new theory
- `GET /api/theories/{id}` - Get theory details
- `PUT /api/theories/{id}` - Update a theory
- `DELETE /api/theories/{id}` - Delete a theory
- `POST /api/theories/{id}/citations` - Add citation to theory
- `POST /api/citations/validate` - Validate a citation
- `GET /api/theories/{id}/provenance` - Get theory provenance

## 🛠 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Database
- **Redis** - Caching layer
- **Pydantic** - Data validation
- **httpx** - Async HTTP client for DeepSeek API

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **react-draggable** - Draggable windows
- **axios** - HTTP client
- **CSS3** - Retro terminal styling with animations

## 📸 Screenshots

### Home Screen
![Home Screen](https://github.com/user-attachments/assets/9994d066-2b54-4100-ade1-68ed0cab958a)

### Theories Window
![Theories](https://github.com/user-attachments/assets/89c06963-45f3-4f75-9c7e-2e138fd8b95b)

### Citation Validation
![Citations](https://github.com/user-attachments/assets/9dd04494-a487-4d6d-a066-64ae62d7190c)

### Contradiction Heat Map
![Heat Map](https://github.com/user-attachments/assets/31215d28-a243-4ab6-afb6-e62c10d5a605)

## 🧪 Development

### Running Tests

```bash
# Backend (when tests are added)
cd backend
pytest

# Frontend (when tests are added)
cd frontend
npm test
```

### Project Structure

```
unbias.ai/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Core functionality (config, db, redis)
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic (DeepSeek, provenance)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   └── styles/       # CSS styles
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── render.yaml
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🆘 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for unbiased research**
