// components/Navbar/Logo.jsx

import Link from "next/link";
import { Search, MapPin } from "lucide-react";

const Logo = () => (
  <Link
    href="/"
    className="hover:opacity-80 transition-opacity flex items-center space-x-2"
  >
    {/* 1. Icon Mark (Magnifying Glass + Pin) */}
    <div className="relative w-11 h-11 flex-shrink-0">
      {/* Search Icon (Primary Blue Outline) */}
      <Search
        className="absolute inset-0 text-blue-600 z-10"
        size={44}
        strokeWidth={2}
      />

      {/* Location Pin Icon (Secondary Orange Fill) */}
      {/* Centering is done here using specific sizing and standard transform utilities */}
      <MapPin
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 z-20"
        size={22}
        fill="currentColor"
        strokeWidth={1.5}
      />
    </div>

    {/* 2. Brand Name Text (LostNFound) */}
    <span className="text-2xl font-extrabold tracking-tight text-gray-800">
      <span className="text-blue-600">Lost</span>
      <span className="text-orange-500">ND</span>
      <span className="text-blue-600">Found</span>
    </span>
  </Link>
);

export default Logo;
