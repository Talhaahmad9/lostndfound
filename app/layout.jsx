// app/layout.jsx (Updated with Inter and Roboto Mono)

// --- CHANGE: IMPORTING INTER AND ROBOTO MONO ---
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper/LayoutWrapper";

// --- CHANGE: DEFINING NEW FONT VARIABLES ---
const inter = Inter({
  variable: "--font-inter", // New CSS variable for sans-serif
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono", // New CSS variable for monospaced
  subsets: ["latin"],
});

export const metadata = {
  title: "LostNDFound",
  description: "A platform for reporting and finding lost items.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // --- CHANGE: APPLYING NEW CSS VARIABLES ---
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
