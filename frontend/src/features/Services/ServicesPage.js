import React from 'react';
import './ServicesPage.scss';

const ServicesPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-page-header">
        <h1>Welcome to Our Event Management Platform</h1>
        <p>Learn more about the different roles you can choose in our platform.</p>
      </header>
      
      <section className="roles-info">
        <h2>Roles Explained</h2>

        <div className="role">
          <h3>Participant</h3>
          <p>As a Participant, you can join events and access all the necessary information to take part. You don't need to worry about organizing or managing anything—just show up and enjoy the event!</p>
        </div>

        <div className="role">
          <h3>Organizer</h3>
          <p>Organizers are responsible for making the event happen. They manage tasks set up by the Organizer Admin. Organizers are the ones who take action during the event to ensure everything runs smoothly. They’re the ones who execute the tasks that have been planned ahead.</p>
        </div>

        <div className="role">
          <h3>Organizer Admin</h3>
          <p>Organizer Admins have full control over the events. They can create and delete events, as well as assign and manage tasks for the event. They are usually part of associations or organizations and work to ensure events are planned and executed properly. It’s important to note that organizers are not paid for their work—they are volunteers helping to make the events successful.</p>
        </div>
      </section>

      <footer className="landing-page-footer">
        <p>Choose your role during registration to get started and become part of our event community!</p>
      </footer>
    </div>
  );
};

export default ServicesPage;
