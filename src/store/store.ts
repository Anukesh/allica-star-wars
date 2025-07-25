import { configureStore } from "@reduxjs/toolkit";
import { starWarsApi } from "./api";
import favoritesReducer from "./favoritesSlice";
import { favoritesOverrideMiddleware } from "./favoritesOverrideMiddleware";

export const store = configureStore({
  reducer: {
    [starWarsApi.reducerPath]: starWarsApi.reducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(starWarsApi.middleware)
      .concat(favoritesOverrideMiddleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
