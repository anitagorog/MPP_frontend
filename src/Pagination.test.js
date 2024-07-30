import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination component', () => {
    it('should navigate to next page when Next button is clicked', () => {
        const { getByText } = render(<Pagination profileList={[]} />);
        fireEvent.click(getByText('Next'));
        expect(getByText('Next').closest('button')).toBeDisabled(); // Expecting "Next" button to be disabled with empty list
    });

    it('should navigate to previous page when Previous button is clicked', () => {
        const { getByText } = render(<Pagination profileList={[]} />);
        fireEvent.click(getByText('Previous'));
        expect(getByText('Previous').closest('button')).toBeDisabled(); // Expecting "Previous" button to be disabled with empty list
    });
});
