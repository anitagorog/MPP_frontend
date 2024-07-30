import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                setError('Login failed');
                throw new Error('Login failed');
            }

            const data = await response.json();
            const token = data.token;
            localStorage.setItem('token', token);

            let tokenProfiles;
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
                        tokenProfiles = data.profiles;
                        console.log("Login: ", data.profiles);
                        //console.log(tokenProfiles);
                        localStorage.setItem('tokenProfiles', JSON.stringify(data.profiles));
                        onLogin(username, tokenProfiles);
                    })
                    .catch(error => {
                        console.error('Token verification failed', error);
                    });
            }

            //console.log("Now:", tokenProfiles);
            
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                setError('Signup failed');
                throw new Error('Signup failed');
            }

            const data = await response.json();
            const token = data.token;
            localStorage.setItem('token', token);

            let tokenProfiles;
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
                        tokenProfiles = data.profiles;
                        console.log("Login: ", data.profiles);
                        //console.log(tokenProfiles);
                        localStorage.setItem('tokenProfiles', JSON.stringify(data.profiles));
                        onLogin(username, tokenProfiles);
                    })
                    .catch(error => {
                        console.error('Token verification failed', error);
                    });
            }
        } catch (error) {
            console.error('Signup failed', error);
        }
    };

    const ChoseLogin = () => {
        setLogin(true);
    }

    const ChoseSignup = () => {
        setLogin(false);
    }

    return (
        <div>
            { login ? <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4>Log in</h4>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br></br>
                <button type="submit">Log in</button>
                <br></br>
            </form> :
                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h4>Sign up</h4>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <br></br>
                    <button type="submit">Sign up</button>
                    <br></br>
                </form>
            }
            <button onClick={ChoseLogin}>Login</button>
            <button onClick={ChoseSignup}>Sign up</button>

            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;
