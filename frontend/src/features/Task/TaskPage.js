import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './TaskPage.scss';

const defaultPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const assigneeName = (assignedTo) => {
  if (!assignedTo) return 'Unassigned';
  if (typeof assignedTo === 'string') return assignedTo;
  return `${assignedTo.firstName || ''} ${assignedTo.lastName || ''}`.trim() || assignedTo.email || 'Assigned user';
};

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [pagination, setPagination] = useState(defaultPagination);

  const fetchTasks = async (nextPage = pagination.page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(pagination.limit || 10),
        status: statusFilter,
        sort: sortOrder,
      });
      if (searchTerm.trim()) params.set('search', searchTerm.trim());

      const response = await axiosInstance.get(`/api/tasks?${params.toString()}`);
      setTasks(response.data.tasks || []);
      setPagination(response.data.pagination || defaultPagination);
      setError('');
    } catch (_error) {
      setError('Unable to load tasks right now.');
      setTasks([]);
      setPagination(defaultPagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchTerm, sortOrder]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/api/tasks/${taskId}`, { status: newStatus });
      await fetchTasks(pagination.page);
    } catch (_error) {
      setError('Unable to update task status.');
    }
  };

  if (loading && tasks.length === 0) return <main className="private-shell"><p>Loading tasks…</p></main>;

  return (
    <main className="private-shell task-page">
      <div className="page-heading"><div><p className="eyebrow">Execution</p><h1>Tasks</h1><p>Keep assigned work visible and move it forward.</p></div></div>
      <div className="task-toolbar">
        <input type="search" placeholder="Search tasks" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="All">All statuses</option><option value="Pending">Pending</option><option value="In Progress">In progress</option><option value="Completed">Completed</option></select>
        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="status">Status</option></select>
      </div>
      {error && <div className="inline-alert">{error}</div>}
      <section className="task-list" aria-busy={loading}>
        {tasks.length === 0 && <div className="empty-state">No tasks match this view.</div>}
        {tasks.map((task) => <article key={task.id} className="task-card"><div><span className={`task-status-badge ${task.status.toLowerCase().replaceAll(' ', '-')}`}>{task.status}</span><h2>{task.title}</h2><p>{task.description || 'No description provided.'}</p><small>Assigned to {assigneeName(task.assignedTo)}</small></div><select aria-label={`Update status for ${task.title}`} value={task.status} onChange={(event) => handleStatusChange(task.id, event.target.value)}><option value="Pending">Pending</option><option value="In Progress">In progress</option><option value="Completed">Completed</option></select></article>)}
      </section>
      <div className="pagination-controls" aria-label="Tasks pagination">
        <button className="secondary-button" disabled={!pagination.hasPreviousPage || loading} onClick={() => fetchTasks(pagination.page - 1)}>Previous</button>
        <span>Page {pagination.page} / {pagination.totalPages} · {pagination.total} tasks</span>
        <button className="secondary-button" disabled={!pagination.hasNextPage || loading} onClick={() => fetchTasks(pagination.page + 1)}>Next</button>
      </div>
    </main>
  );
};

export default TaskPage;
