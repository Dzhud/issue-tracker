import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} from './handlers';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/issues', getIssues);
app.get('/api/issues/:id', getIssueById);
app.post('/api/issues', createIssue);
app.put('/api/issues/:id', updateIssue);
app.delete('/api/issues/:id', deleteIssue);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
