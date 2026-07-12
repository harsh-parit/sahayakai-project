# SahayakAI — Backend

Secure Node.js / Express backend that proxies prediction requests from the
React frontend to IBM AutoAI, keeping all IBM credentials server-side.

---

## Architecture

```
React Frontend  ──POST /api/predict──▶  Express Backend  ──▶  IBM AutoAI
                                              │
                                              ├── authService.js  (IAM token cache)
                                              ├── mlService.js    (AutoAI scoring)
                                              └── predictionController.js
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your IBM Cloud credentials
```

### 3. Start development server

```bash
npm run dev
```

The server starts on `http://localhost:5000` by default.

---

## Environment Variables

| Variable                  | Description                                              |
|---------------------------|----------------------------------------------------------|
| `PORT`                    | HTTP server port (default: 5000)                        |
| `NODE_ENV`                | `development` or `production`                           |
| `IBM_API_KEY`             | IBM Cloud IAM API key                                   |
| `IBM_REGION`              | IBM Cloud region (e.g. `us-south`)                      |
| `IBM_DEPLOYMENT_ENDPOINT` | Full Watson ML scoring URL for your AutoAI deployment   |
| `IBM_PROJECT_ID`          | IBM Cloud project ID                                    |
| `CORS_ORIGINS`            | Comma-separated list of allowed frontend origins        |

---

## API Endpoints

### `GET /api/health`
Returns server health status.

**Response**
```json
{
  "success": true,
  "status": "ok",
  "uptime": 42.3,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

### `POST /api/predict`
Submits applicant data to IBM AutoAI and returns an eligibility prediction.

**Request Body**
```json
{
  "applicant_name": "Ramesh Kumar",
  "age": 35,
  "gender": "male",
  "marital_status": "married",
  "category": "obc",
  "occupation": "farmer",
  "state": "uttar_pradesh",
  "district": "Varanasi",
  "annual_income": 120000,
  "bpl_status": true,
  "disability_status": false,
  "widow_status": false,
  "aadhaar_available": true,
  "bank_account_available": true
}
```

**Success Response**
```json
{
  "success": true,
  "prediction": {
    "eligible": true,
    "confidence": 0.92,
    "eligible_schemes": ["PM Kisan", "PMAY-G"]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Prediction service unavailable",
  "error": "IBM_ENDPOINT_UNREACHABLE"
}
```

---

## IBM IAM Token Flow

`authService.js` requests a bearer token from `https://iam.cloud.ibm.com/identity/token`
using the `IBM_API_KEY` and caches it in memory. Tokens are refreshed automatically
300 seconds before their expiry time — no redundant IAM calls on every prediction request.

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.js                 Environment variable loader & validator
│   ├── controllers/
│   │   └── predictionController.js Request validation + service orchestration
│   ├── middleware/
│   │   ├── errorHandler.js        Global Express error handler
│   │   ├── notFound.js            404 catch-all
│   │   └── requestLogger.js       Per-request structured log helper
│   ├── routes/
│   │   ├── healthRoutes.js        GET /api/health
│   │   └── predictionRoutes.js    POST /api/predict
│   ├── services/
│   │   ├── authService.js         IBM IAM token manager
│   │   └── mlService.js           IBM AutoAI scoring client
│   ├── utils/
│   │   └── response.js            Standardised JSON response helpers
│   ├── app.js                     Express application factory
│   └── server.js                  HTTP server entry point
├── .env                           Local secrets (git-ignored)
├── .env.example                   Template for collaborators
├── .gitignore
├── package.json
└── README.md
```
