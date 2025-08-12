# Expense Tracker Frontend

A modern expense tracking application built with Next.js, TypeScript, and Tailwind CSS. This application allows users to manage their expenses with features like adding, editing, deleting expenses, and viewing expense summaries.

## Features

- **User Authentication**: Login and registration system
- **Expense Management**: Add, edit, and delete expenses
- **Expense Categories**: Categorize expenses (Food, Transport, Shopping, etc.)
- **Dashboard**: View expense summaries and charts
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

The application expects the following API endpoints to be available:

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary/monthly` - Get monthly summary

## Project Structure

```
src/
├── api/
│   └── api.ts              # API client functions
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── dashboard/          # Dashboard page
│   └── layout.tsx          # Root layout
├── components/
│   ├── dashboard/
│   │   ├── AddExpenseForm.tsx    # Add expense modal
│   │   ├── ExpenseList.tsx       # Expense list with CRUD
│   │   └── MonthlySummaryChart.tsx # Expense chart
│   └── layout/
│       └── Sidebar.tsx     # Navigation sidebar
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Recharts** - Charts and graphs

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
