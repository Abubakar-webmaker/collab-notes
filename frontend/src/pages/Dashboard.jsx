import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    setCreating(true);
    try {
      const res = await axios.post('http://localhost:5000/api/notes', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/note/${res.data._id}`);
    } finally {
      setCreating(false);
    }
  };

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    setNotes(prev => prev.filter(n => n._id !== id));
    await axios.delete(`http://localhost:5000/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  useEffect(() => { fetchNotes(); }, []);

  const COLORS = ['#6366f1','#10b981','#f59e0b','#f87171','#60a5fa','#c084fc','#34d399'];

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.brand}>
            <span style={s.brandIcon}></span>
            <span style={s.brandName}>CollabNotes</span>
          </div>
          <div style={s.headerRight}>
            <div style={s.avatarBig}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button style={s.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>
          Good to see you,{' '}
          <span style={s.heroName}>{user?.name?.split(' ')[0]}</span> 
        </h1>
        <p style={s.heroSub}>
          {notes.length} note{notes.length !== 1 ? 's' : ''} · Start writing something amazing
        </p>
        <button
          style={{ ...s.newBtn, opacity: creating ? 0.8 : 1 }}
          onClick={createNote}
          disabled={creating}
        >
          {creating ? <span style={s.spinner} /> : '+ New Note'}
        </button>
      </div>

      {/* Notes Grid */}
      <main style={s.main}>
        {loading ? (
          <div style={s.grid}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={s.skeletonCard} />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>🗒️</div>
            <p style={s.emptyText}>No notes yet</p>
            <p style={s.emptySubText}>Create your first note to get started</p>
          </div>
        ) : (
          <div style={s.grid}>
            {notes.map((note, i) => (
              <div
                key={note._id}
                style={{
                  ...s.card,
                  animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                  borderTop: `2px solid ${COLORS[i % COLORS.length]}44`,
                }}
                onClick={() => navigate(`/note/${note._id}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = COLORS[i % COLORS.length] + '66';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px #00000066`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = COLORS[i % COLORS.length] + '44';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={s.cardDot(COLORS[i % COLORS.length])} />
                <h3 style={s.noteTitle}>{note.title || 'Untitled Note'}</h3>
                <p style={s.notePreview}>
                  {note.content?.replace(/<[^>]*>/g, '').slice(0, 90) || 'Empty note...'}
                </p>
                <div style={s.cardFooter}>
                  <span style={s.date}>
                    {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <button
                    style={s.deleteBtn}
                    onClick={e => deleteNote(note._id, e)}
                    onMouseEnter={e => e.target.style.background = '#f8717133'}
                    onMouseLeave={e => e.target.style.background = '#f8717115'}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  page: { minHeight: '100dvh', background: '#0a0a0f' },
  header: { borderBottom: '1px solid #ffffff0f', background: '#0d0d15', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' },
  headerInner: { maxWidth: '1100px', margin: '0 auto', padding: '0.85rem clamp(1rem, 4vw, 2rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  brandIcon: { fontSize: '1.4rem' },
  brandName: { fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 700, color: '#fff' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatarBig: { width: '34px', height: '34px', borderRadius: '50%', background: '#6366f122', color: '#818cf8', border: '1px solid #6366f133', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' },
  logoutBtn: { padding: '0.4rem 0.9rem', borderRadius: '8px', background: 'transparent', color: '#6b6b80', border: '1px solid #ffffff0f', fontSize: '13px', transition: 'all 0.15s' },
  hero: { maxWidth: '1100px', margin: '0 auto', padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem) 1rem', animation: 'fadeIn 0.4s ease' },
  heroTitle: { fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' },
  heroName: { background: 'linear-gradient(135deg, #6366f1, #818cf8, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { color: '#6b6b80', fontSize: 'clamp(13px, 2vw, 15px)', marginBottom: '1.5rem' },
  newBtn: { padding: 'clamp(0.7rem, 2vw, 0.85rem) clamp(1.2rem, 3vw, 1.8rem)', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 'clamp(14px, 2vw, 15px)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minWidth: '140px', minHeight: '44px', animation: 'pulse 3s infinite', transition: 'transform 0.15s', },
  spinner: { width: '16px', height: '16px', border: '2px solid #ffffff44', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem) 4rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(240px, 30vw, 300px), 1fr))', gap: 'clamp(0.75rem, 2vw, 1.25rem)' },
  skeletonCard: { height: '160px' },
  card: { background: '#111118', border: '1px solid #ffffff0f', borderRadius: '14px', padding: 'clamp(1rem, 3vw, 1.4rem)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s', position: 'relative', overflow: 'hidden' },
  cardDot: (color) => ({ position: 'absolute', top: '1rem', right: '1rem', width: '8px', height: '8px', borderRadius: '50%', background: color, opacity: 0.7 }),
  noteTitle: { fontSize: 'clamp(13px, 2vw, 15px)', fontWeight: 600, color: '#e2e2f0', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  notePreview: { color: '#555568', fontSize: 'clamp(12px, 1.8vw, 13px)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: '11px', color: '#3a3a4a' },
  deleteBtn: { background: '#f8717115', border: '1px solid #f8717133', color: '#f87171', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', padding: '0.3rem 0.6rem', transition: 'all 0.15s' },
  empty: { textAlign: 'center', padding: '5rem 1rem', animation: 'fadeIn 0.4s ease' },
  emptyIcon: { fontSize: '3.5rem', marginBottom: '1rem' },
  emptyText: { color: '#e2e2f0', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' },
  emptySubText: { color: '#6b6b80', fontSize: '14px' },
};