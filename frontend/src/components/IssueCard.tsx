import React from 'react';
import { Issue } from '../types';

interface IssueCardProps {
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

const statusColors: Record<string, string> = {
  open: 'bg-red-100 text-red-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  closed: 'bg-green-100 text-green-800',
};

const statusLabels: Record<string, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  closed: 'Closed',
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onEdit, onDelete, isDeleting }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-primary-500">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">{issue.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[issue.status] || 'bg-gray-100'}`}>
          {statusLabels[issue.status] || issue.status}
        </span>
      </div>

      {issue.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <span>Created: {formatDate(issue.created_at)}</span>
        <span>Updated: {formatDate(issue.updated_at)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(issue)}
          className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-md hover:bg-primary-700 font-medium text-sm transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(issue.id)}
          disabled={isDeleting}
          className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 disabled:bg-gray-400 font-medium text-sm transition-colors"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};
