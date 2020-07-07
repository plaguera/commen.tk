import React from 'react';
import { render } from '@testing-library/react';
import Widget from './Widget';
import { WidgetProps } from './props';

test('renders learn react link', () => {
	let data: WidgetProps = {
		owner: "plaguera",
		repo: "tfm-testing",
		issueName: '',
		issueNumber: 1,
		theme: 'light',
		pageSize: 10
	}
	const { getByText } = render(<Widget {...data} />);
	const linkElement = getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
