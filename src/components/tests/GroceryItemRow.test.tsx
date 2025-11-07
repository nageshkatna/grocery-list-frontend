import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import GroceryItemRow from "../../components/GroceryItemRow";
import { GroceryListContext } from "../../context/AllContexts";
import type { GroceryItemT, GroceryListContextT } from "../../types/GroceryListTypes";

const defaultItem: GroceryItemT = {
  id: "1",
  name: "Milk",
  description: "Protein Rich Milk",
  quantity: 2,
  unit: "Packs",
  purchased: false,
};

const renderWithContext = (item: GroceryItemT = defaultItem, contextOverrides?: Partial<GroceryListContextT>) => {
  const defaults: GroceryListContextT = {
    items: { count: 0, current_page: 1, total_pages: 1, next: "", previous: "", results: [] },
    error: null,
    setPage: vi.fn() as unknown as React.Dispatch<React.SetStateAction<number>>,
    handleAdd: vi.fn(),
    handleDelete: vi.fn(),
    handleUpdate: vi.fn(),
    handleTogglePurchased: vi.fn(),
  } as GroceryListContextT;

  return render(
    <GroceryListContext.Provider value={{ ...defaults, ...contextOverrides }}>
      <GroceryItemRow item={item} />
    </GroceryListContext.Provider>
  );
};

test("renders item details (name, description, quantity & unit)", () => {
  renderWithContext();

  expect(screen.getByText("Milk")).toBeInTheDocument();
  expect(screen.getByText("Protein Rich Milk")).toBeInTheDocument();
  expect(screen.getByText(/2\s+Packs/)).toBeInTheDocument();
});

test("clicking Purchased calls handleTogglePurchased with true", () => {
  const handleTogglePurchased = vi.fn();
  renderWithContext(defaultItem, { handleTogglePurchased } as Partial<GroceryListContextT>);

  const btn = screen.getByText("Purchased");
  fireEvent.click(btn);

  expect(handleTogglePurchased).toHaveBeenCalledWith(defaultItem.id, true);
});

test("shows Unpurchase when item is purchased and clicking it calls handleTogglePurchased with false", () => {
  const purchasedItem = { ...defaultItem, purchased: true };
  const handleTogglePurchased = vi.fn();
  renderWithContext(purchasedItem, { handleTogglePurchased } as Partial<GroceryListContextT>);

  const btn = screen.getByText("Unpurchase");
  fireEvent.click(btn);

  expect(handleTogglePurchased).toHaveBeenCalledWith(purchasedItem.id, false);
});

test("Edit button is disabled when item is purchased", () => {
  const purchasedItem = { ...defaultItem, purchased: true };
  renderWithContext(purchasedItem);

  const editBtn = screen.getByText("Edit");
  expect(editBtn).toBeDisabled();
});

test("Delete button calls handleDelete with item id", () => {
  const handleDelete = vi.fn();
  renderWithContext(defaultItem, { handleDelete } as Partial<GroceryListContextT>);

  const deleteBtn = screen.getByText("Delete");
  fireEvent.click(deleteBtn);

  expect(handleDelete).toHaveBeenCalledWith(defaultItem.id);
});

test("Edit flow: clicking Edit shows inputs; Save calls handleUpdate and exits edit mode", () => {
  const handleUpdate = vi.fn();
  renderWithContext(defaultItem, { handleUpdate } as Partial<GroceryListContextT>);

  // Enter edit mode
  const editBtn = screen.getByText("Edit");
  fireEvent.click(editBtn);

  const nameInput = screen.getByPlaceholderText("Item name") as HTMLInputElement;
  const descInput = screen.getByPlaceholderText("Description") as HTMLInputElement;
  const qtyInput = screen.getByDisplayValue(String(defaultItem.quantity)) as HTMLInputElement;

  expect(nameInput).toBeInTheDocument();
  expect(descInput).toBeInTheDocument();
  expect(qtyInput).toBeInTheDocument();

  fireEvent.change(nameInput, { target: { value: "Soy Milk" } });
  fireEvent.change(descInput, { target: { value: "Less Sugar" } });
  fireEvent.change(qtyInput, { target: { value: "3" } });

  const saveBtn = screen.getByText("Save");
  fireEvent.click(saveBtn);

  expect(handleUpdate).toHaveBeenCalledWith(
    defaultItem.id,
    expect.objectContaining({ name: "Soy Milk", description: "Less Sugar", quantity: 3 })
  );

  expect(screen.queryByPlaceholderText("Item name")).not.toBeInTheDocument();
});

test("Cancel during edit exits edit mode without calling handleUpdate", () => {
  const handleUpdate = vi.fn();
  renderWithContext(defaultItem, { handleUpdate } as Partial<GroceryListContextT>);

  const editBtn = screen.getByText("Edit");
  fireEvent.click(editBtn);

  expect(screen.getByPlaceholderText("Item name")).toBeInTheDocument();

  const cancelBtn = screen.getByText("Cancel");
  fireEvent.click(cancelBtn);

  expect(handleUpdate).not.toHaveBeenCalled();
  expect(screen.queryByPlaceholderText("Item name")).not.toBeInTheDocument();
});
