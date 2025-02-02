// Test case suite setup credit: https://codingpr.com/test-your-react-app-with-vitest-and-react-testing-library/

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Click on the Vite and React logos to learn more/i);
  expect(linkElement).toBeInTheDocument();
});
