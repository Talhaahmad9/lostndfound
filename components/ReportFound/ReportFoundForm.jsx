// components/forms/ReportFoundForm.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";

const ReportFoundForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    last_seen_location: "",
    date_found: "",
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

    if (formData.contact_email && !emailRegex.test(formData.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address.";
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.date_found > today) {
      newErrors.date_found = "Date found cannot be in the future.";
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
      const response = await fetch("/api/found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Thank you! Your found item report has been filed.",
        });

        setTimeout(() => {
          router.push("/");
        }, 1500);

        setErrors({});
      } else {
        const errorText = data.error || data.message || "Server error.";
        setMessage({
          type: "error",
          text: `Failed to submit report: ${errorText}`,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
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

  const getInputClass = (fieldName) => {
    const base = inputClasses;
    const errorBorder = errors[fieldName]
      ? "border-red-500"
      : "border-gray-300";
    return `${base.replace(
      /border-gray-300|border-red-500/g,
      ""
    )} ${errorBorder}`;
  };

  const renderError = (fieldName) => {
    if (!errors[fieldName]) return null;
    return <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>;
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 max-w-2xl mx-auto border-t-4 border-blue-600">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Report a Found Item
      </h1>
      <p className="text-gray-600 mb-6">
        Thank you for taking the time to report an item you found.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Item Name */}
        <div>
          <label
            htmlFor="item_name"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Item Name / Title
          </label>
          <input
            type="text"
            name="item_name"
            id="item_name"
            value={formData.item_name}
            onChange={handleChange}
            required
            placeholder="e.g., Apple Watch, Red Backpack"
            className={getInputClass("item_name")}
          />
          {renderError("item_name")}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
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

        {/* Location Found */}
        <div>
          <label
            htmlFor="last_seen_location"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Location Found
          </label>
          <input
            type="text"
            name="last_seen_location"
            id="last_seen_location"
            value={formData.last_seen_location}
            onChange={handleChange}
            required
            placeholder="e.g., Cafeteria table 5, Sidewalk near clock tower"
            className={getInputClass("last_seen_location")}
          />
          {renderError("last_seen_location")}
        </div>

        {/* Date Found */}
        <div>
          <label
            htmlFor="date_found"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Date Found
          </label>
          <input
            type="date"
            name="date_found"
            id="date_found"
            value={formData.date_found}
            onChange={handleChange}
            required
            className={getInputClass("date_found")}
          />
          {renderError("date_found")}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Detailed Description (Color, Model, Unique Marks)
          </label>
          <textarea
            name="description"
            id="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="e.g., Has a small dent on the corner. The case is clear with a university sticker."
            className={getInputClass("description")}
          />
          {renderError("description")}
        </div>

        {/* Contact Email */}
        <div>
          <label
            htmlFor="contact_email"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Your Contact Email
          </label>
          <input
            type="email"
            name="contact_email"
            id="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            className={getInputClass("contact_email")}
          />
          {renderError("contact_email")}
        </div>

        {/* Messages */}
        {renderMessage()}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            "Submit Found Item Report"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportFoundForm;
