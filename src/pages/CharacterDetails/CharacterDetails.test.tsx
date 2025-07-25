import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CharacterDetails from "./CharacterDetails";
import { renderWithProviders } from "../../test/test-utils";
import {
  mockCharacter,
  mockPlanet,
  mockFilm,
  mockFilm2,
  mockStarship,
  mockStarship2,
} from "../../test/mocks";

// Mock the API hooks
vi.mock("../../store/api", () => ({
  useGetCharacterByIdQuery: vi.fn(),
  useGetPlanetByIdQuery: vi.fn(),
  useFetchFilmsQuery: vi.fn(),
  useFetchStarshipsQuery: vi.fn(),
}));

import {
  useGetCharacterByIdQuery,
  useGetPlanetByIdQuery,
  useFetchFilmsQuery,
  useFetchStarshipsQuery,
} from "../../store/api";

const mockUseGetCharacterByIdQuery = vi.mocked(useGetCharacterByIdQuery);
const mockUseGetPlanetByIdQuery = vi.mocked(useGetPlanetByIdQuery);
const mockUseFetchFilmsQuery = vi.mocked(useFetchFilmsQuery);
const mockUseFetchStarshipsQuery = vi.mocked(useFetchStarshipsQuery);

const renderWithRouter = (
  component: React.ReactElement,
  route = "/character/1"
) =>
  renderWithProviders(
    <MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>,
    { withRouter: false }
  );

const setMocks = ({
  character,
  characterLoading = false,
  characterError = null,
  planet,
  planetLoading = false,
  planetError = null,
  films = [],
  filmsLoading = false,
  filmsError = null,
  starships = [],
  starshipsLoading = false,
  starshipsError = null,
}: {
  character?: any;
  characterLoading?: boolean;
  characterError?: any;
  planet?: any;
  planetLoading?: boolean;
  planetError?: any;
  films?: any[];
  filmsLoading?: boolean;
  filmsError?: any;
  starships?: any[];
  starshipsLoading?: boolean;
  starshipsError?: any;
}) => {
  mockUseGetCharacterByIdQuery.mockReturnValue({
    data: character,
    isLoading: characterLoading,
    error: characterError,
  } as any);

  mockUseGetPlanetByIdQuery.mockReturnValue({
    data: planet,
    isLoading: planetLoading,
    error: planetError,
  } as any);

  mockUseFetchFilmsQuery.mockReturnValue({
    data: films,
    isLoading: filmsLoading,
    error: filmsError,
  } as any);

  mockUseFetchStarshipsQuery.mockReturnValue({
    data: starships,
    isLoading: starshipsLoading,
    error: starshipsError,
  } as any);
};

describe("CharacterDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton when character is loading", () => {
    setMocks({
      character: undefined,
      characterLoading: true,
    });
    renderWithRouter(<CharacterDetails />);
    expect(
      screen.getByLabelText("character-details-skeleton")
    ).toBeInTheDocument();
  });

  it("renders error message when character fails to load", () => {
    setMocks({
      character: undefined,
      characterError: { status: 404, data: "Not found" },
    });
    renderWithRouter(<CharacterDetails />);
    expect(
      screen.getByText("Error loading character details")
    ).toBeInTheDocument();
    expect(screen.getByText("← Back to Characters")).toBeInTheDocument();
  });

  it("renders character details successfully", () => {
    setMocks({
      character: mockCharacter,
      planet: mockPlanet,
      films: [mockFilm, mockFilm2],
      starships: [mockStarship, mockStarship2],
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Gender:")).toBeInTheDocument();
    expect(screen.getByText("male")).toBeInTheDocument();
    expect(screen.getByText("Height:")).toBeInTheDocument();
    expect(screen.getByText("172")).toBeInTheDocument();
    expect(screen.getByText("Hair Color:")).toBeInTheDocument();
    expect(screen.getByText("blond")).toBeInTheDocument();
    expect(screen.getByText("Eye Color:")).toBeInTheDocument();
    expect(screen.getByText("blue")).toBeInTheDocument();
    expect(screen.getByText("Home Planet:")).toBeInTheDocument();
    expect(screen.getByText("Tatooine")).toBeInTheDocument();
    expect(screen.getByText("Films:")).toBeInTheDocument();
    expect(
      screen.getByText("A New Hope, The Empire Strikes Back")
    ).toBeInTheDocument();
    expect(screen.getByText("Starships:")).toBeInTheDocument();
    expect(screen.getByText("X-wing, Imperial shuttle")).toBeInTheDocument();
  });

  it("renders back to characters link", () => {
    setMocks({
      character: mockCharacter,
      planet: mockPlanet,
    });
    renderWithRouter(<CharacterDetails />);
    const backLink = screen.getByText("← Back to Characters");
    expect(backLink).toBeInTheDocument();
  });

  it("shows loading state for planet data", () => {
    setMocks({
      character: mockCharacter,
      planet: undefined,
      planetLoading: true,
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Home Planet:")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state for planet data", () => {
    setMocks({
      character: mockCharacter,
      planet: undefined,
      planetError: { status: 404, data: "Not found" },
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Home Planet:")).toBeInTheDocument();
    expect(screen.getByText("Error loading planet")).toBeInTheDocument();
  });

  it("shows loading state for films data", () => {
    setMocks({
      character: mockCharacter,
      planet: mockPlanet,
      filmsLoading: true,
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Films:")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state for films data", () => {
    setMocks({
      character: mockCharacter,
      planet: mockPlanet,
      filmsError: { status: 500, data: "Server error" },
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Films:")).toBeInTheDocument();
    expect(screen.getByText("Error loading films")).toBeInTheDocument();
  });

  it("shows loading state for starships data", () => {
    setMocks({
      character: mockCharacter,
      planet: mockPlanet,
      starshipsLoading: true,
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Starships:")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state for starships data", () => {
    setMocks({
      character: mockCharacter,
      planet: mockPlanet,
      starshipsError: { status: 500, data: "Server error" },
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Starships:")).toBeInTheDocument();
    expect(screen.getByText("Error loading starships")).toBeInTheDocument();
  });

  it("shows 'Unknown' when planet data is not available", () => {
    setMocks({
      character: mockCharacter,
      planet: undefined,
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Home Planet:")).toBeInTheDocument();
    expect(screen.getAllByText("Unknown").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Unknown' when films data is empty", () => {
    setMocks({
      character: mockCharacter,
      planet: mockPlanet,
      films: [],
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Films:")).toBeInTheDocument();
    expect(screen.getAllByText("Unknown").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Unknown' when starships data is empty", () => {
    setMocks({
      character: mockCharacter,
      planet: mockPlanet,
      films: [],
      starships: [],
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Starships:")).toBeInTheDocument();
    expect(screen.getAllByText("Unknown").length).toBeGreaterThanOrEqual(1);
  });

  it("handles character with no films or starships", () => {
    setMocks({
      character: { ...mockCharacter, films: [], starships: [] },
      planet: mockPlanet,
      films: [],
      starships: [],
    });
    renderWithRouter(<CharacterDetails />);
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Films:")).toBeInTheDocument();
    expect(screen.getAllByText("Unknown")).toHaveLength(2);
  });
});
