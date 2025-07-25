import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Character } from "../types/starwars";
interface FavoritesState {
  favoriteCharacters: Character[];
}

const STORAGE_KEY = "starwars-favorites";

const loadFavorites = (): Character[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites: Character[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {}
};

const initialState: FavoritesState = {
  favoriteCharacters: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, { payload }: PayloadAction<Character>) => {
      const idx = state.favoriteCharacters.findIndex(
        (c) => c.url === payload.url
      );
      idx === -1
        ? state.favoriteCharacters.push(payload)
        : state.favoriteCharacters.splice(idx, 1);
      saveFavorites(state.favoriteCharacters);
    },
    updateFavoriteCharacter: (
      state,
      {
        payload,
      }: PayloadAction<{
        url: string;
        updates: Partial<Pick<Character, "height" | "gender">>;
      }>
    ) => {
      const char = state.favoriteCharacters.find((c) => c.url === payload.url);
      if (char) Object.assign(char, payload.updates);
      saveFavorites(state.favoriteCharacters);
    },
  },
});

export const { toggleFavorite, updateFavoriteCharacter } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
