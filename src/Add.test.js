import { render, fireEvent } from '@testing-library/react';
import Add from './Add';

test('Add component adds a new entity', () => {
  const handleAddPerson = jest.fn();
  const { getByText } = render(<Add handleAddPerson={handleAddPerson} />);

  fireEvent.click(getByText('Add'));

  expect(handleAddPerson).toHaveBeenCalled();
});
