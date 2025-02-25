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

test('navigate to org page from dashboard, create a post, delete a post', async  () => {
  await logInOrg();
  cleanup();

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 2000));

  const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
  expect(orgCard).toBeInTheDocument();
  console.log(screen.debug(orgCard));

  await fireEvent.click(orgCard);
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

  await waitFor(() => {
    const posts = screen.getByTestId("posts-tab");
    fireEvent.click(posts);
    }
  );

  await new Promise((r) => setTimeout(r, 2000));
    // Check current amount of test posts (it may contain any content)
    const postsCurrent = screen.queryAllByText(/This is a test post. Courtesy of SprintTwo_Post.test.tsx/i);

    await fireEvent.click(screen.getByText(/Create New Post/i));
    
    console.log(postsCurrent.length);
    await user.type(screen.getByPlaceholderText(/Title/i), "Test Post (SprintTwo_Post.test.tsx)");
    await user.type(screen.getByPlaceholderText(/Content/i), "This is a test post. Courtesy of SprintTwo_Post.test.tsx");
    
    // Add an image (dummy content) and upload it
    const file = new File(['dummy content'], 'checkmark.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Add Images/i);
    fireEvent.change(input, { target: { files: [file] } });
    
    // Click the create post button
    await user.click(screen.getByTestId("create-post-button"));

    // Wait for the post to be created 
    await waitFor(() => {
      const postsCreated = screen.queryAllByText(/This is a test post. Courtesy of SprintTwo_Post.test.tsx/i);

      expect(postsCreated.length).toBeGreaterThan((postsCurrent.length));
      console.log(postsCreated.length);
    });

    // Check if the image has been uploaded alt: "Upload preview ${index + 1}""
    await waitFor(() => {
      const uploadedImage = screen.getByAltText('Upload preview 1');
      expect(uploadedImage).toBeInTheDocument();
    });

    // Delete the specific post using the first delete button found
    const deleteButtons = screen.queryAllByTestId("delete-post-button");
    if (deleteButtons.length > 0) {
      await user.click(deleteButtons[0]);
    }

    await waitFor(() => {
      const postsDeleted = screen.queryAllByText(/This is a test post. Courtesy of SprintTwo_Post.test.tsx/i);
      expect(postsDeleted).toHaveLength(postsCurrent.length);
      console.log(postsDeleted.length);
    });

    await logOut();
  }, 15000);

  test('navigate to org page from dashboard, unable to find delete post button', async  () => {
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

    await waitFor(() => {
      const posts = screen.getByTestId("posts-tab");
      fireEvent.click(posts);
      }
    );

    // Make sure no delete post buttons are found
    await waitFor(() => {
      const deleteButtons = screen.queryAllByTestId("delete-post-button");
      expect(deleteButtons).toHaveLength(0);
      }
    );
    await logOut();
  }, 15000);