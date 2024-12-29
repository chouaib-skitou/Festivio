import React from 'react';

const DeleteTaskModal = ({ isOpen, onClose, onDelete, task }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-semibold text-white">Confirm Deletion</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 text-white">
          <p>Are you sure you want to delete this task?</p>
          <p className="mt-2">{task?.title}</p>
        </div>
        <div className="flex justify-end gap-3 p-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete(task._id);
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
