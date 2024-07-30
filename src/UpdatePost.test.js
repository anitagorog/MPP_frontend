import React from 'react';
import { render } from '@testing-library/react';
import UpdatePost from './UpdatePost.js';

test('Add component adds a new entity', () => {
    const { getByText } = render(<UpdatePost />);
    const updateButton = getByText('Update');
    expect(updateButton).toBeInTheDocument();
});
