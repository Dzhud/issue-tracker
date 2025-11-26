# Troubleshooting & FAQ

## Installation Issues

### Q: "npm install fails with ERESOLVE error"
**A:** Use legacy peer dependencies flag:
```bash
npm install --legacy-peer-deps
```

Or clear npm cache:
```bash
npm cache clean --force
npm install
```

---

### Q: "Node.js version incompatible"
**A:** Check your Node version:
```bash
node --version
```

Requires Node.js 16+. Install from: https://nodejs.org

---

### Q: "psql command not found"
**A:** PostgreSQL not installed. Install via Homebrew:
```bash
brew install postgresql
brew services start postgresql
```

---

## Database Issues

### Q: "ECONNREFUSED 127.0.0.1:5432"
**A:** PostgreSQL daemon not running:
```bash
# Start PostgreSQL
brew services start postgresql

# Or manually
pg_ctl -D /usr/local/var/postgres start
```

---

### Q: "database \"issue_tracker\" does not exist"
**A:** Create the database:
```bash
psql -U postgres -f database.sql
```

---

### Q: "password authentication failed"
**A:** Check .env file DATABASE_URL:
```
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/issue_tracker
```

If using default Homebrew PostgreSQL (no password):
```
DATABASE_URL=postgresql://postgres:@localhost:5432/issue_tracker
```

---

### Q: "Port 5432 already in use"
**A:** Kill the existing process:
```bash
lsof -ti:5432 | xargs kill -9
brew services restart postgresql
```

Or find what's using it:
```bash
lsof -i :5432
```

---

## Backend Issues

### Q: "Cannot find module 'express'"
**A:** Install dependencies:
```bash
cd backend
npm install
```

---

### Q: "TypeScript compilation error"
**A:** Ensure tsconfig.json is correct and rebuild:
```bash
cd backend
npm run build
```

---

### Q: "Server not starting on port 5000"
**A:** 

1. Check if port is in use:
```bash
lsof -i :5000
```

2. Kill the process:
```bash
lsof -ti:5000 | xargs kill -9
```

3. Restart:
```bash
npm run build
node dist/index.js
```

---

### Q: "API returns 500 error"
**A:** Check server logs for error details:
```bash
# Look at terminal output where server is running
# Check for error messages
```

Common causes:
- Database not connected
- Invalid SQL
- Missing environment variables

---

### Q: "CORS errors in frontend"
**A:** Enable CORS in backend `src/index.ts`:
```typescript
app.use(cors());
```

Or restrict CORS:
```typescript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

---

## Frontend Issues

### Q: "npm run dev fails in frontend"
**A:** Check you're in frontend directory:
```bash
pwd  # Should be /path/to/frontend
npm install
npm run dev
```

---

### Q: "Port 3000 already in use"
**A:** Kill the process:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

Or use different port:
```bash
npm run dev -- --port 3001
```

---

### Q: "blank page when opening localhost:3000"
**A:** Check browser console (F12) for errors:
- Verify backend is running on 5000
- Check network tab for failed requests
- Look for CORS errors

---

### Q: "Components not rendering"
**A:** Check React errors:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API failures
4. Verify API is returning data

---

### Q: "Styling not applied (Tailwind not working)"
**A:** Rebuild frontend:
```bash
cd frontend
npm run build
npm run dev
```

Verify tailwind.config.js content paths:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

---

### Q: "Search/filter not working"
**A:** Check:
1. Backend is running: `curl http://localhost:5000/api/issues?search=test`
2. Frontend console for errors (F12)
3. Network tab to see API request/response

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | Service not running | Start service with npm run dev or npm start |
| `EADDRINUSE` | Port already in use | Kill process on that port |
| `Cannot find module` | Dependency not installed | Run npm install |
| `TypeScript error` | Type mismatch | Check error message, review types.ts |
| `404 Not Found` | Wrong API endpoint | Check API.md for correct endpoints |
| `CORS error` | Frontend/backend domain mismatch | Enable CORS in backend |
| `Blank page` | Frontend not loading | Check browser console F12 |
| `No data showing` | API not returning data | Test API with curl |

---

## Testing Checklist

### Backend Testing
- [ ] Server starts without errors
- [ ] Health check returns OK
- [ ] Can create issue via API
- [ ] Can read issues via API
- [ ] Can update issue via API
- [ ] Can delete issue via API
- [ ] Search returns correct results
- [ ] Filter by status works
- [ ] Database connection successful

