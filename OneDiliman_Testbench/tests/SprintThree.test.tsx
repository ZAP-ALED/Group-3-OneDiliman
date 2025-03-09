import React from 'react';
import { render, screen, waitFor, user, cleanup, fireEvent } from '@testing-library/react';
import LogInPage from '../src/pages/LogIn/LoginPage.tsx';
import OrgPage from '../src/pages/OrgPage/OrgPage.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../src/pages/Dashboard/DashboardPage.tsx';

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

test('as org, create an event', async () => {
    await logInOrg();
    await cleanup;

    await render(
        <MemoryRouter><DashboardPage /></MemoryRouter>);
    const user = userEvent.setup();
    await new Promise((r) => setTimeout(r, 2000));

    const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
    expect(orgCard).toBeInTheDocument();

    await fireEvent.click(orgCard);
    await render(
        <MemoryRouter initialEntries={['/dashboard/jO8BwsPe1lSCAo1gIRa6oR8vGpH3']}>
            <Routes>
                <Route path="/dashboard/:orgId" element ={<OrgPage />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        const about = screen.getByText(/Facebook/i);
        expect(about).toBeInTheDocument();
    });

    await waitFor(() => {
        const events = screen.getByTestId("events-tab");
        fireEvent.click(events);
    })

    await new Promise((r) => setTimeout(r, 2000));
    //Check current amount of test events
    const eventsCurrent = screen.queryAllByText("This is a test event. Courtesy of SprintThree.test.tsx");
    console.log(eventsCurrent.length);

    await fireEvent.click(screen.getByText(/Create New Event/));
    await user.type(screen.getByPlaceholderText(/Name/i), "Test Event (SprintThree.test.tsx)");
    await user.type(screen.getByPlaceholderText(/Describe your event.../i), "This is a test event. Courtesy of SprintThree.test.tsx");
    await user.type(screen.getByPlaceholderText(/Event location/i), "Test location");
    
    const datetime = new Date();
    const date =  `2026-10-10`
    const time = `10:00`

    const inputDate = screen.getByTestId(/input-date/i);
    const inputTime = screen.getByTestId(/input-time/i)
    await fireEvent.change(inputDate, {target: {value: date }})
    await fireEvent.change(inputTime, {target: {value: time }})
    
    const file = new File(['dummy content'], 'checkmark.png', { type: 'image/png'});
    const inputImages = screen.getByLabelText(/Add Images/i);
    await fireEvent.change(inputImages, { target: {files: [file]}});

    await user.click(screen.getByTestId("create-event-button"));
    await new Promise((r) => setTimeout(r, 2000));

    await waitFor(() => {
      const eventsCreated = screen.queryAllByText("This is a test event. Courtesy of SprintThree.test.tsx");
      expect(eventsCreated.length).toBeGreaterThan(eventsCurrent.length);
      console.log(eventsCreated.length);
    })

    await waitFor(() => {
      const uploadedImage = screen.queryAllByAltText('Test Event (SprintThree.test.tsx) - Image 1');
      expect(uploadedImage.length).toBeGreaterThan(0)
    });

    await logOut();

}, 15000)

test('view events as user', async () => {
  await logInUser();
  cleanup;

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 2000));

  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  expect(orgCard).toBeInTheDocument();

  await fireEvent.click(orgCard);
  await render(
      <MemoryRouter initialEntries={['/dashboard/jO8BwsPe1lSCAo1gIRa6oR8vGpH3']}>
          <Routes>
              <Route path="/dashboard/:orgId" element ={<OrgPage />} />
          </Routes>
      </MemoryRouter>
  );

  await waitFor(() => {
      const about = screen.getByText(/Facebook/i);
      expect(about).toBeInTheDocument();
  });

  await waitFor(() => {
      const events = screen.getByTestId("events-tab");
      fireEvent.click(events);
  })

  await new Promise((r) => setTimeout(r, 2000));
  //Check current amount of test events
  const eventsCurrent = screen.queryAllByText("This is a test event. Courtesy of SprintThree.test.tsx");
  expect(eventsCurrent.length).toBeGreaterThan(0);

})