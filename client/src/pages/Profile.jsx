import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { FaUserEdit, FaArrowLeft } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function initials(name = '') {
  return name
    .split(' ')
    .map(s => s[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export default function Profile() {
  const { user: ctxUser, setUser: setCtxUser } = useContext(UserContext) || {};
  const [user, setUser] = useState(ctxUser || null);
  const [loading, setLoading] = useState(!ctxUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ctxUser) return; // already available from context

    const controller = new AbortController();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/contactmyst/auth`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        if (res.data?.success) {
          const u = res.data.user || null;
          setUser(u);
          if (setCtxUser) setCtxUser(u);
        } else {
          setError(res.data?.message || 'Failed to load profile');
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err.response?.data?.message || err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [ctxUser, setCtxUser]);

  const joined = useMemo(() => formatDate(user?.createdAt), [user]);

  if (loading) {
    return <div className="loading-state">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  if (!user) {
    return <div className="empty-state">No profile data</div>;
  }

  return (
    <div className="profile-container">
      <div className="card profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {initials(user.name)}
          </div>
          <div className="profile-title">
            <h2>{user.name}</h2>
            <span className="role-badge">{user.role || 'User'}</span>
          </div>
          <div className="profile-actions">
            <Link to="/dashboard" className="btn-secondary">
              <FaArrowLeft /> Back
            </Link>
            <Link to="/profile-edit" className="btn-primary">
              <FaUserEdit /> Edit
            </Link>
          </div>
        </div>

        <div className="profile-grid">
          <div className="info-group">
            <label>Email Address</label>
            <div className="info-value">{user.email}</div>
          </div>
          <div className="info-group">
            <label>Member Since</label>
            <div className="info-value">{joined}</div>
          </div>
          <div className="info-group full">
            <label>About</label>
            <div className="info-value">{user.about || 'No additional info provided.'}</div>
          </div>
        </div>

        <div className="profile-footer">
          ID: {user._id}
        </div>
      </div>

      <style>{`
        .profile-container {
            display: flex;
            justify-content: center;
            padding-top: 2rem;
            animation: fadeIn 0.5s ease-out;
        }
        
        .profile-card {
            width: 100%;
            max-width: 800px;
            padding: 3rem;
        }

        .profile-header {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border);
        }

        .profile-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 4px solid var(--surface);
        }

        .profile-title {
            flex: 1;
        }

        .profile-title h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .role-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background-color: rgba(99, 102, 241, 0.1);
            color: var(--primary);
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .profile-actions {
            display: flex;
            gap: 1rem;
        }

        .profile-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
        }

        .info-group {
            background-color: rgba(0,0,0,0.2);
            padding: 1.5rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border);
        }

        .info-group.full {
            grid-column: 1 / -1;
        }

        .info-group label {
            display: block;
            color: var(--text-muted);
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .info-value {
            font-size: 1.1rem;
            color: var(--text-main);
            font-weight: 500;
        }

        .profile-footer {
            margin-top: 2rem;
            text-align: right;
            color: var(--text-muted);
            font-size: 0.875rem;
            font-family: monospace;
        }

        @media (max-width: 768px) {
            .profile-header {
                flex-direction: column;
                text-align: center;
                gap: 1.5rem;
            }
            
            .profile-grid {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
    </div>
  );
}