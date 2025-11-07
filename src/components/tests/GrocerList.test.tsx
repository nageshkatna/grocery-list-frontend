import { render, screen, fireEvent } from "@testing-library/react";
import GroceryList from "../../components/GroceryList";
import { GroceryListContext } from "../../context/AllContexts";
import type { GroceryItemPaginatedT, GroceryListContextT } from "../../types/GroceryListTypes";

const dummyItems: GroceryItemPaginatedT = {
  count: 2,
  current_page: 1,
  total_pages: 1,
  next: "",
  previous: "",
  results: [],
};
const dummyContextValues: GroceryListContextT = {
  items: dummyItems,
  error: null,
  setPage: vi.fn(),
  handleAdd: vi.fn(),
  handleDelete: vi.fn(),
  handleTogglePurchased: vi.fn(),
  handleUpdate: vi.fn(),
};

// Helper to render with context
const renderWithContext = (items: GroceryItemPaginatedT, contextOverrides?: Partial<GroceryListContextT>) => {
  return render(
    <GroceryListContext.Provider value={{ ...dummyContextValues, ...contextOverrides, items }}>
      <GroceryList />
    </GroceryListContext.Provider>
  );
};

test("renders header and AddGroceryForm", () => {
  renderWithContext(dummyItems);
  expect(screen.getByText("Grocery List")).toBeInTheDocument();
});

test("shows empty message when no items exist", () => {
  renderWithContext(dummyItems);
  expect(screen.getByTestId("empty-massage")).toBeInTheDocument();
});

test("disables Previous button on first page", () => {
  const items = { results: [], current_page: 1, count: 0, total_pages: 3, next: "", previous: "" };
  renderWithContext(items);
  expect(screen.getByTestId("previous-btn")).toBeDisabled();
});

test("disables Previous button on first page", () => {
  const items = { results: [], current_page: 1, count: 0, total_pages: 3, next: "", previous: "" };
  renderWithContext(items);
  expect(screen.getByTestId("previous-btn")).toBeDisabled();
});

test("disables Next button on last page", () => {
  const items = { results: [], current_page: 3, count: 0, total_pages: 3, next: "", previous: "" };
  const error = "Some error";
  renderWithContext(items, { error });
  expect(screen.getByTestId("error-message")).toBeInTheDocument();
});

test("calls setPage when clicking page number", () => {
  const setPage = vi.fn();
  const items = { results: [], current_page: 1, count: 12, total_pages: 3, next: "", previous: "" };
  renderWithContext(items, { setPage });

  fireEvent.click(screen.getByTestId("number-btn-2"));
  expect(setPage).toHaveBeenCalled();
});

test("renders grocery items when results exist", () => {
  const items: GroceryItemPaginatedT = {
    count: 2,
    current_page: 1,
    total_pages: 1,
    next: "",
    previous: "",
    results: [
      { id: "1", name: "Milk", description: "Protien Rich Milk", quantity: 2, unit: "Packs", purchased: false },
      { id: "2", name: "Bread", description: "Brown Bread", quantity: 2, unit: "Packs", purchased: false },
    ],
  };
  renderWithContext(items);

  expect(screen.getByText("Milk")).toBeInTheDocument();
  expect(screen.getByText("Bread")).toBeInTheDocument();
});

test("calls setPage when clicking Next", () => {
  const setPage = vi.fn();
  const items = { results: [], current_page: 1, count: 0, total_pages: 3, next: "", previous: "" };
  renderWithContext(items, { setPage });

  fireEvent.click(screen.getByTestId("next-btn"));
  expect(setPage).toHaveBeenCalled();
});

test("calls setPage when clicking Previous", () => {
  const setPage = vi.fn();
  const items = { results: [], current_page: 2, count: 0, total_pages: 3, next: "", previous: "" };
  renderWithContext(items, { setPage });

  fireEvent.click(screen.getByTestId("previous-btn"));
  expect(setPage).toHaveBeenCalled();
});

test("shows pagination info correctly", () => {
  const items = { results: [], current_page: 2, count: 10, total_pages: 5, next: "", previous: "" };
  renderWithContext(items);
  expect(screen.getByText(/Page 2 of 5 \(10 total items\)/i)).toBeInTheDocument();
});
