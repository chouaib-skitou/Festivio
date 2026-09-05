import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ListChecks, Shield, UserRound } from 'lucide-react';
import './ServicesPage.scss';

const roles = [
  { icon: Shield, title: 'Administrator', copy: 'Platform-wide operational access for trusted administrators. This role is never available through public registration.' },
  { icon: Crown, title: 'Organizer administrator', copy: 'Owns events, coordinates participants and assigns tasks to organizers. Administrative organizer access is assigned internally.' },
  { icon: ListChecks, title: 'Organizer', copy: 'Works on assigned operational tasks and updates execution status without gaining event administration privileges.' },
  { icon: UserRound, title: 'Participant', copy: 'Discovers events, joins or leaves attendance and views relevant event information without management permissions.' },
];

const ServicesPage = () => (
  <main className="platform-page">
    <section className="platform-hero"><div className="marketing-container"><p className="eyebrow">How Festivio works</p><h1>Clear roles. Clear ownership.</h1><p>Festivio separates platform administration, event ownership, operational work and attendance so every user sees the controls they actually need.</p></div></section>
    <section className="marketing-container role-grid">{roles.map(({ icon: Icon, title, copy }) => <article key={title}><span><Icon /></span><h2>{title}</h2><p>{copy}</p></article>)}</section>
    <section className="platform-cta"><div className="marketing-container"><div><h2>Want to participate or organize?</h2><p>Create a public account. Elevated roles stay controlled by administrators.</p></div><Link className="primary-button large" to="/register">Create account</Link></div></section>
  </main>
);

export default ServicesPage;
