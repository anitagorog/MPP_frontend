import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const UpdatePost = ({ error }) => {
    const { profileId, postId } = useParams();
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const FillTitle = (event) => {
        setNewTitle(event.target.value);
    }

    const FillContent = (event) => {
        setNewContent(event.target.value);
    }

    const handleUpdatePost = async () => {
        if (error !== null) {
            const allPosts = JSON.parse(localStorage.getItem('pendingPosts'));
            const updatedPosts = [...allPosts]; // Copy the existing posts to update

            const profileIndex = updatedPosts.findIndex(post => post.profileId == profileId);

            if (profileIndex !== -1) {
                // Profile found, find the post to update by its ID
                const postIndex = updatedPosts[profileIndex].posts.findIndex(post => post.id == postId);

                if (postIndex !== -1) {
                    // Post found, update its title and content
                    updatedPosts[profileIndex].posts[postIndex].title = newTitle;
                    updatedPosts[profileIndex].posts[postIndex].content = newContent;

                    // Update local storage with updated posts
                    localStorage.setItem('pendingPosts', JSON.stringify(updatedPosts));


                    // Clear input fields after updating the post
                    setNewTitle("");
                    setNewContent("");

                    console.log("Post updated successfully");
                } else {
                    console.error('Post not found for update');
                }
            } else {
                console.error('Profile not found for update');
            }
        } else {
            try {
                const token = localStorage.getItem('token');
                console.log(token);
                const response = await fetch(`/api/posts/update/${profileId}/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: token, element: { title: newTitle, content: newContent } })
                });
                if (response.ok) {
                    console.log('Post updated successfully');
                    setNewTitle("");
                    setNewContent("");
                } else {
                    console.error('Failed to update post:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating post:', error);
            }
        }
    };

    return (
        <div>
            <header>Updating</header>
            <label>
                Title: <input value={newTitle} onChange={FillTitle} />
            </label>
            <br></br>
            <label>
                Content: <input value={newContent} onChange={FillContent} />
            </label>
            <br></br>
            <button onClick={handleUpdatePost}>Update</button>
        </div>
    );
}

export default UpdatePost;
