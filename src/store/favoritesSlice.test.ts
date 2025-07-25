import { describe, it, expect, beforeEach, vi } from "vitest";
import favoritesReducer, {
  toggleFavorite,
  updateFavoriteCharacter,
} from "./favoritesSlice";
import { mockCharacter } from "../test/mocks";
import type { Character } from "../types/starwars";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("favoritesSlice", () => {
  const mockCharacter2: Character = {
    ...mockCharacter,
    name: "Leia Organa",
    url: "https://swapi.dev/api/people/5/",
    gender: "female",
    height: "150",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("initializes with empty array when localStorage is empty", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const state = favoritesReducer(undefined, { type: "@@INIT" });

      expect(state.favoriteCharacters).toEqual([]);
    });
  });

  describe("toggleFavorite action", () => {
    it("adds character to favorites when not already present", () => {
      const initialState = { favoriteCharacters: [] };
      const action = toggleFavorite(mockCharacter);
      const newState = favoritesReducer(initialState, action);

      expect(newState.favoriteCharacters).toHaveLength(1);
      expect(newState.favoriteCharacters[0]).toEqual(mockCharacter);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "starwars-favorites",
        JSON.stringify([mockCharacter])
      );
    });

    it("removes character from favorites when already present", () => {
      const initialState = {
        favoriteCharacters: [mockCharacter, mockCharacter2],
      };
      const action = toggleFavorite(mockCharacter);
      const newState = favoritesReducer(initialState, action);

      expect(newState.favoriteCharacters).toHaveLength(1);
      expect(newState.favoriteCharacters[0]).toEqual(mockCharacter2);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "starwars-favorites",
        JSON.stringify([mockCharacter2])
      );
    });
  });

  describe("updateFavoriteCharacter action", () => {
    it("updates existing favorite character properties", () => {
      const initialState = { favoriteCharacters: [mockCharacter] };
      const updates = { height: "180", gender: "other" };
      const action = updateFavoriteCharacter({
        url: mockCharacter.url,
        updates,
      });
      const newState = favoritesReducer(initialState, action);

      expect(newState.favoriteCharacters[0]).toEqual({
        ...mockCharacter,
        ...updates,
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "starwars-favorites",
        JSON.stringify([{ ...mockCharacter, ...updates }])
      );
    });
  });
});
