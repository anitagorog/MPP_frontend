import React from 'react';

const Details = ({ profiles }) => {
    return (
        <div>
            <ul>
                {profiles.map(profile => (
                    <li key={profile.id}>
                        {profile.id}, {profile.name}, {profile.age}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Details;
