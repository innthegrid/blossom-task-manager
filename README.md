# 🌸 Blossom - Task Manager

**Blossom** is a cherry blossom-themed personal task manager where each task is a petal in your productivity garden.

This is a full-stack web application developed as a learning project to demonstrate modern web development skills. It showcases complete CRUD operations, user authentication, responsive design, and data visualization — all wrapped in a beautiful, themed interface.

## 🌱 Features
### **Core Task Management**
- **Complete CRUD Operations**: Create, read, update, and delete tasks with real-time updates
- **Smart Task Organizaton**: Priority levels (low/medium/high), status tracking (on track/complete/overdue), and deadlines
- **Subtasks Support**: Break complex tasks into manageable steps with individual completion tracking
- **Categories & Tags**: Dual organizational system with preset icons and custom colors
- **Advanced Filtering**: Filter by status, priority, and category

### **User Authentication & Secury**
- **JWT-Based Authenticaton**: Secure login with access/refresh token rotation
- **Password Security**: BCrypt hashing with strength validation and security tips
- **Protected Routes**: Role-based access control for all user data
- **Session Management**: Persistent login with automatic token refresh

### **Analytics & Visualization**
- **Garden Health Dashboard**: Real-time progress tracking with visual indicators
- **Priority Analysis**: Progress bars showing completion rates by priority level
- **Category Insights**: Distribution and completion statistics across categories
- **Time-Based Metrics**: Daily/weekly completion tracking with automatic resets
- **Visual Statistics**: Clean, color-coded progress bars

### **User Experience**
- **Responsive Design**: Fully functional on mobile, tablet, and desktop
- **Modal-Based Interface**: Clean, focused forms using overlay modals
- **Real-Time Updates**: Instant feedback on all actions without page refreshes
- **Cherry Blossom Theme**: Consistent color palette throughout the application

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
│   │   │   └── CategoryIcon.jsx    # Dynamic icon component
│   │   ├── pages/           # Page components
│   │   │   ├── DashboardPage.jsx    # Main task dashboard
│   │   │   ├── LoginPage.jsx        # Authentication page
│   │   │   └── RegisterPage.jsx     # User registration
│   │   ├── services/        # API service layers
│   │   │   ├── taskService.js       # Task CRUD operations
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
│   │   │   ├── taskController.js    # Task business logic
│   │   │   ├── authController.js    # Authentication logic
│   │   │   └── categoryController.js # Category operations
│   │   ├── middleware/     # Custom middleware
│   │   │   └── auth.js     # JWT authentication
│   │   ├── models/         # Data models (Prisma schema)
│   │   ├── routes/         # API route definitions
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
  
  @@map("users")
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      String    @default("pending") // pending, completed
  priority    String    @default("medium")  // low, medium, high
  dueDate     DateTime?
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  subtasks    Subtask[]
  tags        String[]  // Array of tag strings
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@map("tasks")
}

model Category {
  id        String   @id @default(cuid())
  name      String
  color     String   @default("#ffaabb")
  icon      String   @default("Sprout") // Lucide icon name
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

### **Prerequisites**
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Git

### **Local Development Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blossom-task-manager.git
   cd blossom-task-manager
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Initialize the database**
   ```bash
   createdb blossom_db
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   # Server runs on http://localhost:5001
   ```

5. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

7. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5001
   - **API Documentation**: http://localhost:5001/
   - **Prisma Studio**: http://localhost:5555

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

## 🎯 Learning Outcomes

### **Technical Skills Gained**
- **Full-Stack Development**: End-to-end application architecture
- **Database Design**: PostgreSQL schema design and optimization
- **API Design**: RESTful API patterns and best practices
- **State Management**: Complex state patterns in React
- **Authentication**: JWT implementation and security considerations
- **Responsive Design**: Mobile-first CSS with Tailwind
- **Deployment**: Environment configuration and deployment planning

### **Soft Skills Developed**
- **Project Planning**: Feature prioritization and roadmap creation
- **Problem Solving**: Debugging complex full-stack issues
- **Documentation**: Clear technical and user documentation
- **Time Management**: Balancing feature development with learning
- **Attention to Detail**: Consistent theming and UX polish

## 🤝 Contributing
While this is a personal learning project, suggestions and feedback are welcome! Feel free to open an issue if you have ideas for improvement.

## 📄 License
This project is open source and available under the MIT License.

## 👩🏻‍💻 Author
Ingrid Tsai