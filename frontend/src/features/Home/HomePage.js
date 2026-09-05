import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CheckCircle2, ListTodo, ShieldCheck, Sparkles, Users } from 'lucide-react';
import './HomePage.scss';

const HomePage = () => {
  return (
    <main className="marketing-page">
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="marketing-container hero-layout">
          <div className="hero-copy">
            <div className="hero-badge"><Sparkles size={15} /> Event operations, without the chaos</div>
            <h1>Plan the event.<br /><span>Run the whole team.</span></h1>
            <p>Festivio brings event creation, participant coordination and operational tasks into one focused workspace for organizers and communities.</p>
            <div className="hero-actions">
              <Link to="/register" className="primary-button large">Start with Festivio <ArrowRight size={18} /></Link>
              <Link to="/services" className="secondary-button large">Explore the platform</Link>
            </div>
            <div className="hero-proof"><span><CheckCircle2 size={16} /> Role-based access</span><span><CheckCircle2 size={16} /> Secure sessions</span><span><CheckCircle2 size={16} /> One-command local stack</span></div>
          </div>

          <div className="product-preview" aria-label="Festivio product preview">
            <div className="preview-top"><span className="preview-logo">F</span><span>Community Week</span><span className="preview-status">Live workspace</span></div>
            <div className="preview-grid">
              <div className="preview-panel preview-event"><p className="preview-label">NEXT EVENT</p><h3>Opening Night</h3><p>Friday · 18:30</p><div className="preview-progress"><span /></div><small>Coordination ready</small></div>
              <div className="preview-panel"><p className="preview-label">TEAM</p><div className="avatar-row"><span>MA</span><span>OL</span><span>PC</span><span>+8</span></div><p>Organizers and participants aligned in one workspace.</p></div>
              <div className="preview-panel preview-tasks"><p className="preview-label">TASKS</p><div><CheckCircle2 size={16} /> Venue walkthrough <b>Done</b></div><div><ListTodo size={16} /> Check-in desk <b>In progress</b></div><div><ListTodo size={16} /> Speaker briefing <b>Pending</b></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section" id="features">
        <div className="marketing-container">
          <div className="section-heading"><p className="eyebrow">Built for execution</p><h2>Everything your event team needs to stay in sync.</h2><p>Clear responsibilities, shared event context and focused workflows from planning through participation.</p></div>
          <div className="feature-grid">
            <article><span className="feature-icon"><CalendarCheck /></span><h3>Event management</h3><p>Create and manage event details, attendance and online or in-person formats from one place.</p></article>
            <article><span className="feature-icon"><ListTodo /></span><h3>Operational tasks</h3><p>Organizer administrators can assign work while organizers focus on the tasks they own.</p></article>
            <article><span className="feature-icon"><Users /></span><h3>Participant flow</h3><p>Participants can discover events, join them and leave when plans change without operational access.</p></article>
            <article><span className="feature-icon"><ShieldCheck /></span><h3>Role-aware security</h3><p>Administrative, organizer and participant permissions are enforced by the API—not just hidden in the UI.</p></article>
          </div>
        </div>
      </section>

      <section className="marketing-section workflow-section">
        <div className="marketing-container workflow-layout">
          <div className="section-heading left"><p className="eyebrow">A clean operating model</p><h2>From idea to event day in three clear steps.</h2></div>
          <div className="workflow-steps">
            <article><span>01</span><div><h3>Create the event</h3><p>Set the essentials, choose the format and publish a shared source of truth.</p></div></article>
            <article><span>02</span><div><h3>Coordinate the team</h3><p>Assign concrete tasks to organizers and track progress as execution moves forward.</p></div></article>
            <article><span>03</span><div><h3>Bring participants in</h3><p>Let attendees join relevant events while keeping management controls separated.</p></div></article>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="marketing-container cta-card">
          <div><p className="eyebrow">Ready when your team is</p><h2>Give your next event a calmer control room.</h2><p>Create an account and start organizing with Festivio.</p></div>
          <Link to="/register" className="primary-button large">Get started <ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="marketing-footer"><div className="marketing-container"><div className="footer-brand"><span className="preview-logo">F</span><div><strong>Festivio</strong><p>Event planning and team coordination.</p></div></div><div className="footer-links"><Link to="/services">Platform</Link><Link to="/login">Sign in</Link><Link to="/register">Create account</Link></div><p>© {new Date().getFullYear()} Festivio. Open-source software.</p></div></footer>
    </main>
  );
};

export default HomePage;
