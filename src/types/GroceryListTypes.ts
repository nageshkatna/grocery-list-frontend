export type GroceryItemPaginatedT = {
  count: number;
  current_page: number;
  total_pages: number;
  next: string;
  previous: string;
  results: GroceryItemT[];
};

export type GroceryItemT = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: "Pieces" | "Packs" | "Kg" | "Litres";
  purchased: boolean;
};

export type GroceryListContextT = {
  items: GroceryItemPaginatedT;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleAdd: (newItem: Omit<GroceryItemT, "id" | "purchased">) => void;
  handleDelete: (id: string) => void;
  handleUpdate: (id: string, updates: Partial<GroceryItemT>) => void;
  handleTogglePurchased: (id: string, purchased: boolean) => void;
};

export type ContextType = {
  children: React.ReactNode;
};

export type ErrorT = {
  message: string;
};
