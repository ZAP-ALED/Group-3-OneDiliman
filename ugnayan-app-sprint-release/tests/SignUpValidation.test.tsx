import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SignInPage from '../src/pages/SignUp/SignUpPage.tsx'
import { MemoryRouter } from 'react-router-dom';
import SignUpForm from '../src/pages/SignUp/SignUpForm.tsx';
import userEvent from '@testing-library/user-event';

// testing routed pages credit from: https://stackoverflow.com/questions/76081552/typeerror-cannot-destructure-property-basename-of-react-namespace-usecontex

test('renders sign up page', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><SignUpForm /></MemoryRouter>);
  const instructions = screen.getByText(/Create an Ugnayan Account using your UP Mail/i);

  const firstName = screen.getByPlaceholderText("First Name");
  const lastName = screen.getByPlaceholderText("Last Name");
  const studentNo = screen.getByPlaceholderText("Student No.");
  const course = screen.getByRole("combobox");
  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  expect(instructions).toBeInTheDocument();
  expect(firstName).toBeInTheDocument();
  expect(lastName).toBeInTheDocument();
  expect(studentNo).toBeInTheDocument();
  expect(course).toBeInTheDocument();
  expect(username).toBeInTheDocument();
  expect(password).toBeInTheDocument();
});


test('valid sign up inputs', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><SignUpForm /></MemoryRouter>);

  const firstName = screen.getByPlaceholderText("First Name");
  const lastName = screen.getByPlaceholderText("Last Name");
  const studentNo = screen.getByPlaceholderText("Student No.");
  const course = screen.getByRole("combobox");
  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  const errorEmailMessage = screen.queryByText(/Please make sure you've properly entered your UP Email/i);
  const errorPasswordMessage = screen.queryByText(/Please make sure your password is at least 8 characters long/i);
  const errorStudentNoMessage = screen.queryByText(/Please make sure you've properly entered your Student Number/i);

  user.type(firstName, "John");
  user.type(lastName, "Doe");
  user.type(studentNo, "200012345");
  user.selectOptions(course, "BS Computer Science");
  user.type(username, "test@up.edu.ph");
  user.type(password, "password");

  waitFor(() => expect(errorEmailMessage).toBeNull());
  waitFor(() => expect(errorPasswordMessage).toBeNull());
  waitFor(() => expect(errorStudentNoMessage).toBeNull());
});


test('invalid email', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><SignUpForm /></MemoryRouter>);

  const firstName = screen.getByPlaceholderText("First Name");
  const lastName = screen.getByPlaceholderText("Last Name");
  const studentNo = screen.getByPlaceholderText("Student No.");
  const course = screen.getByRole("combobox");
  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  const errorEmailMessage = screen.queryByText(/Please make sure you've properly entered your UP Email/i);
  const errorPasswordMessage = screen.queryByText(/Please make sure your password is at least 8 characters long/i);
  const errorStudentNoMessage = screen.queryByText(/Please make sure you've properly entered your Student Number/i);

  user.type(firstName, "John");
  user.type(lastName, "Doe");
  user.type(studentNo, "200012345");
  user.selectOptions(course, "BS Computer Science");
  user.type(username, "test@gmail.com");
  user.type(password, "password");

  waitFor(() => expect(errorEmailMessage).toBeInTheDocument());
  waitFor(() => expect(errorPasswordMessage).toBeNull());
  waitFor(() =>expect(errorStudentNoMessage).toBeNull());
});

test('invalid password', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><SignUpForm /></MemoryRouter>);

  const firstName = screen.getByPlaceholderText("First Name");
  const lastName = screen.getByPlaceholderText("Last Name");
  const studentNo = screen.getByPlaceholderText("Student No.");
  const course = screen.getByRole("combobox");
  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  const errorEmailMessage = screen.queryByText(/Please make sure you've properly entered your UP Email/i);
  const errorPasswordMessage = screen.queryByText(/Please make sure your password is at least 8 characters long/i);
  const errorStudentNoMessage = screen.queryByText(/Please make sure you've properly entered your Student Number/i);

  user.type(firstName, "John");
  user.type(lastName, "Doe");
  user.type(studentNo, "200012345");
  user.selectOptions(course, "BS Computer Science");
  user.type(username, "test@up.edu.ph");
  user.type(password, "a");

  waitFor(() => expect(errorEmailMessage).toBeNull());
  waitFor(() => expect(errorPasswordMessage).toBeInTheDocument());
  waitFor(() => expect(errorStudentNoMessage).toBeNull());
});

test('invalid student number', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><SignUpForm /></MemoryRouter>);

  const firstName = screen.getByPlaceholderText("First Name");
  const lastName = screen.getByPlaceholderText("Last Name");
  const studentNo = screen.getByPlaceholderText("Student No.");
  const course = screen.getByRole("combobox");
  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  const errorEmailMessage = screen.queryByText(/Please make sure you've properly entered your UP Email/i);
  const errorPasswordMessage = screen.queryByText(/Please make sure your password is at least 8 characters long/i);
  const errorStudentNoMessage = screen.queryByText(/Please make sure you've properly entered your Student Number/i);

  user.type(firstName, "John");
  user.type(lastName, "Doe");
  user.type(studentNo, "0");
  user.selectOptions(course, "BS Computer Science");
  user.type(username, "test@up.edu.ph");
  user.type(password, "password");

  waitFor(() => expect(errorEmailMessage).toBeNull());
  waitFor(() => expect(errorPasswordMessage).toBeNull());
  waitFor(() => expect(errorStudentNoMessage).toBeInTheDocument());
});

test('no valid sign up inputs', () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter><SignUpForm /></MemoryRouter>);

  const firstName = screen.getByPlaceholderText("First Name");
  const lastName = screen.getByPlaceholderText("Last Name");
  const studentNo = screen.getByPlaceholderText("Student No.");
  const course = screen.getByRole("combobox");
  const username = screen.getByPlaceholderText("Email");
  const password = screen.getByPlaceholderText("Password");

  const errorEmailMessage = screen.queryByText(/Please make sure you've properly entered your UP Email/i);
  const errorPasswordMessage = screen.queryByText(/Please make sure your password is at least 8 characters long/i);
  const errorStudentNoMessage = screen.queryByText(/Please make sure you've properly entered your Student Number/i);

  user.type(firstName, "John");
  user.type(lastName, "Doe");
  user.type(studentNo, "0");
  user.selectOptions(course, "BS Computer Science");
  user.type(username, "test@gmail.com");
  user.type(password, "a");

  waitFor(() => expect(errorEmailMessage).toBeInTheDocument());
  waitFor(() => expect(errorPasswordMessage).toBeInTheDocument());
  waitFor(() => expect(errorStudentNoMessage).toBeInTheDocument());
});