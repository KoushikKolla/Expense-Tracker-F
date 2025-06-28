<<<<<<< HEAD
# Smart Expense Tracker

A full-featured, modern MERN stack application for tracking expenses and incomes, with authentication, analytics, and a beautiful, responsive UI.

## Features

- **User Authentication:** Signup, login, JWT-based auth, password change, and account deletion.
- **Profile Management:** Edit profile, upload avatar, view login time.
- **Expense & Income Management:** Add, edit, delete, and filter transactions with predefined and custom categories.
- **Dashboard:** Overview of budget, recent activity, and navigation.
- **Dynamic Charts:** Pie, Bar, Line, and Histogram charts for visualizing expenses (using Chart.js).
- **Filters & Search:** Filter transactions by date, category, and search by description.
- **Export to PDF:** Export filtered expenses to PDF (jsPDF + jsPDF-AutoTable).
- **Dark Mode:** Toggle dark/light mode, with preference saved in localStorage.
- **Modern UI/UX:** Responsive, clean design with icons, gradients, and smooth navigation.
- **Indian Rupees (₹):** All currency values are displayed in INR.

## Tech Stack

- **Frontend:** React, Context API, Chart.js, jsPDF, modern CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Other:** Icons8 for icons, jsPDF-AutoTable for PDF export

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Expense-Tracker\ F
   ```

2. **Install dependencies:**
   - For the backend:
     ```bash
     cd server
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../client
     npm install
     ```

3. **Set up environment variables:**
   - In `server/`, create a `.env` file:
     ```env
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-secret>
     PORT=5000
     ```

4. **Run the backend:**
   ```bash
   cd server
   npm start
   ```

5. **Run the frontend:**
   ```bash
   cd ../client
   npm start
   ```
   The app will be available at `http://localhost:3000`.

## Usage

- **Sign up** for a new account or log in with existing credentials.
- **Add expenses/incomes** with category, amount, and description.
- **View analytics** on the Expenses page with dynamic charts.
- **Filter/search** transactions by date, category, or description.
- **Export** your expenses to PDF.
- **Edit your profile** and manage your account from the Profile page.
- **Toggle dark mode** for a comfortable viewing experience.

## Customization

- **Icons:** All icons are from [Icons8](https://icons8.com/).
- **Currency:** To change the currency, update the currency symbol in the frontend components.
- **Styling:** Modify `client/src/App.css` and `client/src/index.css` for custom themes.

## Folder Structure

```
Expense-Tracker F/
  client/         # React frontend
  server/         # Express backend
```

## License

This project is for educational and personal use. Icons are provided by [Icons8](https://icons8.com/). 
=======
# Expense-Tracker-F
>>>>>>> aef2313f827fc3a071670610ad1f357278f88050
