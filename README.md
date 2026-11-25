# 🌸 Blossom - Task Manager

**Blossom** is a cherry blossom-themed personal task manager where each task is a petal in your productivity garden.

This is a full-stack web application developed as a learning project to demonstrate modern web development skills. It showcases complete CRUD operations, user authentication, responsive design, and data visualization — all wrapped in a beautiful, themed interface.

## 🌱 Features
### **Core Task Management**
- **Complete CRUD Operations**: Create, read, update, and delete tasks with real-time updates
- **Smart Task Organizaton**: Priority levels (low/medium/high), status tracking (on track/complete/overdue), and deadlines
- **Subtasks Support**: Break complex tasks into manageable steps with individual completion tracking
- **Categories & Tags**: Dual organizational system with preset icons and custom colors
- **Archive System**: Move completed tasks to archive for reference while keeping dashboard clean
- **Advanced Filtering**: Filter by status, priority, and category

### **User Authentication & Secury**
- **JWT-Based Authentication**: Login with access tokens and automatic session refresh
- **Password Security**: BCrypt hashing with strength validation and security tips
- **Protected Routes**: Role-based access control for all user data
- **Session Management**: Persistent login with automatic token refresh

### **Analytics & Visualization**
- **Garden Health Dashboard**: Real-time progress tracking with visual indicators
- **Priority Analysis**: Progress bars showing completion rates by priority level
- **Category Insights**: Distribution and completion statistics across categories
- **Time-Based Metrics**: Daily/weekly completion tracking with automatic resets
- **Archive Statistics**: Insights into archived tasks with filtering options
- **Visual Statistics**: Clean, color-coded progress bars

### **User Experience**
- **Responsive Design**: Fully functional on mobile, tablet, and desktop
- **Modal-Based Interface**: Clean, focused forms using overlay modals
- **Real-Time Updates**: Instant feedback on all actions without page refreshes
- **Cherry Blossom Theme**: Consistent color palette throughout the application
- **Confirmation Dialogs**: Prevent accidental deletions with clear confirmations
- **Notification System**: Toast notifications for user feedback on all actions

## 🛠️ Technology Stack

### **Frontend**
| Technology | Purpose | Why I Chose It |
|------------|---------|----------------|
| **React 18** | UI Framework | Component-based architecture, excellent ecosystem |
| **Tailwind CSS v4** | Styling | Utility-first, rapid development, CSS-in-JS alternative |
| **Lucide React** | Icons | Consistent icon set, tree-shakeable, matches theme |
| **Axios** | HTTP Client | Promise-based, interceptors for auth handling |
| **React Router v6** | Navigation | Declarative routing with nested routes |
| **Context API** | State Management | Built-in solution for global state needs |

### **Backend**
| Technology | Purpose | Why I Chose It |
|------------|---------|----------------|
| **Node.js + Express** | Server Framework | Fast, unopinionated, excellent middleware ecosystem |
| **PostgreSQL** | Database | ACID compliance, JSON support, reliable for production |
| **Prisma ORM** | Database Client | Type-safe, migrations, intuitive query API |
| **JWT** | Authentication | Stateless, scalable, widely adopted standard |
| **BCrypt.js** | Password Hashing | Industry standard for password security |
| **Express Validator** | Input Validation | Middleware-based validation with custom error messages |

## 🛠️ Technology Stack

### **Frontend**
| Technology | Purpose | Why I Chose It |
|------------|---------|----------------|
| **React 18** | UI Framework | Component-based architecture, excellent ecosystem |
| **Tailwind CSS v4** | Styling | Utility-first, rapid development, CSS-in-JS alternative |
| **Lucide React** | Icons | Consistent icon set, tree-shakeable, matches theme |
| **Axios** | HTTP Client | Promise-based, interceptors for auth handling |
| **React Router v6** | Navigation | Declarative routing with nested routes |
| **Context API** | State Management | Built-in solution for global state needs |

### **Backend**
| Technology | Purpose | Why I Chose It |
|------------|---------|----------------|
| **Node.js + Express** | Server Framework | Fast, unopinionated, excellent middleware ecosystem |
| **PostgreSQL** | Database | ACID compliance, JSON support, reliable for production |
| **Prisma ORM** | Database Client | Type-safe, migrations, intuitive query API |
| **JWT** | Authentication | Stateless, scalable, widely adopted standard |
| **BCrypt.js** | Password Hashing | Industry standard for password security |
| **Express Validator** | Input Validation | Middleware-based validation with custom error messages |

