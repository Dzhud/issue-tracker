-- Create database
CREATE DATABASE issue_tracker;

-- Connect to the database
\c issue_tracker;

-- Create issues table
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster filtering
CREATE INDEX idx_issues_status ON issues(status);

-- Create index on created_at for sorting
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
