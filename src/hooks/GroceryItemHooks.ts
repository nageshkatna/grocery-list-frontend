import { useQuery, useMutation, useQueryClient, type InvalidateQueryFilters } from "@tanstack/react-query";
import { groceryApi } from "../services/api";
import type { GroceryItemT } from "../types/GroceryListTypes";

const GROCERY_QUERY_KEY = ["groceryItems"];

export const useGroceryItems = (page = 1) => {
  return useQuery({
    queryKey: [...GROCERY_QUERY_KEY, page],
    queryFn: () => groceryApi.getItems(page),
  });
};

export const useAddGroceryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Omit<GroceryItemT, "id" | "purchased">) => groceryApi.addItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries(GROCERY_QUERY_KEY as InvalidateQueryFilters<readonly unknown[]>);
    },
    onError: (error: unknown) => {
      console.error("Add item failed:", error);
    },
  });
};

export const useUpdateGroceryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<GroceryItemT> }) => groceryApi.updateItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(GROCERY_QUERY_KEY as InvalidateQueryFilters<readonly unknown[]>);
    },
  });
};

export const useFlagPurchasedItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<GroceryItemT> }) =>
      groceryApi.flagPurchased(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(GROCERY_QUERY_KEY as InvalidateQueryFilters<readonly unknown[]>);
    },
  });
};

export const useDeleteGroceryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => groceryApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(GROCERY_QUERY_KEY as InvalidateQueryFilters<readonly unknown[]>);
    },
  });
};
