import React from 'react';
import useAuthStore from '../../stores/authStore';

const roleLabels = {
  ROLE_ADMIN: 'Administrator',
  ROLE_ORGANIZER_ADMIN: 'Organizer administrator',
  ROLE_ORGANIZER: 'Organizer',
  ROLE_PARTICIPANT: 'Participant',
};

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const initials = user?.fullName
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'F';

  return (
    <main className="private-shell profile-page">
      <div className="page-heading">
        <div><p className="eyebrow">Account</p><h1>Your profile</h1><p>Your current Festivio identity and access level.</p></div>
      </div>
      <section className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-copy">
          <h2>{user?.fullName || user?.username || 'Festivio user'}</h2>
          <p>{user?.email}</p>
          <span className="role-pill">{roleLabels[user?.role] || user?.role}</span>
        </div>
      </section>
      <section className="profile-details">
        <div><span>Username</span><strong>{user?.username || '—'}</strong></div>
        <div><span>Email verification</span><strong>{user?.isVerified ? 'Verified' : 'Pending'}</strong></div>
        <div><span>Role</span><strong>{roleLabels[user?.role] || user?.role || '—'}</strong></div>
      </section>
    </main>
  );
}
