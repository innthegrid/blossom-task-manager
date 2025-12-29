# 🌸 Blossom - Cherry Blossom Task Manager

**Blossom** is a cherry blossom-themed personal task manager. Grow your goals, one petal at a time.

## 🌱 Features
- **User Authentication**: Secure sign up and login
- **Task Management**: Create, read, update, and delete tasks (CRUD)
- **Beautiful UI**: Cherry blossom-inspired design with pastel colors
- **Responsive Design**: Works on desktop, tablet, and mobile

### Planned Features
- Task categories and tags
- Due date reminders
- Progress tracking
- Dark mode toggle
- Task sharing

## 🛠️ Technology Stack
### **Frontend**
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - API communication

### **Backend**
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Prisma** - Database ORM
- **JWT** - Authentication

### **Tools**
- **Git & GitHub** - Version control
- **VSCode** - Development environment

## 📁 Project Structure
```
blossom-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── index.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── scripts/
│   ├── package.json
│   └── .env
├── frontend/
├── .gitignore
└── README.md
```

## 🗂️ Database Schema
```
PostgreSQL Database (blossom_db)
├── users                    # User accounts
│   ├── id (primary key)
│   ├── email (unique)
│   ├── password (hashed)
│   ├── username
│   └── theme (cherry-blossom)
│
└── tasks                   # Task items
    ├── id (primary key)
    ├── title
    ├── description
    ├── status
    ├── priority
    ├── dueDate
    ├── userId (foreign key → users.id)
    ├── flowerEmoji (🌸)
    └── isBlossom (true)
```

## 🚀 Getting Started
### **Prerequisites**
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/innthegrid/blossom-task-manager.git
   cd blossom-task-manager
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   # Set up environment variables (see .env.example)
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   npm start

4. **Open your browser**
Navigate to http://localhost:3000

## 🩷 Theme Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Pink | `#FFB7C5` | Buttons, accents |
| Soft Blossom | `#D4A5A5` | Secondary elements |
| Bright Petal | `#FF9AA2` | Highlights, alerts |
| Pale Background | `#FFF9FB` | Page background |
| Mint Success | `#B5EAD7` | Completed tasks |
| Peach Warning | `#FFDAC1` | Warnings, due dates |

## 🤝 Contributing
While this is a personal learning project, suggestions and feedback are welcome! Feel free to open an issue if you have ideas for improvement.

## 📄 License
This project is open source and available under the MIT License.

## 👩🏻‍💻 Author
Ingrid Tsai - Learning full-stack development through building beautiful, functional applications.
*Built with lots of 🩷 and 🧋*