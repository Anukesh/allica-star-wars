import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/test-utils";
import CharacterList from "./CharacterList";
import { mockCharacterResponse, mockEmptyResponse } from "../../test/mocks";

// Mock the API calls using factory function
vi.mock("../../store/api", () => {
  return {
    useGetCharactersQuery: vi.fn(),
    useGetPlanetByIdQuery: vi.fn().mockReturnValue({
      data: { name: "Tatooine" },
      isLoading: false,
      error: null,
    }),
    starWarsApi: {
      reducerPath: "starWarsApi",
      reducer: (state = { queries: {}, mutations: {} }) => state,
      middleware: () => (next: any) => (action: any) => next(action),
    },
  };
});

// Import the mocked function
import { useGetCharactersQuery } from "../../store/api";
const mockUseGetCharactersQuery = vi.mocked(useGetCharactersQuery);

// Mock React Router hooks
const mockSetSearchParams = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  };
});

describe("CharacterList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockQueryResult = (overrides: any = {}) =>
    ({
      data: mockCharacterResponse,
      isLoading: false,
      error: null,
      isFetching: false,
      ...overrides,
    } as any);

  describe("Unit Tests", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("renders the Star Wars heading", () => {
      mockUseGetCharactersQuery.mockReturnValue(createMockQueryResult());
      renderWithProviders(<CharacterList />);
      expect(
        screen.getByRole("heading", { name: /star wars/i })
      ).toBeInTheDocument();
    });

    it("renders pagination controls when data is loaded", () => {
      mockUseGetCharactersQuery.mockReturnValue(createMockQueryResult());
      renderWithProviders(<CharacterList />);
      expect(screen.getByText(/previous/i)).toBeInTheDocument();
      expect(screen.getByText(/next/i)).toBeInTheDocument();
      expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
    });

    it("renders search input", () => {
      mockUseGetCharactersQuery.mockReturnValue(createMockQueryResult());
      renderWithProviders(<CharacterList />);
      expect(
        screen.getByPlaceholderText(/search characters/i)
      ).toBeInTheDocument();
    });

    it("displays loading skeletons when data is loading", () => {
      mockUseGetCharactersQuery.mockReturnValue(
        createMockQueryResult({
          isLoading: true,
          isFetching: true,
        })
      );

      renderWithProviders(<CharacterList />);

      const skeletons = document.querySelectorAll(".character-card-skeleton");
      expect(skeletons).toHaveLength(10);
    });

    it("displays error message when there is an error", () => {
      mockUseGetCharactersQuery.mockReturnValue(
        createMockQueryResult({
          isLoading: false,
          error: { message: "Failed to fetch" },
        })
      );
      renderWithProviders(<CharacterList />);
      expect(screen.getByText(/error loading characters/i)).toBeInTheDocument();
    });

    it("displays no results message when search returns empty", () => {
      mockUseGetCharactersQuery.mockReturnValue(
        createMockQueryResult({
          data: mockEmptyResponse,
          isLoading: false,
          error: null,
        })
      );
      renderWithProviders(<CharacterList />);
      expect(screen.getByText(/no characters found/i)).toBeInTheDocument();
    });

    it("renders character cards when data is loaded", () => {
      mockUseGetCharactersQuery.mockReturnValue(createMockQueryResult());
      renderWithProviders(<CharacterList />);
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
      expect(screen.getByText("C-3PO")).toBeInTheDocument();
      expect(screen.getByText("R2-D2")).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("handles search input and updates URL parameters", async () => {
      const user = userEvent.setup();
      mockUseGetCharactersQuery.mockReturnValue(createMockQueryResult());
      renderWithProviders(<CharacterList />);
      const searchInput = screen.getByPlaceholderText(/search characters/i);
      await user.type(searchInput, "Luke");

      await waitFor(
        () => {
          expect(mockSetSearchParams).toHaveBeenCalled();
        },
        { timeout: 500 }
      );
    });

    it("handles pagination navigation", async () => {
      const user = userEvent.setup();
      mockUseGetCharactersQuery.mockReturnValue(
        createMockQueryResult({
          data: {
            ...mockCharacterResponse,
            count: 82,
            next: "https://swapi.dev/api/people/?page=2",
          },
        })
      );

      renderWithProviders(<CharacterList />);
      const nextButton = screen.getByText(/next/i);
      expect(nextButton).not.toBeDisabled();

      await user.click(nextButton);

      expect(mockSetSearchParams).toHaveBeenCalled();
    });

    it("disables previous button on first page", () => {
      mockUseGetCharactersQuery.mockReturnValue(
        createMockQueryResult({
          data: {
            ...mockCharacterResponse,
            previous: null,
          },
        })
      );

      renderWithProviders(<CharacterList />);

      const previousButton = screen.getByText(/previous/i);
      expect(previousButton).toBeDisabled();
    });

    it("disables next button on last page", () => {
      mockUseGetCharactersQuery.mockReturnValue(
        createMockQueryResult({
          data: {
            ...mockCharacterResponse,
            next: null,
            count: 3,
          },
        })
      );
      renderWithProviders(<CharacterList />);
      const nextButton = screen.getByText(/next/i);
      expect(nextButton).toBeDisabled();
    });
  });
});
