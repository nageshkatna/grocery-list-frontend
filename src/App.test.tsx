import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

// Mock the API module
vi.mock("./services/api", () => ({
  groceryApi: {
    getItems: vi.fn().mockResolvedValue({
      count: 0,
      current_page: 1,
      total_pages: 1,
      next: "",
      previous: "",
      results: [],
    }),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
    flagPurchased: vi.fn(),
  },
}));

test("renders Grocery List", () => {
  render(<App />);
  expect(screen.getByText(/Grocery List/i)).toBeInTheDocument();
});
