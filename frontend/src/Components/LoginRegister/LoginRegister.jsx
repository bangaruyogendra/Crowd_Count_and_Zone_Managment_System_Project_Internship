import { FaUser } from "react-icons/fa";
import React,{useState,useEffect} from 'react';
import { FaLock } from "react-icons/fa";
import './LoginRegister.css'
import { IoIosMail } from "react-icons/io";
import axios from "axios";
import UserManagment from '../pages/User_Managment';
import PasswordReset from "./PasswordReset";
import { useNavigate } from "react-router-dom";


const LoginRegister = () => {

    const [action,setAction] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const registerLink =()=>{
        setAction('active')
    }
    const loginLink = () =>{
        setAction('');
    }
    const navigate = useNavigate();

    const handlePasswordReset = () => {
       navigate("/password-reset");
    };

    const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    });

    const handleChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleLogin = async(e)=>{
         e.preventDefault();
        try{
            const res = await axios.post("http://127.0.0.1:8000/api/login/",{
                username :formData.username,
                password :formData.password,
            });

            alert(res.data.message);
            setIsLoggedIn(true);
            localStorage.setItem("loginTime", Date.now());
         
        }
        catch(error){
            alert(error.response.data.error || "Login faild")
        }
    }
    

    const handleRegister = async (e) => {
    e.preventDefault();
         try {
                const res = await axios.post("http://127.0.0.1:8000/api/register/", formData);
                alert(res.data.message);
                
                setFormData({
                   username: "",
                   email: "",
                   password: "",
                });
                setAction("");
         
            } catch (error) {
              alert(error.response?.data?.error || "Registration failed");
           }
    };
    
    useEffect(()=>{
      const clearSession = setInterval(()=>{
        const loginTime = localStorage.getItem["loginTime"]
        if (loginTime) {
            const timePassed = Date.now() - parseInt(loginTime);
            const limit = 10 * 60 * 1000;
            if (timePassed> limit){
                alert("Session expired. Please log in again.");
                localStorage.removeItem("loginTime");
                setIsLoggedIn(false);
            }
        }
      },60000);

      return ()=> clearInterval(clearSession);
           
    },[])
    
     if (isLoggedIn) {
         return <UserManagment/>;
     }

    return (
       <div className={`wrapper ${action}`}>
        <div className ="form-box login">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type = 'text' name = 'username' placeholder = 'Username' required onChange={handleChange} />
                    <FaUser className = 'icon' />
                </div>
                <div className="input-box">
                    <input type = 'password' name = 'password' placeholder = 'Password' required onChange={handleChange}/>
                    <FaLock className = 'icon' />
                </div>
                <div className="remember-forget">
                    <label><input type = 'checkbox'/> Remember me</label>
                     <a href="#" onClick={handlePasswordReset}>
                        Forget password?
                    </a>
                </div>
                <button type = 'submit'>Login</button>
                <div className="register-link">
                    <p>Don't have account? <a onClick = {registerLink}>Register</a></p>
                </div>
            </form>
        </div>

        <div className ="form-box register">
            <form onSubmit = {handleRegister}>
                <h1>Registration</h1>
                <div className="input-box">
                    <input type = 'text' name = 'username' placeholder = 'Username' required onChange={handleChange}/>
                    <FaUser className = 'icon' />
                </div>

                <div className="input-box">
                    <input type = 'email' name = 'email' placeholder = 'Email' required onChange={handleChange}/>
                    <IoIosMail className = 'icon' />
                </div>

                <div className="input-box">
                    <input type = 'password' name = 'password' placeholder = 'Password' required onChange={handleChange}/>
                    <FaLock className = 'icon' />
                </div>

                <div className="remember-forget">
                    <label><input type = 'checkbox'/> I agree terms & conditions </label>
                
                </div>

                <button type = 'submit'>Register</button>
                <div className="register-link">
                    <p>Already have an account? <a href ="#" onClick = {loginLink}>Login</a></p>
                </div>
            </form>
        </div>
        
       </div>
    );
};

export default LoginRegister;