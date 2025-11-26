export interface Issue {
  id: number;
  title: string;
  description: string | null;
  status: 'open' | 'in-progress' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  status?: 'open' | 'in-progress' | 'closed';
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  status?: 'open' | 'in-progress' | 'closed';
}
