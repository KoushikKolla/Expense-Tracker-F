# Expense Tracker Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the `server` folder with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/user` (JWT required)

### Expenses
- `POST /api/expenses` (JWT required)
- `GET /api/expenses` (JWT required)
- `PUT /api/expenses/:id` (JWT required)
- `DELETE /api/expenses/:id` (JWT required)

### Incomes
- `POST /api/incomes` (JWT required)
- `GET /api/incomes` (JWT required)
- `PUT /api/incomes/:id` (JWT required)
- `DELETE /api/incomes/:id` (JWT required) 