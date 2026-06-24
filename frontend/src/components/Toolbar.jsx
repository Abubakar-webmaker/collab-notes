import { useCurrentEditor } from '@tiptap/react';

const ToolbarBtn = ({ onClick, active, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      padding: '0.35rem 0.6rem',
      borderRadius: '6px',
      border: 'none',
      background: active ? '#6366f122' : 'transparent',
      color: active ? '#818cf8' : '#888',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => !active && (e.target.style.background = '#ffffff08')}
    onMouseLeave={e => !active && (e.target.style.background = 'transparent')}
  >
    {children}
  </button>
);

export default function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      padding: '0.5rem 1rem',
      borderBottom: '1px solid #ffffff0f',
      flexWrap: 'wrap',
      background: '#0d0d15',
    }}>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">B</ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><i>I</i></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><s>S</s></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">{`</>`}</ToolbarBtn>

      <div style={{ width: '1px', height: '20px', background: '#ffffff0f', margin: '0 4px' }} />

      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">H1</ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarBtn>

      <div style={{ width: '1px', height: '20px', background: '#ffffff0f', margin: '0 4px' }} />

      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">• List</ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">1. List</ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">" "</ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">{ }</ToolbarBtn>

      <div style={{ width: '1px', height: '20px', background: '#ffffff0f', margin: '0 4px' }} />

      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</ToolbarBtn>
    </div>
  );
}