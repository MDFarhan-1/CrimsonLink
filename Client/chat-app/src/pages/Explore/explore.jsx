import axios from 'axios';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './explore.css'; // Make sure to import your CSS file

const Explore = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:7000/api/user/explore', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.error('Error occurred while fetching the users:', err);
                setError('Failed to load users. Please try again.');
            }
        };
        fetchUsers();
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/message/${userId}`);
    }

    return (
        <div>
            <h2>Users Currently Logged In</h2>
            {error && <p className="error">{error}</p>}
            <div className="user-list">
                {users.length ? (
                    users.map(user => (
                        <div className="user-card" key={user._id} onClick={() => handleUserClick(user._id)}>
                            <img src={user.profilePic} alt={`${user.username}'s profile`} className="profile-pic" />
                            <h3 className="username">{user.username}</h3>
                            <button className="message-button">Message</button>
                        </div>
                    ))
                ) : (
                    <div className="no-users">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default Explore;
