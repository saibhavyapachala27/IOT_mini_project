# IoT Mini Project Showcase Portal

A premium and feature-rich web platform for showcasing, searching, filtering, and reviewing IoT (Internet of Things) mini-projects.

## 🚀 Deployed Links
*   **Frontend (Vite/React)**: [Add your Vercel deployment link here]
*   **Backend (Node.js/Express)**: [Add your Render deployment link here]

## 🛠️ Features
- **Project Showcase**: View and interact with a variety of IoT project submissions.
- **Interactive Search & Filter**: Easily filter projects by category, tools used, or author.
- **Review System**: Registered users and administrators can write reviews and leave ratings.
- **Secure Authentication**: User registration, login, email verification, and password reset functionality.
- **Admin Control Panel**: Review, approve/reject project submissions, and manage user feedback.

## 💻 Tech Stack
*   **Frontend**: React (v18), Vite, Tailwind CSS, Lucide Icons, React Router
*   **Backend**: Node.js, Express, Sequelize (ORM), SQLite (default development) / MySQL
*   **Mailing**: Nodemailer (SMTP/Gmail)

## 🔧 Local Setup & Run

1. **Install Dependencies**:
   Run the following in the project root directory:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   * Create a `.env` file in the `backend` folder matching the variables in `backend/.env`.

3. **Start the Application**:
   Run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   * Frontend will run on `http://localhost:5173`
   * Backend will run on `http://localhost:5000`
