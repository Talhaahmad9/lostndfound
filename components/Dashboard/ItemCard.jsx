// components/Dashboard/ItemCard.jsx

import Link from "next/link";
import {
  MapPin,
  Calendar,
  Tag,
  Clock,
  CircleAlert,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { useState } from "react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ItemCard = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const isLost = item.status === "Lost";
  const borderColor = isLost ? "border-orange-500" : "border-blue-600";
  const statusBg = isLost ? "bg-orange-500" : "bg-blue-600";
  const statusText = isLost ? "text-orange-700" : "text-blue-700";
  const statusIcon = isLost ? CircleAlert : CheckCircle2;
  const dateLabel = isLost ? "Lost On" : "Found On";
  const locationLabel = isLost ? "Last Seen" : "Found At";
  const StatusIcon = statusIcon;

  const handleViewDetails = (e) => {
    setLoading(true);
    // Let the Link handle navigation after a short delay for effect
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="block h-full">
      <div
        className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 ${borderColor} transition-shadow hover:shadow-2xl hover:scale-[1.02] transform duration-200 h-full group`}
      >
        <div
          className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl font-bold text-xs ${statusBg} text-white tracking-widest z-10`}
        >
          {item.status}
        </div>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center mb-2">
            <StatusIcon className={`w-6 h-6 mr-2 ${statusText}`} />
            <h3 className="text-2xl font-extrabold text-gray-900 flex-1 truncate">
              {item.item_name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-gray-400" />
              {item.category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              {item.last_seen_location}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {dateLabel}:{" "}
              {formatDate(isLost ? item.date_lost : item.date_found)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Reported: {formatDate(item.date_submitted)}
            </span>
          </div>
          <div className="flex-1 mb-4">
            <p className="text-gray-600 text-sm italic line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-auto mb-4">
            <Mail className={`w-5 h-5 ${statusText}`} />
            <span className="text-xs text-gray-500">Contact available</span>
          </div>
          <Link href={`/item/${item._id}`} legacyBehavior>
            <a
              className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-200 w-full ${
                isLost
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              onClick={handleViewDetails}
              aria-disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Getting details...
                </>
              ) : (
                "View Details"
              )}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
