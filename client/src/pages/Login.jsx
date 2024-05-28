import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from '../components/Validation'
import '../assets/css/form.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../App';

export default function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const{user, setUser}=useContext(UserContext)
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
       if( errs.email ===" " && errs.password === " ")
             axios.post('http://127.0.0.1:3000/contactmyst/login', values)
          .then(res=>{ 
            if(res.data.success){

            toast.success("Login successfully", {
                position: "top-right",
                autoClose: 5000
            })
           localStorage.setItem("token",res.data.token)
           setUser(res.data.user)
            navigate('/dashboard')
        } 
        }).catch (err=>{
          console.log(err)
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