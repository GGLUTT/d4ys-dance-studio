# D4YS Dance Studio 💃🕺

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern, high-performance web application for **D4YS Dance Studio** (Bila Tserkva). This project serves as the digital face of the studio, offering class schedules, online booking, team presentations, and an administrative dashboard for studio management.

## ✨ Features

### 🎨 User Experience (Client Side)
*   **Modern UI/UX**: Built with a "dark mode" aesthetic using **Tailwind CSS** and **Shadcn UI**.
*   **Smooth Animations**: Powered by **Framer Motion** for engaging transitions and scroll effects.
*   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
*   **Interactive Schedule**: Dynamic weekly schedule with filtering capabilities.
*   **Online Booking**: Seamless booking flow for classes (Group & Personal).
*   **Gallery**: Grid layout showcasing studio atmosphere and events.

### 🛠️ Administration (Admin Panel)
*   **Dashboard**: Real-time analytics (Total bookings, Confirmed/Canceled stats).
*   **Booking Management**: View, approve, or cancel class bookings.
*   **Schedule Management**: Edit training sessions, assign trainers, and set capacities.
*   **Pricing Control**: Manage subscription plans and prices.
*   **Secure Access**: Protected routes accessible only to authorized administrators.

## 🚀 Tech Stack

### Frontend
*   **[React](https://react.dev/)**: Library for building user interfaces.
*   **[TypeScript](https://www.typescriptlang.org/)**: Static type checking for better developer experience and code quality.
*   **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling.
*   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework.
*   **[Shadcn UI](https://ui.shadcn.com/)**: Reusable components built with Radix UI and Tailwind.
*   **[Framer Motion](https://www.framer.com/motion/)**: Production-ready animation library for React.

### Backend / Services
*   **[Supabase](https://supabase.com/)**: Open source Firebase alternative.
    *   **PostgreSQL**: Relational database.
    *   **Auth**: Secure user authentication.
    *   **Real-time**: Live updates for bookings and schedule changes.

### State Management & Utilities
*   **React Query (@tanstack/react-query)**: Powerful asynchronous state management.
*   **Zod**: Schema declaration and validation.
*   **React Hook Form**: Performant, flexible, and extensible forms.
*   **Lucide React**: Beautiful & consistent icons.

## 📸 Screenshots

![D4YS Studio Interface](https://i.imgur.com/g9JhyXI.jpeg)

## 📦 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/GGLUTT/d4ys-dance-studio.git
    cd d4ys-dance-studio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory. You need to connect your own Supabase project:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by [Evgen Lutiy](https://github.com/GGLUTT)
