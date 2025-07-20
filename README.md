# EduTrack - Full-Stack Student Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An end-to-end, role-based student management system designed for educational institutions. EduTrack provides a robust, secure, and intuitive platform for administrators, faculty, and students to manage courses, enrollments, grades, and attendance seamlessly.

---

## ✨ Core Features

The application is architected around three distinct user roles, each with a tailored dashboard and specific permissions.

### 🧑‍💼 **Administrator Portal**
The Admin has full system oversight and control.
-   **Statistical Dashboard:** View real-time analytics, including total student, course, and enrollment counts, with a visual chart for enrollment distribution.
-   **User Management:** A comprehensive dashboard to create, view, update, and delete all user accounts (Students, Faculty, and other Admins).
-   **Course Management:** Full CRUD functionality for the entire course catalog. Create new courses, update details, and assign faculty and departments.
-   **Department Management:** Ability to create and manage academic departments.

### 👨‍🏫 **Faculty Dashboard**
The Faculty dashboard is a focused workspace for managing courses and students.
-   **Assigned Courses:** Automatically view a list of all courses the faculty member is assigned to teach.
-   **Student Roster:** View and manage the list of students enrolled in each course.
-   **Grade Management:** A dedicated interface to submit and update final grades for each student.
-   **Attendance Tracking:** A complete attendance system to mark students as Present, Absent, or Late for any given day.
-   **Reporting & Analytics:** An integrated reporting tab provides a visual summary of class attendance and allows for exporting the full attendance report to CSV.

### 🎓 **Student Experience**
The Student portal is designed for easy access to academic information.
-   **Course Catalog & Enrollment:** Browse the full, up-to-date course catalog and enroll in courses with a single click.
-   **Personalized Dashboard:** A clean interface showing available courses and enrollment status.
-   **Academic Reports:** A dedicated "My Report" page to view all assigned grades, see instructor comments, and calculate cumulative GPA.
-   **Export Functionality:** Students can export their complete grade report to a CSV file for their personal records.

---

## 🛠️ Technology Stack

| Category  | Technology / Library          | Purpose                                        |
| :-------- | :---------------------------- | :--------------------------------------------- |
| **Frontend** | React (with Vite)            | Core user interface library                     |
|           | Tailwind CSS                  | Utility-first styling and theming              |
|           | React Router                  | Client-side routing and navigation             |
|           | Axios                         | HTTP client for API communication              |
|           | Recharts                      | Data visualization and charts                  |
|           | Framer Motion                 | Animations and page transitions                |
|           | Radix UI                      | Headless components for UI primitives (Dialog, Select) |
| **Backend**  | Node.js / Express.js         | Building the RESTful API     |
|           | Sequelize ORM                 | Interacting with the MySQL database            |
|           | JWT (`jsonwebtoken`)          | Secure session and authentication tokens       |
|           | `bcryptjs`                    | Hashing user passwords                         |
|           | MySQL2 Driver                 | High-performance MySQL database driver          |
| **Database & DevOps**   | MySQL                        | Relational database management                 |
|           | Vercel                        | Production deployment and hosting              |
|           | Git / GitHub                  | Version control and code repository            |


---

## 🚀 Getting Started: Local Development

Follow these steps precisely to get the project running on your local machine.

### **Prerequisites**
-   Node.js (v18 or later recommended)
-   npm or yarn
-   A running local instance of MySQL

### **1. Clone the Repository**
```bash
git clone <your-repository-url>
cd edu-track-project
```

### **2. Setup the Backend**

First, navigate to the backend directory and install all required dependencies.
```bash
cd backend
npm install
```

Next, create the environment file.
```bash
cp .env.example .env
```
Open the `.env` file and populate it with your local MySQL database credentials and a JWT secret.

**IMPORTANT:** Before starting the server, you must seed the database. This command will create all tables and populate them with sample data, including the default login accounts.
```bash
npm run seed
```

Now, you can start the backend server.
```bash
npm run dev
```
The backend API will be running on `http://localhost:3001`.

### **3. Setup the Frontend**

In a **new, separate terminal**, navigate to the frontend directory and install its dependencies.
```bash
cd frontend
npm install
```

Now, start the frontend development server.
```bash
npm run dev
```
The application will be available at **`http://localhost:5173`**.

---

## 🔑 Default Login Credentials

After successfully seeding the database, you can use these default accounts to explore the application's features:

| Role      | Email                  | Password      |
| :-------- | :--------------------- | :------------ |
| **Admin**   | `admin@edu.track`      | `password123` |
| **Faculty** | `faculty@edu.track`    | `password123` |
| **Student** | `alice@test.com`       | `password123` |

```
