// app/item/[id]/page.jsx

import {
  MapPin,
  Calendar,
  Tag,
  Clock,
  Mail,
  CircleAlert,
  CheckCircle2,
} from "lucide-react";
import { notFound } from "next/navigation";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

async function getItemDetails(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/items/${id}`,
    {
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("Failed to fetch item details");
  }

  return res.json();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getItemDetails(id);

  return {
    title: item.item_name,
    description: item.description,
    openGraph: {
      title: item.item_name,
      description: item.description,
      images: [
        {
          url: item.image_url || "/images/logo.png",
          width: 1200,
          height: 630,
          alt: item.item_name,
        },
      ],
    },
  };
}

const ItemDetailPage = async ({ params }) => {
  const { id } = await params;
  const item = await getItemDetails(id);

  const isLost = item.status === "Lost";
  const primaryColor = isLost ? "border-red-600" : "border-green-600";
  const bgColor = isLost ? "bg-red-50" : "bg-green-50";
  const textColor = isLost ? "text-red-700" : "text-green-700";
  const statusIcon = isLost ? CircleAlert : CheckCircle2;
  const dateLabel = isLost ? "Lost On" : "Found On";
  const locationLabel = isLost ? "Last Seen Location" : "Location Found";

  const StatusIcon = statusIcon;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div
        className={`bg-white rounded-xl shadow-2xl p-8 border-t-8 ${primaryColor}`}
      >
        <div className="flex justify-between items-start mb-6 pb-4 border-b">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 break-words pr-4">
            {item.item_name}
          </h1>
          <div
            className={`flex items-center rounded-full px-4 py-2 font-bold uppercase text-sm ${bgColor} ${textColor}`}
          >
            <StatusIcon className="w-5 h-5 mr-2" />
            {item.status} Item
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-gray-700 mb-8">
          <div className="flex items-center">
            <Tag className="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Category
              </p>
              <p className="text-lg">{item.category}</p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                {locationLabel}
              </p>
              <p className="text-lg">{item.last_seen_location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                {dateLabel}
              </p>
              <p className="text-lg">
                {formatDate(isLost ? item.date_lost : item.date_found)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Reported On
              </p>
              <p className="text-lg">{formatDate(item.date_submitted)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-8">
          <p className="text-sm font-bold text-gray-800 mb-2">
            Detailed Description:
          </p>
          <p className="text-base text-gray-700 italic">{item.description}</p>
        </div>
        <div className={`p-4 rounded-lg border-2 ${primaryColor}`}>
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-2">
            <Mail className={`w-6 h-6 mr-3 ${textColor}`} />
            Contact the Reporter
          </h2>
          <p className="text-base text-gray-700">
            If this is your item (or you found it), please contact the person
            who reported it:
          </p>
          <a
            href={`mailto:${item.contact_email}`}
            className={`mt-3 inline-block font-semibold text-lg hover:underline ${textColor}`}
          >
            {item.contact_email}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
