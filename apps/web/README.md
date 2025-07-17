# Sweet Shop Management Web Frontend

Modern React frontend for the Sweet Shop Management System, built with Vite, TypeScript, and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Reusable components built on Radix UI
- **Form Handling**: React Hook Form
- **API Communication**: Custom fetch wrapper
- **State Management**: React Query for server state, React Context for UI state

## 🎨 Features

- **Modern UI**: Clean and intuitive interface for sweet shop management
- **Responsive Design**: Works on devices of all sizes
- **Dark/Light Mode**: Toggle between themes for user preference
- **Real-time Feedback**: Toast notifications for user actions
- **Search & Filters**: Find products by name, category, and price range
- **Inventory Management**: Add, purchase, and restock sweets

## 🚀 Getting Started

### Local Development

```bash
# Navigate to the web directory
cd apps/web

# Install dependencies (if not already installed from root)
bun install

# Start the development server
bun run dev
```

The web app will start at http://localhost:8080

## 🧩 Project Structure

```
web/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── ui/          # UI components from shadcn
│   │   └── ...          # Custom components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
└── index.html           # HTML template
```

## 🎭 Theme Switching

The application supports light and dark modes. The theme preference is stored in localStorage and applied by toggling the `dark` class on the root HTML element.
