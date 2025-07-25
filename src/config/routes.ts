export const ROUTES = {
  HOME: "/",
  FAVORITES: "/favorites",
  CHARACTER_DETAILS: "/character/:id",
  NOT_FOUND: "*",
} as const;

// Helper function to generate character detail route with ID
export const getCharacterDetailsPath = (id: string | number): string => {
  return ROUTES.CHARACTER_DETAILS.replace(":id", id.toString());
};
