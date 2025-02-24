import React from 'react';
import { render, screen, waitFor, user, cleanup, fireEvent } from '@testing-library/react';
import LogInPage from '../src/pages/LogIn/LoginPage.tsx';
import OrgPage from '../src/pages/OrgPage/OrgPage.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../src/pages/Dashboard/DashboardPage.tsx';

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


test('navigate to org page from dashboard, create a post, delete a post', async () => {
  await logInUser();
  cleanup();

  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  const user = userEvent.setup();
  await new Promise((r) => setTimeout(r, 1000));

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

    await fireEvent.click(screen.getByText(/Create New Post/i));
    await user.type(screen.getByPlaceholderText(/Title/i), "Test Post (SprintTwo_Post.test.tsx)");
    await user.type(screen.getByPlaceholderText(/Content/i), "This is a test post. Courtesy of SprintTwo_Post.test.tsx");
    
    // Click the create post button
    await user.click(screen.getByTestId("create-post-button"));

    // Wait for the post to be created and get the post ID from the state

    await waitFor(() => {
      const post = screen.getByText(/This is a test post. Courtesy of SprintTwo_Post.test.tsx/i);
      expect(post).toBeInTheDocument();

    });

    // Delete the specific post using the captured post ID
    // Delete the specific post using the first delete button found
    const deleteButtons = screen.queryAllByTestId("delete-post-button");
    if (deleteButtons.length > 0) {
      await user.click(deleteButtons[0]);
    }

    await waitFor(() => {
      const post = screen.queryByText(/This is a test post. Courtesy of SprintTwo_Post.test.tsx/i);
      expect(post).toBeNull();
    });
  });
