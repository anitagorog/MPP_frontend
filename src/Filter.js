import React from 'react';
import { useState, useEffect } from 'react';

const API_URL = '/api/data';

const Filter = ({ filteredList }) => {

    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState("");
    const [profiles, setProfiles] = useState(filteredList);

    const fetchProfilesFilter = async (searchText, age, pageNumber) => {
        try {
            const response = await fetch(`${API_URL}?searchText=${searchText}&age=${age}&pageNumber=${pageNumber}`);

            if (!response.ok) {
                throw new Error('Failed to fetch filtered profiles');
            }
            const data = await response.json();
            setProfiles(data);
        } catch (error) {
            console.error('Error fetching filtered profiles:', error);
            
        }
    };


    useEffect(() => {
        setProfiles(filteredList); // Update profiles state when filteredList prop changes
    }, [filteredList]);

    const FillName = (event) => {
        setNewName(event.target.value);
    }

    const FillAge = (event) => {
        setNewAge(event.target.value);
    }

    /*const handleFilterPerson = () => {
        let newProfiles;

        if (newName === "" && newAge === "") {
            newProfiles = filteredList;
        }
        else if (newName === "") {
            newProfiles = filteredList.filter(profile => {
                return parseInt(profile.age) === parseInt(newAge);
            });
        }
        else if (newAge === "") {
            newProfiles = filteredList.filter(profile => {
                return profile.name === newName;
            });
        }
        else {
            newProfiles = filteredList.filter(profile => {
                return profile.name === newName && parseInt(profile.age) === parseInt(newAge);
            });
        }
        setProfiles(newProfiles);
        // Clear input fields 
        setNewName("");
        setNewAge("");
    }*/

    const handleFilterPerson = () => {
        // Call fetchProfilesFilter to fetch filtered data
        fetchProfilesFilter(newName, newAge, 1); 

        // Clear input fields 
        setNewName("");
        setNewAge("");
    }


    return (
        <div>
            <header>Filtering</header>
            
            <label>
                By name: <input value={newName} onChange={FillName} />
            </label>
            <br></br>
            <label>
                By age: <input value={newAge} onChange={FillAge} />
            </label>
            <br></br>
            <button onClick={handleFilterPerson}>Filter</button>

            <ul>
                {profiles.map(profile => (
                    <li key={profile.id}>
                        {profile.name}, {profile.age}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Filter;
