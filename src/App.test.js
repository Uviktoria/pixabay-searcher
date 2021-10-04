import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Image gallery/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders learn react link', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText('search image');
  expect(inputElement).toBeInTheDocument();
});
