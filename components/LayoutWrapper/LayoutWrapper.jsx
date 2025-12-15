import Navbar from "@/components/Navbar/Navbar";
import { SearchProvider } from "@/components/Context/SearchContext";

const Footer = () => (
  <footer className="bg-gray-800 text-gray-400 text-center p-4 mt-8">
    <div className="max-w-7xl mx-auto">
      © {new Date().getFullYear()} LostNFound - All rights reserved
    </div>
  </footer>
);

export default function LayoutWrapper({ children }) {
  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow py-8 mt-4 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </SearchProvider>
  );
}