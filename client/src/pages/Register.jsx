import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from '../components/Validation';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
    const [values, setValues] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = Validation(values);
        setErrors(errs);
        if (errs.name === " " && errs.email === " " && errs.password === " ") {
            try {
                const res = await axios.post(`${API_BASE}/contactmyst/register`, values);
                if (res.data?.success) {
                    toast.success("Account created successfully");
                    navigate('/login');
                }
            } catch (err) {
                console.log('Register error', err);
                const serverData = err.response?.data;
                if (serverData?.errors) {
                    setServerErrors(serverData.errors);
                } else {
                    toast.error(serverData?.message || 'Network or server error');
                }
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Create Account</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor='name' className="form-label">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="form-control"
                            name="name"
                            onChange={handleInput}
                        />
                        {errors.name && <span className='error-text'>{errors.name}</span>}
                    </div>

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
                            placeholder="Create a password"
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

                    <button className="btn-primary full-width" style={{ marginTop: '1rem' }}>Register</button>

                    <p className="text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                        Already have an account? <Link to='/login'>Login</Link>
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
