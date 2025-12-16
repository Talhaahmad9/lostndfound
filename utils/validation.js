export function validateLostItem(data) {
  const {
    item_name,
    category,
    last_seen_location,
    date_lost,
    description,
    contact_email,
  } = data;
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!item_name || item_name.length < 3 || item_name.length > 100) {
    errors.item_name = "Item name must be between 3 and 100 characters.";
  }
  if (!category || typeof category !== "string") {
    errors.category = "Invalid category.";
  }
  if (!last_seen_location || last_seen_location.length < 5) {
    errors.last_seen_location =
      "Last seen location is required and must be descriptive.";
  }
  if (!description || description.length < 10 || description.length > 500) {
    errors.description = "Description must be between 10 and 500 characters.";
  }
  if (!contact_email || !emailRegex.test(contact_email)) {
    errors.contact_email = "Invalid contact email format.";
  }
  if (date_lost) {
    const lostDate = new Date(date_lost);
    const today = new Date();
    if (isNaN(lostDate) || lostDate > today) {
      errors.date_lost = "Invalid or future date provided.";
    }
  } else {
    errors.date_lost = "Date lost is required.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateFoundItem(data) {
  const {
    item_name,
    category,
    last_seen_location,
    date_found,
    description,
    contact_email,
  } = data;
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!item_name || item_name.length < 3 || item_name.length > 100) {
    errors.item_name = "Item name must be between 3 and 100 characters.";
  }
  if (!category || typeof category !== "string") {
    errors.category = "Invalid category.";
  }
  if (!last_seen_location || last_seen_location.length < 5) {
    errors.last_seen_location = "Location is required and must be descriptive.";
  }
  if (!description || description.length < 10 || description.length > 500) {
    errors.description = "Description must be between 10 and 500 characters.";
  }
  if (!contact_email || !emailRegex.test(contact_email)) {
    errors.contact_email = "Invalid contact email format.";
  }
  if (date_found) {
    const foundDate = new Date(date_found);
    const today = new Date();
    if (isNaN(foundDate) || foundDate > today) {
      errors.date_found = "Invalid or future date provided.";
    }
  } else {
    errors.date_found = "Date found is required.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
