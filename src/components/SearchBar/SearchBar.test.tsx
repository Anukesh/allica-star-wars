import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";

const mockOnSearchChange = vi.fn();

describe("SearchBar Component", () => {
  it("renders search input with correct placeholder", () => {
    render(<SearchBar onSearchChange={mockOnSearchChange} searchQuery="" />);

    expect(
      screen.getByPlaceholderText(/search characters/i)
    ).toBeInTheDocument();
  });

  it("displays the current search query as value", () => {
    const searchQuery = "Luke Skywalker";

    render(
      <SearchBar
        onSearchChange={mockOnSearchChange}
        searchQuery={searchQuery}
      />
    );

    const input = screen.getByDisplayValue(searchQuery);
    expect(input).toBeInTheDocument();
  });

  it("calls onSearchChange when input value changes", async () => {
    const user = userEvent.setup();

    render(
      <SearchBar onSearchChange={mockOnSearchChange} searchQuery="Vade" />
    );

    const input = screen.getByPlaceholderText(/search characters/i);
    await user.type(input, "r");

    expect(mockOnSearchChange).toHaveBeenCalledWith("Vader");
  });
});
