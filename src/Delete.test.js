import { render, fireEvent } from '@testing-library/react';
import Delete from './Delete';

test('Delete component deletes an entity', () => {
    const handleDeletePerson = jest.fn();
    const { getByLabelText, getByText } = render(<Delete handleDeletePerson={handleDeletePerson} />);

    fireEvent.change(getByLabelText('Id:'), { target: { value: '2' } });
    fireEvent.click(getByText('Delete'));

    expect(handleDeletePerson).toHaveBeenCalled();
});
