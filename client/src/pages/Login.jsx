import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from '../components/Validation'
import '../assets/css/form.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../App';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const{user, setUser}=useContext(UserContext)
    const [errors,setErrors] =useState({})
    const [serverErrors, setServerErrors] = useState([]);
    const navigate =useNavigate()
    const handleInput = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       const errs= Validation(values)
       setErrors(errs);
       if( errs.email ===" " && errs.password === " ") {
          try {
            const res = await axios.post(`${API_BASE}/contactmyst/login`, values)
            if(res.data?.success){
                toast.success("Login successfully", { position: "top-right", autoClose: 5000 })
                localStorage.setItem("token",res.data.token)
                setUser(res.data.user)
                navigate('/dashboard')
            }
          } catch (err) {
            console.log('Login error', err.message, err);
            const serverData = err.response?.data
            if (serverData?.errors) {
              setServerErrors(serverData.errors)
            } else {
              // show friendly message in UI or toast
              toast.error(serverData?.message || 'Network or server error')
            }
          }
       }
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Login</h2>
             
                <div className="form-group">
                    <label htmlFor='email' className="label">Email:</label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="form-control"
                        name="email"
                        onChange={handleInput}
                    />
                    {errors.email && <span className='errors'>{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor='password' className="label">Password:</label>
                    <input
                        type="password"
                        placeholder="********"
                        className="form-control"
                        name="password"
                        onChange={handleInput}
                    />
                    </div>
                    {
                    serverErrors.length>0 && 
                    ( serverErrors.map((error,index)=>
                    (
                        <p className='error' key={index}>{error.msg}</p>
                   ) )
                )
                }
                <button className="form-btn">Login</button>
                <p> Dont have Account? <Link to='/register'>Register</Link></p>
            </form>
        </div>
    );
}