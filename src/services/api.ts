import type { GroceryItemT, GroceryItemPaginatedT } from "../types/GroceryListTypes";

export const groceryApi = {
  getItems: async (page: number): Promise<GroceryItemPaginatedT> => {
    const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/?page=${page}`);
    if (!response.ok) throw new Error("Failed to fetch items");
    return response.json();
  },

  addItem: async (
    item: Omit<GroceryItemT, "id" | "created_at" | "updated_at" | "purchased">
  ): Promise<GroceryItemT> => {
    const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Failed to add item");
    return response.json();
  },

  updateItem: async (id: string, updates: Partial<GroceryItemT>): Promise<GroceryItemT> => {
    const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update item");
    return response.json();
  },

  flagPurchased: async (id: string, updates: Partial<GroceryItemT>): Promise<GroceryItemT> => {
    const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to flag item purchased");
    return response.json();
  },

  deleteItem: async (id: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete item");
  },
};
