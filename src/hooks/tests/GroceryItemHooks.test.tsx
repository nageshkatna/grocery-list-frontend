/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock groceryApi
// const addItem = vi.fn();
// const updateItem = vi.fn();
// const deleteItem = vi.fn();
// const flagPurchased = vi.fn();
// const getItems = vi.fn();

vi.mock("../../services/api", () => ({
  groceryApi: {
    addItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
    flagPurchased: vi.fn(),
    getItems: vi.fn(),
  },
}));

import { groceryApi } from "../../services/api";

import {
  useAddGroceryItem,
  useUpdateGroceryItem,
  useDeleteGroceryItem,
  useFlagPurchasedItem,
  useGroceryItems,
} from "../GroceryItemHooks";

describe("GroceryItemHooks", () => {
  it("useAddGroceryItem mutate calls groceryApi.addItem and invalidates queries", async () => {
    const qc = new QueryClient();
    qc.invalidateQueries = vi.fn();

    (groceryApi.addItem as any).mockResolvedValueOnce({ name: "X", description: "", quantity: 1, unit: "Pieces" });

    const Test = () => {
      const mutation = useAddGroceryItem();
      return (
        <button onClick={() => mutation.mutate({ name: "X", description: "", quantity: 1, unit: "Pieces" })}>go</button>
      );
    };

    render(
      <QueryClientProvider client={qc}>
        <Test />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("go"));

    await waitFor(() => expect(groceryApi.addItem).toHaveBeenCalled());
    expect(qc.invalidateQueries).toHaveBeenCalled();
  });

  it("useUpdateGroceryItem mutate calls groceryApi.updateItem and invalidates queries", async () => {
    const qc = new QueryClient();
    qc.invalidateQueries = vi.fn();
    (groceryApi.updateItem as any).mockResolvedValueOnce({ id: "1" });

    const Test = () => {
      const mutation = useUpdateGroceryItem();
      return <button onClick={() => mutation.mutate({ id: "1", updates: { name: "Y" } })}>go</button>;
    };

    render(
      <QueryClientProvider client={qc}>
        <Test />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("go"));
    await waitFor(() => expect(groceryApi.updateItem).toHaveBeenCalled());
    expect(qc.invalidateQueries).toHaveBeenCalled();
  });

  it("useFlagPurchasedItem mutate calls groceryApi.flagPurchased and invalidates queries", async () => {
    const qc = new QueryClient();
    qc.invalidateQueries = vi.fn();
    (groceryApi.flagPurchased as any).mockResolvedValueOnce({ id: "1" });

    const Test = () => {
      const mutation = useFlagPurchasedItem();
      return <button onClick={() => mutation.mutate({ id: "1", updates: { purchased: true } })}>go</button>;
    };

    render(
      <QueryClientProvider client={qc}>
        <Test />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("go"));
    await waitFor(() => expect(groceryApi.flagPurchased).toHaveBeenCalled());
    expect(qc.invalidateQueries).toHaveBeenCalled();
  });

  it("useDeleteGroceryItem mutate calls groceryApi.deleteItem and invalidates queries", async () => {
    const qc = new QueryClient();
    qc.invalidateQueries = vi.fn();
    (groceryApi.deleteItem as any).mockResolvedValueOnce(undefined);

    const Test = () => {
      const mutation = useDeleteGroceryItem();
      return <button onClick={() => mutation.mutate("1")}>go</button>;
    };

    render(
      <QueryClientProvider client={qc}>
        <Test />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("go"));
    await waitFor(() => expect(groceryApi.deleteItem).toHaveBeenCalled());
    expect(qc.invalidateQueries).toHaveBeenCalled();
  });

  it("useGroceryItems returns data from groceryApi.getItems", async () => {
    const qc = new QueryClient();
    const sample = { count: 0, current_page: 1, total_pages: 1, next: "", previous: "", results: [] };
    (groceryApi.getItems as any).mockResolvedValueOnce(sample);

    const Test = () => {
      const { data, isLoading } = useGroceryItems(1);
      if (isLoading) return <div>loading</div>;
      return <div>loaded-{data?.current_page}</div>;
    };

    render(
      <QueryClientProvider client={qc}>
        <Test />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("loaded-1")).toBeInTheDocument());
  });
});
