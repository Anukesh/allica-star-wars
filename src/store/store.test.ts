import { describe, it, expect } from "vitest";
import { store } from "./store";
import { toggleFavorite, updateFavoriteCharacter } from "./favoritesSlice";
import { mockCharacter } from "../test/mocks";
import type { RootState } from "./store";

describe("store", () => {
  describe("store configuration", () => {
    it("has the correct initial state structure", () => {
      const state = store.getState() as RootState;

      expect(state).toHaveProperty("favorites");
      expect(state).toHaveProperty("starWarsApi");
      expect(state.favorites).toHaveProperty("favoriteCharacters");
      expect(Array.isArray(state.favorites.favoriteCharacters)).toBe(true);
    });
  });

  describe("store integration", () => {
    it("dispatches actions successfully", () => {
      expect(() => {
        store.dispatch(toggleFavorite(mockCharacter));
      }).not.toThrow();

      // Clean up
      store.dispatch(toggleFavorite(mockCharacter));
    });

    it("handles favorites slice actions", () => {
      const initialState = store.getState() as RootState;
      const characterInFavorites =
        initialState.favorites.favoriteCharacters.find(
          (c) => c.url === mockCharacter.url
        );

      // If character is already in favorites, remove it first to start clean
      if (characterInFavorites) {
        store.dispatch(toggleFavorite(mockCharacter));
      }

      const cleanState = store.getState() as RootState;
      const cleanFavoritesCount =
        cleanState.favorites.favoriteCharacters.length;

      // Add a favorite
      store.dispatch(toggleFavorite(mockCharacter));

      const newState = store.getState() as RootState;
      expect(newState.favorites.favoriteCharacters.length).toBe(
        cleanFavoritesCount + 1
      );

      // Remove the favorite
      store.dispatch(toggleFavorite(mockCharacter));

      const finalState = store.getState() as RootState;
      expect(finalState.favorites.favoriteCharacters.length).toBe(
        cleanFavoritesCount
      );
    });

    it("handles updateFavoriteCharacter action", () => {
      // Ensure character is not in favorites initially
      const initialState = store.getState() as RootState;
      const characterInFavorites =
        initialState.favorites.favoriteCharacters.find(
          (c) => c.url === mockCharacter.url
        );

      if (characterInFavorites) {
        store.dispatch(toggleFavorite(mockCharacter));
      }

      // Add the character to favorites
      store.dispatch(toggleFavorite(mockCharacter));

      // Then update it
      store.dispatch(
        updateFavoriteCharacter({
          url: mockCharacter.url,
          updates: { height: "180", gender: "other" },
        })
      );

      const state = store.getState() as RootState;
      const updatedCharacter = state.favorites.favoriteCharacters.find(
        (c) => c.url === mockCharacter.url
      );

      expect(updatedCharacter).toBeDefined();
      expect(updatedCharacter?.height).toBe("180");
      expect(updatedCharacter?.gender).toBe("other");

      // Clean up
      store.dispatch(toggleFavorite(mockCharacter));
    });
  });

  describe("middleware integration", () => {
    it("includes RTK Query middleware", () => {
      const state = store.getState() as RootState;
      expect(state.starWarsApi).toBeDefined();
    });
  });
});
