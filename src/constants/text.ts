// Static text content constants for the application

export const API_CONSTANTS = {
  BASE_URL: "https://swapi.dev/api/",
} as const;

export const CHARACTER_CARD_TEXT = {
  GENDER_LABEL: "Gender:",
  HEIGHT_LABEL: "Height:",
  HOMEWORLD_LABEL: "Homeworld:",
  LOADING: "Loading...",
  SAVE_BUTTON: "Save",
  CANCEL_BUTTON: "Cancel",
  FAVORITE_BUTTON_ADD: "Add to favorites",
  FAVORITE_BUTTON_REMOVE: "Remove from favorites",
  EDIT_BUTTON_EDIT: "Edit character",
  EDIT_BUTTON_CANCEL: "Cancel editing",
  GENDER_OPTIONS: {
    MALE: "male",
    FEMALE: "female",
    NOT_APPLICABLE: "n/a",
  },
} as const;
