import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ListTodo, Users } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import './LandingPage.scss';

const roleCopy = {
  ROLE_ADMIN: 'You have platform-wide administration access.',
  ROLE_ORGANIZER_ADMIN: 'You can create events, coordinate participants and manage organizer tasks.',
  ROLE_ORGANIZER: 'Your workspace focuses on the operational tasks assigned to you.',
  ROLE_PARTICIPANT: 'Your workspace keeps upcoming events and participation close at hand.',
};

const LandingPage = () => {
  const user = useAuthStore((state) => state.user);
  const showEvents = ['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_PARTICIPANT'].includes(user?.role);
  const showTasks = ['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_ORGANIZER'].includes(user?.role);

  return (
    <main className="workspace-home private-shell">
      <section className="workspace-welcome"><p className="eyebrow">Workspace</p><h1>Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}.</h1><p>{roleCopy[user?.role] || 'Your Festivio workspace is ready.'}</p></section>
      <section className="workspace-cards">
        {showEvents && <Link to="/events"><span><CalendarDays /></span><div><h2>Events</h2><p>Browse event details, participation and coordination.</p></div></Link>}
        {showTasks && <Link to="/tasks"><span><ListTodo /></span><div><h2>Tasks</h2><p>See operational work and current execution status.</p></div></Link>}
        <Link to="/profile"><span><Users /></span><div><h2>Your profile</h2><p>Review your account and current role.</p></div></Link>
      </section>
    </main>
  );
};

export default LandingPage;
