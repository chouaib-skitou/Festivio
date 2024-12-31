import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './TaskPage.scss';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      const tasksData = response.data.tasks || [];
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/api/tasks/${taskId}`, {
        status: newStatus
      });
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="tasks-container">Loading tasks...</div>;
  }

  return (
    <div className="tasks-container">
      <h1 className="tasks-title">Tasks</h1>
      <div className="tasks-filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="tasks-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-content">
                <h2 className="task-title">{task.title}</h2>
                <p className="task-description">{task.description}</p>
                <p className="task-assigned">
                  Assigned to: {task.assignedTo}
                </p>
              </div>
              <div className="task-status">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default TaskPage;

