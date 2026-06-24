import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.card}>
        <div style={s.logo}></div>
        <h1 style={s.title}>Welcome back</h1>
        <p style={s.sub}>Sign in to your notes</p>

        {error && <div style={s.error}>{error}</div>}

        <label style={s.label}>Email</label>
        <input
          style={s.input}
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <label style={s.label}>Password</label>
        <input
          style={s.input}
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <button
          style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span style={s.spinner} /> : 'Sign In'}
        </button>

        <p style={s.link}>
          No account?{' '}
          <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0f',
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-10%', left: '-10%',
    width: 'clamp(200px, 40vw, 400px)', height: 'clamp(200px, 40vw, 400px)',
    background: '#6366f115', borderRadius: '50%',
    filter: 'blur(60px)', pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-10%', right: '-10%',
    width: 'clamp(150px, 35vw, 350px)', height: 'clamp(150px, 35vw, 350px)',
    background: '#818cf810', borderRadius: '50%',
    filter: 'blur(60px)', pointerEvents: 'none',
  },
  card: {
    background: '#111118',
    border: '1px solid #ffffff0f',
    borderRadius: '16px',
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    animation: 'scaleIn 0.3s ease',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 24px 64px #00000088',
  },
  logo: { fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.25rem' },
  title: { fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: '#fff', textAlign: 'center' },
  sub: { color: '#6b6b80', fontSize: '14px', textAlign: 'center', marginBottom: '0.5rem' },
  label: { fontSize: '13px', color: '#6b6b80', fontWeight: 500 },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid #ffffff0f',
    background: '#0d0d15',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.9rem',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease infinite',
    color: '#fff',
    border: 'none',
    fontWeight: 700,
    fontSize: '15px',
    transition: 'transform 0.15s, opacity 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '48px',
  },
  spinner: {
    width: '18px', height: '18px',
    border: '2px solid #ffffff44',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  error: {
    background: '#f8717115',
    border: '1px solid #f8717133',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '13px',
    animation: 'fadeIn 0.2s ease',
  },
  link: { color: '#6b6b80', fontSize: '14px', textAlign: 'center', marginTop: '0.25rem' },
};