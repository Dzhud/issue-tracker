# Issue Tracker API Documentation

## Base URL
```
http://localhost:5000/api
```

## Health Check

### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

---

## Issues Endpoints

### GET /issues
Get all issues with optional filtering and search.

**Query Parameters:**
- `status` (optional): Filter by status - `open`, `in-progress`, `closed`
- `search` (optional): Search by title or description

**Examples:**
```bash
# Get all issues
curl http://localhost:5000/api/issues

# Filter by status
curl http://localhost:5000/api/issues?status=open

# Search issues
curl http://localhost:5000/api/issues?search=login

# Combine filters
curl http://localhost:5000/api/issues?status=open&search=bug
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "First Issue",
    "description": "Test issue",
    "status": "open",
    "created_at": "2025-11-26T10:05:01.047Z",
    "updated_at": "2025-11-26T10:05:01.047Z"
  }
]
```

---

### GET /issues/:id
Get a specific issue by ID.

**Parameters:**
- `id` (required): Issue ID

**Example:**
```bash
curl http://localhost:5000/api/issues/1
```

**Response:**
```json
{
  "id": 1,
  "title": "First Issue",
  "description": "Test issue",
  "status": "open",
  "created_at": "2025-11-26T10:05:01.047Z",
  "updated_at": "2025-11-26T10:05:01.047Z"
}
```

**Error Response (404):**
```json
{
  "error": "Issue not found"
}
```

---

### POST /issues
Create a new issue.

**Request Body:**
```json
{
  "title": "New Issue Title",
  "description": "Optional description",
  "status": "open"
}
```

**Required Fields:**
- `title` (string): Issue title
- `description` (optional): Issue description
- `status` (optional): Default is "open" - can be "open", "in-progress", or "closed"

**Example:**
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Bug",
    "description": "Something is broken",
    "status": "open"
  }'
```

**Response (201):**
```json
{
  "id": 4,
  "title": "New Bug",
  "description": "Something is broken",
  "status": "open",
  "created_at": "2025-11-26T10:10:00.000Z",
  "updated_at": "2025-11-26T10:10:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Title is required"
}
```

---

### PUT /issues/:id
Update an existing issue.

**Parameters:**
- `id` (required): Issue ID

**Request Body (all optional):**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in-progress"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/issues/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "closed",
    "description": "Fixed the issue"
  }'
```

**Response:**
```json
{
  "id": 1,
  "title": "First Issue",
  "description": "Fixed the issue",
  "status": "closed",
  "created_at": "2025-11-26T10:05:01.047Z",
  "updated_at": "2025-11-26T10:10:30.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Issue not found"
}
```

**Error Response (400):**
```json
{
  "error": "No fields to update"
}
```

---

### DELETE /issues/:id
Delete an issue.

**Parameters:**
- `id` (required): Issue ID

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/issues/1
```

**Response:**
```json
{
  "message": "Issue deleted successfully",
  "issue": {
    "id": 1,
    "title": "First Issue",
    "description": "Test issue",
    "status": "closed",
    "created_at": "2025-11-26T10:05:01.047Z",
    "updated_at": "2025-11-26T10:10:30.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Issue not found"
}
```

---

## Status Values

Issues can have one of three statuses:
- `open` - New issue, not started
- `in-progress` - Currently being worked on
- `closed` - Resolved and closed

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes
- `200` - OK, successful request
- `201` - Created, successful resource creation
- `400` - Bad Request, invalid input
- `404` - Not Found, resource doesn't exist
- `500` - Internal Server Error

---

## Testing with cURL

### Create Sample Issues
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Issue","status":"open"}'

curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -d '{"title":"Bug in login","description":"Users cannot login","status":"in-progress"}'

curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -d '{"title":"Performance issue","description":"Slow database queries","status":"open"}'
```

### List All Issues
```bash
curl http://localhost:5000/api/issues
```

### Filter by Status
```bash
curl http://localhost:5000/api/issues?status=open
curl http://localhost:5000/api/issues?status=in-progress
curl http://localhost:5000/api/issues?status=closed
```

### Search Issues
```bash
curl http://localhost:5000/api/issues?search=login
```

### Update an Issue
```bash
curl -X PUT http://localhost:5000/api/issues/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"closed"}'
```

### Delete an Issue
```bash
curl -X DELETE http://localhost:5000/api/issues/1
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. This can be added in the future using middleware like `express-rate-limit`.

---

## CORS

The API supports CORS for requests from different origins. Configure allowed origins in `backend/src/index.ts` if needed.
