# CLAUDE.md
## Présentation du projet
Regarde le @README.md afin de savoir de quoi le projet retourne

### Commandes (Docker — recommandé)
```bash
make dev          # Build et démarre tous les services (backend, frontend, redis, worker)
make down         # Arrête tous les services
make logs         # Affiche les logs de tous les services
make migrate      # Applique les migrations Alembic en attente
make revision msg="description"  # Génère une nouvelle migration
make shell        # Ouvre un REPL Python dans le conteneur backend
```

### Commandes Local (sans Docker)
```bash
make install      # Installe les dépendances backend + frontend
make dev-backend  # Uvicorn sur le port 8000 avec hot-reload (nécessite .venv)
make dev-frontend # Serveur de développement Next.js sur le port 3000
```

### Stack technique
- Next.js 16 (App Router) + TypeScript strict
- FastAPI + python 3.12 + SQLAlchemy + Alembic + Redis + httpx + ARQ
- Supabase (auth, database, storage)
- TailwindCSS 4
- VPS hostinger (déploiement)
- npm

### Organisation du backend (`backend/app/`)
| Répertoire | Rôle |
|------------|------|
| `scans/` | Router, modèles SQLAlchemy (`Scan`, `ScanResult`), schémas Pydantic, service d'orchestration des scans |
| `scanners/` | Système de plugins : classe abstraite `BaseScanner`, `registry.py`, implémentations des scanners |
| `auth/` | Dépendance JWT (`get_current_user`), schéma `CurrentUser` |
| `shared/` | Client httpx singleton, détecteur de type d'entrée (email/domain/username/name), gestionnaires d'exceptions |
| `workers/` | Worker ARQ (`WorkerSettings`) pour l'exécution asynchrone des scans |
| `services/` | Wrapper du cache Redis |

### Structure des pages frontend (`frontend/app/`)
| Route | Fichier | Rôle |
|-------|---------|------|
| `/` | `page.tsx` | Formulaire de saisie du scan, lance le scan, redirige vers les résultats |
| `/scan/[id]` | `scan/[id]/page.tsx` | S'abonne au flux SSE, affiche les résultats en temps réel |
| `/login` | `login/page.tsx` | Interface d'authentification Supabase |

`lib/api.ts` contient tous les wrappers d'appels API (`createScan`, `getScan`).
`lib/supabase.ts` initialise les clients Supabase navigateur/serveur.

### Variables d'environnement
Regarde le fichier @.env.example a la racine du projet

### Versionnement de l'API
Toutes les routes backend sont préfixées `/api/v1`. Le CORS est configuré pour `http://localhost:3000`.

## Conventions
- Server Components par défaut pour le frontend
- 'use client' uniquement si nécessaire pour le frontend
- Zod pour toute validation pour le frontend
- Pas de any en TypeScript
- Nommage : PascalCase composants, camelCase utils

## Règles
- RLS activé sur TOUTES les tables Supabase
- Jamais de clé API côté client
- Toujours vérifier l'auth avant les mutations