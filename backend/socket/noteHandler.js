const Note = require('../models/Note');

module.exports = (io, socket) => {

  // User joins a note's room
  socket.on('join-note', async ({ noteId, userId, userName }) => {
    socket.join(noteId);
    socket.noteId = noteId;
    socket.userId = userId;
    socket.userName = userName;

    // Send current note content to the joining user
    const note = await Note.findById(noteId);
    if (note) {
      socket.emit('load-note', { title: note.title, content: note.content });
    }

    // Notify others in room
    socket.to(noteId).emit('user-joined', { userId, userName });

    console.log(`${userName} joined note ${noteId}`);
  });

  // User types — broadcast to everyone else in room
  socket.on('note-change', async ({ noteId, content }) => {
    // Broadcast to all OTHER users in this room
    socket.to(noteId).emit('note-update', { content });

    // Debounced save — save to DB (in production use actual debounce)
    await Note.findByIdAndUpdate(noteId, { content }, { new: true });
  });

  // Title change
  socket.on('title-change', async ({ noteId, title }) => {
    socket.to(noteId).emit('title-update', { title });
    await Note.findByIdAndUpdate(noteId, { title });
  });

  // User disconnects
  socket.on('disconnect', () => {
    if (socket.noteId) {
      socket.to(socket.noteId).emit('user-left', {
        userId: socket.userId,
        userName: socket.userName
      });
    }
    console.log('User disconnected:', socket.id);
  });
};