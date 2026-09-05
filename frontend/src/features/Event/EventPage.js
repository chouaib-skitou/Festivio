import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import useAuthStore from '../../stores/authStore';

const participantId = (participant) =>
  typeof participant === 'string' ? participant : participant?._id || participant?.id;

const EventPage = () => {
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, eventId: null });
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/api/events');
      const nextEvents = (response.data.events || []).map((event) => ({
        ...event,
        isParticipating: (event.participants || []).some(
          (participant) => participantId(participant) === user?.id
        ),
      }));
      setEvents(nextEvents);
      setError('');
    } catch (_error) {
      setError('Unable to load events right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleParticipate = async (eventId) => {
    await axiosInstance.post(`/api/events/${eventId}/participate`);
    setEvents((current) => current.map((event) =>
      event.id === eventId ? { ...event, isParticipating: true } : event
    ));
  };

  const confirmUnparticipate = async () => {
    const eventId = confirmationModal.eventId;
    try {
      await axiosInstance.post(`/api/events/${eventId}/unparticipate`);
      setEvents((current) => current.map((event) =>
        event.id === eventId ? { ...event, isParticipating: false } : event
      ));
    } finally {
      setConfirmationModal({ isOpen: false, eventId: null });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsOnline(false);
    setSelectedImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData();
    formData.append('name', form.name.value);
    formData.append('description', form.description.value);
    formData.append('date', form.date.value);
    formData.append('isOnline', isOnline);
    if (isOnline) formData.append('zoomLink', form.zoomLink.value);
    if (form.image.files[0]) formData.append('image', form.image.files[0]);

    await axiosInstance.post('/api/events', formData);
    closeModal();
    await fetchEvents();
  };

  const canCreateEvent = ['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN'].includes(user?.role);

  if (isLoading) return <main className="private-shell"><p>Loading events…</p></main>;

  return (
    <main className="private-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Event workspace</p>
          <h1>Events</h1>
          <p>Discover upcoming events, coordinate teams and keep participation visible.</p>
        </div>
        {canCreateEvent && (
          <button className="primary-button" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Create event
          </button>
        )}
      </div>

      {error && <div className="inline-alert">{error}</div>}

      <section className="event-grid">
        {events.length === 0 && <div className="empty-state">No events yet.</div>}
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <button className="event-card-main" onClick={() => navigate(`/events/${event.id}`)}>
              {event.imagePath ? <img src={event.imagePath} alt="" /> : <div className="event-image-placeholder">F</div>}
              <div className="event-card-body">
                <div className="event-meta"><CalendarDays size={16} /> {new Date(event.date).toLocaleDateString()}</div>
                <h2>{event.name}</h2>
                <p>{event.description || 'No description provided.'}</p>
                <div className="event-meta"><MapPin size={16} /> {event.isOnline ? 'Online' : 'In person'}</div>
              </div>
            </button>
            {user?.role === 'ROLE_PARTICIPANT' && (
              <div className="event-card-action">
                <button
                  className={event.isParticipating ? 'secondary-button danger' : 'secondary-button'}
                  onClick={() => event.isParticipating
                    ? setConfirmationModal({ isOpen: true, eventId: event.id })
                    : handleParticipate(event.id)}
                >
                  {event.isParticipating ? 'Leave event' : 'Join event'}
                </button>
              </div>
            )}
          </article>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="create-event-title">
            <div className="modal-heading"><div><p className="eyebrow">New event</p><h2 id="create-event-title">Create an event</h2></div><button className="icon-button" onClick={closeModal}>×</button></div>
            <form onSubmit={handleSubmit} className="stack-form">
              <label>Name<input name="name" required /></label>
              <label>Description<textarea name="description" rows="4" /></label>
              <label>Date<input type="date" name="date" required /></label>
              <label>Cover image<input type="file" name="image" accept="image/jpeg,image/png,image/webp" onChange={(event) => event.target.files[0] && setSelectedImage(URL.createObjectURL(event.target.files[0]))} /><small>JPEG, PNG or WebP · max 5 MB</small></label>
              {selectedImage && <img className="image-preview" src={selectedImage} alt="Selected event preview" />}
              <label className="checkbox-label"><input type="checkbox" checked={isOnline} onChange={(event) => setIsOnline(event.target.checked)} /><span>Online event</span></label>
              {isOnline && <label>Meeting URL<input type="url" name="zoomLink" placeholder="https://…" /></label>}
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={closeModal}>Cancel</button><button type="submit" className="primary-button">Create event</button></div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, eventId: null })}
        onConfirm={confirmUnparticipate}
        title="Leave this event?"
        message="You can join again later if registration remains available."
      />
    </main>
  );
};

export default EventPage;
