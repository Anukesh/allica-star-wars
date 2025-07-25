import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import favoritesReducer from "./store/favoritesSlice";
import { starWarsApi } from "./store/api";

// Mock react-router-dom to use MemoryRouter instead of BrowserRouter
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock store setup for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
      [starWarsApi.reducerPath]: starWarsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(starWarsApi.middleware),
    preloadedState: {
      favorites: {
        favoriteCharacters: [],
      },
      ...initialState,
    },
  });
};

const renderApp = (initialRoute = "/") => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe("App Component", () => {
  it("renders the navigation", () => {
    renderApp();

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Characters" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Favorites" })).toBeInTheDocument();
  });

  it("renders navigation links with correct href", () => {
    renderApp();

    const charactersLink = screen.getByRole("link", { name: "Characters" });
    const favoritesLink = screen.getByRole("link", { name: "Favorites" });

    expect(charactersLink).toHaveAttribute("href", "/");
    expect(favoritesLink).toHaveAttribute("href", "/favorites");
  });

  it("displays favorites count when favorites exist", () => {
    const storeWithFavorites = createMockStore({
      favorites: {
        favoriteCharacters: [
          { id: "1", name: "Luke Skywalker" },
          { id: "2", name: "Leia Organa" },
        ],
      },
    });

    render(
      <Provider store={storeWithFavorites}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not display favorites count when no favorites", () => {
    renderApp();
    const favoritesLink = screen.getByRole("link", { name: "Favorites" });
    expect(favoritesLink).not.toHaveTextContent(/\d/);
  });

  it("renders the main app container", () => {
    const { container } = renderApp();
    expect(container.querySelector(".app")).toBeInTheDocument();
  });

  it("renders CharacterList component on home route", () => {
    renderApp("/");
    expect(
      screen.getByPlaceholderText("Search characters...")
    ).toBeInTheDocument();
  });

  it("renders FavoritesList component on favorites route", () => {
    renderApp("/favorites");
    expect(
      screen.getByRole("heading", { name: /favorite characters/i })
    ).toBeInTheDocument();
  });

  it("renders NotFound component on invalid route", () => {
    renderApp("/invalid-route");
    expect(screen.getByRole("heading", { name: /404/i })).toBeInTheDocument();
  });
});
