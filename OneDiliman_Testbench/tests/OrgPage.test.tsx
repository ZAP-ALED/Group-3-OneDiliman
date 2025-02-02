import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OrgPage from '../src/pages/OrgPage/OrgPage.tsx'
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// testing routed pages credit from: https://stackoverflow.com/questions/76081552/typeerror-cannot-destructure-property-basename-of-react-namespace-usecontex

test('org page must display "Sign up to apply to this organization" by default', () => {
    render(
      <MemoryRouter><OrgPage /></MemoryRouter>);
    const notice = screen.getByText(/Sign up as a user to apply to this organization/i);
  
    expect(notice).toBeInTheDocument();
  });
