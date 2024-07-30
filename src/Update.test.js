import { render, fireEvent } from '@testing-library/react';
import Update from './Update';

test('Update component updates an entity', () => {
  const handleUpdatePerson = jest.fn();
  const { getByLabelText, getByText } = render(<Update handleUpdatePerson={handleUpdatePerson} />);

  fireEvent.change(getByLabelText('Id to the one to update:'), { target: { value: '1' } });
  fireEvent.change(getByLabelText('New name:'), { target: { value: 'John Doe' } });
  fireEvent.change(getByLabelText('New age:'), { target: { value: '30' } });
  fireEvent.click(getByText('Update'));

  expect(handleUpdatePerson).toHaveBeenCalled();
});
