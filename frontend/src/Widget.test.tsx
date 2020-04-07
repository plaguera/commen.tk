import React from 'react';
import { render } from '@testing-library/react';
import Widget from './Widget';

test('renders learn react link', () => {
  let data = {
    user:"plaguera",
    repo:"tfm-testing",
    number: 1,
    theme: 'light'
  }
  const { getByText } = render(<Widget {...data}/>);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
