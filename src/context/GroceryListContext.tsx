import { useState } from "react";
import type { ContextType, ErrorT, GroceryItemPaginatedT, GroceryItemT } from "../types/GroceryListTypes";
import {
  useGroceryItems,
  useAddGroceryItem,
  useUpdateGroceryItem,
  useDeleteGroceryItem,
  useFlagPurchasedItem,
} from "../hooks/GroceryItemHooks";
import { GroceryListContext } from "./AllContexts";

export const GroceryListContextProvider = ({ children }: ContextType) => {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useGroceryItems(page);

  const items = data || ({} as GroceryItemPaginatedT);

  const addMutation = useAddGroceryItem();
  const updateMutation = useUpdateGroceryItem();
  const deleteMutation = useDeleteGroceryItem();
  const purchasedMutation = useFlagPurchasedItem();

  const handleAdd = (newItem: Omit<GroceryItemT, "id" | "purchased">) => {
    addMutation.mutate(newItem, {
      onError: (err) => {
        const errs = err as ErrorT;
        setError(errs.message);
      },
    });
  };

  const handleUpdate = (id: string, updates: Partial<GroceryItemT>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleTogglePurchased = (id: string, purchased: boolean) => {
    const updates = { purchased };
    purchasedMutation.mutate({ id, updates });
  };

  return (
    <>
      {isLoading ? (
        <div className='loading'>Loading grocery list...</div>
      ) : (
        <GroceryListContext.Provider
          value={{
            items,
            error,
            setError,
            setPage,
            handleAdd,
            handleDelete,
            handleUpdate,
            handleTogglePurchased,
          }}
        >
          {children}
        </GroceryListContext.Provider>
      )}
    </>
  );
};
