import React from 'react';
import { render } from '@testing-library/react';
import Widget from '../components/Widget';
import { Attributes } from '../props';

test('renders learn react link', () => {
	let data: Attributes = {
		repo: 'plaguera/tfm-testing',
		issue: {
			name: '',
			number: 1
		},
		theme: 'light',
		pageSize: 10
	}
	const { getByText } = render(<Widget {...data} />);
	const linkElement = getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
