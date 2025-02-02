import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from '../src/pages/AdminPage/AdminPage.tsx'
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import EditOrgModalContent from '../src/pages/OrgPage/EditOrgModal.tsx'

// testing routed pages credit from: https://stackoverflow.com/questions/76081552/typeerror-cannot-destructure-property-basename-of-react-namespace-usecontex

test('edit org modal should render', () => {
    render(
      <MemoryRouter><EditOrgModalContent handleClose={() => false}/></MemoryRouter>);
    
      const banner = screen.getAllByText(/Edit Banner Images/i);
      expect(banner[0]).toBeInTheDocument();
  });