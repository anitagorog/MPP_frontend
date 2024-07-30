import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = ({ profiles, error }) => {
    const [postsCounts, setPostsCounts] = useState({});

    useEffect(() => {
        // Fetch posts counts for each profile
        profiles.forEach(profile => {
            fetchPosts(profile.id);
        });
    }, [profiles]);

    const fetchPosts = async (profileId) => {
        if (error !== null) {
            let allPosts = JSON.parse(localStorage.getItem('pendingPosts')) || [];

            const profile = allPosts.find(profile => profile.profileId == profileId);
            if (profile) {
                // Extract the posts from the profile
                const posts = profile.posts;
                // Count the number of posts
                const postCount = posts.length;
                console.log('Posts found for Profile ID', profileId, ':', posts);
                console.log('Number of Posts:', postCount);
                setPostsCounts(prevCounts => ({
                    ...prevCounts,
                    [profileId]: postCount
                }));
            } else {
                // Handle the case when no profile with the specified profileId is found
                console.log('No posts found for Profile ID', profileId);
                setPostsCounts(prevCounts => ({
                    ...prevCounts,
                    [profileId]: 0
                }));
            }
        }
        else {
            try {
                const response = await fetch(`/api/posts/count/${profileId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Update postsCounts state with the count of posts for the profile
                    setPostsCounts(prevCounts => ({
                        ...prevCounts,
                        [profileId]: data.count
                    }));
                } else {
                    console.error(`Failed to fetch posts count for Profile ID ${profileId}:`, response.statusText);
                }
            } catch (error) {
                console.error(`Error fetching posts count for Profile ID ${profileId}:`, error);
            }
        }
    };

    return (
        <div>
            <h3>Profiles</h3>
            <ul>
                {profiles.map(profile => (
                    <li key={profile.id}>
                        {profile.name}, {profile.age},
                        <span>     Number of Posts: {postsCounts[profile.id] || 0}     </span>
                        <Link to={`/posts/${profile.id}`}>
                            <button>View Posts</button>
                        </Link>
                        <Link to={`/posts/add/${profile.id}`}>
                            <button>Add Posts</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
