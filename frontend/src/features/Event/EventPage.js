import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Plus } from 'lucide-react';
import axiosInstance from "../../api/axiosInstance";
//import useAuthStore from "../../stores/authStore";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";

const EventPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, eventId: null });
  const navigate = useNavigate();
  //const { user } = useAuthStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/api/events");
      console.log("API response:", response.data);
      if (response.data && Array.isArray(response.data.events)) {
        const eventsWithParticipation = response.data.events.map(event => {
          const isParticipating = event.participants.some(participant => participant._id === user.id);
          console.log(`Event ${event.id} - isParticipating:`, isParticipating);
          return {
            ...event,
            isParticipating
          };
        });
        setEvents(eventsWithParticipation);
      } else {
        console.error("Unexpected API response format:", response.data);
        setEvents([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleParticipate = async (eventId) => {
    try {
      await axiosInstance.post(`/api/events/${eventId}/participate`);
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, isParticipating: true } : event
      ));
    } catch (error) {
      console.error("Error participating in event:", error);
    }
  };

  const handleUnparticipate = async (eventId) => {
    setConfirmationModal({ isOpen: true, eventId });
  };

  const confirmUnparticipate = async () => {
    const eventId = confirmationModal.eventId;
    try {
      await axiosInstance.post(`/api/events/${eventId}/unparticipate`);
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, isParticipating: false } : event
      ));
    } catch (error) {
      console.error("Error unparticipating from event:", error);
    } finally {
      setConfirmationModal({ isOpen: false, eventId: null });
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error("User not found");
      return;
    }

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("description", e.target.description.value);
    formData.append("date", e.target.date.value);
    formData.append("isOnline", isOnline);
    formData.append("organizer", user.id);
    if (isOnline) formData.append("zoomLink", e.target.zoomLink.value);
    if (e.target.image.files[0]) formData.append("image", e.target.image.files[0]);

    try {
      await axiosInstance.post("/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      closeModal();
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error.response?.data?.message || "Server error");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <p className="text-white text-xl">Loading events...</p>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <p className="text-red-500 text-xl">{error}</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white">Events</h1>
          {(user?.role === 'ROLE_ORGANIZER_ADMIN' || user?.role === 'ROLE_ADMIN') && (
            <button
              onClick={openModal}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-2.5 px-6 rounded-full transition-colors duration-200"
            >
              Add Event
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-[#1E293B] rounded-xl overflow-hidden shadow-lg transition-transform duration-200 hover:transform hover:scale-[1.02]"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#EF4444] flex items-center justify-center text-white font-semibold">
                        {event.organizer && typeof event.organizer === 'string' ? event.organizer[0] : 'E'}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-white">
                          {event.name}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more options click
                      }}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  {event.imagePath && (
                    <img
                      src={event.imagePath}
                      alt={event.name}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {event.description}
                    </p>
                  </div>
                </div>
                {user?.role === 'ROLE_PARTICIPANT' && (
                  <div className="px-5 pb-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (event.isParticipating) {
                          handleUnparticipate(event.id);
                        } else {
                          handleParticipate(event.id);
                        }
                      }}
                      className={`w-full font-medium py-2 rounded transition-colors duration-200 ${
                        event.isParticipating
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                      }`}
                    >
                      {event.isParticipating ? 'Unparticipate' : 'Participate'}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-white text-center col-span-3">No events found.</p>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm z-50 rounded">
            <div className="bg-[#1E2B3D] rounded p-6 w-[480px] max-w-[95vw] mx-auto">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Create New Event
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-group">
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-input w-full bg-[#131B2A] border border-gray-700/50 rounded text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                    placeholder="Enter event name"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    name="description"
                    className="form-textarea w-full bg-[#131B2A] border border-gray-700/50 rounded text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 resize-none"
                    placeholder="Enter event description"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="form-input w-full bg-[#131B2A] border border-gray-700/50 rounded text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Event Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-gray-700/50 border-dashed rounded bg-[#131B2A] hover:border-gray-600 transition-colors duration-200">
                    <div className="space-y-2 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-400 justify-center">
                        <label className="relative cursor-pointer rounded font-medium text-blue-500 hover:text-blue-400">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            name="image"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  {selectedImage && (
                    <div className="mt-3">
                      <img
                        src={selectedImage}
                        alt="Selected event"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="form-group flex items-center">
                  <input
                    type="checkbox"
                    name="isOnline"
                    checked={isOnline}
                    onChange={(e) => setIsOnline(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-500 border-gray-700/50 rounded bg-[#131B2A] focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Online Event
                  </span>
                </div>

                {isOnline && (
                  <div className="form-group">
                    <label className="block text-sm text-gray-300 mb-1.5">
                      Zoom Link
                    </label>
                    <input
                      type="url"
                      name="zoomLink"
                      className="form-input w-full bg-[#131B2A] border border-gray-700/50 rounded text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#131B2A] hover:bg-[#1A2435] rounded transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded transition-colors duration-200"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, eventId: null })}
          onConfirm={confirmUnparticipate}
          title="Unparticipate from Event"
          message="Are you sure you want to unparticipate from this event?"
        />
      </div>
    </div>
  );
};

export default EventPage;

