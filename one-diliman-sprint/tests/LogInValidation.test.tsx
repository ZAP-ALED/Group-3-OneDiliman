import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LogInPage from '../src/pages/LogIn/LoginPage.tsx'
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// testing routed pages credit from: https://stackoverflow.com/questions/76081552/typeerror-cannot-destructure-property-basename-of-react-namespace-usecontex

test('renders log in page', () => {
  render(
    <MemoryRouter><LogInPage /></MemoryRouter>);
  const instructions = screen.getByText(/Sign in using your UP mail account/i);

  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  expect(instructions).toBeInTheDocument();
  expect(username).toBeInTheDocument();
  expect(password).toBeInTheDocument();
});

// https://www.youtube.com/watch?v=MhFSuOjU624
// https://testing-library.com/docs/queries/byplaceholdertext/
// https://stackoverflow.com/questions/76705164/whats-the-difference-between-getbytext-vs-findbytext-vs-querybytext-in-testing

test('valid log in e-mail and password input', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><LogInPage /></MemoryRouter>);

  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");
  
  const errorEmailMessage = screen.queryByText(/Please make sure you've properly entered your UP Email/i);
  const errorPasswordMessage = screen.queryByText(/Please make sure your password is at least 8 characters long/i);

  user.type(username, "test@up.edu.ph");
  user.type(password, "password");

  waitFor(() => expect(errorEmailMessage).toBeNull());
  waitFor(() => expect(errorPasswordMessage).toBeNull());
});

test('invalid log in e-mail but valid password input', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><LogInPage /></MemoryRouter>);

  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");
  
  const errorEmailMessage = screen.queryByText(/Please make sure you've properly entered your UP Email/i);
  const errorPasswordMessage = screen.queryByText(/Please make sure your password is at least 8 characters long/i);

  user.type(username, "test@gmail.com");
  user.type(password, "password");

  waitFor(() => expect(errorEmailMessage).toBeInTheDocument());
  waitFor(() => expect(errorPasswordMessage).toBeNull());
});

test('valid log in e-mail but invalid password input', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><LogInPage /></MemoryRouter>);

  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");
  
  const errorEmailMessage = screen.queryByText(/Please make sure you've properly entered your UP Email/i);
  const errorPasswordMessage = screen.queryByText(/Please make sure your password is at least 8 characters long/i);

  user.type(username, "test@gmail.com");
  user.type(password, "a");
  
  waitFor(() => expect(errorEmailMessage).toBeNull());
  waitFor(() => expect(errorPasswordMessage).toBeInTheDocument());
});
