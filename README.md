# EduTrack - Full-Stack Student Management System

A complete, full-stack student management system designed from the ground up to handle user authentication, role-based access control (students and admins), course creation, and student enrollment. This project is built with modern technologies and is deployed for live access.

**Live Application URL:** [https://your-vercel-project-url.vercel.app](https://your-vercel-project-url.vercel.app)

---

## Core Features Implemented

*   **Secure User Authentication:** Full user registration and login system with password hashing (`bcryptjs`).
*   **Role-Based Access Control:**
    *   **Student Role:** Can view the course catalog and enroll in courses. The UI dynamically updates to show enrolled status.
    *   **Admin Role:** Can view the course catalog and has access to an exclusive admin panel to create new courses.
*   **Protected API:** Backend routes are protected using JSON Web Tokens (JWT), ensuring only authenticated users can access data.
*   **Dynamic Frontend:** The UI, built with React, intelligently renders different components and options based on the logged-in user's role.
*   **Cloud Deployment:** The entire monorepo is seamlessly deployed on Vercel, with the Express.js backend running as serverless functions.
*   **Cloud Database:** Connected to a robust, serverless TiDB Cloud MySQL database with a secure SSL connection.
*   **Modern UI/UX:** Clean, responsive interface built with Tailwind CSS and custom components, featuring a user-selectable dark mode.

---

## Technology Stack

| Area      | Technology / Library          | Purpose                                        |
| :-------- | :---------------------------- | :--------------------------------------------- |
| **Frontend** | React (with Vite)            | Core user interface library                     |
|           | Tailwind CSS                  | Utility-first CSS for rapid styling            |
|           | React Router                  | Client-side routing (`/`, `/dashboard`)        |
|           | Axios                         | Promise-based HTTP client for API calls        |
|           | `jwt-decode`                  | To inspect user roles on the frontend          |
| **Backend**  | Node.js / Express.js         | Server framework for building the REST API     |
|           | Sequelize                     | ORM for interacting with the MySQL database    |
|           | MySQL2                        | Database driver                                |
|           | JWT (`jsonwebtoken`)          | Authentication token generation & verification |
|           | `bcryptjs`                    | Secure password hashing                        |
|           | CORS                          | Handling cross-origin requests               |
| **DevOps**   | Vercel                        | Platform for deployment and hosting            |
|           | TiDB Cloud                    | Free, serverless, cloud-hosted MySQL database  |
|           | Git / GitHub                  | Version control and code repository            |

---

## Local Development Setup

To run this project on your local machine, follow these steps:

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/your-repo-name.git
cd edu-track-project