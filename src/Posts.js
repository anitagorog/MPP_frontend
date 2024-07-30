// Posts.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Posts = ({ error }) => {
    const { profileId } = useParams();
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        if (error !== null) {
            let allPosts = JSON.parse(localStorage.getItem('pendingPosts')) || [];

            const profile = allPosts.find(profile => profile.profileId == profileId);
            //setPosts(allPosts);

            if (profile) {
                // Extract the posts from the profile and set the state
                setPosts(profile.posts);
            } else {
                // Handle the case when no profile with the specified profileId is found
                console.log('No posts found for Profile ID', profileId);
            }
        }
        else { 
            try {
                    const response = await fetch(`/api/posts/${profileId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPosts(data);
                    } else {
                        console.error('Failed to fetch posts:', response.statusText);
                    }
                
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [profileId]);

    const handleDelete = async (postId) => {
        if (error !== null) {
            const pendingPosts = JSON.parse(localStorage.getItem('pendingPosts')) || [];

            // Filter out the post with the specified ID
            const updatedPosts = pendingPosts.map(profile => ({
                ...profile,
                posts: profile.posts.filter(post => post.id !== parseInt(postId))
            }));

            // Update local storage with the updated posts
            localStorage.setItem('pendingPosts', JSON.stringify(updatedPosts));

            // Fetch posts to reflect the changes
            fetchPosts();
        }
        else {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/posts/delete/${profileId}/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: token })
                });
                if (response.ok) {
                    console.log('Post deleted successfully');
                    fetchPosts();
                } else {
                    console.error('Failed to delete post:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <div>
            <h3>Posts for profile with id: {profileId}</h3>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <h4>{post.title}</h4>
                        <p>{post.content}</p>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                        <Link to={`/posts/update/${profileId}/${post.id}`}>
                            <button>Update Post</button>
                        </Link>
                    </li>
                ))}
            </ul>
            
        </div>
    );
};

export default Posts;
