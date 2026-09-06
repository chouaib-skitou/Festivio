import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ListTodo,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import './HomePage.scss';

const HomePage = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <main className="marketing-page">
      <section className="hero-section">
        <div className="hero-aurora hero-aurora-one" />
        <div className="hero-aurora hero-aurora-two" />
        <div className="marketing-container hero-layout">
          <div className="hero-copy">
            <div className="hero-badge"><Sparkles size={14} /> Calm operations for ambitious events</div>
            <h1>Everything your event team needs. <span>Nothing it doesn’t.</span></h1>
            <p className="hero-lead">Festivio brings event planning, team assignments and participant coordination into one focused workspace designed to stay clear when event day gets busy.</p>
            <div className="hero-actions">
              <Link to={accessToken ? '/home' : '/register'} className="primary-button marketing-primary large">
                {accessToken ? 'Open your workspace' : 'Start with Festivio'} <ArrowRight size={18} />
              </Link>
              <a href="#features" className="secondary-button marketing-secondary large">See what’s inside</a>
            </div>
            <div className="hero-proof">
              <span><CheckCircle2 size={15} /> Role-aware access</span>
              <span><CheckCircle2 size={15} /> Secure sessions</span>
              <span><CheckCircle2 size={15} /> Built for real operations</span>
            </div>
          </div>

          <div className="product-preview" aria-label="Festivio workspace preview">
            <div className="preview-window-bar">
              <div className="preview-dots" aria-hidden="true"><span /><span /><span /></div>
              <span>festivio / workspace</span>
              <span className="preview-live">Live</span>
            </div>
            <div className="preview-body">
              <aside className="preview-sidebar">
                <div className="preview-mini-brand">F</div>
                <span className="selected" />
                <span />
                <span />
                <span />
              </aside>
              <div className="preview-content">
                <div className="preview-heading"><div><small>GOOD MORNING</small><strong>Community Week</strong></div><button>+ New event</button></div>
                <div className="preview-stats"><article><small>UPCOMING</small><strong>04</strong><span>events</span></article><article><small>OPEN TASKS</small><strong>12</strong><span>across the team</span></article><article><small>PARTICIPANTS</small><strong>248</strong><span>registered</span></article></div>
                <div className="preview-grid">
                  <article className="preview-panel preview-event"><p className="preview-label">NEXT EVENT</p><h3>Opening Night</h3><p>Friday · 18:30</p><div className="preview-progress"><span /></div><small>Coordination ready</small></article>
                  <article className="preview-panel"><p className="preview-label">TEAM</p><div className="avatar-row"><span>MA</span><span>OL</span><span>PC</span><span>+8</span></div><p>Organizers and participants aligned in one workspace.</p></article>
                  <article className="preview-panel preview-tasks"><p className="preview-label">TASKS</p><div><CheckCircle2 size={15} /> Venue walkthrough <b>Done</b></div><div><ListTodo size={15} /> Check-in desk <b>In progress</b></div><div><ListTodo size={15} /> Speaker briefing <b>Pending</b></div></article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section" id="features">
        <div className="marketing-container">
          <div className="section-heading"><p className="eyebrow">One focused platform</p><h2>Designed around the work that actually happens.</h2><p>From the first event draft to the final task update, every role gets the context it needs without exposing controls it should not have.</p></div>
          <div className="feature-grid">
            <article><span className="feature-icon"><CalendarCheck /></span><h3>Event management</h3><p>Create and manage event details, attendance and online or in-person formats from one place.</p></article>
            <article><span className="feature-icon"><ListTodo /></span><h3>Operational tasks</h3><p>Assign concrete work, track execution and keep ownership visible as plans move forward.</p></article>
            <article><span className="feature-icon"><Users /></span><h3>Participant flow</h3><p>Let participants discover and join events without mixing attendee actions with organizer controls.</p></article>
            <article><span className="feature-icon"><ShieldCheck /></span><h3>Security by role</h3><p>Permissions are enforced by the backend, with secure sessions and explicit role boundaries throughout the product.</p></article>
          </div>
        </div>
      </section>

      <section className="marketing-section workflow-section" id="workflow">
        <div className="marketing-container workflow-layout">
          <div className="section-heading left"><p className="eyebrow">A simple operating model</p><h2>Move from planning to execution without changing tools.</h2><p>Festivio keeps the operating loop intentionally small so teams can stay focused on delivery.</p></div>
          <div className="workflow-steps">
            <article><span>01</span><div><h3>Shape the event</h3><p>Set the essentials and establish one shared source of truth for the team.</p></div></article>
            <article><span>02</span><div><h3>Coordinate execution</h3><p>Assign ownership, follow progress and keep operational work visible.</p></div></article>
            <article><span>03</span><div><h3>Bring people in</h3><p>Give participants a clean way to discover and join the events that matter to them.</p></div></article>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="marketing-container cta-card">
          <div><p className="eyebrow">Festivio workspace</p><h2>A calmer control room for your next event.</h2><p>{accessToken ? 'Your workspace is ready when you are.' : 'Create an account and start coordinating your next event.'}</p></div>
          <Link to={accessToken ? '/home' : '/register'} className="primary-button marketing-primary large">{accessToken ? 'Open workspace' : 'Get started'} <ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="marketing-footer">
        <div className="marketing-container footer-layout">
          <div className="footer-brand"><span className="preview-mini-brand">F</span><div><strong>Festivio</strong><p>Event planning and team coordination.</p></div></div>
          <div className="footer-links"><a href="#features">Features</a><a href="#workflow">How it works</a><Link to="/services">Platform</Link>{accessToken ? <Link to="/home">Workspace</Link> : <Link to="/login">Sign in</Link>}</div>
          <p>© {new Date().getFullYear()} Festivio. Open-source software.</p>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
