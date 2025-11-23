import { createContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contacts from './components/Contacts';
import AddContact from './components/AddContact';
import EditContact from './components/EditContact';
import Logout from './components/Logout';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Layout from './components/Layout';

export const UserContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE}/contactmyst/auth`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (res.data?.success) {
                        setUser(res.data.user);
                    }
                })
                .catch(err => {
                    console.log('Auth verify error', err);
                });
        }
    }, []);

    return (
        <>
            <ToastContainer
                theme="dark"
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(12px)',
                    color: 'var(--text-main)',
                    fontFamily: 'Outfit, Inter, sans-serif',
                }}
                progressStyle={{
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                }}
            />
            <UserContext.Provider value={{ user, setUser }}>
                <Layout>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/profile-edit' element={<EditProfile />} />
                        <Route path='/dashboard' element={<Dashboard />}>
                            <Route index element={<Contacts />} />
                            <Route path='add-contacts' element={<AddContact />} />
                            <Route path='edit-contact/:id' element={<EditContact />} />
                        </Route>
                        <Route path='/logout' element={<Logout />} />
                    </Routes>
                </Layout>
            </UserContext.Provider>
        </>
    );
}