import React from 'react';
import { render } from '@testing-library/react';
import Filter from './Filter';

describe('Filter component', () => {
    it('renders the Filter button', () => {
        const { getByText } = render(<Filter filteredList={[]} />);
        const filterButton = getByText('Filter');
        expect(filterButton).toBeInTheDocument();
    });
});
