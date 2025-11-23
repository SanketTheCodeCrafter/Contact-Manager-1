import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { FaAddressBook, FaUser, FaSignOutAlt, FaHome, FaPlus } from 'react-icons/fa';

export default function Layout({ children }) {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="app-layout">
            <nav className="sidebar">
                <div className="logo">
                    <FaAddressBook size={28} color="var(--primary)" />
                    <span>ChitChat</span>
                </div>

                <div className="nav-links">
                    <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                        <FaHome /> <span>Home</span>
                    </Link>

                    {user && (
                        <>
                            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                                <FaAddressBook /> <span>Contacts</span>
                            </Link>
                            <Link to="/dashboard/add-contacts" className={`nav-item ${isActive('/dashboard/add-contacts') ? 'active' : ''}`}>
                                <FaPlus /> <span>Add Contact</span>
                            </Link>
                            <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
                                <FaUser /> <span>Profile</span>
                            </Link>
                        </>
                    )}
                </div>

                <div className="nav-footer">
                    {user ? (
                        <div className="user-info">
                            <div className="avatar">{user.name[0].toUpperCase()}</div>
                            <div className="details">
                                <span className="name">{user.name}</span>
                                <Link to="/logout" className="logout-btn">
                                    <FaSignOutAlt /> Logout
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-primary full-width">Login</Link>
                            <Link to="/register" className="btn-secondary full-width">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            <main className="main-content">
                {children}
            </main>

            <style>{`
                .app-layout {
                    display: flex;
                    min-height: 100vh;
                    width: 100%;
                    background: var(--background);
                }
                
                .sidebar {
                    width: 280px;
                    background: var(--surface-glass);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-right: 1px solid var(--border-light);
                    display: flex;
                    flex-direction: column;
                    padding: 2rem;
                    position: fixed;
                    height: 100vh;
                    left: 0;
                    top: 0;
                    z-index: 50;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-main);
                    margin-bottom: 3rem;
                    letter-spacing: -0.03em;
                }

                .nav-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    flex: 1;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-radius: var(--radius-md);
                    color: var(--text-muted);
                    transition: all 0.3s;
                    font-weight: 500;
                    border: 1px solid transparent;
                }

                .nav-item:hover {
                    background-color: rgba(255, 255, 255, 0.03);
                    color: var(--text-main);
                    transform: translateX(4px);
                }

                .nav-item.active {
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.15), transparent);
                    color: var(--primary);
                    border-left: 3px solid var(--primary);
                    border-radius: 0 var(--radius-md) var(--radius-md) 0;
                }

                .nav-footer {
                    margin-top: auto;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-light);
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.5rem;
                    border-radius: var(--radius-md);
                    transition: background-color 0.2s;
                }
                
                .user-info:hover {
                    background-color: rgba(255, 255, 255, 0.03);
                }

                .avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.2rem;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }

                .details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .name {
                    font-weight: 600;
                    font-size: 1rem;
                    color: var(--text-main);
                }

                .logout-btn {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: color 0.2s;
                }

                .logout-btn:hover {
                    color: var(--error);
                }

                .auth-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .main-content {
                    flex: 1;
                    margin-left: 280px;
                    padding: 3rem;
                    width: calc(100% - 280px);
                    min-height: 100vh;
                }

                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                    }
                    
                    .sidebar.open {
                        transform: translateX(0);
                    }
                    
                    .main-content {
                        margin-left: 0;
                        width: 100%;
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
