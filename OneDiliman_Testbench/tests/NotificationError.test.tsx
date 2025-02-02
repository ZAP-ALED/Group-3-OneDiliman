import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../src/pages/Dashboard/DashboardPage.tsx'
import { MemoryRouter } from 'react-router-dom';
import SignUpForm from '../src/pages/SignUp/SignUpForm.tsx';
import userEvent from '@testing-library/user-event';
import Sidebar from '../src/components/Sidebar/Sidebar.tsx';

// testing routed pages credit from: https://stackoverflow.com/questions/76081552/typeerror-cannot-destructure-property-basename-of-react-namespace-usecontex

test('renders dashboard', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  const instructions = screen.getByText(/What Org You Looking For?/i);

  expect(instructions).toBeInTheDocument();
});

test('returns no database connection', () => {
    const user = userEvent.setup()
  
    render(
      <MemoryRouter><DashboardPage /></MemoryRouter>);
    const instructions = screen.getByText(/No Database Connection./i);
  
    // don't wait for database to load
    expect(instructions).toBeInTheDocument();
});

test('returns nothing from search query', () => {
    const user = userEvent.setup()
  
    render(
      <MemoryRouter><DashboardPage /></MemoryRouter>);

    const searchQuery = screen.getByPlaceholderText("Type to Search");
    user.type(searchQuery, "asdfghjkl") // no organization has this substring

    const results = screen.queryByText(/No organizations match your search query/i);
  
    // don't wait for database to load
    waitFor(() => expect(results).toBeNull());
});

test('returns nothing from sidebar if guest mode', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);

  const sideBarContent = screen.getByText("Sign up to access");

  // don't wait for database to load
  expect(sideBarContent).toBeInTheDocument();
});