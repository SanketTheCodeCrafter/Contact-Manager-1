import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPenToSquare, FaRegTrashCan, FaPlus, FaMagnifyingGlass } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/contactmyst/contacts`, {
                headers: getAuthHeaders(),
                params: { search, page, limit }
            });
            if (res.data?.success) {
                setContacts(res.data.contacts || []);
                if (res.data.pagination) {
                    setTotalPages(res.data.pagination.pages);
                }
            } else {
                setContacts([]);
            }
        } catch (err) {
            console.error('Fetch contacts error', err);
            MySwal.fire('Error', 'Failed to load contacts', 'error');
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchContacts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchContacts]);

    const deleteRecord = async (id) => {
        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--error)",
            cancelButtonColor: "var(--surface)",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axios.delete(`${API_BASE}/contactmyst/contacts/${id}`, {
                headers: getAuthHeaders()
            });
            if (res.data?.success) {
                fetchContacts(); // Refresh list
                MySwal.fire('Deleted!', 'Your contact has been deleted.', 'success');
            }
        } catch (err) {
            MySwal.fire('Error', 'Failed to delete contact', 'error');
        }
    };

    return (
        <div className="contacts-container">
            <div className="header-actions">
                <div className="search-box">
                    <FaMagnifyingGlass className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to page 1 on search
                        }}
                    />
                </div>
                <Link to="/dashboard/add-contacts" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Add Contact
                </Link>
            </div>

            {loading ? (
                <div className="loading-state">Loading contacts...</div>
            ) : (
                <>
                    {contacts.length === 0 ? (
                        <div className="empty-state">
                            <h3>No contacts found</h3>
                            <p>Start by adding a new contact to your list.</p>
                        </div>
                    ) : (
                        <div className="table-container card">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact) => (
                                        <tr key={contact._id}>
                                            <td>
                                                <div className="contact-name">
                                                    <div className="avatar-sm">{contact.name[0]}</div>
                                                    {contact.name}
                                                </div>
                                            </td>
                                            <td>{contact.email}</td>
                                            <td>{contact.phone}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link to={`/dashboard/edit-contact/${contact._id}`} className="icon-btn edit">
                                                        <FaPenToSquare />
                                                    </Link>
                                                    <button onClick={() => deleteRecord(contact._id)} className="icon-btn delete">
                                                        <FaRegTrashCan />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </button>
                            <span>Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            <style>{`
                .contacts-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    animation: fadeIn 0.5s ease-out;
                }
                
                .header-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .search-box {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                .search-box input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 2.75rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    background-color: var(--surface);
                    color: var(--text-main);
                    transition: all 0.2s;
                }

                .search-box input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-glow);
                }

                .table-container {
                    overflow-x: auto;
                    padding: 0;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                }

                .custom-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .custom-table th {
                    padding: 1.25rem 1.5rem;
                    text-align: left;
                    background-color: rgba(0, 0, 0, 0.2);
                    color: var(--text-muted);
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid var(--border);
                }

                .custom-table td {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    color: var(--text-main);
                    transition: background-color 0.2s;
                }

                .custom-table tr:last-child td {
                    border-bottom: none;
                }

                .custom-table tbody tr:hover td {
                    background-color: rgba(255, 255, 255, 0.02);
                }

                .contact-name {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .avatar-sm {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    font-weight: 600;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }

                .action-buttons {
                    display: flex;
                    gap: 0.75rem;
                }

                .icon-btn {
                    padding: 0.5rem;
                    border-radius: var(--radius-md);
                    background: transparent;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .icon-btn.edit { 
                    color: var(--primary); 
                    background-color: rgba(99, 102, 241, 0.1);
                }
                .icon-btn.edit:hover { 
                    background-color: var(--primary); 
                    color: white;
                }

                .icon-btn.delete { 
                    color: var(--error); 
                    background-color: rgba(239, 68, 68, 0.1);
                }
                .icon-btn.delete:hover { 
                    background-color: var(--error); 
                    color: white;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .pagination button {
                    background-color: var(--surface);
                    border: 1px solid var(--border);
                    padding: 0.5rem 1rem;
                }

                .pagination button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background-color: var(--surface);
                    border-radius: var(--radius-lg);
                    color: var(--text-muted);
                    border: 1px solid var(--border);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
