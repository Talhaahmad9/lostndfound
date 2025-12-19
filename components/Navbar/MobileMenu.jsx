import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "@/components/Context/SearchContext";

const NavLinks = [
  { name: "Dashboard", href: "/" },
  { name: "Report Found", href: "/report/found" },
];

const MobileMenu = ({ isMenuOpen, isSearchActive, setIsMenuOpen }) => {
  const { search, setSearch } = useSearch();
  const { isSignedIn } = useUser();
  return (
    // Visible on screens smaller than large (mobile and tablet)
    <div
      className={`$${
        isMenuOpen || isSearchActive ? "block" : "hidden"
      } lg:hidden bg-white shadow-lg p-4 w-full border-t border-gray-200 absolute top-16 left-0 right-0 z-40`}
    >
      {/* Mobile Search Input (Toggled by Search Icon) */}
      {isSearchActive && (
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-2 rounded-lg text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Navigation Links (Toggled by Menu Icon) */}
      {isMenuOpen && (
        <div className="flex flex-col space-y-2">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {isSignedIn ? (
            <Link
              href="/report/lost"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg text-center transition duration-300 w-full"
            >
              Report Lost
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg text-center transition duration-300 w-full"
              >
                Report Lost
              </button>
            </SignInButton>
          )}
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg text-center transition duration-300 w-full"
              >
                Login
              </button>
            </SignInButton>
          ) : (
            <div className="mt-2 flex justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
