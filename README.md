# Vacation Management Interface

# Tech Stack

- **Frontend**: React + Vite + TypeScript + Axios + React Router + Tailwind
- **Backend**: Node.js + Express + TypeScript + TypeORM
- **Database**: PostgreSQL
- **Tests**: Vitest (backend unit tests)

# 1) Requester Interface

- Submit vacation request with:
  - Start Date (required)
  - End Date (required)
  - Reason (optional)
- View requester-specific requests and status:
  - Pending
  - Approved
  - Rejected

# 2) Validator Interface

- Dashboard of all requests
- Filter by status (All / Pending / Approved / Rejected)
- Approve request
- Reject request
- Reject comment is required (validated in backend)

# 3) Backend REST API

- `GET /api/v1/users` - List users (Requester / Validator)
- `POST /api/v1/requests` - Submit vacation request
- `GET /api/v1/requests?userId=<id>` - Requester view
- `GET /api/v1/requests?status=<status>` - Validator filtered view
- `PATCH /api/v1/requests/:requestId/status` - Approve/Reject request

Implemented with:

- Input validation
- Proper HTTP status codes
- Structured JSON error messages

# Database Schema

# `users`

- `id`
- `name`
- `role` (`Requester` / `Validator`)

# `vacation_requests`

- `id`
- `user_id`
- `start_date`
- `end_date`
- `reason`
- `status` (`Pending` / `Approved` / `Rejected`)
- `comments`
- `created_at`

# Project Structure

```txt
backend/    Node.js + Express + TypeORM API
frontend/   React + Vite + Router UI
```

# Local Setup

# 1) Start PostgreSQL

Recommended:

```bash
docker compose up -d
```

This starts:

- `postgres` on `localhost:5432`
- DB: `travel_factory`
- User: `postgres`
- Password: `postgres`

If using local PostgreSQL manually, create:

```sql
CREATE DATABASE travel_factory;
```

# Seed DB

```bash
- cd backend
- npm run seed
```

# 2) Backend setup (`backend/.env`)

Create `backend/.env` with:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=travel_factory
```

Run backend:

```bash
cd backend
npm install
npm run dev
```

Backend URL: `http://localhost:4000`

# 3) Frontend setup (`frontend/.env`)

Create `frontend/.env` with:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_API_URL=/api/v1
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

# Tests

Basic backend unit tests are included (controllers):

- `backend/tests/user.controller.test.ts`
- `backend/tests/vacationRequest.controller.test.ts`

Run tests:

```bash
cd backend
npm test
```

# Build Commands

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

# Technical Decisions

- TypeORM entities and repositories are used directly in controllers for this scope.
- Validation rules are enforced in backend controllers:
  - valid user/request IDs
  - valid dates
  - allowed status values
  - reject comment requirement
- Frontend pages are split by role (Requester / Validator) with reusable UI components.
- Validator logic is extracted to a custom hook (`useValidatorState`) to separate business logic from UI.
- Used Tailwind Css for building faster UI

# Known Limitations

- No authentication/authorization (user is selected from UI).
- `synchronize: true` is enabled in TypeORM for development convenience (not recommended for production).
- Tests currently cover controller-level unit scenarios; integration/e2e tests are not included yet.
- The assignment asked for Vue; this repository uses React.
