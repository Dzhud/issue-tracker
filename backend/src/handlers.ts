import { Request, Response } from 'express';
import pool from './db';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from './types';

// Get all issues with optional filtering
export async function getIssues(req: Request, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM issues';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    if (search) {
      if (params.length > 0) {
        query += ' AND (title ILIKE $2 OR description ILIKE $2)';
        params.push(`%${search}%`);
      } else {
        query += ' WHERE (title ILIKE $1 OR description ILIKE $1)';
        params.push(`%${search}%`);
      }
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query<Issue>(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get single issue by ID
export async function getIssueById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await pool.query<Issue>('SELECT * FROM issues WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Issue not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create new issue
export async function createIssue(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, status } = req.body as CreateIssueRequest;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const result = await pool.query<Issue>(
      'INSERT INTO issues (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description || null, status || 'open']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update issue
export async function updateIssue(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body as UpdateIssueRequest;

    // Build dynamic query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length === 1) {
      // Only updated_at is being set
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    values.push(id);

    const query = `UPDATE issues SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query<Issue>(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Issue not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete issue
export async function deleteIssue(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query<Issue>('DELETE FROM issues WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Issue not found' });
      return;
    }

    res.json({ message: 'Issue deleted successfully', issue: result.rows[0] });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
