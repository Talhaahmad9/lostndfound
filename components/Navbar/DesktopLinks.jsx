import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "@/components/Context/SearchContext";

const NavLinks = [
  { name: "Dashboard", href: "/" },
  { name: "Report Found", href: "/report/found" },
];

const DesktopLinks = () => {
  const { search, setSearch } = useSearch();
  const { isSignedIn } = useUser();

  return (
    // Visible only on large screens (desktops)
    <div className="hidden lg:flex flex-grow items-center justify-center space-x-8">
      {/* Direct Desktop Links */}
      {NavLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          {link.name}
        </Link>
      ))}

      {isSignedIn ? (
        <Link
          href="/report/lost"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105"
        >
          Report Lost
        </Link>
      ) : (
        <SignInButton mode="modal">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105">
            Report Lost
          </button>
        </SignInButton>
      )}

      {/* Desktop Search Bar (Centered) */}
      <div className="w-full max-w-lg relative">
        <input
          type="text"
          placeholder="Search items, locations, or categories..."
          className="w-full p-2 pl-4 rounded-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-gray-800">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Auth Links */}
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105">
            Login
          </button>
        </SignInButton>
      ) : (
        <UserButton afterSignOutUrl="/" />
      )}
    </div>
  );
};

export default DesktopLinks;
