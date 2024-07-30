import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Add from './Add.js';
import Delete from './Delete.js'
import Update from './Update';
import Filter from './Filter.js';
import Statistics from './Statistics.js';
import Home from './Home';
import Pagination from './Pagination';
import Details from './Details';
import Posts from './Posts'; 
import AddPost from './AddPost';
import UpdatePost from './UpdatePost'
import Login from './Login'


const API_URL = '/api/data';
const WEBSOCKET_URL = 'ws://localhost:5000'; 

const initialProfiles = [
    /*{ name: 'Jane Smith', id: 1, age: 20 },
    { name: 'Tom Denem', id: 2, age: 22 }*/
];

function App() {
    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState("");
    const [profiles, setProfiles] = useState(initialProfiles);
    const [idToDelete, setDeleteId] = useState("");
    const [idToUpdate, setUpdateId] = useState("");
    const [newNameUpdate, setNewNameUpdate] = useState("");
    const [newAgeUpdate, setNewAgeUpdate] = useState("");

    const [error, setError] = useState(null); 

    const [pageNumber, setPageNumber] = useState(1);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [tokenProfiles, setTokenProfiles] = useState(() => {
        const storedTokenProfiles = localStorage.getItem('tokenProfiles');
        return storedTokenProfiles ? JSON.parse(storedTokenProfiles) : [];
    });

    /*useEffect(() => {
        console.log("Loading profiles from localStorage...");
        const storedProfiles = localStorage.getItem('profiles');
        if (storedProfiles) {
            console.log("Profiles loaded:", JSON.parse(storedProfiles));
            setProfiles(JSON.parse(storedProfiles));
        } else {
            console.log("No profiles found in localStorage. Initializing with initialProfiles.");
            setProfiles(initialProfiles);
        }
    }, []);*/

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Token verification failed');
                    }
                    return response.json();
                })
                .then(data => {
                    setUsername(data.username);
                    setTokenProfiles(data.profiles);
                    console.log(data.username);
                    console.log(data.profiles);
                    //console.log(tokenProfiles);
                    setIsLoggedIn(true);
                    localStorage.setItem('tokenProfiles', JSON.stringify(data.profiles));
                })
                .catch(error => {
                    console.error('Token verification failed', error);
                });
        }

        fetchProfiles();

        //setupWebSocket();
    }, [pageNumber]);

    useEffect(() => {
        /*const storedTokenProfiles = localStorage.getItem('tokenProfiles');
        if (storedTokenProfiles) {
            setTokenProfiles(JSON.parse(storedTokenProfiles));
        }
        else {
            setTokenProfiles([]);
        }*/

        window.addEventListener("scroll", handleScroll);
    }, []);

    const handleScroll = () => {
        // console.log("Height: ", document.documentElement.scrollHeight);
        // console.log("Top: ", document.documentElement.scrollTop);
        // console.log("Window: ", window.innerHeight);

        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
            setPageNumber(previous => previous + 1);
        }
    }

    const setupWebSocket = () => {
        const ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            fetchProfiles();
            //const newData = JSON.parse(event.data);
            //setProfiles(prevProfiles => [...prevProfiles, newData]); 
        };


        ws.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting...');
            setTimeout(setupWebSocket, 3000); // Attempt to reconnect after 3 seconds
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    const sync = async (datasize) => {
        const pendingProfiles = JSON.parse(localStorage.getItem('pendingProfiles')) || [];
        if (pendingProfiles.length > 0) {
            //alert(pendingProfiles.length);
            for (const profile of pendingProfiles) {
                //alert('for');
                // Send pending profiles to the server
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(profile),
                });

                if (!response.ok) {
                    throw new Error('Failed to sync pending profile with server');
                }

                // Find corresponding posts for the current profile
                const pendingPosts = JSON.parse(localStorage.getItem('pendingPosts')) || [];
                const profilePosts = pendingPosts.find(post => post.profileId == profile.id);
                if (profilePosts) {
                    //alert('ifpost')
                    for (const post of profilePosts.posts) {
                        //alert('forpost')
                        const newProfileId = datasize + pendingProfiles.indexOf(profile) + 1;


                        //alert(profiles.length);
                        //alert(datasize);
                        // alert(pendingProfiles.indexOf(profile));

                        // Send post to server
                        const postResponse = await fetch(`/api/posts/${newProfileId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ title: post.title, content: post.content }),
                        });

                        if (!postResponse.ok) {
                            throw new Error('Failed to sync pending post with server');
                        }
                    }
                }
            }
            alert('sync');
            // Clear pending profiles from localStorage
            localStorage.removeItem('pendingPosts');

            // Clear pending profiles from localStorage
            localStorage.removeItem('pendingProfiles');
        }

    }

    const fetchProfiles = async () => {
        let internetError = null;
        let serverError = null;
        let datasize = 0;

        try {
            // Check if the internet connection is available
            try {
                const internetCheckResponse = await fetch('https://8.8.8.8', { mode: 'no-cors' });
            } catch (error) {
                internetError = 'No internet connection';
            }

            // Check if the server connection is available
            try {
                const response = await fetch(`${API_URL}?pageNumber=${pageNumber}`);
                if (!response.ok) {
                    serverError = 'The server is unreachable.';
                }
                else if (internetError == null) {
                    //const data = await response.json();
                    //setProfiles(data);
                    //datasize = data.length;


                    /*const response = await fetch(`${API_URL}?pageNumber=1`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch profiles');
                    }
                    let data = await response.json();
                    // Combine the data from all pages into a single array
                    let allData = [...data];
                    let pageNumber = 2;
                    while (data.length === 100) {
                        const nextPageResponse = await fetch(`${API_URL}?pageNumber=${pageNumber}`);
                        if (!nextPageResponse.ok) {
                            throw new Error('Failed to fetch profiles from page ' + pageNumber);
                        }
                        data = await nextPageResponse.json();
                        allData = [...allData, ...data];
                        pageNumber++;
                    }
                    setProfiles(allData);
                    datasize = allData.length;
                    setError(null); // Clear any previous errors*/

                    try {
                        const data = await response.json();
                        let allData = profiles;
                        //const filteredData = data.filter(profile => tokenProfiles.includes(profile.id));
                     
                        //console.log("Token: ", tokenProfiles);
                        //console.log("Filtered data: ", filteredData);
                        //console.log("Page:", pageNumber);
                        //console.log(isLoggedIn);
                        //allData = [...allData, ...filteredData];
                        allData = [...allData, ...data];
                        setProfiles(allData);

                        const responseCount = await fetch(`/api/count`);
                        if (responseCount.ok) {
                            const responseSize = await responseCount.json();
                            datasize = responseSize.count;
                        } else {
                            console.error(`Failed to fetch count for Profiles: `, responseCount.statusText);
                        }
                        setError(null);

                        if (profiles.length === 0 && tokenProfiles.length !== 0) {
                            setPageNumber(previous => previous + 1);
                        }

                        //await sync(datasize);
                    } catch (error) {
                        console.error('Error fetching profiles:', error);
                        setError('Error: ' + error.message);
                    }
                }
            } catch (error) {
                console.log('Error with server:', error);
            }

            if (internetError || serverError)
                //localStorage.removeItem('pendingPosts');
                setProfiles(JSON.parse(localStorage.getItem('pendingProfiles')) || []);
            else {
                try {
                    //alert("syncbefore");
                    //await sync(datasize);

                    //alert("before");

                    const token = localStorage.getItem('token');
                    const pendingProfiles = JSON.parse(localStorage.getItem('pendingProfiles')) || [];
                    localStorage.removeItem('pendingProfiles');
                    if (pendingProfiles.length > 0) {
                        //alert(pendingProfiles.length);
                        for (const profile of pendingProfiles) {
                            //alert('for');
                            // Send pending profiles to the server
                            const response = await fetch(API_URL, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ token: token, newItem: profile }),
                            });

                            if (!response.ok) {
                                const errorText = await response.text(); // Capture the response text for debugging
                                throw new Error(`Failed to sync pending profile with server: ${response.status} ${response.statusText} - ${errorText}`);

                            }

                            // Find corresponding posts for the current profile
                            const pendingPosts = JSON.parse(localStorage.getItem('pendingPosts')) || [];
                            
                            localStorage.removeItem('pendingPosts');
                            const profilePosts = pendingPosts.find(post => post.profileId == profile.id);
                            if (profilePosts) {
                                //alert('ifpost')
                                for (const post of profilePosts.posts) {
                                    //alert('forpost')
                                    const newProfileId = datasize + pendingProfiles.indexOf(profile) + 1;


                                    //alert(profiles.length);
                                    //alert(datasize);
                                    // alert(pendingProfiles.indexOf(profile));

                                    // Send post to server
                                    const postResponse = await fetch(`/api/posts/${newProfileId}`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ token: "", element:{ title: post.title, content: post.content }}),
                                    });

                                    if (!postResponse.ok) {
                                        throw new Error('Failed to sync pending post with server');
                                    }
                                }
                            }
                        }
                        alert('sync');
                        // Clear pending profiles from localStorage
                        

                        // Clear pending profiles from localStorage
                        
                    }


                    //alert('remove2');
                    // Clear pending profiles from localStorage
                    //localStorage.removeItem('pendingPosts');

                    // Clear pending profiles from localStorage
                    //localStorage.removeItem('pendingProfiles');

                } catch (error) {
                    console.error('Error syncing pending profiles with server:', error);
                }
            }
        

            if (internetError && serverError) {
                throw new Error(internetError + ' ' + serverError);
            }
            if (internetError) {
                throw new Error(internetError);
            }
            if (serverError) {
                throw new Error(serverError);
            }

            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching profiles:', error);

            setError('Error: ' + error.message);
        }
    };

    const FillName = (event) => {
        setNewName(event.target.value);
    }

    const FillAge = (event) => {
        setNewAge(event.target.value);
    }

    const FillId = (event) => {
        setDeleteId(event.target.value);
    }

    const FillIdUpdate = (event) => {
        setUpdateId(event.target.value);
    }

    const FillNameUpdate = (event) => {
        setNewNameUpdate(event.target.value);
    }

    const FillAgeUpdate = (event) => {
        setNewAgeUpdate(event.target.value);
    }

    /*const handleAddPerson = () => {
        // Add the new person
        const newPerson = { id: profiles.length + 1, name: newName, age: newAge };
        const updatedProfiles = [...profiles, newPerson];
        setProfiles(updatedProfiles);
        // Clear input fields after adding the person
        setNewName("");
        setNewAge("");
        // Save the updated profiles list to localStorage
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    }*/

    const generateUniqueId = () => {
        // Generate a random number
        return Math.floor(Math.random() * 1000) + 500;
    }

    const handleAddPerson = async () => {
        if (error !== null) {
            const pendingProfiles = JSON.parse(localStorage.getItem('pendingProfiles')) || [];
            pendingProfiles.push({ id: generateUniqueId(), name: newName, age: newAge });
            localStorage.setItem('pendingProfiles', JSON.stringify(pendingProfiles));
            fetchProfiles();
            setNewName("");
            setNewAge("");
        }
        else {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found, please login first.');
                    return;
                }

                if (newAge < 10) {
                    throw new Error("Person too young");
                }

                // Make a POST request to add a new entity
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({token: token, newItem: { name: newName, age: newAge } }),
                });

                if (response.ok) {
                    /*try {
                        const data = await response.json();
                        const newToken = data.token;
                        const newTokenProfiles = data.tokenProfiles;
                        console.log(newToken, newTokenProfiles);
                        localStorage.setItem('token', newToken);
                        localStorage.setItem('tokenProfiles', JSON.stringify(newTokenProfiles));
                    } catch (error) {
                        console.error('Error fetching new token:', error);
                        setError('Error: ' + error.message);
                    }*/

                    // If the request is successful, fetch the updated list of profiles
                    await fetchProfiles();
                    // Clear input fields after adding the person
                    setNewName("");
                    setNewAge("");
                } else {
                    console.error('Failed to add person:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding person:', error);
                setError(error.message);
            }
        }
    }

    /*const handleDeletePerson = () => {
        // Filter out the person with the given ID
        const updatedProfiles = profiles.filter(profile => profile.id !== parseInt(idToDelete));
        // Update the state with the filtered array
        setProfiles(updatedProfiles);
        setDeleteId("");
        // Save the updated profiles list to localStorage
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    }*/

    const handleDeletePerson = async () => {
        if (error !== null) {
            const pendingProfiles = JSON.parse(localStorage.getItem('pendingProfiles')) || [];
            const updatedProfiles = pendingProfiles.filter(profile => profile.id !== parseInt(idToDelete));
            localStorage.setItem('pendingProfiles', JSON.stringify(updatedProfiles));

            fetchProfiles();
            setDeleteId("");
        }
        else {
            try {
                // Send DELETE request to the backend
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/${idToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: token })
                });

                if (response.ok) {
                    // If the delete request is successful, update the profiles state by removing the deleted entity
                    fetchProfiles();
                    setDeleteId(""); // Clear the ID input field
                } else {
                    console.error('Failed to delete person:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting person:', error);
            }
        }
    }

    /*const handleUpdatePerson = () => {
        // Create a copy of the profiles array
        const updatedProfiles = profiles.map(profile => {
            // If the ID matches the ID to update, update the name and age
            if (profile.id == idToUpdate) {
                return { ...profile, name: newNameUpdate, age: newAgeUpdate };
            }
            // Otherwise, return the profile as it is
            return profile;
        });

        // Update the state with the modified profiles array
        setProfiles(updatedProfiles);

        setUpdateId("");
        setNewNameUpdate("");
        setNewAgeUpdate("");
        // Save the updated profiles list to localStorage
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    }*/

    const handleUpdatePerson = async () => {
        if (error !== null) {
            const pendingProfiles = JSON.parse(localStorage.getItem('pendingProfiles')) || [];
            const updatedProfiles = pendingProfiles.map(profile => {
                // If the ID matches the ID to update, update the name and age
                if (profile.id == idToUpdate) {
                    return { id:profile.id, name: newNameUpdate, age: newAgeUpdate };
                }
                // Otherwise, return the profile as it is
                return profile;
            });
            console.log(updatedProfiles);
            localStorage.setItem('pendingProfiles', JSON.stringify(updatedProfiles));

            fetchProfiles();
            setUpdateId("");
            setNewNameUpdate("");
            setNewAgeUpdate("");
        }
        else {
            try {
                const token = localStorage.getItem('token');
                // Make a PUT request to update the entity
                const response = await fetch(`${API_URL}/${idToUpdate}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: token, element: { name: newNameUpdate, age: newAgeUpdate } }),
                });

                if (response.ok) {
                    // If the request is successful, fetch the updated list of profiles
                    await fetchProfiles();
                    // Clear input fields after updating the person
                    setUpdateId("");
                    setNewNameUpdate("");
                    setNewAgeUpdate("");
                } else {
                    console.error('Failed to update person:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating person:', error);
            }
        }
    }


    const handleLogin = (user, tokenProfiles) => {
        setIsLoggedIn(true);
        setUsername(user);
        console.log("Login tokens: ", tokenProfiles);
        setTokenProfiles(tokenProfiles);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setTokenProfiles([]);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenProfiles');
        window.location.href = '/';
    };


    if (isLoggedIn) {
        return (
            <div className="App">
                <header className="App-header">

                    <p>Hello {username}</p>
                    <button onClick={handleLogout}>Log out</button>
                    <br></br>

                    {/* Display error message if error state is set */}
                    {error && <p>{error}</p>}

                    <a href="/home">Home</a>
                    <a href="/details">Details</a>
                    <a href="/add">Add a new entity</a>
                    <a href="/delete">Delete an entity</a>
                    <a href="/update">Update an entity</a>
                    <a href="/filter">Filter an entity</a>
                    <a href="/statistics">Statistics</a>
                    <a href="/pagination">Pagination</a>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<div>Welcome to this page! Choose a menu item.</div>} />
                            <Route path='/home' element={<Home profiles={profiles} error={error} />} />
                            <Route path='/details' element={<Details profiles={profiles} />} />
                            <Route path='/add' element={<Add FillName={FillName} FillAge={FillAge} handleAddPerson={handleAddPerson} newName={newName} newAge={newAge} />} />
                            <Route path='/delete' element={<Delete FillId={FillId} handleDeletePerson={handleDeletePerson} idToDelete={idToDelete} />} />
                            <Route path='/update' element={<Update FillIdUpdate={FillIdUpdate} FillNameUpdate={FillNameUpdate} FillAgeUpdate={FillAgeUpdate} handleUpdatePerson={handleUpdatePerson} idToUpdate={idToUpdate} newNameUpdate={newNameUpdate} newAgeUpdate={newAgeUpdate} />} />
                            <Route path='/filter' element={<Filter filteredList={profiles} />} />
                            <Route path='/statistics' element={<Statistics filteredList={profiles} />} />
                            <Route path='/pagination' element={<Pagination profileList={profiles} />} />
                            <Route path="/posts/:profileId" element={<Posts error={error} />} />
                            <Route path="/posts/add/:profileId" element={<AddPost error={error} />} />
                            <Route path="/posts/update/:profileId/:postId" element={<UpdatePost error={error} />} />
                        </Routes>
                    </BrowserRouter>

                   

                </header>
            </div>
        );
    }
    else {
        return (
            <div className="App">
                <header className="App-header">

                    <Login onLogin={handleLogin}></Login>

                </header>
            </div>
        );
    }
}

export default App;
