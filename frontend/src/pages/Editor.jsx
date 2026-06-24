import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import Toolbar from '../components/Toolbar';

const COLORS = ['#f87171','#fb923c','#facc15','#4ade80','#60a5fa','#c084fc','#f472b6'];

export default function Editor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [saved, setSaved] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const saveTimer = useRef(null);
  const typingTimer = useRef(null);
  const isRemote = useRef(false);
  const lastScrollY = useRef(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        style: 'outline:none; min-height:60vh; padding: clamp(1rem,4vw,2rem); font-size:clamp(15px,2vw,16px); line-height:1.9; color:#b0b0c8;',
      }
    },
    onUpdate: ({ editor }) => {
      if (isRemote.current) return;
      const html = editor.getHTML();
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setSaved(false);
      socket.emit('note-change', { noteId: id, content: html });
      socket.emit('typing', { noteId: id, userName: user.name });
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaved(true), 1000);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        socket.emit('stop-typing', { noteId: id, userName: user.name });
      }, 1500);
    }
  });

  useEffect(() => {
    if (!editor) return;
    socket.connect();
    socket.emit('join-note', { noteId: id, userId: user.id, userName: user.name });

    socket.on('load-note', ({ title, content }) => {
      setTitle(title);
      if (content) {
        isRemote.current = true;
        editor.commands.setContent(content);
        isRemote.current = false;
        const text = editor.getText();
        setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      }
    });

    socket.on('note-update', ({ content }) => {
      isRemote.current = true;
      editor.commands.setContent(content);
      isRemote.current = false;
    });

    socket.on('title-update', ({ title }) => setTitle(title));
    socket.on('user-joined', ({ userName }) => setActiveUsers(p => p.includes(userName) ? p : [...p, userName]));
    socket.on('user-left', ({ userName }) => {
      setActiveUsers(p => p.filter(u => u !== userName));
      setTypingUsers(p => p.filter(u => u !== userName));
    });
    socket.on('user-typing', ({ userName }) => {
      if (userName === user.name) return;
      setTypingUsers(p => p.includes(userName) ? p : [...p, userName]);
    });
    socket.on('user-stop-typing', ({ userName }) => setTypingUsers(p => p.filter(u => u !== userName)));

    return () => { socket.disconnect(); };
  }, [editor, id]);

  // Hide toolbar on scroll down (mobile UX)
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setToolbarVisible(y < lastScrollY.current || y < 60);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    socket.emit('title-change', { noteId: id, title: e.target.value });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  return (
    <div style={s.page}>
      {/* Topbar */}
      <header style={s.topBar}>
        <button style={s.backBtn} onClick={() => navigate('/')}>← Back</button>

        <div style={s.users}>
          {activeUsers.slice(0, 4).map((u, i) => (
            <div key={i} title={u} style={{ ...s.avatar, background: COLORS[i % COLORS.length] + '22', color: COLORS[i % COLORS.length], border: `1px solid ${COLORS[i % COLORS.length]}44` }}>
              {u.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>

        <div style={s.rightBar}>
          <span style={{ fontSize: '11px', color: saved ? '#10b981' : '#f59e0b', whiteSpace: 'nowrap' }}>
            {saved ? '✓ Saved' : '● Saving...'}
          </span>
          <button style={s.shareBtn} onClick={copyShareLink}>Share</button>
        </div>
      </header>

      {/* Toolbar — hides on mobile scroll */}
      <div style={{ ...s.toolbarWrap, opacity: toolbarVisible ? 1 : 0, transform: toolbarVisible ? 'translateY(0)' : 'translateY(-100%)', transition: 'opacity 0.2s, transform 0.2s' }}>
        <Toolbar editor={editor} />
      </div>

      {/* Title */}
      <div style={s.titleWrap}>
        <input
          style={s.titleInput}
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Note"
        />
        <div style={s.meta}>
          <span style={s.wordCount}>{wordCount} words</span>
          {typingUsers.length > 0 && (
            <span style={s.typing}>
              {typingUsers[0]} typing
              <span className="typing-dot"> .</span>
              <span className="typing-dot"> .</span>
              <span className="typing-dot"> .</span>
            </span>
          )}
        </div>
      </div>

      {/* Editor */}
      <div style={s.editorWrap}>
        <EditorContent editor={editor} />
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div style={s.toast}>🔗 Link copied!</div>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: '100dvh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem clamp(0.75rem, 3vw, 1.5rem)', borderBottom: '1px solid #ffffff0f', background: '#0d0d15', position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(12px)', gap: '0.5rem' },
  backBtn: { background: 'none', border: 'none', color: '#6366f1', fontSize: 'clamp(12px, 2vw, 14px)', padding: '0.4rem 0.6rem', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0 },
  users: { display: 'flex', gap: '0.3rem', flexShrink: 0 },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 },
  rightBar: { display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 },
  shareBtn: { padding: '0.35rem 0.8rem', borderRadius: '6px', background: '#6366f122', color: '#818cf8', border: '1px solid #6366f133', fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 600, whiteSpace: 'nowrap' },
  toolbarWrap: { position: 'sticky', top: '49px', zIndex: 15, background: '#0d0d15', borderBottom: '1px solid #ffffff0f' },
  titleWrap: { padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 4vw, 2rem) 0.5rem', maxWidth: '860px', width: '100%', margin: '0 auto', animation: 'fadeIn 0.3s ease' },
  titleInput: { background: 'none', border: 'none', color: '#fff', fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', fontWeight: 800, outline: 'none', width: '100%', letterSpacing: '-0.5px' },
  meta: { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap' },
  wordCount: { fontSize: '12px', color: '#3a3a4a' },
  typing: { fontSize: '12px', color: '#6b6b80', display: 'flex', alignItems: 'center' },
  editorWrap: { flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '0 clamp(0.5rem, 2vw, 1rem)', animation: 'fadeIn 0.4s ease 0.1s both' },
  toast: { position: 'fixed', bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))', left: '50%', transform: 'translateX(-50%)', background: '#1a1a24', border: '1px solid #6366f133', color: '#818cf8', padding: '0.7rem 1.4rem', borderRadius: '10px', fontSize: '13px', zIndex: 999, boxShadow: '0 8px 32px #00000088', animation: 'toastIn 0.25s ease', whiteSpace: 'nowrap' },
};