import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  let data = {
    user:"plaguera",
    repo:"tfm-testing",
    number: 1
  }
  const { getByText } = render(<App {...data}/>);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
