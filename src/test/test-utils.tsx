import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import type { ReactElement } from "react";
import favoritesReducer from "../store/favoritesSlice";
import { starWarsApi } from "../store/api";

export interface RenderOptions {
  preloadedState?: any;
  store?: any;
  withRouter?: boolean;
  includeApiMiddleware?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions = {}
) {
  const {
    preloadedState,
    store,
    withRouter = true,
    includeApiMiddleware = false,
  } = options;

  const testStore =
    store ||
    configureStore({
      reducer: {
        favorites: favoritesReducer,
        ...(includeApiMiddleware && {
          [starWarsApi.reducerPath]: starWarsApi.reducer,
        }),
      } as any,
      middleware: (getDefaultMiddleware) =>
        includeApiMiddleware
          ? getDefaultMiddleware().concat(starWarsApi.middleware)
          : getDefaultMiddleware(),
      preloadedState,
    });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={testStore}>
        {withRouter ? <BrowserRouter>{children}</BrowserRouter> : children}
      </Provider>
    );
  }

  return {
    store: testStore,
    ...render(ui, { wrapper: Wrapper }),
  };
}

export * from "@testing-library/react";
