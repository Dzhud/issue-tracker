import React, { useState, useEffect } from 'react';
import { Issue } from '../types';
import { issuesAPI } from '../api';
import { IssueCard } from './IssueCard';
import { IssueForm } from './IssueForm';
import { SearchFilter } from './SearchFilter';

export const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await issuesAPI.getAll(status || undefined, search || undefined);
      setIssues(data);
    } catch (err) {
      setError('Failed to load issues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [status, search]);

  const handleCreateIssue = async (formData: any) => {
    setLoading(true);
    try {
      const newIssue = await issuesAPI.create({
        title: formData.title,
        description: formData.description,
        status: formData.status,
      });
      setIssues([newIssue, ...issues]);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create issue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditIssue = async (formData: any) => {
    if (!editingIssue) return;

    setLoading(true);
    try {
      const updated = await issuesAPI.update(editingIssue.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      });
      setIssues(issues.map(issue => (issue.id === editingIssue.id ? updated : issue)));
      setEditingIssue(null);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to update issue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIssue = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    setDeletingId(id);
    try {
      await issuesAPI.delete(id);
      setIssues(issues.filter(issue => issue.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete issue');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (issue: Issue) => {
    setEditingIssue(issue);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingIssue(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Issue Tracker</h1>
          <p className="text-gray-600">Manage and track your issues efficiently</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Create Issue Button */}
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="mb-6 bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 font-medium transition-colors"
          >
            + Create New Issue
          </button>
        )}

        {/* Form */}
        {isFormOpen && (
          <div className="mb-6">
            <IssueForm
              issue={editingIssue || undefined}
              onSubmit={editingIssue ? handleEditIssue : handleCreateIssue}
              onCancel={handleCloseForm}
              isLoading={loading}
            />
          </div>
        )}

        {/* Search and Filter */}
        <SearchFilter
          status={status}
          search={search}
          onStatusChange={setStatus}
          onSearchChange={setSearch}
        />

        {/* Loading State */}
        {loading && !isFormOpen && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading issues...</p>
            </div>
          </div>
        )}

        {/* Issues Grid */}
        {!loading && issues.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {issues.map(issue => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onEdit={handleEditClick}
                onDelete={handleDeleteIssue}
                isDeleting={deletingId === issue.id}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && issues.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No issues found</p>
            <p className="text-gray-400 text-sm">
              {search || status ? 'Try adjusting your filters' : 'Create your first issue to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
