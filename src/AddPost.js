import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const AddPost = ({ error }) => {
    const { profileId } = useParams();
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const FillTitle = (event) => {
        setNewTitle(event.target.value);
    }

    const FillContent = (event) => {
        setNewContent(event.target.value);
    }

    const generateUniqueId = () => {
        // Generate a random number
        return Math.floor(Math.random() * 1000) + 500;
    }

    const handleAddPost = async () => {
        if (error !== null) {
            const newPostId = generateUniqueId();
            const allPosts = JSON.parse(localStorage.getItem('pendingPosts')) || [];

            let updatedPosts = [...allPosts]; // Copy the existing posts to update

            const profileIndex = updatedPosts.findIndex(post => post.profileId === profileId);

            if (profileIndex === -1) {
                // Profile not found, create a new profile object
                const newProfile = { profileId: profileId, posts: [{ id: newPostId, title: newTitle, content: newContent }] };
                updatedPosts.push(newProfile);
            } else {
                // Profile found, push the new post into its posts array
                updatedPosts[profileIndex].posts.push({ id: newPostId, title: newTitle, content: newContent });
            }

            // Update local storage with updated posts
            localStorage.setItem('pendingPosts', JSON.stringify(updatedPosts));


            // Clear input fields after adding the post
            setNewTitle("");
            setNewContent("");
        }
        else {

            try {
                const token = localStorage.getItem('token');
                // Make a POST request to add a new entity
                const response = await fetch(`/api/posts/${profileId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: token, element: { title: newTitle, content: newContent } }),
                });

                if (response.ok) {
                    // Clear input fields after adding the person
                    setNewTitle("");
                    setNewContent("");
                } else {
                    console.error('Failed to add post:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding post:', error);
            }
        }
    }

    return (
        <div>
            <header>Adding</header>
            <label>
                Title: <input value={newTitle} onChange={FillTitle} />
            </label>
            <br></br>
            <label>
                Content: <input value={newContent} onChange={FillContent} />
            </label>
            <br></br>
            <button onClick={handleAddPost}>Add</button>
        </div>
    );
}

export default AddPost;
