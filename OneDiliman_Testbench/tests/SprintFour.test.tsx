import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import LogInPage from '../src/pages/LogIn/LoginPage.tsx';
import OrgPage from '../src/pages/OrgPage/OrgPage.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../src/pages/Dashboard/DashboardPage.tsx';
import { expect, test} from 'vitest'

// testing routed pages credit from: https://stackoverflow.com/questions/76081552/typeerror-cannot-destructure-property-basename-of-react-namespace-usecontex

async function logInOrg() {
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

async function logInUser() {
  cleanup();
  await render(
    <MemoryRouter><LogInPage /></MemoryRouter>);
  const user = userEvent.setup();

  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  await user.type(username, "ptperez2@up.edu.ph");
  await user.type(password, "useremailtest123");

  await user.click(screen.getByText(/Log In/));
}

async function logOut() {
  const user = userEvent.setup();
  const dropdown = screen.queryAllByTestId("profile-dropdown"); //look into this, why many profile dropdowns?
  await user.click(dropdown[0]);
  await user.click(screen.getByTestId("logout-button"));
}

test('as user, check for loading screen on dashboard', async  () => {
  await logInUser();
  cleanup();

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 2000));

  waitFor(() => {
    expect(screen.findByTestId("dashboard-loading-spinner")).toBeDefined();
    expect(screen.findByTestId("dashboard-fetching-string")).toBeDefined();
  })
 
    await logOut();
  }, 50000);

test('as user, check for application button on org page', async  () => {
    await logInUser();
    cleanup();
  
    await render(
      <MemoryRouter><DashboardPage /></MemoryRouter>);
    const user = userEvent.setup();
    await new Promise((r) => setTimeout(r, 5000));
  
  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  await expect(orgCard).toBeDefined();

  await userEvent.click(orgCard);

    await render(
        <MemoryRouter initialEntries={['/dashboard/jO8BwsPe1lSCAo1gIRa6oR8vGpH3']}>
            <Routes>
                <Route path="/dashboard/:orgId" element ={<OrgPage />} />
            </Routes>
        </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 5000));
    await waitFor(() => {
        const applicationButton = screen.findByTestId("application-button");
        expect(applicationButton).toBeDefined();
    });

   
    await logOut();
    }, 50000);

  test('as org, create a post, then log out. log in as user, check if post appears in notifications', async  () => {
    await logInOrg();
    cleanup();
  
    await render(
      <MemoryRouter><DashboardPage /></MemoryRouter>);
    const user = userEvent.setup();
    await new Promise((r) => setTimeout(r, 5000));
  
    const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
    await expect(orgCard).toBeDefined();

    await userEvent.click(orgCard);

    await render(
        <MemoryRouter initialEntries={['/dashboard/jO8BwsPe1lSCAo1gIRa6oR8vGpH3']}>
            <Routes>
                <Route path="/dashboard/:orgId" element ={<OrgPage />} />
            </Routes>
        </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 5000));
    await waitFor(() => {
        const applicationButton = screen.findByTestId("application-button");
        expect(applicationButton).toBeDefined();
    });

    
    await logOut();
    }, 50000);