// components/Dashboard/ItemCard.jsx

import Link from "next/link";
import {
  MapPin,
  Calendar,
  Tag,
  Clock,
  CircleAlert,
  CheckCircle2,
} from "lucide-react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ItemCard = ({ item }) => {
  // Determine the type, colors, and icons based on the item's status
  const isLost = item.status === "Lost";
  const primaryColor = isLost ? "border-red-500" : "border-green-500";
  const statusBg = isLost ? "bg-red-500" : "bg-green-600";
  const statusIcon = isLost ? CircleAlert : CheckCircle2;
  const dateLabel = isLost ? "Lost On" : "Found On";
  const locationLabel = isLost ? "Last Seen" : "Found At";

  const StatusIcon = statusIcon;

  return (
    // Wrap the entire card content in the Link component, directing to the detail page
    <Link
      href={`/item/${item._id}`} // Dynamic route to the detail page
      className="block h-full"
    >
      <div
        className={`bg-white rounded-xl shadow-lg overflow-hidden border-t-4 ${primaryColor} transition-shadow duration-300 hover:shadow-2xl hover:scale-[1.02] transform duration-150 h-full`}
      >
        {/* Header: Item Title and Status Tag */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 pr-4">
              {item.item_name}
            </h3>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${statusBg} uppercase`}
            >
              <StatusIcon className="w-4 h-4 mr-1" />
              {item.status}
            </span>
          </div>

          {/* Key Details Grid */}
          <div className="space-y-3 text-sm text-gray-600">
            {/* Category */}
            <p className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-semibold">Category:</span> {item.category}
            </p>

            {/* Location */}
            <p className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-semibold">{locationLabel}:</span>{" "}
              {item.last_seen_location}
            </p>

            {/* Date Lost/Found */}
            <p className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-semibold">{dateLabel}:</span>{" "}
              {formatDate(isLost ? item.date_lost : item.date_found)}
            </p>

            {/* Date Submitted */}
            <p className="flex items-center border-t pt-3 mt-3 text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-2" />
              Reported on: {formatDate(item.date_submitted)}
            </p>
          </div>
        </div>

        {/* Description (Optional) */}
        <div className="border-t bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Description:
          </p>
          <p className="text-sm text-gray-600 italic line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Visual indicator that it's clickable */}
        <div className="p-4 bg-gray-100 text-center text-blue-600 font-semibold text-sm hover:underline">
          Click to View Details
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
