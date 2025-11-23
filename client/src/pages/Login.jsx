import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from '../components/Validation'
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../App';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const { setUser } = useContext(UserContext)
    const [errors, setErrors] = useState({})
    const [serverErrors, setServerErrors] = useState([]);
    const navigate = useNavigate()
    
    const handleInput = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = Validation(values)
        setErrors(errs);
        if (errs.email === " " && errs.password === " ") {
            try {
                const res = await axios.post(`${API_BASE}/contactmyst/login`, values)
                if (res.data?.success) {
                    toast.success("Login successfully")
                    localStorage.setItem("token", res.data.token)
                    setUser(res.data.user)
                    navigate('/dashboard')
                }
            } catch (err) {
                console.log('Login error', err.message, err);
                const serverData = err.response?.data
                if (serverData?.errors) {
                    setServerErrors(serverData.errors)
                } else {
                    toast.error(serverData?.message || 'Network or server error')
                }
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Welcome Back</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor='email' className="form-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="form-control"
                            name="email"
                            onChange={handleInput}
                        />
                        {errors.email && <span className='error-text'>{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor='password' className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="form-control"
                            name="password"
                            onChange={handleInput}
                        />
                        {errors.password && <span className='error-text'>{errors.password}</span>}
                    </div>

                    {serverErrors.length > 0 && (
                        <div className="server-errors">
                            {serverErrors.map((error, index) => (
                                <p className='error-text' key={index}>{error.msg}</p>
                            ))}
                        </div>
                    )}

                    <button className="btn-primary full-width" style={{ marginTop: '1rem' }}>Login</button>
                    
                    <p className="text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to='/register'>Register</Link>
                    </p>
                </form>
            </div>

            <style>{`
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                }
                .auth-card {
                    width: 100%;
                    max-width: 450px;
                }
                .error-text {
                    color: var(--error);
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }
                .server-errors {
                    background-color: rgba(239, 68, 68, 0.1);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    margin-bottom: 1rem;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .full-width {
                    width: 100%;
                }
            `}</style>
        </div>
    );
}