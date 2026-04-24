# BFHL challenge

This repository contains a separate backend and frontend for the SRM BFHL assignment.

## What is included

- `backend`: Node.js REST API with `POST /bfhl`
- `frontend`: single-page React app that submits node lists and renders the response

## Backend

The API runs on port `4000` by default.

Set these environment variables for deployment:

- `BFHL_USER_ID`
- `BFHL_EMAIL_ID`
- `BFHL_ROLL_NUMBER`

The API is CORS-enabled for cross-origin evaluator calls.

### Run locally

```bash
cd backend
npm install
npm test
npm run dev
```

## Frontend

The frontend reads the API base URL from `BFHL_API_BASE_URL`.

### Run locally

```bash
cd frontend
npm install
npm run dev
```

### Build for deployment

```bash
cd frontend
npm run build
```

Set `BFHL_API_BASE_URL` to your hosted backend before building the frontend.
