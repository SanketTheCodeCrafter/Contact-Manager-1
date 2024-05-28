import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from '../components/Validation'
import '../assets/css/form.css';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function Register() {
    const [values, setValues] = useState({ name: '', email: '', password: '' });
    const [errors,setErrors] =useState({})
    const [serverErrors, setServerErrors] = useState([]);
    const navigate =useNavigate()
    const handleInput = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
       const errs= Validation(values)
       setErrors(errs);
       if(errs.name=== " "&& errs.email ===" " && errs.password === " ")
             axios.post('http://127.0.0.1:3000/contactmyst/register', values)
          .then(res=>{ 
            if(res.data.success){

            toast.success("Account created successfully", {
                position: "top-right",
                autoClose: 5000
            })
            navigate('/login')
        }
        }).catch (err=>{
            if(err.response.data.errors){
                setServerErrors( err.response.data.errors)
            } 
            else
           {
                
             console.log(err)
            }
        })
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <div className="form-group">
                    <label htmlFor='name' className="label">Name:</label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        className="form-control"
                        name="name"
                        onChange={handleInput}
                    />
                    {errors.name && <span className='errors'>{errors.name}</span>}
                </div>
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
                <button className="form-btn">Register</button>
                <p>Already Registered? <Link to='/login'>Login</Link></p>
            </form>
        </div>
    );
}
