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
import Profile from './pages/Profile'; // added
export const UserContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // local API base (no global axios change)

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
            <ToastContainer />
            <UserContext.Provider value={{ user, setUser }}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile' element={<Profile />} /> {/* new profile route */}
                    <Route path='/dashboard' element={<Dashboard />}>
                        {/* Nested Route with Children */}
                        <Route index element={<Contacts />} />
                        <Route path='add-contacts' element={<AddContact/>}/>
                        <Route path='edit-contact/:id' element={<EditContact/>}/>
                    </Route>
                    <Route path='/logout' element={<Logout/>} />
                </Routes>
            </UserContext.Provider>
        </>
    );
}