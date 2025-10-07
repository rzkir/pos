import { format } from "date-fns";

import { id } from "date-fns/locale";

/**
 * Format date and time in Indonesian format (e.g., "10 Oktober 2025 14:30")
 * @param date - The date to format
 * @returns Formatted date and time string in Indonesian
 */
export const formatDateTimeIndonesian = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return format(dateObj, "d MMMM yyyy HH:mm", { locale: id });
  } catch (error) {
    console.error("Error formatting Indonesian date and time:", error);
    return "Invalid Date";
  }
};
