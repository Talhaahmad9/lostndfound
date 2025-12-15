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
  const isLost = item.status === "Lost";
  const primaryColor = isLost ? "border-red-500" : "border-green-500";
  const statusBg = isLost ? "bg-red-500" : "bg-green-600";
  const statusIcon = isLost ? CircleAlert : CheckCircle2;
  const dateLabel = isLost ? "Lost On" : "Found On";
  const locationLabel = isLost ? "Last Seen" : "Found At";
  const StatusIcon = statusIcon;
  return (
    <Link href={`/item/${item._id}`} className="block h-full">
      <div
        className={`bg-white rounded-xl shadow-lg overflow-hidden border-t-4 ${primaryColor} transition-shadow duration-300 hover:shadow-2xl hover:scale-[1.02] transform duration-150 h-full`}
      >
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
          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              {item.category}
            </p>
            <p className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              {item.last_seen_location}
            </p>
            <p className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              {dateLabel}: {formatDate(isLost ? item.date_lost : item.date_found)}
            </p>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              Reported: {formatDate(item.date_submitted)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
