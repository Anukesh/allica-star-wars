// src/components/CharacterDetails/CharacterDetails.test.tsx
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { waitFor, screen } from "../../test/test-utils";
import { server } from "../../test/server";
import { http, HttpResponse } from "msw";
import { CharacterDetails } from "./CharacterDetails";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { renderWithProviders } from "../../test/test-utils";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderComponent = (id = "1") =>
  renderWithProviders(
    <MemoryRouter initialEntries={[`/character/${id}`]}>
      <Routes>
        <Route path="/character/:id" element={<CharacterDetails />} />
      </Routes>
    </MemoryRouter>,
    {
      includeApiMiddleware: true,
      withRouter: false,
    }
  );

describe("CharacterDetails Integration", () => {
  it("renders character details correctly from API", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
      expect(screen.getByText(/back to characters/i)).toBeInTheDocument();
      expect(screen.getByText(/male/i)).toBeInTheDocument();
      expect(screen.getByText(/172/)).toBeInTheDocument();
      expect(screen.getByText(/blond/i)).toBeInTheDocument();
      expect(screen.getByText(/blue/i)).toBeInTheDocument();
      expect(screen.getByText(/Tatooine/)).toBeInTheDocument();
      expect(screen.getByText(/A New Hope/)).toBeInTheDocument();
      expect(screen.getByText(/X-wing/)).toBeInTheDocument();
    });
  });

  it("displays error message when API fails", async () => {
    server.use(
      http.get("https://swapi.dev/api/people/:id", () =>
        HttpResponse.json({}, { status: 500 })
      )
    );

    renderComponent();

    await waitFor(() =>
      expect(
        screen.getByText(/error loading character details/i)
      ).toBeInTheDocument()
    );
  });
});
