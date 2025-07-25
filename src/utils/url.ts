/**
 * Extracts the ID from a SWAPI URL
 * @param url - URL in format "https://swapi.dev/api/resource/:id/"
 * @returns The ID from the URL
 * @example
 * getIdFromUrl("https://swapi.dev/api/planets/1/") // returns "1"
 */
export const getIdFromUrl = (url: string): string => {
  return url.split("/").filter(Boolean).pop() || "";
};
