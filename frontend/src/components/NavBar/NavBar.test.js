import React from 'react';
import { render, screen } from '@testing-library/react';
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
