import type { Middleware } from "@reduxjs/toolkit";
import { starWarsApi } from "./api";
import type { Character } from "../types/starwars";

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

    // Handle API response fulfillment - override with favorites data
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

    if (starWarsApi.endpoints.getCharacterById.matchFulfilled(action)) {
      return next({
        ...action,
        payload: overrideCharacter(action.payload, favorites),
      });
    }

    if (action.type === "favorites/updateFavoriteCharacter") {
      const result = next(action);

      setTimeout(() => {
        // Get current API state to find cached queries
        const apiState = store.getState().starWarsApi;

        // Remove all getCharacters and getCharacterById queries from cache
        Object.keys(apiState.queries || {}).forEach((key) => {
          if (
            key.startsWith("getCharacters(") ||
            key.startsWith("getCharacterById(")
          ) {
            store.dispatch({
              type: "starWarsApi/removeQueryResult",
              payload: { queryCacheKey: key },
            });
          }
        });
      }, 0);

      return result;
    }

    return next(action);
  };
