import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/form.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaAt, FaPhoneFlip, FaRegAddressCard, FaUserPlus } from 'react-icons/fa6';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AddContact() {
    const [values, setValues] = useState({ name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate(); // Correctly call the useNavigate hook

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
                toast.success("Contact added successfully", {
                    position: "top-right",
                    autoClose: 5000
                });
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Add contact error', err);
            const serverData = err.response?.data;
            toast.error(serverData?.message || 'Network or server error');
        }
    };

    return (
        <div className="add-form-container">
            <form className="add-form" onSubmit={handleSubmit}>
                <h2>Create Contact</h2>
                <div className="form-group">
                    <FaUserPlus />
                    <input
                        type="text"
                        placeholder="Enter Name"
                        className="form-control"
                        name="name"
                        onChange={handleInput}
                    />
                </div>
                <div className="form-group">
                    <FaAt />
                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="form-control"
                        name="email"
                        onChange={handleInput}
                    />
                </div>
                <div className="form-group">
                    <FaPhoneFlip />
                    <input
                        type="text"
                        placeholder="Enter Phone Number"
                        className="form-control"
                        name="phone"
                        onChange={handleInput}
                    />
                </div>
                <div className="form-group">
                    <FaRegAddressCard />
                    <input
                        type="text" // Correct input type for address
                        placeholder="Enter Address"
                        className="form-control"
                        name="address"
                        onChange={handleInput}
                    />
                </div>
                <button className="form-btn">Add</button>
            </form>
        </div>
    );
}
