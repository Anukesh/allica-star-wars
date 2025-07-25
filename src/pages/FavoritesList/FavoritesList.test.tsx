import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import FavoritesList from "./FavoritesList";
import { mockCharacter, mockCharacterResponse } from "../../test/mocks";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../../store/favoritesSlice";

// Mock CharacterCard
vi.mock("../../components/CharacterCard/CharacterCard", () => ({
  default: ({ character, showHeight, allowEditing }: any) => (
    <div data-testid="character-card">
      <span data-testid="character-name">{character.name}</span>
      <span data-testid="show-height">{showHeight.toString()}</span>
      <span data-testid="allow-editing">{allowEditing.toString()}</span>
    </div>
  ),
}));

describe("FavoritesList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createStoreWithFavorites = (favorites: any[] = []) => {
    return configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
      preloadedState: {
        favorites: {
          favoriteCharacters: favorites,
        },
      },
    });
  };

  it("renders the Favorite Characters heading", () => {
    const store = createStoreWithFavorites();
    renderWithProviders(<FavoritesList />, { store });

    expect(
      screen.getByRole("heading", { name: /favorite characters/i })
    ).toBeInTheDocument();
  });

  it("displays empty state when no favorites exist", () => {
    const store = createStoreWithFavorites([]);
    renderWithProviders(<FavoritesList />, { store });

    expect(screen.getByText("No favorite characters yet.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Go to the characters page and click the heart icon to add favorites!"
      )
    ).toBeInTheDocument();
  });

  it("renders favorites grid when favorites exist", () => {
    const store = createStoreWithFavorites([mockCharacter]);
    renderWithProviders(<FavoritesList />, { store });

    expect(document.querySelector(".favorites-grid")).toBeInTheDocument();
  });

  it("renders favorite characters", () => {
    const secondCharacter = {
      ...mockCharacter,
      name: "Princess Leia",
      url: "https://swapi.dev/api/people/5/",
    };
    const store = createStoreWithFavorites([mockCharacter, secondCharacter]);
    renderWithProviders(<FavoritesList />, { store });

    const characterCards = screen.getAllByTestId("character-card");
    expect(characterCards).toHaveLength(2);

    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Princess Leia")).toBeInTheDocument();
  });

  it("passes showHeight=true to all character cards", () => {
    const store = createStoreWithFavorites([mockCharacter]);
    renderWithProviders(<FavoritesList />, { store });

    expect(screen.getByTestId("show-height")).toHaveTextContent("true");
  });

  it("passes allowEditing=true to all character cards", () => {
    const store = createStoreWithFavorites([mockCharacter]);
    renderWithProviders(<FavoritesList />, { store });

    expect(screen.getByTestId("allow-editing")).toHaveTextContent("true");
  });

  it("renders all characters from mockCharacterResponse as favorites", () => {
    const store = createStoreWithFavorites(mockCharacterResponse.results);
    renderWithProviders(<FavoritesList />, { store });

    const characterCards = screen.getAllByTestId("character-card");
    expect(characterCards).toHaveLength(mockCharacterResponse.results.length);

    mockCharacterResponse.results.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });

  it("uses character.url as the key for mapping", () => {
    const charactersWithSameData = [
      { ...mockCharacter, url: "https://swapi.dev/api/people/1/" },
      { ...mockCharacter, url: "https://swapi.dev/api/people/2/" },
    ];
    const store = createStoreWithFavorites(charactersWithSameData);
    renderWithProviders(<FavoritesList />, { store });

    const characterCards = screen.getAllByTestId("character-card");
    expect(characterCards).toHaveLength(2);
  });
});
