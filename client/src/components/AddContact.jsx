import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaAt, FaPhoneFlip, FaRegAddressCard, FaUserPlus } from 'react-icons/fa6';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AddContact() {
    const [values, setValues] = useState({ name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/contactmyst/add-contacts`, values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data?.success) {
                toast.success("Contact added successfully");
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Add contact error', err);
            const serverData = err.response?.data;
            toast.error(serverData?.message || 'Network or server error');
        }
    };

    return (
        <div className="form-container">
            <div className="card form-card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Create Contact</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-icon-wrapper">
                            <FaUserPlus className="input-icon" />
                            <input
                                type="text"
                                placeholder="Enter Name"
                                className="form-control with-icon"
                                name="name"
                                onChange={handleInput}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-icon-wrapper">
                            <FaAt className="input-icon" />
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="form-control with-icon"
                                name="email"
                                onChange={handleInput}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <div className="input-icon-wrapper">
                            <FaPhoneFlip className="input-icon" />
                            <input
                                type="text"
                                placeholder="Enter Phone Number"
                                className="form-control with-icon"
                                name="phone"
                                onChange={handleInput}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <div className="input-icon-wrapper">
                            <FaRegAddressCard className="input-icon" />
                            <input
                                type="text"
                                placeholder="Enter Address"
                                className="form-control with-icon"
                                name="address"
                                onChange={handleInput}
                            />
                        </div>
                    </div>
                    <button className="btn-primary full-width" style={{ marginTop: '1rem' }}>Add Contact</button>
                </form>
            </div>

            <style>{`
                .form-container {
                    display: flex;
                    justify-content: center;
                    padding-top: 2rem;
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
                    top: 50%;
                    transform: translateY(-50%);
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
