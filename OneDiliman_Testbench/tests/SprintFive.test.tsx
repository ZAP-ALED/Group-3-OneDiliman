import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import LogInPage from '../src/pages/LogIn/LoginPage.tsx';
import OrgPage from '../src/pages/OrgPage/OrgPage.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../src/pages/Dashboard/DashboardPage.tsx';
import { vi, expect, test} from 'vitest'

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

test('create post, check for notifs, delete all, check for empty notifs', async () => {
await logInOrg();
    cleanup();
  
    await render(
      <MemoryRouter><DashboardPage /></MemoryRouter>);
    const user = userEvent.setup();
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
    
    //click post tab
    const postsTab = await screen.findByTestId("posts-tab");
    await expect(postsTab).toBeDefined();
    await fireEvent.click(postsTab);

    //click create post button
    const createOnePost = await screen.findByTestId("create-post");
    await expect(createOnePost).toBeDefined();
    await userEvent.click(createOnePost);

    //first post, fill in title, content
    const postOneTitle = 'test one title'
    const postOneContent = 'test one content'

    const titleOneField = await screen.findByTestId("post-title-field");
    await expect(titleOneField).toBeDefined();
    await fireEvent.change(titleOneField, {target: {value: postOneTitle}} );
    const contentOneField = await screen.findByTestId("post-content-field");
    await expect(contentOneField).toBeDefined();
    await fireEvent.change(contentOneField, {target: {value: postOneContent}});
    const createPostOneButton = await screen.findByTestId("create-post-button");
    await expect(createPostOneButton).toBeDefined();
    await fireEvent.click(createPostOneButton);

    await new Promise((r) => setTimeout(r, 3000));

    //click create post button
    const createTwoPost = await screen.findByTestId("create-post");
    await expect(createTwoPost).toBeDefined();
    await userEvent.click(createTwoPost);

    //first post, fill in title, content
    const postTwoTitle = 'test two title'
    const postTwoContent = 'test two content'

    const titleTwoField = await screen.findByTestId("post-title-field");
    await expect(titleTwoField).toBeDefined();
    await fireEvent.change(titleTwoField, {target: {value: postTwoTitle}} );
    const contentTwoField = await screen.findByTestId("post-content-field");
    await expect(contentTwoField).toBeDefined();
    await fireEvent.change(contentTwoField, {target: {value: postTwoContent}});
    const createPostTwoButton = await screen.findByTestId("create-post-button");
    await expect(createPostTwoButton).toBeDefined();
    await fireEvent.click(createPostTwoButton);

    await new Promise((r) => setTimeout(r, 3000));
    
    
    await logOut();
    //login as user
    await logInUser();
    cleanup();
  
    await render(
      <MemoryRouter><DashboardPage /></MemoryRouter>);
    await new Promise((r) => setTimeout(r, 5000));
    //click notification button
    const notificationButton = await screen.findByTestId("notification-button");
    await expect(notificationButton).toBeDefined();
    await fireEvent.click(notificationButton)
    const notificationMessageBeforeDelete = await screen.findAllByTestId("notification-message");
    await expect(notificationMessageBeforeDelete[0].textContent).toBe('New Post from New New Org: test two title')
    await expect(notificationMessageBeforeDelete[1].textContent).toBe("New Post from New New Org: test one title")
    //delete notification
    const clearAllNotificationButton = await screen.findByTestId("clear-all-notifs");
    await expect(clearAllNotificationButton).toBeDefined();
    await fireEvent.click(clearAllNotificationButton);

    await new Promise((r) => setTimeout(r, 1000));
    
    const notificationMessageAfterDelete = await screen.queryAllByTestId("notification-message");
    await expect(notificationMessageAfterDelete.length).toBe(0)
    await logOut();
      // delete the test posts
    await logInOrg();
    cleanup();

    const spyConfirm = vi.spyOn(window, 'confirm').mockImplementation(() => true);
  
    await render(
      <MemoryRouter><DashboardPage /></MemoryRouter>);
    await new Promise((r) => setTimeout(r, 7000));
  
    const orgCardTwo = await screen.findByTestId("org-card-jO8BwsPe1lSCAo1gIRa6oR8vGpH3");
    await expect(orgCardTwo).toBeDefined();

    await userEvent.click(orgCardTwo);

    await render(
        <MemoryRouter initialEntries={['/dashboard/jO8BwsPe1lSCAo1gIRa6oR8vGpH3']}>
            <Routes>
                <Route path="/dashboard/:orgId" element ={<OrgPage />} />
            </Routes>
        </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 5000));

    //click post tab
    const postsTabTwo = await screen.findByTestId("posts-tab");
    await expect(postsTabTwo).toBeDefined();
    await fireEvent.click(postsTabTwo);

    const deletePostButtonsOne = await screen.findAllByTestId("delete-post-button");
    await expect(deletePostButtonsOne).toBeDefined();
    await fireEvent.click(deletePostButtonsOne[0]);
    await waitFor(() => {
        expect(spyConfirm).toHaveBeenCalledWith('Are you sure you want to delete this post?');
      });
    
    //spyConfirm.mockRestore();

    await new Promise((r) => setTimeout(r, 3000))

    const deletePostButtonsTwo = await screen.findAllByTestId("delete-post-button");
    await expect(deletePostButtonsTwo).toBeDefined();
    await fireEvent.click(deletePostButtonsTwo[0]);

    await waitFor(() => {
      expect(spyConfirm).toHaveBeenCalledWith('Are you sure you want to delete this post?');
    });
  
    await spyConfirm.mockRestore();

    await new Promise((r) => setTimeout(r, 3000))


}, 100000);

test('edit org details, see if user sees changes', async () => {

}, 50000)

