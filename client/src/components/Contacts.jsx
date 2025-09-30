import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPenToSquare, FaRegTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/contactmyst/contacts`, {
                headers: getAuthHeaders()
            });
            if (res.data?.success) {
                setContacts(res.data.contacts || []);
            } else {
                console.error('Fetch contacts failed', res.data);
                MySwal.fire('Error', res.data?.message || 'Failed to load contacts', 'error');
            }
        } catch (err) {
            console.error('Fetch contacts error', err);
            MySwal.fire('Error', 'Network or server error while fetching contacts', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const deleteRecord = useCallback(async (id) => {
        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axios.delete(`${API_BASE}/contactmyst/contacts/${id}`, {
                headers: getAuthHeaders()
            });
            if (res.data?.success) {
                setContacts(prev => prev.filter(contact => contact._id !== id));
                MySwal.fire('Deleted!', 'Your contact has been deleted.', 'success');
            } else {
                MySwal.fire('Error', res.data?.message || 'Failed to delete contact', 'error');
            }
        } catch (err) {
            console.error('Delete contact error', err);
            MySwal.fire('Error', 'An error occurred while deleting', 'error');
        }
    }, []);

    const columns = useMemo(() => [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true
        },
        {
            name: 'Action',
            cell: row => (
                <>
                    <Link to={`/dashboard/edit-contact/${row._id}`}>
                        <FaPenToSquare className='table-icon1' />
                    </Link>
                    <FaRegTrashCan className='table-icon2' onClick={() => deleteRecord(row._id)} />
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
    ], [deleteRecord]);

    return (
        <div className='contact-list'>
            <DataTable
                columns={columns}
                data={contacts}
                customStyles={customerStyles}
                progressPending={loading}
                pagination
            />
            {!loading && contacts.length === 0 && <h1>Add a Contact</h1>}
        </div>
    );
}
