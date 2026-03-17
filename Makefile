.PHONY: dev down logs migrate revision shell dev-backend dev-frontend install

# --- Local development (no Docker) ---
VENV := .venv/bin

install:
	cd backend && ../$(VENV)/pip install -e ".[dev]" 2>/dev/null || ../$(VENV)/pip install -e .
	cd frontend && npm install

dev-backend:
	cd backend && ../$(VENV)/uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm install && npm run dev

# --- Docker (full stack) ---
dev:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

migrate:
	docker compose exec backend alembic upgrade head

revision:
	docker compose exec backend alembic revision --autogenerate -m "$(msg)"

shell:
	docker compose exec backend python -c "import IPython; IPython.start_ipython()" 2>/dev/null || docker compose exec backend python
