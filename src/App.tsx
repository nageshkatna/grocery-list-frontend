import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import GroceryList from "./components/GroceryList";
import { GroceryListContextProvider } from "./context/GroceryListContext";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GroceryListContextProvider>
          <GroceryList />
        </GroceryListContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
