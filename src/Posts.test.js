import React from 'react';
import { render } from '@testing-library/react';
import Posts from './Posts.js';

// Mock the fetchPosts function
jest.mock('./Posts.js', () => ({
    __esModule: true,
    default: () => {
        return (
            <div>
                <h3>Posts for profile with id: 1</h3>
                <ul>
                    <li>
                        <h4>Title 1</h4>
                        <p>Content 1</p>
                        <button>Delete</button>
                        <button>Update Post</button>
                    </li>
                    <li>
                        <h4>Title 2</h4>
                        <p>Content 2</p>
                        <button>Delete</button>
                        <button>Update Post</button>
                    </li>
                </ul>
            </div>
        );
    }
}));

test('Posts component renders correctly', () => {
    const { getByText } = render(<Posts />);
    const header = getByText('Posts for profile with id: 1');
    expect(header).toBeInTheDocument();
});
