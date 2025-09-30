import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/css/form.css';
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
                toast.success("Contact Updated Successfully", { position: "top-right", autoClose: 3000 });
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
                    // fallback for APIs that return fields directly
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
        <div className="add-form-container">
            <form className="add-form" onSubmit={handleSubmit}>
                <h2>Edit Contact</h2>
                <div className="form-group">
                    <FaUserPlus />
                    <input
                        type="text"
                        placeholder="Enter Name"
                        className="form-control"
                        name="name"
                        onChange={handleInput}
                        value={values.name}
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
                        value={values.email}
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
                        value={values.phone}
                    />
                </div>
                <div className="form-group">
                    <FaRegAddressCard />
                    <input
                        type="text"
                        placeholder="Enter Address"
                        className="form-control"
                        name="address"
                        onChange={handleInput}
                        value={values.address}
                    />
                </div>
                <button type="submit" className="form-btn">Update</button>
            </form>
        </div>
    );
}