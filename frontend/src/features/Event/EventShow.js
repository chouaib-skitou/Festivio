import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import './EventShow.scss';
import axiosInstance from '../../api/axiosInstance';

const EventShow = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("participants");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axiosInstance.get(`/api/events/${id}`);
        setEvent(response.data.event);
        setParticipants(response.data.event.participants || []);
        setTasks(response.data.event.tasks || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setError("Failed to load event data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <p className="text-white text-xl">Loading event details...</p>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <p className="text-red-500 text-xl">{error}</p>
    </div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <p className="text-white text-xl">Event not found.</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] pt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          {event.imagePath && (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${event.imagePath}`}
              alt={event.name}
              className="w-full h-64 object-cover"
            />
          )}
          
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
              <span>{event.location || (event.isOnline ? 'Online' : 'N/A')}</span>
            </div>
            
            <p className="text-gray-300 mb-6">{event.description}</p>
            
            {event.isOnline && event.zoomLink && (
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
                          key={participant._id}
                          className="bg-[#0F172A] p-4 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <h4 className="text-white font-medium">{`${participant.firstName} ${participant.lastName}`}</h4>
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
                          key={task._id}
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
                          <p className="text-sm text-gray-500">Assigned to: {task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 'Unassigned'}</p>
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
        onTaskAdded={addTask}
      />
    </div>
  );
};

export default EventShow;

