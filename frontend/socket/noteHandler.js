const Note = require('../models/Note');

module.exports = (io, socket) => {
  socket.on('join-note', async ({ noteId, userId, userName }) => {
    socket.join(noteId);
    socket.noteId = noteId;
    socket.userId = userId;
    socket.userName = userName;

    const note = await Note.findById(noteId);
    if (note) socket.emit('load-note', { title: note.title, content: note.content });

    socket.to(noteId).emit('user-joined', { userId, userName });
  });

  socket.on('note-change', async ({ noteId, content }) => {
    socket.to(noteId).emit('note-update', { content });
    await Note.findByIdAndUpdate(noteId, { content });
  });

  socket.on('title-change', async ({ noteId, title }) => {
    socket.to(noteId).emit('title-update', { title });
    await Note.findByIdAndUpdate(noteId, { title });
  });

  socket.on('typing', ({ noteId, userName }) => {
    socket.to(noteId).emit('user-typing', { userName });
  });

  socket.on('stop-typing', ({ noteId, userName }) => {
    socket.to(noteId).emit('user-stop-typing', { userName });
  });

  socket.on('disconnect', () => {
    if (socket.noteId) {
      socket.to(socket.noteId).emit('user-left', {
        userId: socket.userId,
        userName: socket.userName
      });
    }
  });
};