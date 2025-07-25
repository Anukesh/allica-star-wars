import type { Middleware } from "@reduxjs/toolkit";
import { starWarsApi } from "./api";
import type { Character } from "../types/starwars";
import { getIdFromUrl } from "../utils/url";

const overrideCharacter = (character: Character, favorites: Character[]) => {
  const fav = favorites.find((f) => f.url === character.url);
  return fav
    ? { ...character, height: fav.height, gender: fav.gender }
    : character;
};

export const favoritesOverrideMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const state = store.getState();
    const favorites = state.favorites?.favoriteCharacters ?? [];

    // Override character results from getCharacters
    if (starWarsApi.endpoints.getCharacters.matchFulfilled(action)) {
      return next({
        ...action,
        payload: {
          ...action.payload,
          results: action.payload.results.map((c: Character) =>
            overrideCharacter(c, favorites)
          ),
        },
      });
    }

    // Override individual character response
    if (starWarsApi.endpoints.getCharacterById.matchFulfilled(action)) {
      return next({
        ...action,
        payload: overrideCharacter(action.payload, favorites),
      });
    }

    // Invalidate on updateFavoriteCharacter
    if (action.type === "favorites/updateFavoriteCharacter") {
      const result = next(action);
      const id = getIdFromUrl(action.payload.url);
      // Invalidate RTK Query tags to refetch updated data
      store.dispatch(
        starWarsApi.util.invalidateTags([
          { type: "Characters" },
          { type: "Character", id },
        ])
      );

      return result;
    }

    return next(action);
  };
