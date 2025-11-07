import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import AddGroceryForm from "../../components/AddGroceryForm";
import { GroceryListContext } from "../../context/AllContexts";
import type { GroceryListContextT } from "../../types/GroceryListTypes";

const renderWithContext = (contextOverrides?: Partial<GroceryListContextT>) => {
  const defaults: GroceryListContextT = {
    items: { count: 0, current_page: 1, total_pages: 1, next: "", previous: "", results: [] },
    error: null,
    setError: vi.fn() as unknown as React.Dispatch<React.SetStateAction<string | null>>,
    setPage: vi.fn() as unknown as React.Dispatch<React.SetStateAction<number>>,
    handleAdd: vi.fn(),
    handleDelete: vi.fn(),
    handleUpdate: vi.fn(),
    handleTogglePurchased: vi.fn(),
  } as GroceryListContextT;

  return render(
    <GroceryListContext.Provider value={{ ...defaults, ...contextOverrides }}>
      <AddGroceryForm />
    </GroceryListContext.Provider>
  );
};

test("expands on focus and shows additional inputs and actions", () => {
  renderWithContext();

  const nameInput = screen.getByPlaceholderText("Add a new item...");
  // initially not expanded
  expect(screen.queryByText("Add Item")).not.toBeInTheDocument();

  fireEvent.focus(nameInput);

  // after focus, quantity input, select and action buttons appear
  expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toBeInTheDocument();
  expect(screen.getByText("Add Item")).toBeInTheDocument();
  expect(screen.getByText("Cancel")).toBeInTheDocument();
});

test("submitting calls handleAdd with correct values and resets the form", () => {
  const handleAdd = vi.fn();
  renderWithContext({ handleAdd } as Partial<GroceryListContextT>);

  const nameInput = screen.getByPlaceholderText("Add a new item...") as HTMLInputElement;
  fireEvent.focus(nameInput);

  const qtyInput = screen.getByRole("spinbutton") as HTMLInputElement;
  const unitSelect = screen.getByRole("combobox") as HTMLSelectElement;
  const addButton = screen.getByText("Add Item");

  fireEvent.change(nameInput, { target: { value: "Eggs" } });
  fireEvent.change(qtyInput, { target: { value: "12" } });
  fireEvent.change(unitSelect, { target: { value: "Packs" } });

  // description appears only when expanded
  const descInput = screen.getByPlaceholderText("Description (optional)") as HTMLInputElement;
  fireEvent.change(descInput, { target: { value: "Free range" } });

  fireEvent.click(addButton);

  expect(handleAdd).toHaveBeenCalledWith({ name: "Eggs", description: "Free range", quantity: 12, unit: "Packs" });

  // after submit form should collapse and inputs reset
  const collapsedName = screen.getByPlaceholderText("Add a new item...") as HTMLInputElement;
  expect(collapsedName.value).toBe("");
  expect(screen.queryByText("Add Item")).not.toBeInTheDocument();
});

test("cancel button collapses and resets expanded form", () => {
  renderWithContext();

  const nameInput = screen.getByPlaceholderText("Add a new item...") as HTMLInputElement;
  fireEvent.focus(nameInput);

  const qtyInput = screen.getByRole("spinbutton") as HTMLInputElement;
  const descInput = screen.getByPlaceholderText("Description (optional)") as HTMLInputElement;

  fireEvent.change(nameInput, { target: { value: "Apples" } });
  fireEvent.change(qtyInput, { target: { value: "5" } });
  fireEvent.change(descInput, { target: { value: "Green" } });

  const cancelBtn = screen.getByText("Cancel");
  fireEvent.click(cancelBtn);

  // form collapsed and name reset
  const collapsedName = screen.getByPlaceholderText("Add a new item...") as HTMLInputElement;
  expect(collapsedName.value).toBe("");
  expect(screen.queryByPlaceholderText("Description (optional)")).not.toBeInTheDocument();
  expect(screen.queryByText("Add Item")).not.toBeInTheDocument();
});
