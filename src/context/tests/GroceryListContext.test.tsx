import React, { useContext } from "react";
import { vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const addMutate = vi.fn();
const updateMutate = vi.fn();
const deleteMutate = vi.fn();
const flagMutate = vi.fn();

const sampleData = { count: 0, current_page: 1, total_pages: 1, next: "", previous: "", results: [] };

vi.mock("../../hooks/GroceryItemHooks", () => ({
  useGroceryItems: () => ({ data: sampleData, isLoading: false }),
  useAddGroceryItem: () => ({ mutate: addMutate }),
  useUpdateGroceryItem: () => ({ mutate: updateMutate }),
  useDeleteGroceryItem: () => ({ mutate: deleteMutate }),
  useFlagPurchasedItem: () => ({ mutate: flagMutate }),
}));

import { GroceryListContextProvider } from "../GroceryListContext";
import { GroceryListContext } from "../AllContexts";

describe("GroceryListContextProvider", () => {
  it("provides functions that call underlying mutations", () => {
    const Consumer = () => {
      const ctx = useContext(GroceryListContext);
      return (
        <div>
          <button onClick={() => ctx.handleAdd({ name: "A", description: "", quantity: 1, unit: "Pieces" })}>
            add
          </button>
          <button onClick={() => ctx.handleUpdate("1", { name: "B" })}>update</button>
          <button onClick={() => ctx.handleDelete("1")}>delete</button>
          <button onClick={() => ctx.handleTogglePurchased("1", true)}>flag</button>
        </div>
      );
    };

    render(
      <GroceryListContextProvider>
        <Consumer />
      </GroceryListContextProvider>
    );

    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("update"));
    fireEvent.click(screen.getByText("delete"));
    fireEvent.click(screen.getByText("flag"));

    expect(addMutate).toHaveBeenCalled();
    expect(updateMutate).toHaveBeenCalled();
    expect(deleteMutate).toHaveBeenCalled();
    expect(flagMutate).toHaveBeenCalled();
  });
});
