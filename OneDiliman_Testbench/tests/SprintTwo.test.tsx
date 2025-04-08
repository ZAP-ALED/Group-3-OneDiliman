import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import LogInPage from '../src/pages/LogIn/LoginPage.tsx';
import OrgPage from '../src/pages/OrgPage/OrgPage.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../src/pages/Dashboard/DashboardPage.tsx';
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

async function timeout(time: number) {
  await new Promise((r) => setTimeout(r, time));
}

async function renderOrgPage() {
  await render(
    <MemoryRouter><DashboardPage /></MemoryRouter>);
  await new Promise((r) => setTimeout(r, 7000));

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
}

test('navigate to org page from dashboard, create a post, edit a post, delete a post', async  () => {
  const spyConfirm = vi.spyOn(window, 'confirm').mockImplementation(() => true);
  const spyAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
  await logInOrg();
  await cleanup();

  await renderOrgPage()

  await waitFor(() => {
    const posts = screen.getByTestId("posts-tab");
    userEvent.click(posts);
    }
  );

  await timeout(3000);
    
  const createNewPostButton = await screen.findByTestId("create-post");
  await expect(createNewPostButton).toBeDefined();
  await userEvent.click(createNewPostButton);

  const postTitleField = await screen.findByTestId("post-title-field");
  await expect(postTitleField).toBeDefined();
  await fireEvent.change(postTitleField, { target: { value: "test post from sprint two"}});

  const postContentField = await screen.findByTestId("post-content-field");
  await expect(postContentField).toBeDefined();
  await fireEvent.change(postContentField, { target: { value: "test content"}});

  // Add an image (dummy content) and upload it
  const file = new File(['dummy content'], 'checkmark.png', { type: 'image/png' });
  const postImageField = await screen.findByTestId("post-image-field")
  await fireEvent.change(postImageField, { target: { files: [file] } });
  
  // Click the create post button
  const submitPostButton = await screen.findByTestId("create-post-button");
  await expect(submitPostButton).toBeDefined();
  await userEvent.click(submitPostButton);

  await timeout(5000);

  // Check if the image has been uploaded alt: "Upload preview ${index + 1}""
  await waitFor(() => {
    const uploadedImage = screen.findAllByAltText('Upload preview 1');
    expect(uploadedImage).toBeDefined();
  });

  await new Promise((r) => setTimeout(r, 2000));

  //edit post
  await waitFor(() => {
    const editButtons = screen.queryAllByTestId("edit-post-button");
    userEvent.click(editButtons[0]);

    const postTitleField = screen.getByTestId("edit-post-title")
    const postContentField = screen.getByTestId("edit-post-content");
    const saveChangesField = screen.getByTestId("save-changes-post");

    expect(postTitleField).toBeDefined();
    expect(postContentField).toBeDefined();
    expect(saveChangesField).toBeDefined();

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

  await timeout(5000);
  
  // Verify that the changes are reflected
  await waitFor(() => {
    expect(screen.queryAllByText("post edit name").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("post edit desc").length).toBeGreaterThan(0);
  });

  // Delete the specific post using the first delete button found
  await waitFor(() =>{
    const deleteButtons = screen.queryAllByTestId("delete-post-button");
    if (deleteButtons.length != 0) {
      userEvent.click(deleteButtons[0]);
    }
  })

  await waitFor(() => {
    expect(spyConfirm).toHaveBeenCalledWith('Are you sure you want to delete this post?');
  });
  // Restore the original alert function
  spyConfirm.mockRestore();

  await timeout(3000);

  await waitFor(() => {
    const postsDeleted = screen.queryAllByText(/test post from sprint two/i);
    expect(postsDeleted).toHaveLength(0);
  });

  await logOut();
  }, 100000);


/*
  test('navigate to org page from dashboard, unable to find delete post button', async  () => {
    await logInUser();
    cleanup();

    await render(
      <MemoryRouter><DashboardPage /></MemoryRouter>);
    const user = userEvent.setup();
    await new Promise((r) => setTimeout(r, 3000));

    const orgCard = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
    expect(orgCard).toBeDefined();

  
    await fireEvent.click(orgCard);
    await render(
      <MemoryRouter initialEntries={['/dashboard/jO8BwsPe1lSCAo1gIRa6oR8vGpH3']}>
        <Routes>
          <Route path="/dashboard/:orgId" element={<OrgPage />} />
        </Routes>
      </MemoryRouter>);

    await waitFor(() => {
      const about = screen.getByText(/Facebook/i);
      expect(about).toBeDefined();
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
  }, 100000);*/