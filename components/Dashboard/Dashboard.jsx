"use client";
import { useEffect, useState, useCallback } from "react";
import ItemCard from "@/components/Dashboard/ItemCard";
import { AlertTriangle, Home } from "lucide-react";
import SpinningLoader from "../miscellaneous/SpinningLoader";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "@/components/Context/SearchContext";

const PAGE_LIMIT = 9;

const Dashboard = () => {

  const { search } = useSearch();

  const [items, setItems] = useState([]);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);


  const fetchItems = useCallback(async (pageNum, currentSearch) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: PAGE_LIMIT,
      });
      if (currentSearch) params.append("q", currentSearch);


      const res = await fetch(`/api/items?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch item data");
      const data = await res.json();

      // Return both items and total count
      return {
        items: Array.isArray(data.allItems) ? data.allItems : [],
        totalItems: data.totalItems || 0,
      };
    } catch (e) {
      console.error(e);
      setError(
        "Could not load items from the server. Please check the API connection."
      );
      return { items: [], totalItems: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load items when search term changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems(1, debouncedSearch).then(({ items: newItems, totalItems }) => {
      setItems(newItems);
      setHasMore(newItems.length < totalItems);
    });
  }, [debouncedSearch, fetchItems]);

  const loadMoreItems = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage, debouncedSearch).then(
      ({ items: newItems, totalItems }) => {
        setItems((prevItems) => [...prevItems, ...newItems]);
        setHasMore(items.length + newItems.length < totalItems);
      }
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <Home className="w-7 h-7 mr-3 text-blue-600" />
          Live Item Feed
        </h1>

      </div>

      {error && !loading && (
        <div className="flex items-center justify-center p-6 bg-red-100 text-red-800 rounded-lg shadow-md mb-8">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {loading && <SpinningLoader color="text-blue-600" size={50} />}

      {items.length === 0 && !error && !loading && (
        <div className="text-center py-16">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            No items found matching your search.
          </h2>
          <p className="text-gray-500 mt-2">
            Try a different search term or check back later!
          </p>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreItems}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
            disabled={loading}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default Dashboard;
