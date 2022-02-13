import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const headerFile = screen.getByRole('banner');
  expect(headerFile.innerHTML).toBe('Pokemon List');
});
