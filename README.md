# Issue Tracker

A modern, full-stack issue tracking application built with:

- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Database**: PostgreSQL with proper schema and indexing

## Features

- ✅ Create, read, update, and delete issues
- ✅ Search issues by title or description
- ✅ Filter issues by status (Open, In Progress, Closed)
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Real-time status updates
- ✅ Timestamps for creation and updates
- ✅ API with proper error handling

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (running and accessible)
- npm or yarn

## Setup Instructions

### 1. Create the Database

Run the SQL script to set up the database:

```bash
psql -U postgres -f /path/to/database.sql
```

This will create:
- `issue_tracker` database
- `issues` table with proper schema
- Indexes for performance

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your PostgreSQL connection string
# Default: DATABASE_URL=postgresql://postgres:@localhost:5432/issue_tracker

# Start the server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# Frontend runs on http://localhost:3000
```

## API Endpoints

All endpoints are prefixed with `/api`

### Issues

- `GET /issues` - Get all issues (supports filtering and search)
  - Query params: `status` (open|in-progress|closed), `search` (text)
  
- `GET /issues/:id` - Get a specific issue

- `POST /issues` - Create a new issue
  - Body: `{ title, description?, status? }`
  
- `PUT /issues/:id` - Update an issue
  - Body: `{ title?, description?, status? }`
  
- `DELETE /issues/:id` - Delete an issue

### Health Check

- `GET /health` - Server health check

## Issue Schema

```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── index.ts         # Express server
│   │   ├── db.ts           # Database connection
│   │   ├── handlers.ts      # Route handlers (CRUD operations)
│   │   ├── types.ts         # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── IssueList.tsx    # Main component
│   │   │   ├── IssueCard.tsx    # Issue display card
│   │   │   ├── IssueForm.tsx    # Create/Edit form
│   │   │   └── SearchFilter.tsx # Search & filter
│   │   ├── api.ts          # API client
│   │   ├── types.ts        # TypeScript types
│   │   ├── App.tsx         # Root component
│   │   ├── main.tsx        # Entry point
│   │   └── App.css         # Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── database.sql            # Database schema
```

## Development

### Backend
```bash
cd backend
npm run dev              # Start with ts-node
npm run build          # Build TypeScript
npm run watch          # Watch for changes
```

### Frontend
```bash
cd frontend
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

## Features Implemented

1. **CRUD Operations**: Full create, read, update, delete functionality
2. **Search**: Search issues by title or description
3. **Filtering**: Filter by status (Open, In Progress, Closed)
4. **Timestamps**: Automatic created_at and updated_at
5. **Modern UI**: Beautiful, responsive design with Tailwind CSS
6. **Error Handling**: Proper error messages and validation
7. **Loading States**: User feedback during operations
8. **Type Safety**: Full TypeScript implementation on both sides

## Notes

- The API includes CORS support for cross-origin requests
- All timestamps are stored in UTC with timezone info
- Database queries include proper indexes for performance
- Form validation happens on both frontend and backend
- Sensitive operations (delete) require confirmation

## Future Enhancements

- Authentication and authorization
- User assignment to issues
- Comments/discussions on issues
- View navigation
- Issue labels and categories
- Activity history/audit log
- Webhooks for integrations
- Bulk operations
- Export to CSV/PDF
