# Getting Started — Rare Publishing Platform

Welcome to the Rare project. This guide walks you through setting up the full development environment from scratch, including the PostgreSQL database, Django API, and React client.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Database Setup](#database-setup)
4. [API Setup](#api-setup)
5. [Seeding the Database](#seeding-the-database)
6. [Client Setup](#client-setup)
7. [Starting Both Servers](#starting-both-servers)
8. [Login Credentials](#login-credentials)

---

## Prerequisites

Make sure the following tools are installed before you begin.

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | `node -v` to check |
| npm | 8+ | Comes with Node |
| Python | 3.10+ | `python --version` to check |
| Pipenv | latest | `pip install pipenv` |
| Docker Desktop | latest | Required for PostgreSQL |
| Git | any | `git --version` to check |

---

## Repository Setup

The project lives in a monorepo with two sub-directories. Clone both from the same parent directory, then open the workspace root in your editor.

```bash
# From your workspace root
git clone <rare-project-repo-url>
cd rare-project
```

Expected structure after cloning:

```
rare-project/
├── rare-api/       # Django backend
└── rare-client/    # React frontend
```

---

## Database Setup

The API uses PostgreSQL 16. A `docker-compose.yml` in `rare-api/` spins up the database container with the correct credentials pre-configured.

```bash
cd rare-api
docker compose up -d
```

Verify the container is running:

```bash
docker ps
# You should see a container named "rare-api-db-1" or similar
```

**Connection details (local development only):**

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `rare` |
| Username | `rare_user` |
| Password | `rare_password` |

> These credentials match `rare-api/rareproject/settings.py` and do not need to be changed for local development.

---

## API Setup

Navigate to the `rare-api/` directory and install Python dependencies using Pipenv.

```bash
cd rare-api
pipenv install
pipenv shell
```

Apply all database migrations to create the schema:

```bash
python manage.py migrate
```

You should see output confirming each migration applied successfully.

---

## Seeding the Database

A fixture file at `rareapi/fixtures/initial_data.json` loads sample users, posts, categories, tags, comments, and reactions.

```bash
python manage.py loaddata initial_data
```

Expected output:

```
Installed X object(s) from 1 fixture(s)
```

---

## Client Setup

In a separate terminal, navigate to `rare-client/` and install JavaScript dependencies.

```bash
cd rare-client
npm install
```

The client is pre-configured to communicate with the API at `http://localhost:8000` via `src/managers/api.js`. No environment changes are needed for local development.

---

## Starting Both Servers

You will need two terminal windows open simultaneously.

**Terminal 1 — API server:**

```bash
cd rare-api
pipenv shell
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

**Terminal 2 — React client:**

```bash
cd rare-client
npm start
```

The client will open automatically at `http://localhost:3000`.

Both must be running for the application to work correctly.

---

## Login Credentials

### Registering a New Account

The fastest way to start is to create a fresh account through the UI at `http://localhost:3000`. Click **Register**, fill in the form, and you will be logged in immediately.

### Using Seeded Accounts

The seed fixture creates the following accounts. Because passwords are stored hashed in the fixture, use the Django management command to set a known password before logging in.

**Set a password for a seeded user:**

```bash
# From rare-api/ with pipenv shell active
python manage.py changepassword admin_sarah
```

**Seeded users:**

| Username | Role | Email |
|----------|------|-------|
| `admin_sarah` | Admin | sarah.chen@rare.com |
| `admin_marcus` | Admin | marcus.j@rare.com |
| `dev_diana` | Author | diana.r@devblog.io |
| `wanderlust_joe` | Author | — |
| `chef_maya` | Author | — |

Admin accounts (`is_staff = True`) can approve posts, manage users, and access the demotion queue. Author accounts can create posts (which enter the moderation queue pending admin approval).

### Token Authentication

The API uses token-based authentication. When you log in via the UI, the token is stored in `localStorage` under the key `rare_token` and sent automatically with every request. You can inspect it in the browser's DevTools under **Application > Local Storage**.
