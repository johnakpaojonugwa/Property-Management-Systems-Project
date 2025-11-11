import { AppProvider } from "../context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lusitana } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lusitana",
});

export const metadata = {
  title: "Property Management System",
  description: "Manage your real estate properties seamlessly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${lusitana.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ClientProviders>{
          children}
        </ClientProviders>
        
      </body>
    </html>
  );
}

function ClientProviders({ children }) {
  "use client";
  return (
    <AppProvider>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </AppProvider>
  );
}
