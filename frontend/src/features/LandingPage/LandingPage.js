import React from 'react';
import { ArrowRight, CalendarDays, ListTodo, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import './LandingPage.scss';

const roleCopy = {
  ROLE_ADMIN: 'Platform administration, event operations and team access are available from this workspace.',
  ROLE_ORGANIZER_ADMIN: 'Create events, coordinate participants and keep organizer work moving from one place.',
  ROLE_ORGANIZER: 'Stay focused on the operational tasks assigned to you and keep execution status current.',
  ROLE_PARTICIPANT: 'Discover upcoming events and keep your participation close at hand.',
};

const roleLabel = {
  ROLE_ADMIN: 'Administrator',
  ROLE_ORGANIZER_ADMIN: 'Organizer admin',
  ROLE_ORGANIZER: 'Organizer',
  ROLE_PARTICIPANT: 'Participant',
};

const LandingPage = () => {
  const user = useAuthStore((state) => state.user);
  const showEvents = ['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_PARTICIPANT'].includes(user?.role);
  const showTasks = ['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_ORGANIZER'].includes(user?.role);
  const firstName = user?.fullName?.split(' ')[0] || user?.firstName || 'there';

  const cards = [
    showEvents && { to: '/events', icon: CalendarDays, label: 'Events', copy: 'Browse event details, participation and coordination.', meta: 'Event operations' },
    showTasks && { to: '/tasks', icon: ListTodo, label: 'Tasks', copy: 'Review assigned work and keep execution status current.', meta: 'Team execution' },
    { to: '/profile', icon: UserRound, label: 'Your profile', copy: 'Review your account details and current access level.', meta: 'Account' },
  ].filter(Boolean);

  return (
    <main className="workspace-home private-shell">
      <div className="workspace-orb workspace-orb-one" />
      <div className="workspace-orb workspace-orb-two" />

      <section className="workspace-welcome">
        <div>
          <p className="workspace-kicker">Workspace overview</p>
          <h1>Welcome back, {firstName}.</h1>
          <p>{roleCopy[user?.role] || 'Your Festivio workspace is ready.'}</p>
        </div>
        <div className="workspace-role-card">
          <span className="workspace-role-icon"><ShieldCheck size={17} /></span>
          <div><small>ACCESS</small><strong>{roleLabel[user?.role] || 'Member'}</strong></div>
          <span className="workspace-online"><i /> Active</span>
        </div>
      </section>

      <section className="workspace-cards" aria-label="Workspace shortcuts">
        {cards.map(({ to, icon: Icon, label, copy, meta }) => (
          <Link to={to} key={to}>
            <div className="workspace-card-top"><span className="workspace-card-icon"><Icon size={20} /></span><span className="workspace-card-meta">{meta}</span></div>
            <div className="workspace-card-copy"><h2>{label}</h2><p>{copy}</p></div>
            <span className="workspace-card-action">Open <ArrowRight size={15} /></span>
          </Link>
        ))}
      </section>

      <section className="workspace-note">
        <div><span>F</span><div><strong>Festivio workspace</strong><p>The application area is intentionally separated from the public website so your operational navigation stays focused.</p></div></div>
        <Link to="/">View public website <ArrowRight size={14} /></Link>
      </section>
    </main>
  );
};

export default LandingPage;
