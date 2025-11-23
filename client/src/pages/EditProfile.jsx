import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../App';
import { FaUser, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EditProfile() {
    const { user, setUser } = useContext(UserContext);
    const [values, setValues] = useState({ name: '', email: '', about: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setValues({
                name: user.name || '',
                email: user.email || '',
                about: user.about || ''
            });
        }
    }, [user]);

    const handleInput = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_BASE}/contactmyst/update-profile`, values, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.success) {
                toast.success("Profile updated successfully");
                setUser(res.data.user);
                navigate('/profile');
            }
        } catch (err) {
            console.error('Update profile error', err);
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="form-container">
            <div className="card form-card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-icon-wrapper">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                className="form-control with-icon"
                                name="name"
                                value={values.name}
                                onChange={handleInput}
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-icon-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                className="form-control with-icon"
                                name="email"
                                value={values.email}
                                onChange={handleInput}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">About</label>
                        <div className="input-icon-wrapper">
                            <FaInfoCircle className="input-icon" />
                            <textarea
                                className="form-control with-icon"
                                name="about"
                                value={values.about}
                                onChange={handleInput}
                                placeholder="Tell us about yourself"
                                rows="3"
                                style={{ paddingLeft: '2.5rem', resize: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button type="button" onClick={() => navigate('/profile')} className="btn-secondary full-width">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary full-width">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-container {
                    display: flex;
                    justify-content: center;
                    padding-top: 2rem;
                    animation: fadeIn 0.5s ease-out;
                }
                .form-card {
                    width: 100%;
                    max-width: 500px;
                }
                .input-icon-wrapper {
                    position: relative;
                }
                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 1rem; /* Adjusted for textarea alignment */
                    color: var(--text-muted);
                    z-index: 1;
                }
                .form-control.with-icon {
                    padding-left: 2.5rem;
                }
                .full-width {
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
