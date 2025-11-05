import { useContext, useState } from "react";
import type { GroceryItemT } from "../types/GroceryListTypes";
import { GroceryListContext } from "../context/AllContexts";

const AddGroceryForm = () => {
  const { handleAdd } = useContext(GroceryListContext);
  const [groceryItem, setGroceryItem] = useState<Omit<GroceryItemT, "id" | "purchased">>({
    name: "",
    description: "",
    quantity: 1,
    unit: "Pieces",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groceryItem.name) {
      handleAdd(groceryItem);
      setGroceryItem({
        name: "",
        description: "",
        quantity: 1,
        unit: "Pieces",
      });
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='add-grocery-form'>
      <div className='form-row'>
        <input
          type='text'
          value={groceryItem.name}
          onChange={(e) => setGroceryItem({ ...groceryItem, name: e.target.value })}
          onFocus={() => setIsExpanded(true)}
          placeholder='Add a new item...'
          className='form-input name-input'
          required
        />
        {isExpanded && (
          <>
            <input
              type='number'
              min='0'
              step='0.1'
              value={groceryItem.quantity}
              onChange={(e) => setGroceryItem({ ...groceryItem, quantity: Number(e.target.value) })}
              className='form-input quantity-input'
              required
            />
            <select
              value={groceryItem.unit}
              onChange={(e) => setGroceryItem({ ...groceryItem, unit: e.target.value as GroceryItemT["unit"] })}
              className='form-select'
            >
              <option value='Pieces'>Pieces</option>
              <option value='Packs'>Packs</option>
              <option value='Kg'>Kg</option>
              <option value='Liters'>Liters</option>
            </select>
          </>
        )}
      </div>
      {isExpanded && (
        <>
          <div className='form-row'>
            <input
              type='text'
              value={groceryItem.description}
              onChange={(e) => setGroceryItem({ ...groceryItem, description: e.target.value })}
              placeholder='Description (optional)'
              className='form-input description-input-full'
            />
          </div>
          <div className='form-actions'>
            <button type='submit' className='btn btn-add'>
              Add Item
            </button>
            <button
              type='button'
              onClick={() => {
                setIsExpanded(false);
                setGroceryItem({
                  name: "",
                  description: "",
                  quantity: 1,
                  unit: "Pieces",
                });
              }}
              className='btn btn-cancel'
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default AddGroceryForm;
