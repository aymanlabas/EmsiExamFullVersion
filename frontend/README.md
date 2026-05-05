# Online Exam Management System (Frontend)

This project is a React-based frontend for an Online Exam Management System. It is built using **React 19, Vite, Tailwind CSS, and React Router**.

## Features

- **Authentication**: Login and Register pages. Includes an `AuthContext` to manage the authenticated user globally. Includes `ProtectedRoute` wrapper to secure routes.
- **Dashboard**: Displays a list of available exams fetched from the server. Exams can be started only if the current time dictates that they are open.
- **Exam Taking UI**: A functional exam page with questions and timed operation.
- **Auto Submission**: If the time expires, an auto-submit triggers and securely logs a consequence (e.g. late submission).
- **Results**: A results page detailing prior tests taken and highlights penalties if late.
- **Tailwind CSS**: A beautiful and responsive UI interface.

## Project Structure
```text
/src
├── components/      # Reusable components like Navbar and ProtectedRoute
├── context/         # AuthContext
├── pages/           # Pages (Dashboard, ExamPage, Login, Register, ResultPage)
├── services/        # Axios instances connecting to the hypothetical Spring Boot backend
├── App.jsx          # React Router Configuration
└── index.css        # Tailwind and Global CSS
```

## How to Run

1. **Install Dependencies**
   Open your terminal in the `frontend` directory and run:
   ```bash
   npm install
   ```
2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Open the Application**
   Visit the local URL provided by Vite in your browser (usually `http://localhost:5173`).

## Backend Integration
All API calls are prepared in the `src/services/` directory and use Axios. Ensure your **Spring Boot** application runs on `http://localhost:8080` (or update `baseURL` in `services/api.js`).

Enjoy building and extending the Exam System!
