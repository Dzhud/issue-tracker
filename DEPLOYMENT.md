# Deployment Guide

## Overview

This guide covers deploying the Issue Tracker to various hosting platforms.

---

## Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Frontend built and tested
- [ ] Backend compiled and tested
- [ ] CORS properly configured
- [ ] Database backups ready
- [ ] Error logging configured

---

## Deploying to Heroku

### Backend Deployment

1. **Create Heroku App**
```bash
cd backend
heroku login
heroku create issue-tracker-api
```

2. **Configure Database**
```bash
# Option A: Use Heroku PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev --app issue-tracker-api

# Option B: Use external PostgreSQL
heroku config:set DATABASE_URL=postgresql://user:pass@host:port/dbname
```

3. **Deploy Code**
```bash
git push heroku main
```

4. **Run Migrations**
```bash
heroku run psql -f database.sql --app issue-tracker-api
```

5. **View Logs**
```bash
heroku logs --tail --app issue-tracker-api
```

### Frontend Deployment

**Option 1: Deploy with Vercel (Recommended)**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel --prod
```

3. **Configure Environment**
```
VITE_API_URL=https://issue-tracker-api.herokuapp.com
```

**Option 2: Deploy to Netlify**

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Deploy**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## Deploying to AWS

### Backend (EC2 + RDS)

1. **Create RDS PostgreSQL Instance**
   - Database: PostgreSQL 13+
   - Instance: db.t3.micro (free tier)
   - Storage: 20GB
   - Security group: Allow port 5432 from EC2

2. **Create EC2 Instance**
   - AMI: Ubuntu 20.04 LTS
   - Instance: t3.micro (free tier)
   - Security group: Allow ports 22, 80, 443, 5000

3. **Setup on EC2**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <repo-url>
cd IssueTracker/backend

# Install dependencies
npm install

# Configure environment
echo "DATABASE_URL=postgresql://user:pass@rds-host:5432/issue_tracker" > .env
echo "NODE_ENV=production" >> .env

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start dist/index.js --name issue-tracker
pm2 startup
pm2 save
```

### Frontend (S3 + CloudFront)

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync dist/ s3://issue-tracker-frontend --delete
```

3. **Configure CloudFront**
   - Origin: S3 bucket
   - Default root object: index.html
   - Error pages: 404 → index.html (for SPA routing)

---

## Deploying to DigitalOcean

### Backend Deployment

1. **Create Droplet**
   - Image: Ubuntu 22.04
   - Size: Basic (5$/month)
   - Region: Closest to users

2. **Initial Setup**
```bash
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Create database
sudo -u postgres psql < database.sql
```

3. **Deploy Application**
```bash
# Clone and setup
git clone <repo-url>
cd IssueTracker/backend
npm install
npm run build

# Configure
echo "DATABASE_URL=postgresql://localhost:5432/issue_tracker" > .env
echo "NODE_ENV=production" >> .env

# Install nginx
apt install -y nginx

# Configure nginx (reverse proxy)
# Edit /etc/nginx/sites-available/default
```

4. **Nginx Config Example**
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment

Upload to DigitalOcean App Platform or serve from same nginx instance.

---

## Docker Deployment

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: issue_tracker
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    volumes:
      - ./database.sql:/docker-entrypoint-initdb.d/init.sql
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:@postgres:5432/issue_tracker
      NODE_ENV: development
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up
```

---

## Environment Variables for Production

Create `.env` in backend root:

```env
DATABASE_URL=postgresql://user:password@host:5432/issue_tracker
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## Monitoring & Logging

### Backend Logging

Add to `backend/src/index.ts`:

```typescript
import fs from 'fs';
import path from 'path';

const logStream = fs.createWriteStream(
  path.join(__dirname, '../logs.txt'),
  { flags: 'a' }
);

app.use((req, res, next) => {
  logStream.write(`${new Date().toISOString()} ${req.method} ${req.path}\n`);
  next();
});
```

### Error Tracking

Add error tracking service:

```typescript
// Example with Sentry
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

---

## Performance Optimization

### Backend
- Enable gzip compression
- Use connection pooling
- Add caching headers
- Implement rate limiting

### Frontend
- Enable minification (done by Vite)
- Use CDN for assets
- Enable lazy loading
- Compress images

### Database
- Add missing indexes
- Optimize queries
- Archive old data
- Regular backups

---

## Security Hardening

1. **HTTPS/TLS**
   - Always use HTTPS in production
   - Use Let's Encrypt for free certificates

2. **Database**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups
   - IP whitelisting

3. **API**
   - Add API authentication
   - Implement rate limiting
   - Add input validation
   - CORS configuration
   - Security headers

4. **Frontend**
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options

---

## Backup Strategy

### Database Backups

```bash
# Daily automatic backup
pg_dump issue_tracker > backup_$(date +%Y%m%d).sql

# For cron:
0 2 * * * pg_dump issue_tracker > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Store backups
- AWS S3
- Google Cloud Storage
- DigitalOcean Spaces
- On-premise storage

---

## Scaling Considerations

### Horizontal Scaling
- Load balancer (nginx, HAProxy)
- Multiple backend instances
- Session management (Redis)

### Vertical Scaling
- Larger EC2/Droplet instances
- More database resources
- Increased memory/CPU

### Database Scaling
- Read replicas
- Database sharding
- Archiving old data

---

## Rollback Procedures

1. **Code Rollback**
```bash
git revert <commit-hash>
git push
```

2. **Database Rollback**
```bash
# From backup
psql issue_tracker < backup_20231126.sql
```

3. **Stop Current Deployment**
```bash
# For Heroku
heroku restart --app issue-tracker-api

# For EC2/Docker
sudo systemctl restart app
docker-compose restart
```

---

## Testing in Production

1. **Health Check**
```bash
curl https://your-api.com/health
```

2. **API Testing**
```bash
curl https://your-api.com/api/issues
```

3. **Frontend Access**
```bash
https://your-frontend.com
```

4. **Performance Testing**
```bash
ab -n 100 -c 10 https://your-api.com/api/issues
```

---

## Troubleshooting Common Issues

### Issue: Database Connection Timeout
- Check VPC security groups
- Verify DATABASE_URL
- Ensure database is running
- Check firewall rules

### Issue: CORS Errors
- Verify CORS_ORIGIN in .env
- Check browser console for exact error
- Add proper headers in middleware

### Issue: High Memory Usage
- Check for memory leaks
- Restart application
- Increase instance size
- Review database queries

### Issue: Slow Queries
- Add database indexes
- Analyze query plans
- Consider caching
- Optimize SQL queries

---

## Maintenance

### Regular Tasks
- Monitor logs
- Check database size
- Review error rates
- Update dependencies
- Test backups
- Security patches

### Schedule
- Daily: Monitor logs and errors
- Weekly: Check performance metrics
- Monthly: Update dependencies
- Quarterly: Security audit
- Annually: Disaster recovery test

---

## Support & Resources

- Heroku Docs: https://devcenter.heroku.com
- AWS Docs: https://docs.aws.amazon.com
- DigitalOcean Docs: https://docs.digitalocean.com
- PostgreSQL Docs: https://www.postgresql.org/docs
- Express Docs: https://expressjs.com
- React Docs: https://react.dev

---

## Conclusion

Choose the deployment platform that best fits your needs:
- **Heroku**: Quick setup, managed services
- **AWS**: Scalable, comprehensive, complex
- **DigitalOcean**: Simple, affordable, straightforward
- **Docker**: Portable, version control, flexible

All platforms require similar setup steps for database and environment configuration.
