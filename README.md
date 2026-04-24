# BFHL challenge

This repository contains a separate backend and frontend for the SRM BFHL assignment.

## What is included

- `backend`: Node.js REST API with `POST /bfhl`
- `frontend`: single-page React app that submits node lists and renders the response

## Submission checklist

- [x] Separate backend and frontend folders
- [x] `POST /bfhl` accepts JSON input with `data`
- [x] Valid node strings are parsed, grouped, and returned as hierarchies
- [x] Invalid entries are collected separately
- [x] Duplicate edges are collected separately
- [x] Cycle groups return `tree: {}` with `has_cycle: true`
- [x] Tree groups include `depth`
- [x] Summary includes `total_trees`, `total_cycles`, and `largest_tree_root`
- [x] CORS is enabled on the API
- [x] Frontend submits to `/bfhl` and renders the response
- [x] Backend tests pass
- [x] Frontend production build passes
- [ ] Fill in your real `BFHL_USER_ID`, `BFHL_EMAIL_ID`, and `BFHL_ROLL_NUMBER` before submission

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

## Deployment notes

- Deploy the backend and frontend separately.
- Expose the backend at a public URL such as `https://your-api.example.com`.
- The frontend should call `https://your-api.example.com/bfhl`.
- Keep the identity values in environment variables instead of hardcoding them.
