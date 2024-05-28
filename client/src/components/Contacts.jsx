import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPenToSquare, FaRegTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const customerStyles = {
    headCells: {
        style: {
            fontSize: '15px',
            fontWeight: 600,
        },
    },
    cells: {
        style: {
            fontSize: '13px',
            fontWeight: 500,
        },
    },
};

const MySwal = withReactContent(Swal);

export default function Contacts() {
    const [contacts, setContacts] = useState([]);

    const deleteRecord = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://127.0.0.1:3000/contactmyst/contacts/${id}`, { // Changed port to 3000
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }).then((res) => {
                    if (res.data.success) {
                        setContacts(prevContacts => prevContacts.filter(contact => contact._id !== id));
                        MySwal.fire({
                            title: "Deleted!",
                            text: "Your contact has been deleted.",
                            icon: "success"
                        });
                    } else {
                        MySwal.fire({
                            title: "Error!",
                            text: "Failed to delete contact.",
                            icon: "error",
                        });
                    }
                }).catch((err) => {
                    MySwal.fire({
                        title: "Error!",
                        text: "An error occurred!",
                        icon: "error",
                    });
                });
            }
        });
    };

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.name,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <Link to={`/dashboard/edit-contact/${row._id}`}>
                        <FaPenToSquare className='table-icon1' />
                    </Link>
                    <FaRegTrashCan className='table-icon2' onClick={() => deleteRecord(row._id)} />
                </>
            ),
        },
    ];

    useEffect(() => {
        axios.get('http://127.0.0.1:3000/contactmyst/contacts', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(res => {
            if (res.data.success) {
                setContacts(res.data.contacts);
            }
        })
        .catch(err => {
            console.error(err);
        });
    }, []);

    return (
        <div className='contact-list'>
            <DataTable
                columns={columns}
                data={contacts}
                customStyles={customerStyles}
                pagination
            />
            {contacts.length === 0 && <h1>Add a Contact</h1>}
        </div>
    );
}