### **Development & Deployment**
- **Vite**: Lightning-fast build tool and dev server
- **Git + GitHub**: Version control and collaboration
- **Postman**: API testing and documentation
- **Prisma Studio**: Database GUI for development
- **Render/Vercel**: Planned deployment platforms

## 📁 Project Architecture

```
blossom-task-manager/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Layout.jsx    # Main layout with conditional Navbar
│   │   │   ├── TaskFormModal.jsx    # Modal for task creation/editing
│   │   │   ├── CategoryManagerModal.jsx  # Modal for category management
│   │   │   ├── CategoryIcon.jsx    # Dynamic icon component
│   │   │   ├── Notification.jsx    # Toast notifications for user feedback
│   │   │   └── ConfirmationModal.jsx # Interactive confirmation dialogs
│   │   ├── pages/           # Page components
│   │   │   ├── DashboardPage.jsx    # Main task dashboard
│   │   │   ├── ArchivePage.jsx      # Archived tasks management
│   │   │   ├── LoginPage.jsx        # Authentication page
│   │   │   └── RegisterPage.jsx     # User registration
│   │   ├── services/        # API service layers
│   │   │   ├── taskService.js       # Task CRUD operations + archive
│   │   │   └── categoryService.js   # Category management
│   │   ├── api/            # API configuration
│   │   │   └── axiosConfig.js      # Axios instance with interceptors
│   │   ├── utils/          # Helper functions
│   │   └── assets/         # Images, fonts, static files
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
│
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   └── database.js # Prisma client initialization
│   │   ├── controllers/    # Request handlers
│   │   │   ├── taskController.js    # Task business logic + archive
│   │   │   ├── authController.js    # Authentication logic
│   │   │   └── categoryController.js # Category operations
│   │   ├── middleware/     # Custom middleware
│   │   │   └── auth.js     # JWT authentication
│   │   ├── models/         # Data models (Prisma schema)
│   │   ├── routes/         # API route definitions
│   │   │   ├── taskRoutes.js       # Task endpoints + archive routes
│   │   │   ├── authRoutes.js       # Authentication endpoints
│   │   │   └── categoryRoutes.js   # Category endpoints
│   │   ├── utils/          # Helper functions
│   │   │   ├── jwt.js      # Token generation/validation
│   │   │   └── password.js # Password hashing/validation
│   │   └── index.js        # Express server entry point
│   ├── prisma/             # Database schema and migrations
│   │   └── schema.prisma   # Prisma schema definition
│   └── package.json        # Backend dependencies
│
└── README.md              # Project documentation
```

## 🗄️ Database Schema

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  username  String?
  tasks     Task[]
  categories Category[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  theme     String?   @default("cherry-blossom")
  
  @@map("users")
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      String    @default("pending") // pending, completed, archived
  priority    String    @default("medium")  // low, medium, high
  dueDate     DateTime?
  recurring   String?   // null, daily, weekly, monthly
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  subtasks    Subtask[]
  tags        String[]  // Array of tag strings
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Blossom-specific fields
  flowerEmoji String?   @default("🌸")
  isBlossom   Boolean   @default(true)
  
  @@map("tasks")
}

model Category {
  id        String   @id @default(cuid())
  name      String
  color     String   @default("#ffaabb")  // Cherry blossom pink
  icon      String   @default("🌸")
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([name, userId])
  @@map("categories")
}

