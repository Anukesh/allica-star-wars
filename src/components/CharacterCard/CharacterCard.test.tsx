import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import CharacterCard from "./CharacterCard";
import favoritesReducer from "../../store/favoritesSlice";
import { mockCharacter } from "../../test/mocks";
import { renderWithProviders } from "../../test/test-utils";

// Mock the API hook
vi.mock("../../store/api", () => ({
  useGetPlanetByIdQuery: vi.fn(),
}));

import { useGetPlanetByIdQuery } from "../../store/api";
const mockUseGetPlanetByIdQuery = vi.mocked(useGetPlanetByIdQuery);

const getStore = (favorite: boolean = false, dispatch?: any) => {
  const store = configureStore({
    reducer: { favorites: favoritesReducer },
    preloadedState: favorite
      ? { favorites: { favoriteCharacters: [mockCharacter] } }
      : undefined,
  });
  if (dispatch) store.dispatch = dispatch;
  return store;
};

const renderCard = (props: any = {}, store?: any) =>
  renderWithProviders(
    <CharacterCard character={mockCharacter} {...props} />,
    store ? { store } : undefined
  );

describe("CharacterCard Component", () => {
  let mockDispatch: any;

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockUseGetPlanetByIdQuery.mockReturnValue({
      data: { name: "Tatooine" },
      isLoading: false,
      error: null,
    } as any);
    vi.clearAllMocks();
  });

  it("renders character name, gender, and homeworld", () => {
    renderCard();
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText(/Gender: male/)).toBeInTheDocument();
    expect(screen.getByText(/Homeworld: Tatooine/)).toBeInTheDocument();
  });

  it("renders favorite button", () => {
    renderCard();
    expect(screen.getByTitle(/Add to favorites/)).toBeInTheDocument();
  });

  it("does not render height by default", () => {
    renderCard();
    expect(screen.queryByText(/Height:/)).not.toBeInTheDocument();
  });

  it("renders height when showHeight prop is true", () => {
    renderCard({ showHeight: true });
    expect(screen.getByText(/Height: 172/)).toBeInTheDocument();
  });

  it("does not render edit button when allowEditing is false", () => {
    renderCard();
    expect(screen.queryByTitle(/Edit character/)).not.toBeInTheDocument();
  });

  it("renders edit button when allowEditing is true and character is favorite", () => {
    renderCard({ allowEditing: true }, getStore(true));
    expect(screen.getByTitle(/Edit character/)).toBeInTheDocument();
  });

  it("calls dispatch when favorite button is clicked", async () => {
    const user = userEvent.setup();
    renderCard({}, getStore(false, mockDispatch));
    const favoriteButton = screen.getByTitle(/Add to favorites/);
    await user.click(favoriteButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "favorites/toggleFavorite",
      payload: mockCharacter,
    });
  });

  it("shows correct favorite button title when character is favorite", () => {
    renderCard({}, getStore(true));
    const favoriteButton = screen.getByTitle(/Remove from favorites/);
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass("favorite");
  });

  it("enters edit mode when edit button is clicked", async () => {
    const user = userEvent.setup();
    renderCard({ allowEditing: true, showHeight: true }, getStore(true));
    const editButton = screen.getByTitle(/Edit character/);
    await user.click(editButton);
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("updates gender selection in edit mode", async () => {
    const user = userEvent.setup();
    renderCard({ allowEditing: true }, getStore(true));
    const editButton = screen.getByTitle(/Edit character/);
    await user.click(editButton);
    const genderSelect = screen.getByDisplayValue("male");
    await user.selectOptions(genderSelect, "female");
    expect(screen.getByDisplayValue("female")).toBeInTheDocument();
  });

  it("updates height input in edit mode", async () => {
    const user = userEvent.setup();
    renderCard({ allowEditing: true, showHeight: true }, getStore(true));
    const editButton = screen.getByTitle(/Edit character/);
    await user.click(editButton);
    const heightInput = screen.getByDisplayValue("172");
    await user.clear(heightInput);
    await user.type(heightInput, "180");
    expect(screen.getByDisplayValue("180")).toBeInTheDocument();
  });

  it("saves changes when save button is clicked", async () => {
    const user = userEvent.setup();
    renderCard(
      { allowEditing: true, showHeight: true },
      getStore(true, mockDispatch)
    );
    const editButton = screen.getByTitle(/Edit character/);
    await user.click(editButton);
    const genderSelect = screen.getByDisplayValue("male");
    await user.selectOptions(genderSelect, "female");
    const saveButton = screen.getByText("Save");
    await user.click(saveButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "favorites/updateFavoriteCharacter",
      payload: {
        url: mockCharacter.url,
        updates: {
          height: "172",
          gender: "female",
        },
      },
    });
  });

  it("cancels changes when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderCard({ allowEditing: true, showHeight: true }, getStore(true));
    const editButton = screen.getByTitle(/Edit character/);
    await user.click(editButton);
    const genderSelect = screen.getByDisplayValue("male");
    await user.selectOptions(genderSelect, "female");
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);
    expect(screen.queryByDisplayValue("female")).not.toBeInTheDocument();
    expect(screen.getByText(/Gender: male/)).toBeInTheDocument();
  });

  it("shows loading message when planet data is not available", () => {
    mockUseGetPlanetByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);
    renderCard();
    expect(screen.getByText(/Homeworld: Loading.../)).toBeInTheDocument();
  });

  it("creates correct navigation link", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/character/1");
  });
});
