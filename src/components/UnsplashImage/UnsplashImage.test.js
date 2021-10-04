import { render, screen } from '@testing-library/react';
import UnsplashImage from './UnsplashImage';

test('renders UnsplashImage', () => {
  render(<UnsplashImage />);
  const titleElement = screen.getByAltText(/image.*?/i)
  expect(titleElement).toBeInTheDocument();
});