### Frontend Testing
- [ ] Frontend loads at localhost:3000
- [ ] Issues list displays
- [ ] Can create new issue
- [ ] Can edit issue
- [ ] Can delete issue (with confirmation)
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Combined filters work
- [ ] Timestamps display correctly
- [ ] Status badges show correct colors

### Full Integration Testing
- [ ] Create issue in frontend
- [ ] Issue appears in list
- [ ] Issue saved in database
- [ ] Can retrieve with API
- [ ] Can edit and see updates immediately
- [ ] Can delete and list updates
- [ ] Refresh page and data persists

---

## Performance Tips

### Backend
```typescript
// Add connection pooling (already configured)
// Use indexes (already created)
// Avoid N+1 queries (single query per request)
// Add response caching for frequently accessed data
```

### Frontend
```typescript
// Use React.memo for expensive components
import React from 'react';

export const IssueCard = React.memo(({ issue, onEdit, onDelete }) => {
  // Component code
});

// Implement infinite scroll for large lists
// Use code splitting for lazy loading
```

### Database
```sql
-- Verify indexes are used
EXPLAIN ANALYZE SELECT * FROM issues WHERE status = 'open';

-- Check table statistics
VACUUM ANALYZE issues;
```

---

## Debugging Tips

### Debug Backend
```bash
# Run with more verbose output
DEBUG=* npm run dev

# Or add console.logs
console.log('Debug info:', variable);

# Check PostgreSQL logs
tail -f /usr/local/var/log/postgres.log
```

### Debug Frontend
```typescript
// Add debugging
console.log('Issues:', issues);
console.log('Loading:', loading);
console.log('Error:', error);

// Use React DevTools
// Available as Chrome extension
```

### Debug Network
```bash
# Test API endpoints
curl -v http://localhost:5000/api/issues

# Check response headers
curl -i http://localhost:5000/api/issues

# Monitor network in browser
# Open DevTools F12 -> Network tab
```

---

## Getting Help

### Step 1: Check Logs
- Backend console output
- Browser console (F12)
- Network tab in DevTools

### Step 2: Test Components
- Test API with curl
- Test database connection
- Test individual components

### Step 3: Check Documentation
- README.md - Full setup
- API.md - API reference
- QUICKSTART.md - Quick reference
- DEPLOYMENT.md - Deployment

### Step 4: Verify Environment
- Correct directory?
- All dependencies installed?
- Node version correct?
- PostgreSQL running?
- Ports not in use?

---

## FAQ

**Q: Can I change the port numbers?**  
A: Yes. Update in:
- Backend: `.env` file
- Frontend: `vite.config.ts` server.port

**Q: How do I backup my data?**  
A: Backup PostgreSQL:
```bash
pg_dump issue_tracker > backup.sql
```

**Q: Can I add more fields to issues?**  
A: Yes, modify schema and add to types.ts

**Q: How do I reset the database?**  
A: Drop and recreate:
```bash
dropdb issue_tracker
psql -U postgres -f database.sql
```

**Q: Can I run on different servers?**  
A: Yes, update DATABASE_URL and VITE_API_URL

**Q: How do I make it production ready?**  
A: See DEPLOYMENT.md for full guide

**Q: Can I add authentication?**  
A: Yes, see Future Enhancements in README.md

**Q: How do I scale this?**  
A: Add load balancers, caching, read replicas

**Q: What's the max number of issues supported?**  
A: PostgreSQL can handle millions easily

**Q: Can I export data?**  
A: Yes, via PostgreSQL export or add API endpoint

---

## Still Having Issues?

1. **Check error messages carefully** - they often tell you exactly what's wrong
2. **Search the terminal output** - scroll up for complete error traces
3. **Check file permissions** - especially for .env and database files
4. **Verify all prerequisites** - Node, npm, PostgreSQL versions
5. **Try starting fresh** - delete node_modules, clear npm cache, reinstall
6. **Check documentation** - README.md and other .md files have detailed info

---

## Quick Restart Guide

If something goes wrong, try this:

```bash
# 1. Stop everything (Ctrl+C in terminals)

# 2. Kill any hanging processes
lsof -ti:5000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# 3. Restart PostgreSQL
brew services restart postgresql

# 4. Rebuild backend
cd backend
npm run build

# 5. Start fresh (in separate terminals)
# Terminal 1:
cd backend && node dist/index.js

# Terminal 2:
cd frontend && npm run dev

# 6. Open http://localhost:3000
```

---

**Document Version:** 1.0  
**Last Updated:** November 26, 2025  
**Compatible With:** Node 16+, PostgreSQL 12+
