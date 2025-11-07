import type { GroceryItemT, GroceryItemPaginatedT } from "../types/GroceryListTypes";

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      VITE_APP_API_BASE_URL: string;
    };
  }
}

// Try to get the URL from runtime config first, then fall back to build time env
let API_BASE_URL = window.__RUNTIME_CONFIG__?.VITE_APP_API_BASE_URL || import.meta.env.VITE_APP_API_BASE_URL;

// Ensure the URL doesn't end with a slash and doesn't include the API path
API_BASE_URL = API_BASE_URL.replace(/\/+$/, "");
if (API_BASE_URL.includes("/api/v1")) {
  API_BASE_URL = API_BASE_URL.split("/api/v1")[0];
}

// Debug logging
console.log("Runtime config:", window.__RUNTIME_CONFIG__);
console.log("Build time env:", import.meta.env.VITE_APP_API_BASE_URL);
console.log("Normalized API Base URL:", API_BASE_URL);
export const groceryApi = {
  getItems: async (page: number): Promise<GroceryItemPaginatedT> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/groceryItems/?page=${page}`);
    if (!response.ok) throw new Error("Failed to fetch items");
    return response.json();
  },

  addItem: async (
    item: Omit<GroceryItemT, "id" | "created_at" | "updated_at" | "purchased">
  ): Promise<GroceryItemT> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/groceryItems/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody.error);
    }

    return response.json();
  },

  updateItem: async (id: string, updates: Partial<GroceryItemT>): Promise<GroceryItemT> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/groceryItems/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update item");
    return response.json();
  },

  flagPurchased: async (id: string, updates: Partial<GroceryItemT>): Promise<GroceryItemT> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/groceryItems/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to flag item purchased");
    return response.json();
  },

  deleteItem: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/groceryItems/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete item");
  },
};
