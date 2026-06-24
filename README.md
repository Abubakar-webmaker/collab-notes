# 📝 CollabNotes

A real-time collaborative note-taking app where multiple users can edit the same note simultaneously — like Google Docs but built from scratch.

![Tech Stack](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register & login
- ⚡ **Real-time Editing** — Multiple users edit simultaneously via Socket.io
- 💬 **Typing Indicators** — See when others are typing live
- 👥 **Live User Presence** — Colored avatars show who's in the note
- 📝 **Rich Text Editor** — Bold, italic, headings, lists, code blocks (Tiptap)
- 🔗 **Share Notes** — Copy link to invite collaborators instantly
- 💾 **Auto-save** — Debounced save to MongoDB
- 📱 **Fully Responsive** — Works perfectly on mobile & desktop
- 🌙 **Premium Dark UI** — Smooth animations throughout

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI Framework |
| Socket.io Client | Real-time communication |
| Tiptap | Rich text editor |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Socket.io | WebSocket server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |

---

## 📁 Project Structure

collab-notes/

├── client/                 # React frontend

│   └── src/

│       ├── components/

│       │   └── Toolbar.jsx

│       ├── context/

│       │   └── AuthContext.jsx

│       ├── pages/

│       │   ├── Login.jsx

│       │   ├── Register.jsx

│       │   ├── Dashboard.jsx

│       │   └── Editor.jsx

│       ├── socket.js

│       └── App.jsx

│

└── server/                 # Node.js backend

├── middleware/

│   └── auth.js

├── models/

│   ├── User.js

│   └── Note.js

├── routes/

│   ├── auth.js

│   └── notes.js

├── socket/

│   └── noteHandler.js

└── index.js

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/collab-notes.git
cd collab-notes
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🌐 Deployment

- **Frontend** → Vercel
- **Backend** → Vercel Serverless / Railway

---

## 📸 Screenshots

> Coming soon

---

## 👨‍💻 Author

Built with ❤️ by **Abu Bakar**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Abubakar-webmaker)
