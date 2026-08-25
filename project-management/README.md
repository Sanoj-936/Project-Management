# 🚀 Full-Stack Project Management & Workspace Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Inngest](https://img.shields.io/badge/Workflows-Inngest-00E599?logo=inngest&logoColor=black)](https://www.inngest.com/)

A modern, multi-tenant enterprise Project Management web application built for seamless team collaboration, project milestone tracking, task lifecycle management, automated event-driven workflows, and scheduled email reminders.

---

## 🌐 Live Demo & Deployments

* **Frontend Application:** https://your-project-management.vercel.app *(Placeholder / Configured on Vercel)*
* **Backend API Server:** [https://project-management-server-hees.onrender.com](https://project-management-server-hees.onrender.com)
* **API Health Check:** [https://project-management-server-hees.onrender.com/](https://project-management-server-hees.onrender.com/) *(Returns: Server is live!)*

---

## ✨ Key Features

* 🏢 **Multi-Tenant Workspaces:** Create, manage, and switch between multiple organizations with role-based member permissions (ADMIN, MEMBER).
* 📁 **Project Portfolio Management:** Create projects with custom priorities (LOW, MEDIUM, HIGH), lifecycle statuses (PLANNING, ACTIVE, COMPLETED, ON_HOLD, CANCELLED), target start/end dates, team lead assignment, and real-time progress calculations.
* 📋 **Task Tracking & Granular Details:** Organize tasks by type (TASK, BUG, FEATURE, IMPROVEMENT, OTHER) and status (TODO, IN_PROGRESS, DONE) with assignees and due dates.
* 💬 **Threaded Task Comments:** Collaborate with team members directly on task detail views with author identity and timestamps.
* 🔐 **Secure Clerk Authentication & Onboarding:** Complete authentication flow with JWT-protected Express routes, organization onboarding, and seamless route protection.
* ⚡ **Event-Driven Workflow Automation (Inngest):** Background synchronization of Clerk users, organizations, and member invites directly to the PostgreSQL database.
* 📧 **Automated Email Notifications (Nodemailer & Brevo):** Instant email alerts dispatched upon task assignment, with background scheduled reminders sent before/on task due dates.
* 📊 **Analytics & Visual Dashboards:** Project overview metrics, task completion distributions, and visual stats powered by Recharts.
* 🌓 **Dark & Light Mode:** Theme toggle with persistent state powered by Redux Toolkit.

---

## 🛠️ Complete Technology Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI library with latest concurrent rendering capabilities |
| **Vite 7** | Next-generation fast frontend tooling and dev server |
| **Tailwind CSS v4** | Utility-first responsive styling and theme customization |
| **Redux Toolkit & React-Redux** | Centralized global state management (workspaces, theme) |
| **React Router v7** | Declarative client-side routing and nested layout management |
| **@clerk/clerk-react** | User authentication, sessions, and organization switcher components |
| **Axios** | HTTP client for authenticated API requests |
| **Recharts** | Interactive charts and visual analytics |
| **Lucide React** | Modern, clean UI icons |
| **React Hot Toast** | Toast notification system |
| **date-fns** | Date calculation and formatting utilities |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js (ES Modules)** | JavaScript runtime environment |
| **Express 5** | REST API routing and middleware framework |
| **@clerk/express** | Backend Clerk SDK for Bearer JWT verification and user extraction |
| **Prisma ORM 7** | Type-safe database client and schema migration tool |
| **@neondatabase/serverless & @prisma/adapter-neon** | High-performance serverless PostgreSQL connection pooling via WebSockets |
| **Inngest 3** | Reliable background job orchestration, event processing, and scheduled steps |
| **Nodemailer** | Transactional email delivery integration |
| **Brevo (Sendinblue) SMTP** | SMTP relay provider for notification delivery |
| **CORS & Dotenv** | Cross-origin resource sharing and environment management |

### Database & Cloud Services
| Service | Role |
| :--- | :--- |
| **PostgreSQL (Neon)** | Serverless relational cloud database |
| **Clerk** | Authentication, user identity, and organization membership provider |
| **Inngest Cloud** | Serverless background job queue and workflow execution |
| **Brevo SMTP** | Email delivery relay |
| **Render** | Backend web service hosting |
| **Vercel** | Frontend web application hosting |

---

## 🏛️ System Design & Architecture

### High-Level Architecture Diagram

`mermaid
flowchart TD
    subgraph Client["Frontend Client (React 19 + Vite)"]
        UI["React UI (Pages & Components)"]
        Redux["Redux Toolkit (State Management)"]
        ClerkClient["Clerk Auth Provider"]
    end

    subgraph Auth["Identity & Webhooks (Clerk)"]
        ClerkAuth["Clerk Identity Service"]
        ClerkWebhook["Clerk Webhooks"]
    end

    subgraph Backend["Backend API (Express 5 Server)"]
        AuthMiddleware["Clerk Auth Middleware (JWT Verification)"]
        APIRoutes["REST API Endpoints (/api/workspaces, /projects, etc.)"]
        InngestHandler["Inngest Event Handler (/api/inngest)"]
        Nodemailer["Nodemailer (Brevo SMTP Relay)"]
    end

    subgraph Background["Event Queue & Workflows"]
        InngestEngine["Inngest Workflow Engine"]
    end

    subgraph Database["Data Layer"]
        Prisma["Prisma ORM Client"]
        NeonDB[("Neon PostgreSQL Database")]
    end

    %% Client Interactions
    UI -->|"User Action / State"| Redux
    UI -->|"Sign In / Org Switch"| ClerkClient
    ClerkClient -->|"Authenticates"| ClerkAuth
    ClerkClient -->|"Bearer Token"| AuthMiddleware
    Redux -->|"Axios HTTP Requests"| APIRoutes

    %% Backend Processing
    AuthMiddleware -->|"Validates Session"| APIRoutes
    APIRoutes -->|"Queries & Mutations"| Prisma
    Prisma -->|"Serverless Driver (WebSocket)"| NeonDB

    %% Event-Driven Sync
    ClerkWebhook -->|"clerk/user.*, clerk/org.*"| InngestHandler
    InngestHandler <-->|"Sync & Step Execution"| InngestEngine
    InngestEngine -->|"Async DB Operations"| Prisma
    InngestEngine -->|"Trigger Notifications"| Nodemailer
    APIRoutes -->|"Dispatch Task Events"| InngestEngine
    Nodemailer -->|"Send Email"| UserEmail[("Assignee Email Inbox")]
`

### Component Responsibilities & Data Flow

1. **Authentication Flow:**
   - Unauthenticated users are routed to Clerk's <SignIn /> / <SignUp /> flow.
   - Upon authentication, Clerk provides a session token (JWT).
   - Authenticated users without an organization are seamlessly guided to the <CreateOrganization /> step.
   - Users with an active organization transition directly to the main Dashboard.
2. **API & Security Flow:**
   - Client sends HTTP requests with Authorization: Bearer <Clerk_Session_Token>.
   - Express server intercepts requests using @clerk/express middleware to verify token signature and expiry.
   - Route handlers extract the authenticated userId to scope all database operations to the user's workspaces.
3. **Event-Driven Webhook & Background Workflow:**
   - Clerk user/organization lifecycle events (user.created, user.deleted, organization.created, organization.deleted, organizationInvitation.accepted) are dispatched to Inngest.
   - Inngest functions execute idempotent Prisma database synchronizations.
   - Task assignment triggers pp/task.assigned, sending an instant notification email and scheduling a reminder check on the due date.

---

## 📂 Project Structure

`
project-management/
├── client/                                 # Frontend Application (React 19 + Vite)
│   ├── public/                             # Static assets
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js                    # Redux Toolkit store configuration
│   │   ├── assets/                         # Icons, avatars, and graphics
│   │   ├── components/                     # Reusable UI components
│   │   │   ├── AddProjectMember.jsx        # Project member addition modal
│   │   │   ├── CreateProjectDialog.jsx     # New project creation dialog
│   │   │   ├── CreateTaskDialog.jsx        # New task creation modal
│   │   │   ├── InviteMemberDialog.jsx      # Organization invitation dialog
│   │   │   ├── MyTasksSidebar.jsx          # Quick-access assigned tasks widget
│   │   │   ├── Navbar.jsx                  # Top navigation bar & user profile
│   │   │   ├── ProjectAnalytics.jsx        # Project charts and metrics
│   │   │   ├── ProjectCalendar.jsx         # Calendar task schedule view
│   │   │   ├── ProjectCard.jsx             # Project summary card component
│   │   │   ├── ProjectOverview.jsx         # Overview breakdown of active projects
│   │   │   ├── ProjectSettings.jsx         # Project configuration and status edit
│   │   │   ├── ProjectsSidebar.jsx         # Workspace project list sidebar
│   │   │   ├── ProjectTasks.jsx            # Filterable task board component
│   │   │   ├── RecentActivity.jsx          # Recent workspace activities list
│   │   │   ├── Sidebar.jsx                 # Collapsible application sidebar
│   │   │   ├── StatsGrid.jsx               # Dashboard summary metrics grid
│   │   │   ├── TasksSummary.jsx            # Task status summary widget
│   │   │   └── WorkspaceDropdown.jsx       # Workspace / Organization switcher
│   │   ├── configs/
│   │   │   └── api.js                      # Axios instance with baseURL configuration
│   │   ├── features/
│   │   │   ├── themeSlice.js               # Dark/light mode Redux state
│   │   │   └── workspaceSlice.js           # Workspaces, projects & tasks state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx               # Main analytics and workspace dashboard
│   │   │   ├── Layout.jsx                  # Root layout, Clerk auth & org routing
│   │   │   ├── ProjectDetails.jsx          # Single project view with tabs
│   │   │   ├── Projects.jsx                # All projects list and management
│   │   │   ├── Settings.jsx                # User settings & security overview
│   │   │   ├── TaskDetails.jsx             # Task detail view with comments
│   │   │   └── Team.jsx                    # Team members & roles directory
│   │   ├── App.jsx                         # Application router setup
│   │   ├── index.css                       # Global Tailwind CSS styles
│   │   └── main.jsx                        # Entry point with ClerkProvider & Redux
│   ├── .env                                # Frontend environment variables (ignored)
│   ├── package.json                        # Frontend dependencies and scripts
│   ├── tailwind.config.js / vite.config.js # Build and style configuration
│   └── vercel.json                         # Vercel SPA routing configuration
│
├── server/                                 # Backend Application (Node.js + Express)
│   ├── configs/
│   │   ├── nodemailer.js                   # Brevo SMTP transport & email dispatcher
│   │   └── prisma.js                       # Neon PostgreSQL Prisma client instance
│   ├── controllers/
│   │   ├── commentController.js            # Task comment CRUD operations
│   │   ├── projectController.js            # Project creation, update, and member management
│   │   ├── taskController.js               # Task creation, status update, deletion
│   │   └── workspaceController.js          # Workspace querying for authenticated user
│   ├── inngest/
│   │   └── index.js                        # Inngest client, Clerk sync & email functions
│   ├── middlewares/
│   │   └── authMiddleware.js               # Clerk JWT session verification middleware
│   ├── prisma/
│   │   └── schema.prisma                   # PostgreSQL relational database schema
│   ├── routes/
│   │   ├── commentRoutes.js                # /api/comments endpoints
│   │   ├── projectRoutes.js                # /api/projects endpoints
│   │   ├── taskRoutes.js                   # /api/tasks endpoints
│   │   └── workspaceRoutes.js              # /api/workspaces endpoints
│   ├── .env                                # Backend environment variables (ignored)
│   ├── package.json                        # Backend dependencies and scripts
│   ├── server.js                           # Express application entry point
│   └── vercel.json                         # Vercel serverless deployment config
│
├── .gitignore                              # Comprehensive multi-tier gitignore
└── README.md                               # Project documentation
`

---

## ⚙️ Installation & Local Setup

### Prerequisites
* **Node.js** (v18.0.0 or later recommended)
* **npm** (v9+ or yarn / pnpm)
* **PostgreSQL Database** (e.g. free tier on [Neon](https://neon.tech/))
* **Clerk Account** ([Clerk.com](https://clerk.com/))
* **Brevo Account** ([Brevo.com](https://www.brevo.com/)) for SMTP email notifications
* **Inngest Account / CLI** ([Inngest.com](https://www.inngest.com/))

### 1. Clone the Repository
`ash
git clone https://github.com/Sanoj-936/Project-Management.git
cd Project-Management
`

### 2. Configure Backend Environment
Navigate to the server/ folder and create a .env file:
`ash
cd server
`
Create .env with the following variables:
`env
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."
INNGEST_SIGNING_KEY="signkey-..."
INNGEST_EVENT_KEY="your_inngest_event_key"
SMTP_USER="your_brevo_smtp_login"
SMTP_PASS="your_brevo_smtp_password"
SENDER_EMAIL="your_verified_sender@domain.com"
`

### 3. Install Backend Dependencies & Run Migrations
`ash
npm install
npx prisma generate
npx prisma db push
`

### 4. Configure Frontend Environment
Navigate to the client/ folder and create a .env file:
`ash
cd ../client
`
Create .env with the following variables:
`env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_BASEURL="http://localhost:5000"
`

### 5. Install Frontend Dependencies
`ash
npm install
`

---

## 🏃 Running the Application Locally

Run both the server and client concurrently in separate terminal windows:

### Terminal 1: Start Backend Server
`ash
cd server
npm run server
`
*Backend runs on: http://localhost:5000*

### Terminal 2: Start Frontend Client
`ash
cd client
npm run dev
`
*Frontend runs on: http://localhost:5173*

### Terminal 3 (Optional): Start Inngest Dev Server
To test background functions, Clerk webhooks, and email workflows locally:
`ash
npx inngest-cli@latest dev -u http://localhost:5000/api/inngest
`
*Inngest Dev Dashboard runs on: http://localhost:8288*

---

## 🗄️ Database Schema & Models

The PostgreSQL schema is managed via Prisma ORM with the following models and relationships:

`
┌──────────────┐       ┌────────────────────┐       ┌─────────────────┐
│     User     │◄─────►│  WorkspaceMember   │◄─────►│    Workspace    │
└──────┬───────┘       └────────────────────┘       └────────┬────────┘
       │                                                     │
       │ (Assigned To / Lead)                                │ (Has Many)
       ▼                                                     ▼
┌──────────────┐                                    ┌─────────────────┐
│     Task     │◄───────────────────────────────────┤     Project     │
└──────┬───────┘                                    └─────────────────┘
       │
       │ (Has Many)
       ▼
┌──────────────┐
│   Comment    │
└──────────────┘
`

* **User**: Synchronized from Clerk identity; stores user details and cross-workspace relations.
* **Workspace**: Organization entity created via Clerk webhook; owned by a User.
* **WorkspaceMember**: Associative table managing workspace membership and roles (ADMIN, MEMBER).
* **Project**: Projects nested under workspaces with lead assignment, status, priority, and dates.
* **ProjectMember**: Associative table linking users to specific projects.
* **Task**: Tasks associated with a project; stores assignees, status, type, priority, and due dates.
* **Comment**: Threaded discussion entries tied to a specific task and authored by a user.

---

## 🔌 API Reference

All /api/* endpoints (except /api/inngest and health check) require a valid **Clerk Bearer Token** in the Authorization header: Authorization: Bearer <token>.

### 1. Workspaces
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/workspaces | Fetch all workspaces, projects, members, and tasks for the authenticated user |

### 2. Projects
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/projects | Create a new project within a workspace |
| PUT | /api/projects | Update project details, status, or progress |
| POST | /api/projects/:projectId/addMember | Add a registered workspace member to a specific project |

### 3. Tasks
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/tasks | Create a task, assign to user, and trigger assignment email event |
| PUT | /api/tasks/:id | Update task fields (status, priority, assignee, due date) |
| POST | /api/tasks/delete | Delete one or multiple tasks by ID |

### 4. Comments
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/comments | Post a new comment on a specific task |
| GET | /api/comments/:taskId | Retrieve all comments with user profiles for a task |

### 5. Webhooks & Background Engine
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET / POST / PUT | /api/inngest | Inngest event receiver and execution endpoint for Clerk webhook syncs & emails |

---

## 🚀 Deployment Guide

### Backend Deployment (Render)
1. Create a **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository and set the **Root Directory** to server.
3. Set **Build Command:** 
pm install && npx prisma generate
4. Set **Start Command:** 
pm start
5. Add all required backend environment variables in the Render Environment settings.

### Frontend Deployment (Vercel)
1. Import the repository on [Vercel](https://vercel.com/).
2. Set the **Root Directory** to client.
3. Add the frontend environment variables:
   - VITE_CLERK_PUBLISHABLE_KEY
   - VITE_BASEURL (pointing to your deployed backend URL on Render)
4. Deploy the project.

### Clerk & Inngest Webhook Setup
1. In the **Clerk Dashboard** under **Webhooks**, add an endpoint pointing to your Inngest sync webhook or configure Clerk's Inngest integration.
2. Ensure the following events are subscribed:
   - user.created, user.updated, user.deleted
   - organization.created, organization.updated, organization.deleted
   - organizationInvitation.accepted

---

## 🔮 Future Improvements

- [ ] **Real-time Collaboration:** Implement WebSockets for live drag-and-drop Kanban updates across connected team members.
- [ ] **File Attachments:** Cloud storage integration (AWS S3 / Cloudinary) for task attachments and project documentation.
- [ ] **Granular Custom Roles:** Custom permission matrix beyond standard ADMIN and MEMBER roles.
- [ ] **Activity Audit Log & Export:** Export project milestones, Gantt summaries, and task reports in CSV and PDF formats.

---

## 👤 Author

**Sanoj**
* GitHub: [@Sanoj-936](https://github.com/Sanoj-936)
* Repository: [Project-Management](https://github.com/Sanoj-936/Project-Management)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
