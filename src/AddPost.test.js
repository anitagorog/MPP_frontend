import React from 'react';
import { render } from '@testing-library/react';
import AddPost from './AddPost.js';

test('Add component adds a new entity', () => {
    const { getByText } = render(<AddPost />);
    const addButton = getByText('Add');
    expect(addButton).toBeInTheDocument();
});
