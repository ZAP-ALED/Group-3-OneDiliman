import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from '../src/pages/AdminPage/AdminPage.tsx'
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// testing routed pages credit from: https://stackoverflow.com/questions/76081552/typeerror-cannot-destructure-property-basename-of-react-namespace-usecontex

test('site admin page should not contain any text at start', () => {
    render(
      <MemoryRouter><AdminPage /></MemoryRouter>);
    const header = screen.queryByText(/Admin Dashboard/i);
  
    expect(header).not.toBeInTheDocument();
  });

test('site admin page should have a loading icon at start', () => {
    render(
        <MemoryRouter><AdminPage /></MemoryRouter>);
    const header = screen.queryByLabelText(/Loading Spinner/i);

    expect(header).toBeInTheDocument();
});