model Subtask {
  id        String    @id @default(cuid())
  title     String
  completed Boolean   @default(false)
  taskId    String
  task      Task      @relation(fields: [taskId], references: [id], onDelete: Cascade)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@map("subtasks")
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.12+ and npm
- A running PostgreSQL 14+ server and a database your PostgreSQL user can access

### Local development

```bash
git clone https://github.com/innthegrid/blossom-task-manager.git
cd blossom-task-manager
createdb blossom_db
cd backend
cp .env.example .env
node -p "require('node:crypto').randomBytes(32).toString('hex')"
```

Paste the generated value into `JWT_SECRET` in `backend/.env`.
Replace `YOUR_POSTGRES_USER` in `DATABASE_URL` with your PostgreSQL username. Add
a password or change the host and port to match your local database.

```bash
npm ci
npm run generate
npx prisma migrate deploy
npm run dev
```

In a second terminal, from the repository root:

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

Open [Blossom](http://localhost:5173) and register an account. The API runs on
port 5001 by default. Use `npm run studio` from `backend/` to inspect the database.

### Optional demo data

From `backend/`, set `DEMO_PASSWORD` in `.env` to a password with at least six
characters, one uppercase letter, and one digit. Then run `npm run seed` and
sign in as `blossom@example.com` with that password. Set `DEMO_EMAIL` to use a
different address. The command creates a single account with sample tasks and
leaves existing accounts and tasks intact. On repeat runs it leaves the demo
account intact, including its password and any edits.

### Hosting configuration

| Where | Variable | Value |
| --- | --- | --- |
| API runtime | `DATABASE_URL` | PostgreSQL connection string |
| API runtime | `JWT_SECRET` | Random signing secret kept private |
| API runtime | `FRONTEND_ORIGIN` | Frontend origin, such as `https://blossom.example.com` |
| API runtime | `PORT` | Port assigned by the host, or `5001` by default |
| Frontend build | `VITE_API_BASE_URL` | Public API URL ending in `/api`, such as `https://api.example.com/api` |

Set the frontend URL before running `npm run build`. Configure the static host
to serve `index.html` for client-side routes. Run `npx prisma migrate deploy` against
the hosted database before starting the API.

## 🔧 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Authenticate user and get JWT |
| GET | `/api/auth/me` | Get current user profile |

### **Tasks**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for current user |
| GET | `/api/tasks/:id` | Get specific task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task completion |
| GET | `/api/tasks/stats` | Get task statistics |

### **Archive System**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/archive/completed` | Archive all completed tasks |
| GET | `/api/tasks/archive/list` | Get all archived tasks |
| PATCH | `/api/tasks/:id/restore` | Restore a task from archive |

### **Categories**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create a new category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

## 🎨 Design System

### **Color Palette**
| Color | Hex | Usage |
|-------|-----|-------|
| Blossom Dark | `#e890a2` | Headers, primary text |
| Blossom Pink | `#ffaabb` | Buttons, accents, subtext |
| Blossom Green | `#7bd4b3` / `#cdfaea` | Success states, completed items |
| Blossom Yellow | `#eba678` / `#fce3d2` | Warnings, medium priority |
| Blossom Red | `#de7880` / `#ffd9dd` | Errors, high priority, overdue |
| Blossom Blue | `#79cad1` | Informational elements |
| Background | `#FFF9FB` | Page background |

### **Typography**
- **Headings**: Jua (400 weight only) - Playful, rounded
- **Body**: Lexend (300-700 weights) - Clean, readable
- **Hierarchy**: Clear visual hierarchy with consistent spacing

### **Components**
- **Buttons**: Two variants (filled and outlined) with consistent hover states
- **Cards**: Soft shadows, rounded corners, subtle hover effects
- **Inputs**: Clear focus states with theme-appropriate colors
- **Progress Bars**: Color-coded by priority with smooth animations
- **Notifications**: Toast-style alerts with auto-dismiss
- **Confirmation Modals**: Interactive dialogs for critical actions

## 🎯 Learning Outcomes

### **Technical Skills Gained**
- **Full-Stack Development**: End-to-end application architecture from database to UI
- **Database Design**: PostgreSQL schema design, migrations, and optimization
- **API Design**: RESTful API patterns, authentication, and error handling
- **State Management**: Complex state patterns in React with service layers
- **Authentication**: JWT implementation, token refresh, and security best practices
- **Responsive Design**: Mobile-first CSS with Tailwind and custom theming
- **Component Architecture**: Reusable, maintainable component patterns
- **Deployment Planning**: Environment configuration and deployment strategies

### **Project Management Skills**
- **Feature Planning**: Breaking down complex features into manageable steps
- **Version Control**: Git workflows and meaningful commit messages
- **Documentation**: Comprehensive technical and user documentation
- **Testing Strategy**: Manual testing flows and error handling
- **Problem Solving**: Debugging full-stack issues and edge cases

## 🤝 Contributing
While this is a personal learning project, suggestions and feedback are welcome! Feel free to open an issue if you have ideas for improvement.

## 📄 License
This project is open source and available under the MIT License.

## 👩🏻‍💻 Author
Ingrid Tsai