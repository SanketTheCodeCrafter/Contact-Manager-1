import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import '../assets/css/form.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function initials(name = '') {
  return name
    .split(' ')
    .map(s => s[0] || '')
    .slice(0,2)
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

  const cardStyle = {
    maxWidth: 900,
    margin: '28px auto',
    padding: 24,
    borderRadius: 10,
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    background: '#fff',
    display: 'grid',
    gridTemplateColumns: '160px 1fr',
    gap: 20,
    alignItems: 'center'
  };

  const avatarStyle = {
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: '#2d8cff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    fontWeight: 700,
    boxShadow: '0 6px 12px rgba(0,0,0,0.08)'
  };

  if (loading) {
    return (
      <div style={{maxWidth: 900, margin: '48px auto', padding: 24}}>
        <div style={{height: 180, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', padding: 20}}>
          <div style={{display:'flex', gap:20}}>
            <div style={{...avatarStyle, opacity: 0.2}} />
            <div style={{flex:1}}>
              <div style={{height:18, width:'40%', background:'#eee', borderRadius:6, marginBottom:12}} />
              <div style={{height:14, width:'60%', background:'#eee', borderRadius:6, marginBottom:8}} />
              <div style={{height:14, width:'30%', background:'#eee', borderRadius:6}} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div style={{maxWidth:900, margin:'48px auto', padding:24, color:'#c0392b'}}>Error: {error}</div>;
  }

  if (!user) {
    return <div style={{maxWidth:900, margin:'48px auto', padding:24}}>No profile data</div>;
  }

  return (
    <div style={cardStyle}>
      <div style={{textAlign:'center'}}>
        <div style={avatarStyle}>{initials(user.name)}</div>
        <div style={{marginTop:12, fontSize:13, color:'#666'}}>{user.role || 'User'}</div>
      </div>

      <div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h2 style={{margin:0}}>{user.name || '—'}</h2>
          <div style={{display:'flex', gap:8}}>
            <Link to="/profile-edit" style={{textDecoration:'none'}}>
              <button style={{padding:'8px 12px', borderRadius:6, border:'1px solid #ddd', background:'#fff', cursor:'pointer'}}>Edit</button>
            </Link>
            <Link to="/dashboard" style={{textDecoration:'none'}}>
              <button style={{padding:'8px 12px', borderRadius:6, border:'none', background:'#2d8cff', color:'#fff', cursor:'pointer'}}>Back</button>
            </Link>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div style={{padding:12, borderRadius:8, background:'#f7f9fc'}}>
            <div style={{fontSize:12, color:'#888'}}>Email</div>
            <div style={{fontSize:15}}>{user.email || '—'}</div>
          </div>

          <div style={{padding:12, borderRadius:8, background:'#f7f9fc'}}>
            <div style={{fontSize:12, color:'#888'}}>Joined</div>
            <div style={{fontSize:15}}>{joined || '—'}</div>
          </div>

          <div style={{gridColumn:'1 / -1', padding:12, borderRadius:8, background:'#fbfbfe'}}>
            <div style={{fontSize:12, color:'#888'}}>About</div>
            <div style={{fontSize:15, color:'#333'}}>{user.about || 'No additional info provided.'}</div>
          </div>
        </div>

        {/* extra metadata */}
        <div style={{marginTop:16, color:'#999', fontSize:13}}>
          ID: {user._id}
        </div>
      </div>
    </div>
  );
}