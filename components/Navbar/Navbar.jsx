// components/Navbar/Navbar.jsx

"use client";

import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";

// Import sub-components
import Logo from "./Logo";
import DesktopLinks from "./DesktopLinks";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Handlers to control state toggles
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchActive(false); // Close search when menu opens
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    setIsMenuOpen(false); // Close menu when search opens
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center text-blue-600">
        <Logo />
        <DesktopLinks />
        <div className="flex items-center space-x-3 text-blue-600">
          <button
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleSearch}
          >
            <Search className="w-6 h-6" />
          </button>
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      <MobileMenu
        isMenuOpen={isMenuOpen}
        isSearchActive={isSearchActive}
        setIsMenuOpen={setIsMenuOpen}
      />
    </nav>
  );
};

export default Navbar;
