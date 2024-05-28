import React, { useContext } from 'react';
import { UserContext } from '../App';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const { setUser } = useContext(UserContext);
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out!"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                setUser(null);
                navigate('/');
            }
        });
    };


