import React, { useState, useEffect } from 'react';

const Pagination = ({ profileList }) => {
    const pageSize = 100; // Number of elements per page
    const [currentPage, setCurrentPage] = useState(0); // Current page index
    const [nrOfElements, setNrOfElements] = useState(profileList.length); // Total number of elements
    const [nrPartOfElements, setNrPartOfElements] = useState(0); // Number of elements in current page

    useEffect(() => {
        // Update the total number of elements and reset the current page when the profile list changes
        setNrOfElements(profileList.length);
        setCurrentPage(0);
    }, [profileList]);

    useEffect(() => {
        // Calculate the number of elements in the current page
        const startIndex = currentPage * pageSize;
        const endIndex = Math.min(startIndex + pageSize, profileList.length);
        setNrPartOfElements(endIndex - startIndex);
    }, [currentPage, profileList]);

    const handleNextPage = () => {
        // Go to the next page
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        // Go to the previous page
        setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <br></br>
            <header>Pagination</header>
            <ul>
                {profileList.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(profile => (
                    <li key={profile.id}>
                        {profile.name}, {profile.age}
                    </li>
                ))}
            </ul>
            <label style={{ fontSize: '0.8em' }}>
                Entities: <span>{currentPage * pageSize + 1}</span> - <span>{currentPage * pageSize + nrPartOfElements}</span> out of <span>{nrOfElements}</span>
            </label>
            <br />
            <button onClick={handlePrevPage} disabled={currentPage === 0}>Previous</button>
            <button onClick={handleNextPage} disabled={(currentPage + 1) * pageSize >= nrOfElements}>Next</button>
        </div>
    );
}

export default Pagination;
