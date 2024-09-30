import React , {useState} from 'react';
import "./register.css";
import axios from "axios";
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Register(){
    const navigate = useNavigate();
    const [file,setFile] = useState("");
    const [info,setInfo] = useState({});

    const handleChange = (e) =>{
        setInfo((prev)=>({...prev,[e.target.id]:e.target.value}));
    }
    const handleClick = async(e)=>{
        e.preventDefault();
        if(file){
            const data=new FormData();
            data.append("file",file);
            data.append("upload_preset","upload");
            
            try{
                const uploadRes = await axios.post(
                    "my api cloudinary api link",
                    data,{withCredentials:false}
                );
                const {url} = uploadRes.data;
                const newUser ={
                    ...info,
                    profilePicture:url,
                }
                await axios.post("http://localhost:7000/api/user/register",newUser,{withCredentials:false})
                .then(alert(res=>res.data.message))
                navigate("/login");
            }catch(err){
                console.log(err);
            }
        }else{
            try{
                await axios.post("http://localhost:7000/api/user/register",info,{withCredentials:false})
                .then(alert(res=>res.data.message))
                navigate("/login");
            }catch(err){
                console.log(err);
            }
        }
    };

    return(
        <div className='register'> {/*className=register*/}
            <div className='registerCard'> {/*className=registerCard*/}
                <div className='center'> {/*className=center*/}
                    <h1>Let's start with personalize chatting!!!</h1>
                    <form>
                        <div className='image'> {/*className=image*/}
                           <img src={file? URL.createObjectURL(file):"https://icon-library.com/images/no-image-icon-0.jpg"} alt="" height="100px"/>
                            <div className='txt_field_img'>{/*className=txt_field_img*/}
                                <label htmlFor='file'> 
                                        Image
                                </label>
                                <input type="file" id="file" onChange={(e)=>setFile(e.target.files[0])} style={{display:"none"}}/>
                            </div>
                        </div>
                        <div className='formInput'>{/*className=formInput*/}
                            <div className='txt_field'>{/*className=txt_field*/}
                                <input
                                  type="text"
                                  placeholder='username'
                                  name="username"
                                  onChange={handleChange}
                                  id="username"
                                  required
                                />
                            </div>
                            <div className='txt_field'>{/*className=txt_field*/}
                                <input
                                  type="email"
                                  placeholder='email'
                                  name="email"
                                  onChange={handleChange}
                                  id="email"
                                  required
                                />
                            </div>
                            <div className='txt_field'>{/*className=txt_field*/}
                                <input
                                  type="password"
                                  placeholder='password'
                                  name="password"
                                  onChange={handleChange}
                                  id="password"
                                  required
                                />
                            </div>
                        </div>
                        <div className='login_button'>{/*className=login_button*/}
                                <button className='button' onClick={handleClick}>{/*className=button*/}
                                    Register
                                </button>
                        </div>
                        <div className='signup_link'>{/*className=signup_link*/}
                            <p>
                                Already Registered? <Link to="/login">login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;