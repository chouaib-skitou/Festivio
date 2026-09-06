import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import NavBar from './NavBar';

const renderAt = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <NavBar />
  </MemoryRouter>
);

afterEach(() => {
  useAuthStore.setState({ accessToken: null, user: null });
});

test('renders website navigation on public routes', () => {
  renderAt('/');

  expect(screen.getByRole('navigation', { name: /website navigation/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  expect(screen.getByRole('link', { name: /get started/i })).toHaveAttribute('href', '/register');
});

test('toggles the website mobile navigation from the burger button', () => {
  renderAt('/');

  const toggle = screen.getByRole('button', { name: /toggle website navigation/i });
  const links = screen.getByRole('link', { name: /features/i }).closest('.navbar-links');

  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(links).not.toHaveClass('open');

  fireEvent.click(toggle);

  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(links).toHaveClass('open');

  fireEvent.click(toggle);

  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(links).not.toHaveClass('open');
});

test('offers the workspace from the website when authenticated', () => {
  useAuthStore.setState({ accessToken: 'test-token', user: { role: 'ROLE_PARTICIPANT' } });
  renderAt('/');

  expect(screen.getByRole('link', { name: /open workspace/i })).toHaveAttribute('href', '/home');
});

test('renders focused workspace navigation on application routes', () => {
  useAuthStore.setState({ accessToken: 'test-token', user: { role: 'ROLE_ORGANIZER_ADMIN' } });
  renderAt('/home');

  expect(screen.getByRole('navigation', { name: /workspace navigation/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /website/i })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: /overview/i })).toHaveAttribute('href', '/home');
  expect(screen.getByRole('link', { name: /events/i })).toHaveAttribute('href', '/events');
  expect(screen.getByRole('link', { name: /tasks/i })).toHaveAttribute('href', '/tasks');
});
