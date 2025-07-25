import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockReset();
  });

  it("renders current page, total pages, previous and Next buttons", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByText("Page 5 of 10")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const previousButton = screen.getByText("Previous");
    expect(previousButton).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("enables both buttons on middle pages", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const previousButton = screen.getByText("Previous");
    const nextButton = screen.getByText("Next");
    expect(previousButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it("calls onPageChange with previous page when Previous is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const previousButton = screen.getByText("Previous");
    await user.click(previousButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with next page when Next is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const nextButton = screen.getByText("Next");
    await user.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });
});
