.PHONY: dev down logs migrate revision shell

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
