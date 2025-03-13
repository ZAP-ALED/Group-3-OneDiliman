import React from 'react';
import { render, screen, waitFor, user, cleanup, fireEvent} from '@testing-library/react';
import LogInPage from '../src/pages/LogIn/LoginPage.tsx';
import OrgPage from '../src/pages/OrgPage/OrgPage.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../src/pages/Dashboard/DashboardPage.tsx';
import { Alert } from 'react-bootstrap';
import { expect, test, vi } from 'vitest'



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
    await new Promise((r) => setTimeout(r, 5000));

    const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
    expect(orgCard).toBeInTheDocument();

    await userEvent.click(orgCard);
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
        userEvent.click(events);
    })

    await new Promise((r) => setTimeout(r, 2000));
    //Check current amount of test events
    const eventsCurrent = screen.queryAllByText("This is a test event. Courtesy of SprintThree.test.tsx");
    console.log(eventsCurrent.length);

    await userEvent.click(screen.getByText(/Create New Event/));
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
      const uploadedImage = screen.queryAllByAltText('Test Event (SprintThree.test.tsx)');
      expect(uploadedImage.length).toBeGreaterThan(0)
    });

    await logOut();

}, 25000)

test('view events as user', async () => {
  await logInUser();
  cleanup;

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 5000));

  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  expect(orgCard).toBeInTheDocument();

  await userEvent.click(orgCard);
  await render(
      <MemoryRouter initialEntries={['/dashboard/jO8BwsPe1lSCAo1gIRa6oR8vGpH3']}>
          <Routes>
              <Route path="/dashboard/:orgId" element ={<OrgPage />} />
          </Routes>
      </MemoryRouter>
  );
  await new Promise((r) => setTimeout(r, 2000));
  await waitFor(() => {
      const about = screen.getByText(/Facebook/i);
      expect(about).toBeInTheDocument();
  });

  await waitFor(() => {
      const events = screen.getByTestId("events-tab");
      userEvent.click(events);
  })

  await new Promise((r) => setTimeout(r, 2000));
  //Check current amount of test events
  const eventsCurrent = screen.queryAllByText("This is a test event. Courtesy of SprintThree.test.tsx");
  expect(eventsCurrent.length).toBeGreaterThan(0);

  await logOut();

}, 25000)

test('as org, edit an event', async () => {
  const spyAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
  

  await logInOrg();
  await cleanup;

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>
  );
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 2000));

  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  expect(orgCard).toBeInTheDocument();

  await user.click(orgCard);
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
      user.click(events);
  });

  await new Promise((r) => setTimeout(r, 2000));
  await waitFor(() => {
    const eventsCurrent = screen.queryAllByText("This is a test event. Courtesy of SprintThree.test.tsx");
    expect(eventsCurrent.length).toBeGreaterThan(0);
  });

  await waitFor(() => {
    const editButtons = screen.queryAllByTestId("edit-event-button");
    user.click(editButtons[0]);

    const eventNameField = screen.getByTestId("edit-event-name")
    const descriptionField = screen.getByTestId("edit-description");
    const saveChangesField = screen.getByTestId("save-changes-event");

    expect(eventNameField).toBeInTheDocument();
    expect(descriptionField).toBeInTheDocument();
    expect(saveChangesField).toBeInTheDocument();

    fireEvent.change(eventNameField, {target: {value: "test edit name"}});
    fireEvent.change(descriptionField, {target: {value: "test edit desc"}});
    fireEvent.click(saveChangesField);

    
  });
  // Verify that the alert was called
  await waitFor(() => {
    expect(spyAlert).toHaveBeenCalledWith('Event updated successfully!');
  });
  // Restore the original alert function
  spyAlert.mockRestore();

  // Verify that the changes are reflected
  await waitFor(() => {
    expect(screen.getByText("test edit name")).toBeInTheDocument();
    expect(screen.getByText("test edit desc")).toBeInTheDocument();
  });

  await logOut();
}, 15000)

test('as org, delete an event', async () => {
  const spyConfirm = vi.spyOn(window, 'confirm').mockImplementation(() => true);
  

  await logInOrg();
  await cleanup;

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>
  );
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 5000));

  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  expect(orgCard).toBeInTheDocument();

  await user.click(orgCard);
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
      user.click(events);
  });

  await new Promise((r) => setTimeout(r, 2000));
  await waitFor(() => {
    const eventsCurrent = screen.queryAllByText("test edit name");
    expect(eventsCurrent.length).toBeGreaterThan(0);  
  });

  const deleteButtons = screen.queryAllByTestId("delete-event-button");
  if (deleteButtons.length > 0){
    await user.click(deleteButtons[0])
  }

  await waitFor(() => {
    expect(spyConfirm).toHaveBeenCalledWith('Are you sure you want to delete this event?');
  });

  spyConfirm.mockRestore();

  await waitFor(() => {
    const eventsCurrent = screen.queryAllByText("test edit name");
    expect(eventsCurrent.length).toBe(0);  
  });

  await logOut();
}, 15000)

test('as org, edit a post', async () => {
  const spyAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

  await logInOrg();
  await new Promise((r) => setTimeout(r, 5000));
  await cleanup;

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>
  );
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 5000));

  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  expect(orgCard).toBeInTheDocument();

  await user.click(orgCard);
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
      const posts = screen.getByTestId("posts-tab");
      user.click(posts);
  });

  await new Promise((r) => setTimeout(r, 2000));

  
  await waitFor(() => {
    const editButtons = screen.queryAllByTestId("edit-post-button");
    user.click(editButtons[0]);

    const postTitleField = screen.getByTestId("edit-post-title")
    const postContentField = screen.getByTestId("edit-post-content");
    const saveChangesField = screen.getByTestId("save-changes-post");

    expect(postTitleField).toBeInTheDocument();
    expect(postContentField).toBeInTheDocument();
    expect(saveChangesField).toBeInTheDocument();

    fireEvent.change(postTitleField, {target: {value: "post edit name"}});
    fireEvent.change(postContentField, {target: {value: "post edit desc"}});
    fireEvent.click(saveChangesField);
  })
  // Verify that the alert was called
  await waitFor(() => {
    expect(spyAlert).toHaveBeenCalledWith('Post updated successfully!');
  });
  // Restore the original alert function
  spyAlert.mockRestore();

  // Verify that the changes are reflected
  await waitFor(() => {
    expect(screen.queryAllByText("post edit name").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("post edit desc").length).toBeGreaterThan(0);

  });
  await logOut();

}, 15000)

test('as a user, follow and unfollow an org', async () => {
  await logInUser();
  cleanup;

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 5000));

  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  expect(orgCard).toBeInTheDocument();

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
      const about = screen.getByText(/Facebook/i);
      expect(about).toBeInTheDocument();
  });

  const preFollowButton = await screen.getByTestId("follow-button");
  expect(preFollowButton).toBeInTheDocument();
  userEvent.click(preFollowButton);

  await new Promise((r) => setTimeout(r, 2000));

  const unfollowButton = screen.getByTestId("unfollow-button");
  expect(unfollowButton).toBeInTheDocument();
  userEvent.click(unfollowButton);

  await new Promise((r) => setTimeout(r, 2000));

  await waitFor(() => {
    const postFollowButton = screen.getByTestId("follow-button");
    expect(postFollowButton).toBeInTheDocument();
  });
}, 35000)