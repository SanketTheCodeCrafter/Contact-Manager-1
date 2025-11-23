import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaAt, FaPhoneFlip, FaRegAddressCard, FaUserPlus } from 'react-icons/fa6';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EditContact() {
    const [values, setValues] = useState({ name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate();
    const { id } = useParams();

    const handleInput = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${API_BASE}/contactmyst/update-contacts/${id}`, values, {
                headers: getAuthHeaders()
            });
            const data = res.data;
            if (data?.success) {
                toast.success("Contact Updated Successfully");
                navigate('/dashboard');
            } else {
                toast.error(data?.message || 'Failed to update contact');
            }
        } catch (err) {
            console.error('Update contact error', err);
            const serverData = err.response?.data;
            toast.error(serverData?.message || 'Network or server error while updating');
        }
    };

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await axios.get(`${API_BASE}/contactmyst/contacts/${id}`, {
                    headers: getAuthHeaders()
                });
                const data = res.data;
                if (data?.success && data?.contact) {
                    setValues({
                        name: data.contact.name || '',
                        email: data.contact.email || '',
                        phone: data.contact.phone || '',
                        address: data.contact.address || ''
                    });
                } else if (data?.name || data?.email) {
                    setValues({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        address: data.address || ''
                    });
                } else {
                    toast.error(data?.message || 'Failed to load contact');
                }
            } catch (err) {
                console.error('Fetch contact error', err);
                toast.error(err.response?.data?.message || 'Network or server error while fetching contact');
            }
        };

        if (id) fetchContact();
    }, [id]);

    return (
        <div className="form-container">
            <div className="card form-card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Edit Contact</h2>
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
                                value={values.name}
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
                                value={values.email}
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
                                value={values.phone}
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
                                value={values.address}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary full-width" style={{ marginTop: '1rem' }}>Update Contact</button>
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