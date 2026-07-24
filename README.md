# Urja Meter Ops API

A clean REST API built on top of the legacy **Urja Meter Ops** portal.

The original portal is designed for human users who log in through the browser and navigate between pages to view meter information. Although the portal already communicates with its backend, it does not expose a clean API that another application can easily consume.

This project acts as an adapter between the legacy portal and modern applications. It authenticates with the portal, communicates with its internal endpoints, and exposes a simplified REST API with consistent JSON responses.

---

# Features

- Automated login to the Urja Meter Ops portal
- Session management using cookies
- Search meters with pagination
- Retrieve meter details
- Retrieve meter location
- Retrieve meter energy history
- Retrieve transformer information
- Normalize inconsistent meter detail responses into a single response format
- Interactive Swagger documentation
- OpenAPI 3 specification

---

# Tech Stack

- Node.js
- Express.js
- Axios
- axios-cookiejar-support
- tough-cookie
- Swagger UI
- swagger-jsdoc

---

# Project Structure

```
src
├── clients
│   └── portal.client.js
├── config
│   └── swagger.js
├── controllers
├── routes
├── services
├── utils
│   └── parseMeterData.js
├── app.js
└── server.js

scripts
└── generateOpenApi.js

README.md
PROTOCOL.md
openapi.json
```

---

# Architecture

```
Client

        │

        ▼

Express API

        │

Controllers

        │

Services

        │

Portal Client

        │

Urja Meter Ops Portal
```

The Portal Client is the only part of the application that communicates with the legacy portal.

The rest of the application only interacts with clean service methods and never needs to know how the portal works internally.

---

# Getting Started

## Prerequisites

- Node.js 20+
- npm

---

## Installation

Clone the repository.

```bash
git clone <repository-url>

```

Install dependencies.

```bash
npm install
```

---

## Environment Variables

Create a `.env` file.

```
PORT=3000

URJA_BASE_URL=https://urja-ops.flockenergy.tech

URJA_USERNAME=your-email

URJA_PASSWORD=your-password
```

---

## Run

Development

```bash
npm run dev
```

Generate OpenAPI

```bash
npm run generate:openapi
```

---

# API Documentation

Swagger UI

```
http://localhost:3000/docs
```

OpenAPI Specification

```
openapi.json
```

---

# API Endpoints

## Meters

```
GET /api/meters
```

Returns a paginated list of meters.

Query Parameters

| Parameter | Description |
|-----------|-------------|
| page | Page number |
| search | Search by meter ID |

---

```
GET /api/meters/:meterId
```

Returns meter details.

---

```
GET /api/meters/:meterId/location
```

Returns latitude and longitude.

---

```
GET /api/meters/:meterId/energy
```

Returns historical energy readings.

---

## Transformers

```
GET /api/transformers
```

Returns paginated transformer information.

---

# Example Request

```
GET /api/meters?page=1
```

Example Response

```json
{
  "data": [
    {
      "meterId": "J100000",
      "serialNo": "SE33962",
      "make": "HPL",
      "phaseType": "single",
      "installStatus": "Decommissioned",
      "dtCode": "DT-001"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 403
}
```

---

# Design Decisions

## Why a Portal Client?

The portal client isolates all communication with the legacy portal.

If the portal changes in the future, only this layer needs to be updated.

---

## Why a Service Layer?

The service layer separates business logic from HTTP handling.

Controllers remain small and only deal with requests and responses.

---

## Why a Parser?

The meter detail endpoint returned two different serialization formats.

Instead of exposing those differences to API consumers, I normalized both formats into the same response object.

This keeps the API consistent regardless of how the legacy portal represents its data.

---

# Assumptions

During development I assumed:

- The portal should be treated as read-only.
- Login credentials remain valid for the current session.
- Existing portal endpoints continue to behave consistently.
- Consumers of this API should not need to understand the portal's internal response formats.

---

# Trade-offs

To keep the scope reasonable, I focused on building a clean and maintainable API instead of implementing every possible optimization.

Examples include:

- No caching layer
- No retry mechanism
- No rate limiting
- No persistent session storage

These would be useful in a production environment but were outside the scope of this assignment.

---

# What I Intentionally Left Out

Because of the time available, I intentionally did not implement:

- Caching
- Retry logic
- Request throttling
- Authentication for my own API
- Automated tests
- Bulk synchronization
- Optional extensions such as hierarchy reconstruction or a frontend dashboard

I preferred spending more time understanding the legacy portal and documenting the investigation rather than adding additional features.

---

# Future Improvements

With additional time I would like to add:

- Response caching
- Better error handling and retry logic
- Automated unit and integration tests
- Authentication for the API itself
- Background synchronization jobs
- Bulk import endpoints
- A modern frontend dashboard for exploring meters and transformers

---

# Related Documents

This repository also includes:

- **PROTOCOL.md** — Reverse engineering notes describing how the legacy portal works and how the API was built.
- **openapi.json** — OpenAPI 3 specification.
- **Swagger UI** — Available at `/docs`.

---

# Reflection

## What assumptions did I make?

My goal throughout the investigation was to avoid making assumptions and instead rely on observing the portal's actual network requests. One assumption I did make was believing that every meter detail endpoint returned the same serialization format. Later I discovered that different meters returned different formats, which required redesigning my parser to normalize both responses into a consistent object.

---

## Which part was the most difficult?

Authentication and the meter detail parser.

The login request initially failed with `415 Unsupported Media Type` and later with `403 Forbidden`. Comparing my backend requests with the browser requests helped me understand which headers and request format were required.

The second challenge was discovering that the meter detail endpoint returned two different serialization formats. My initial parser only supported one format, so I updated it to detect the response structure dynamically.

---

## If I had another day

I would add automated tests, caching, retry logic, better error handling, and support for additional optional features such as reconstructing the network hierarchy and building a small frontend dashboard.

---

## What mistake did I make?

The biggest mistake I made was assuming that the meter detail endpoint always returned the same structure. I only discovered the second serialization format while refactoring and testing additional meters.

Although it required additional work, it also improved the overall design because the parser now supports both response formats.

---

## If I were reviewing my own submission

The first thing I would improve is automated testing.

The application works as intended, but unit tests for the parser and integration tests for the API would increase confidence when making future changes.

I would also improve resilience around session expiry and transient portal failures.

---

## Final Thoughts

Before starting this assignment I had never reverse engineered a web application like this.

At the beginning I was honestly confused about what the assignment was asking me to build. Once I started investigating the portal through Chrome DevTools, everything gradually became clearer.

The most enjoyable part of the project was understanding how the portal worked behind the scenes and turning those discoveries into a clean API that hides the complexity of the legacy system.