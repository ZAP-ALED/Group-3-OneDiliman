import React from 'react';
import { render, screen, waitFor, user, cleanup, fireEvent } from '@testing-library/react';
import LogInPage from '../../src/pages/LogIn/LoginPage.tsx';
import DashboardPage from '../../src/pages/Dashboard/DashboardPage.tsx';
import OrgPage from '../../src/pages/OrgPage/OrgPage.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// testing routed pages credit from: https://stackoverflow.com/questions/76081552/typeerror-cannot-destructure-property-basename-of-react-namespace-usecontex

async function logInUser() {
  cleanup();
  await render(
    <MemoryRouter><LogInPage /></MemoryRouter>);
  const user = userEvent.setup();

  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  await user.type(username, "org1@up.edu.ph");
  await user.type(password, "12345678");

  await user.click(screen.getByText(/Log In/));
}

test('login and navigate to dashboard', async () => {
  await logInUser();
  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  
  const card = await screen.findByText(/Type in keywords or use tags to filter out the results!/i);
  expect(card).toBeInTheDocument();
});

test('navigate to org page from dashboard', async () => {
  await logInUser();
  cleanup();

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 2000));

  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  expect(orgCard).toBeInTheDocument();
  console.log(screen.debug(orgCard));

  await fireEvent.click(orgCard);

  cleanup();
  //await new Promise((r) => setTimeout(r, 2000));

  await render(
    <MemoryRouter initialEntries={['/dashboard/jO8BwsPe1lSCAo1gIRa6oR8vGpH3']}>
      <Routes>
        <Route path="/dashboard/:orgId" element={<OrgPage />} />
      </Routes>
    </MemoryRouter>);

  await waitFor(() => {
    const about = screen.getByText(/Facebook/i);
    expect(about).toBeInTheDocument();
  });
});

test('navigate to dashboard from org page', async () => {
  await logInUser();
  cleanup();

  await render(
    <MemoryRouter><OrgPage /></MemoryRouter>);
  const user = userEvent.setup();

  const dashboardButton = await screen.findByText(/Dashboard/i);
  expect(dashboardButton).toBeInTheDocument();

  await user.click(dashboardButton);
  cleanup();

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);

  await waitFor(() => {
    const card = screen.getByText(/Type in keywords or use tags to filter out the results!/i);
    expect(card).toBeInTheDocument();
  });
});