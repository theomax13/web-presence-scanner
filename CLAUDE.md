# Scopaly — Web Presence Scanner

## Projet

**Scopaly** est un outil SaaS d'OSINT qui scanne la présence en ligne (fuites de données, mentions web) pour les particuliers et entreprises. L'objectif est de démocratiser l'OSINT entre le simple "Google ton nom" et les outils pro coûteux (Maltego, SpiderFoot).

- **Fondateurs :** Théo (dev) et Léo (dev)
- **Contact :** admin.scopaly@gmail.com
- **Modèle :** Freemium, transparence-first
- **Démarrage :** Mars 2026

## Stack technique

| Couche | Techno |
|--------|--------|
| Backend | FastAPI (Python) |
| Frontend | Next.js 14 (App Router) |
| Base de données | Supabase (Postgres hébergé) |
| Auth | Supabase Auth (OAuth Google/GitHub + email/password) |
| File d'attente | ARQ (async Redis job queue) |
| Streaming résultats | SSE (Server-Sent Events) |
| Conteneurisation | Docker Compose (optionnel, dev local sans Docker possible) |

## Architecture

```
/
├── backend/
│   └── app/
│       ├── api/           # Routes FastAPI (health, scan)
│       │   ├── router.py  # Router principal
│       │   ├── scan.py    # Endpoints de scan
│       │   └── health.py  # Health check
│       ├── scanners/      # Plugins de scan (pattern BaseScanner)
│       │   ├── base.py    # ABC BaseScanner
│       │   ├── hibp.py    # Have I Been Pwned
│       │   ├── web_search.py  # Recherche web
│       │   └── registry.py    # Registre des scanners
│       ├── models/        # Modèles SQLAlchemy
│       ├── schemas/       # Schémas Pydantic
│       ├── services/      # Logique métier
│       ├── workers/       # Workers ARQ
│       ├── auth.py        # Vérification JWT Supabase
│       ├── config.py      # Configuration (env vars)
│       ├── database.py    # Connexion DB
│       └── main.py        # App FastAPI + lifespan (enregistrement scanners)
├── frontend/
│   └── app/
│       ├── login/         # Page de connexion
│       ├── scan/          # Page de scan
│       ├── layout.tsx     # Layout principal
│       └── page.tsx       # Page d'accueil
├── docker-compose.yml
└── Makefile
```

### Principes clés

- **Plugin pattern pour les scanners :** chaque source implémente `BaseScanner` (ABC), enregistré dans `main.py` lifespan. Ajouter une source = 1 fichier + l'enregistrer.
- **API versionnée** : tous les endpoints sous `/api/v1/`
- **Auth obligatoire** sur tous les endpoints de scan. JWT vérifié via `app/auth.py`. Scans liés au `user_id`.
- **JSONB** pour les résultats de scan (schéma flexible par source)
- **Frontend** utilise `@supabase/ssr` pour l'auth, passe un Bearer token au backend API
- **Supabase partagé** : Théo et Léo partagent la même instance Supabase hébergée

## Développement local

### Prérequis
- Python 3.11+ avec venv
- Node.js 18+
- Redis (pour ARQ)

### Commandes (Makefile)

```bash
# Installation des dépendances
make install

# Lancer le backend (sans Docker)
make dev-backend    # uvicorn sur port 8000

# Lancer le frontend (sans Docker)
make dev-frontend   # next dev

# Avec Docker (stack complète)
make dev            # docker compose up --build
make down           # docker compose down
make logs           # docker compose logs -f
make migrate        # alembic upgrade head
make revision msg="description"  # nouvelle migration
```

### Variables d'environnement

Le backend nécessite les variables Supabase (URL, clés) et Redis dans un `.env`. Ne pas commiter le `.env`.

## Conventions

- Le backend est en **Python async** (FastAPI natif)
- Les scanners suivent le pattern ABC `BaseScanner` — ne pas créer de scanner en dehors de ce pattern
- Les résultats de scan sont stockés en JSONB — pas de schéma rigide par source
- Favoriser la simplicité et l'accessibilité pour les utilisateurs non-techniques
- Pas de framework CSS dans le V0

## Ressources externes

- **Notion :** Le hub projet "Scanner de Présence Web" contient la roadmap (V1/V2/Exploration), le registre de risques, les décisions de stack et les checklists par phase
- **Supabase :** Instance partagée entre les deux devs (Postgres + Auth)
