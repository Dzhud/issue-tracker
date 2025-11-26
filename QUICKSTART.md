# Quick Start Guide

## Prerequisites
- Node.js 16+
- PostgreSQL (with daemon running)
- npm or yarn

## One-Step Setup

### Step 1: Create Database
```bash
psql -U postgres -f database.sql
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 3: Start Both Servers

Using the startup script (recommended):
```bash
bash start.sh
```

Or manually in separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run build
node dist/index.js
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## That's it! 🎉

Open your browser to `http://localhost:3000` and start tracking issues!

---

## Available Actions

### Creating Issues
1. Click "Create New Issue" button
2. Fill in the title (required) and description (optional)
3. Select a status (Open, In Progress, Closed)
4. Click "Save Issue"

### Viewing Issues
- All issues are displayed in the main list
- Issues are sorted by most recent first
- Click any issue card to see more details

### Editing Issues
1. Click the "Edit" button on an issue card
2. Modify the title, description, or status
3. Click "Save Issue" to update

### Deleting Issues
1. Click the "Delete" button on an issue card
2. Confirm the deletion when prompted
3. Issue is removed from the list

### Searching & Filtering
1. Use the **Search** field to find issues by title or description
2. Use the **Status Filter** to show only issues with a specific status
3. Clear either field to reset the view

---

## File Structure

```
IssueTracker/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── index.ts     # Server entry point
│   │   ├── db.ts        # Database connection
│   │   ├── handlers.ts  # Route handlers
│   │   └── types.ts     # TypeScript types
│   ├── dist/            # Compiled JavaScript
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── IssueList.tsx
│   │   │   ├── IssueCard.tsx
│   │   │   ├── IssueForm.tsx
│   │   │   └── SearchFilter.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── api.ts
│   └── package.json
├── database.sql         # Database schema
├── start.sh             # Startup script
├── README.md            # Full documentation
└── API.md               # API reference
```

---

## Troubleshooting

### PostgreSQL Connection Error
**Error:** `ECONNREFUSED` or similar database error

**Solution:**
1. Ensure PostgreSQL is running: `brew services start postgresql`
2. Check database exists: `psql -U postgres -l | grep issue_tracker`
3. Re-create if needed: `psql -U postgres -f database.sql`

### Port Already in Use
**Error:** `EADDRINUSE` on port 5000 or 3000

**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installing
**Error:** `npm ERR! code ERESOLVE` or similar

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing with legacy peer deps
npm install --legacy-peer-deps
```

### Frontend Not Showing Data
**Error:** 404 or CORS errors in browser console

**Solution:**
1. Ensure backend is running on port 5000
2. Check browser console for errors (F12)
3. Verify API response: `curl http://localhost:5000/api/issues`

---

## Technology Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- PostgreSQL
- pg (database driver)
- CORS support

**Frontend:**
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)

---

## Features Checklist

- ✅ Create issues
- ✅ View all issues
- ✅ Edit issues
- ✅ Delete issues
- ✅ Search by title/description
- ✅ Filter by status
- ✅ Timestamps (created_at, updated_at)
- ✅ Modern UI with Tailwind CSS
- ✅ Full TypeScript implementation
- ✅ Proper error handling

---

## Next Steps

After getting the app running:

1. **Explore the UI** - Create, edit, and delete some issues
2. **Test the API** - See `API.md` for curl examples
3. **Customize** - Modify styling in Tailwind config or add new features
4. **Deploy** - Follow deployment guides for your hosting platform

---

## Support

For issues or questions:
1. Check the README.md for detailed setup
2. Review API.md for API reference
3. Check browser console for frontend errors
4. Check backend logs for server errors

Happy tracking! 🚀
