import axios from 'axios'
import {useNavigate} from "react-router-dom"
import React,{useState,useEffect} from 'react'

const Explore = ()=>{
    const [users,setUsers] = useState([]);
    const [error,setError] = useState(null);
    const navigate=useNavigate();

    useEffect(()=>{
        const fetchUsers = async()=>{
            try{
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:7000/api/user/explore',{
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            }catch(err){
                console.error('Error occurred while fetching the users:', err);
                setError('Failed to load users. Please try again.');
            }
        };
        fetchUsers();
    },[]);

    const handleUserClick = (userId)=>{
        navigate(`/message/${userId}`);
    }

    return (
        <div>
            <h2>Users Currently Logged In</h2>
            {error && <p style={{color:'red'}}>{error}</p>}
            <ul>
                {users.length ? (
                    users.map(user=>(
                        <li key={user._id}>
                            {user.username}
                            <button onClick={()=>handleUserClick(user._id)}>Message</button>
                        </li>
                    ))
                ):(
                    <li>No users found.</li>
                )}
            </ul>
        </div>
    );
};

export default Explore;