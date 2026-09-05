import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './TaskPage.scss';

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

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      setTasks(response.data.tasks || []);
      setError('');
    } catch (_error) {
      setError('Unable to load tasks right now.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/api/tasks/${taskId}`, { status: newStatus });
      await fetchTasks();
    } catch (_error) {
      setError('Unable to update task status.');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const haystack = `${task.title || ''} ${task.description || ''}`.toLowerCase();
    return matchesStatus && haystack.includes(searchTerm.toLowerCase());
  });

  if (loading) return <main className="private-shell"><p>Loading tasks…</p></main>;

  return (
    <main className="private-shell task-page">
      <div className="page-heading"><div><p className="eyebrow">Execution</p><h1>Tasks</h1><p>Keep assigned work visible and move it forward.</p></div></div>
      <div className="task-toolbar"><input type="search" placeholder="Search tasks" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="All">All statuses</option><option value="Pending">Pending</option><option value="In Progress">In progress</option><option value="Completed">Completed</option></select></div>
      {error && <div className="inline-alert">{error}</div>}
      <section className="task-list">
        {filteredTasks.length === 0 && <div className="empty-state">No tasks match this view.</div>}
        {filteredTasks.map((task) => <article key={task.id} className="task-card"><div><span className={`task-status-badge ${task.status.toLowerCase().replaceAll(' ', '-')}`}>{task.status}</span><h2>{task.title}</h2><p>{task.description || 'No description provided.'}</p><small>Assigned to {assigneeName(task.assignedTo)}</small></div><select aria-label={`Update status for ${task.title}`} value={task.status} onChange={(event) => handleStatusChange(task.id, event.target.value)}><option value="Pending">Pending</option><option value="In Progress">In progress</option><option value="Completed">Completed</option></select></article>)}
      </section>
    </main>
  );
};

export default TaskPage;
