import axios from 'axios';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from './types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const issuesAPI = {
  getAll: async (status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await api.get<Issue[]>(`/issues?${params}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Issue>(`/issues/${id}`);
    return response.data;
  },

  create: async (issue: CreateIssueRequest) => {
    const response = await api.post<Issue>('/issues', issue);
    return response.data;
  },

  update: async (id: number, issue: UpdateIssueRequest) => {
    const response = await api.put<Issue>(`/issues/${id}`, issue);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  },
};
