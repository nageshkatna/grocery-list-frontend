import { createContext } from "react";
import type { GroceryListContextT } from "../types/GroceryListTypes";

export const GroceryListContext = createContext({} as GroceryListContextT);
