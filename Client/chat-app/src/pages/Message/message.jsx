import React ,{useState,useEffect} from 'react';
import io from 'socket.io-client';
import {useParams} from 'react-router-dom';
import axios from 'axios';

const socket = io('http://localhost:7000',{
    withCredentials:true,
});

const MessagePage = ()=>{
    const {userId:toUserId} = useParams();
    const [messages,setMessages] = useState([]);
    const [input,setInput] = useState('');
    const [isConnected , setIsConnected ] = useState(false);
    const [error,setError]= useState('');

    useEffect (()=>{
        const currentUserId = sessionStorage.getItem('userId');
        const token = sessionStorage.getItem('token');
        if(currentUserId){
            socket.emit('register-user',currentUserId,toUserId);
            const checkConnection = ()=>{
                axios.get(
                    `http://localhost:7000/api/user/check-connection/${currentUserId}/${toUserId}`,{
                        headers:{
                            Authorization:`Bearer ${token}`,
                        },
                    }
                ).then((response)=>{
                    setIsConnected(response.data.connected);
                })
                .catch((err)=>{
                    setError('Error checking connection');
                });
            };

            checkConnection();
            socket.on('private-message',({message,from})=>{
                if(from === toUserId){
                    setMessages((prevMessages)=>[...prevMessages,{message,from}]);
                }
            });

            socket.on('update-user-status',({userId,status})=>{
                if(userId===toUserId){
                    setIsConnected(status);
                }
            });
            socket.on('out',({userId,status})=>{
                if(userId === toUserId){
                    setIsConnected(status);
                }
            });

            return ()=>{
                socket.emit('out',{userId:currentUserId,toUserId:toUserId});
                socket.off('private-message');
                socket.off('update-user-status');
                socket.off('out');
            };
        }
    },[toUserId]);

    const sendMessage = ()=>{
        const currentUserId = sessionStorage.getItem('userId');
        if(input.trim() && currentUserId && isConnected){
            socket.emit('private-message',{message:input,to:toUserId,from:currentUserId});
            setMessages((prevMessages)=>[...prevMessages,{message:input,from:"Me"}]);
            setInput('');
        }else if(!isConnected){
            setError('User is not connected');
        }
    };

    return(
        <div>
            <div>
                {messages.map((msg,index)=>(
                    <p key={index}>
                        <strong>{msg.from}</strong>{msg.message}
                    </p>
                ))}
            </div>
            {error && <p style={{color:'red'}}>{error}</p>}
            <input
             type="text"
             value={input}
             onChange={(e)=>setInput(e.target.value)}
             placeholder='Type a message ...'
            />

            {isConnected?(
                <button onClick={sendMessage}>Send</button>
            ):(
                <p>You are not connected with this user</p>
            )}
        </div>
    );
};

export default MessagePage;