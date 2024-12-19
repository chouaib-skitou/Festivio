import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import './EventShow.scss';
import paellaImage from '../../media/images/paella.jpg';

const EventShow = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("participants");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Placeholder data
  const event = {
    id: id,
    name: "Sample Event",
    description: "This is a detailed description of the event. It includes all the necessary information about what will happen during the event, who should attend, and what to expect.",
    date: "2024-01-20",
    imagePath: paellaImage,
    isOnline: true,
    zoomLink: "https://zoom.us/j/123456789",
    location: "Online",
  };

  const participants = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  const tasks = [
    { id: 1, title: "Prepare presentation", description: "Create slides for the main topic", status: "In Progress", assignedTo: "John Doe" },
    { id: 2, title: "Setup virtual room", description: "Configure Zoom settings and test audio", status: "Completed", assignedTo: "Jane Smith" },
    { id: 3, title: "Send invitations", description: "Email all participants with event details", status: "Pending", assignedTo: "Bob Johnson" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] pt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <img
            src={event.imagePath}
            alt={event.name}
            className="w-full h-64 object-cover"
          />
          
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-2">{event.name}</h1>
            <div className="flex items-center text-gray-400 mb-4">
              <span className="mr-4">
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>{event.location}</span>
            </div>
            
            <p className="text-gray-300 mb-6">{event.description}</p>
            
            {event.isOnline && (
              <div className="bg-[#0F172A] p-4 rounded-2xl mb-6">
                <h3 className="text-white font-semibold mb-2">Zoom Meeting</h3>
                <a 
                  href={event.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Join Meeting
                </a>
              </div>
            )}

            <div className="tabs">
              <div className="tab-list bg-[#0F172A] inline-flex rounded-2xl overflow-hidden">
                {['participants', 'tasks'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-3 ${activeTab === tab ? 'bg-transparent text-white' : 'text-gray-400'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="tab-content mt-4">

                {activeTab === 'participants' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Participants</h3>
                    <div className="grid gap-4">
                      {participants.map((participant) => (
                        <div 
                          key={participant.id}
                          className="bg-[#0F172A] p-4 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <h4 className="text-white font-medium">{participant.name}</h4>
                            <p className="text-gray-400 text-sm">{participant.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">Tasks</h3>
                      <button 
                        onClick={() => setIsAddTaskModalOpen(true)}
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {tasks.map((task) => (
                        <div 
                          key={task.id}
                          className="bg-[#0F172A] p-4 rounded-2xl"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-medium">{task.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              task.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                              task.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                          <p className="text-sm text-gray-500">Assigned to: {task.assignedTo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        eventId={id}
        participants={participants}
      />
    </div>
  );
};

export default EventShow;

