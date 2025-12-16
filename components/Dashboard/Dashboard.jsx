"use client";
import { useEffect, useState } from "react";
import ItemCard from "@/components/Dashboard/ItemCard";
import { AlertTriangle, Home } from "lucide-react";
import { useSearch } from "@/components/Context/SearchContext";
import SpinningLoader from "../miscellaneous/SpinningLoader";

const Dashboard = () => {
  const { search } = useSearch();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchItems() {
      setLoading(true);
      setError(null);
      try {
        const q = search ? `?q=${encodeURIComponent(search)}` : "";
        const res = await fetch(`/api/items${q}`);
        if (!res.ok) throw new Error("Failed to fetch item data");
        const data = await res.json();
        if (!ignore) setItems(data);
      } catch (e) {
        if (!ignore)
          setError(
            "Could not load items from the server. Please check the API connection."
          );
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchItems();
    return () => {
      ignore = true;
    };
  }, [search]);

  return (
    <>
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <Home className="w-7 h-7 mr-3 text-blue-600" />
          Live Item Feed
        </h1>
      </div>
      {error && (
        <div className="flex items-center justify-center p-6 bg-red-100 text-red-800 rounded-lg shadow-md mb-8">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <p className="font-medium">{error}</p>
        </div>
      )}
      {loading && <SpinningLoader color="text-blue-600" size={50} />}
      {items.length === 0 && !error && !loading && (
        <div className="text-center py-16">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            No items reported yet.
          </h2>
          <p className="text-gray-500 mt-2">
            Be the first to report a lost or found item!
          </p>
        </div>
      )}
      {items.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
