const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Note' },
  content: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  activeUsers: [{ socketId: String, userId: String, name: String }]
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);