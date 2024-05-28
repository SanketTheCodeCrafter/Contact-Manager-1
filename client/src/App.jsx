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
export const UserContext = createContext(null);

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://127.0.0.1:3000/contactmyst/verify', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(token)}`,
                },
            })
            .then(res => {
                if (res.data.success) {
                    setUser(res.data.user);
                }
            })
            .catch(err => {
                console.log(err);
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
                    <Route path='/dashboard' element={<Dashboard />}>
                        {/* Nested Route with Children */}
                        <Route index element={<Contacts />} />
                        <Route path='/dashboard/add-contacts' element={<AddContact/>}/>
                        <Route path='/dashboard/edit-contact/:id' element={<EditContact/>}/>
                    </Route>
                    <Route path='/logout' element={<Logout/>} />
                </Routes>
            </UserContext.Provider>
        </>
    );
}
