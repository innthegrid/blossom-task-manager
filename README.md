# 🌸 Blossom - Cherry Blossom Task Manager

**Blossom** is a cherry blossom-themed personal task manager where each task is a petal in your productivity garden. Grow your goals, one petal at a time.

## 🌱 Features
### **Authentication & Security**
- **User Registration** - Secure account creation with email validation
- **Login/Logout** - JWT-based authentication with refresh tokens
- **Password Security** - BCrypt hashing with strength validation
- **Protected Routes** - Tasks are private to each user

### **Task Management**
- **Full CRUD Operations** - Create, Read, Update, Delete tasks
- **Task Organization** - Priority levels (low/medium/high), status tracking
- **Due Dates** - Optional deadlines with date picker
- **Search & Filter** - Find tasks by status, priority, or date

### **User Experience**
- **Cherry Blossom Theme** - Soothing pastel color palette
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Beautiful UI** - Rounded corners, soft shadows, cute icons
- **Real-time Updates** - Instant feedback on actions

### **Insights & Analytics**
- **Task Statistics** - Completion rates, priority distribution
- **Progress Tracking** - Visual indicators of productivity
- **User Profile** - Personalized dashboard with garden metaphore

## 🛠️ Technology Stack
### **Frontend**
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - API communication
- **React Router** - Client-side routing

### **Backend**
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Prisma** - Database ORM
- **JWT** - Authentication
- **BCrypt** - Password hashing library
- **Express Validator** - Input validation middleware

### **Tools**
- **Git & GitHub** - Version control
- **VSCode** - Development environment
- **Postman/curl** - API testing
- **Prisma Studio** - Database GUI
- **Nodemon** - Automatic server restart

## 📁 Project Structure
```
blossom-task-manager/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers (business logic)
│   │   ├── middleware/        # Authentication & validation
│   │   ├── models/            # Data models & repositories
│   │   ├── routes/            # API route definitions
│   │   ├── scripts/           # Database seeding scripts
│   │   └── utils/             # Helper functions (JWT, password)
│   ├── prisma/                # Database schema & migrations
│   ├── scripts/               # Development shell scripts
│   ├── .env                   # Environment variables
│   └── package.json
├── frontend/                  # React frontend (to be implemented)
└── README.md                  # You are here!
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
   git clone https://github.com/YOUR-USERNAME/blossom-task-manager.git
   cd blossom-task-manager
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up database**
   ```bash
   # Create PostgreSQL database (one-time setup)
   createdb blossom_db
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with sample data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the applications**
   - **Backend API:** `http://localhost:5001`
   - **API Documentation:** `http://localhost:5001/`
   - **Prisma Studio (Database GUI):** `http://localhost:5555`

## 🔐 API Endpoints

### **Authentication**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login existing user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/validate` | Validate JWT token | No |

### **Tasks**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks for user | Yes |
| GET | `/api/tasks/stats` | Get task statistics | Yes |
| GET | `/api/tasks/:id` | Get specific task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### **Public**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/api/health` | Health check |
| GET | `/api/blossom` | Blossom theme info |
| GET | `/api/auth/password-tips` | Password strength tips |

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