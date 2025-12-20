// components/ReportLost/ReportLostForm.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";

const ReportLostForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    last_seen_location: "",
    date_lost: "",
    description: "",
    contact_email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const categories = [
    "Electronics",
    "Wallets/Bags",
    "Keys",
    "Clothing",
    "Documents",
    "Jewelry",
    "Other",
  ];

  const inputClasses =
    "w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = `${key.replace(/_/g, " ")} is required.`;
      }
    });

    if (formData.item_name.length < 3 || formData.item_name.length > 100) {
      newErrors.item_name = "Item name must be between 3 and 100 characters.";
    }

    if (formData.description.length < 10) {
      newErrors.description =
        "Please provide a detailed description (min 10 characters).";
    }

    if (!emailRegex.test(formData.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address.";
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.date_lost > today) {
      newErrors.date_lost = "Date lost cannot be in the future.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please correct the errors in the form before submitting.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/lost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Success! Your lost item report has been filed.",
        });

        setFormData({
          item_name: "",
          category: "",
          last_seen_location: "",
          date_lost: "",
          description: "",
          contact_email: "",
        });

        setTimeout(() => {
          router.push("/");
        }, 1500);

        setErrors({});
      } else {
        setMessage({
          type: "error",
          text: data?.error || "Submission failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = () => {
    if (!message.text) return null;

    const baseClasses = "flex items-center p-3 my-4 rounded-lg font-medium";
    const successClasses = "bg-green-100 text-green-700";
    const errorClasses = "bg-red-100 text-red-700";
    const Icon = message.type === "success" ? CheckCircle : AlertTriangle;

    return (
      <div
        className={`${baseClasses} ${
          message.type === "success" ? successClasses : errorClasses
        }`}
      >
        <Icon className="w-5 h-5 mr-2" />
        {message.text}
      </div>
    );
  };

  const getInputClass = (field) =>
    `${inputClasses} ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 max-w-2xl mx-auto border-t-4 border-orange-500">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Report a Lost Item
      </h1>
      <p className="text-gray-600 mb-6">
        Provide as much detail as possible to help us find your item quickly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Item Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Item Name / Title
          </label>
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            className={getInputClass("item_name")}
            placeholder="e.g., Black iPhone 14 Pro Max"
          />
          {renderError("item_name")}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={getInputClass("category")}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {renderError("category")}
        </div>

        {/* Last Seen Location */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Last Seen Location
          </label>
          <input
            type="text"
            name="last_seen_location"
            value={formData.last_seen_location}
            onChange={handleChange}
            className={getInputClass("last_seen_location")}
            placeholder="e.g., Library 3rd Floor, Starbucks near main gate"
          />
          {renderError("last_seen_location")}
        </div>

        {/* Date Lost */}
        <div>
          <label className="block text-sm font-semibold mb-1">Date Lost</label>
          <input
            type="date"
            name="date_lost"
            value={formData.date_lost}
            onChange={handleChange}
            className={getInputClass("date_lost")}
          />
          {renderError("date_lost")}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Detailed Description (Color, Model, Unique Marks)
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className={getInputClass("description")}
            placeholder="e.g., Has a small dent on the corner. The case is clear with a university sticker."
          />
          {renderError("description")}
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Contact Email
          </label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className={getInputClass("contact_email")}
            placeholder="your.email@example.com"
          />
          {renderError("contact_email")}
        </div>

        {renderMessage()}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Submit Lost Item Report"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportLostForm;
