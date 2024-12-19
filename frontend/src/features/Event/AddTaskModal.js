import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AddTaskModal.scss';

const AddTaskModal = ({ isOpen, onClose, eventId, participants }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'Pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to create the task
    console.log('Creating task:', { ...formData, eventId });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-semibold text-white">Add New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-base font-medium text-gray-200">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-base font-medium text-gray-200">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="assignedTo" className="block text-base font-medium text-gray-200">
              Assign To
            </label>
            <select
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a person</option>
              {participants.map((participant) => (
                <option key={participant.id} value={participant.id.toString()}>
                  {participant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-base font-medium text-gray-200">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {['Pending', 'In Progress', 'Completed'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;

