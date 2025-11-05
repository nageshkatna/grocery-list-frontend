import { useContext, useEffect, useState } from "react";
import type { GroceryItemT } from "../types/GroceryListTypes";
import { GroceryListContext } from "../context/AllContexts";

interface GroceryItemRowProps {
  item: GroceryItemT;
}

const GroceryItemRow = ({ item }: GroceryItemRowProps) => {
  const { handleUpdate, handleDelete, handleTogglePurchased } = useContext(GroceryListContext);
  const [groceryItem, setGroceryItem] = useState<Omit<GroceryItemT, "id" | "purchased">>({
    name: "",
    description: "",
    quantity: 1,
    unit: "Pieces",
  });

  useEffect(() => {
    if (item) {
      setGroceryItem({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
      });
    }
  }, [item]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    handleUpdate(item.id, groceryItem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setGroceryItem({} as Omit<GroceryItemT, "id" | "purchased">);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className='grocery-item editing'>
        <div className='item-content'>
          <input
            type='text'
            value={groceryItem.name}
            onChange={(e) => setGroceryItem({ ...groceryItem, name: e.target.value })}
            className='edit-input name-input'
            placeholder='Item name'
          />
          <input
            type='text'
            value={groceryItem.description}
            onChange={(e) => setGroceryItem({ ...groceryItem, description: e.target.value })}
            className='edit-input description-input'
            placeholder='Description'
          />
          <div className='quantity-unit'>
            <input
              type='number'
              min='0'
              step='0.1'
              value={groceryItem.quantity}
              onChange={(e) => setGroceryItem({ ...groceryItem, quantity: Number(e.target.value) })}
              className='edit-input quantity-input'
            />
            <select
              value={groceryItem.unit}
              onChange={(e) => setGroceryItem({ ...groceryItem, unit: e.target.value as GroceryItemT["unit"] })}
              className='edit-select'
            >
              <option value='pieces'>pieces</option>
              <option value='packs'>packs</option>
              <option value='kg'>kg</option>
              <option value='liters'>liters</option>
            </select>
          </div>
        </div>
        <div className='item-actions'>
          <button onClick={handleSave} className='btn btn-save'>
            Save
          </button>
          <button onClick={handleCancel} className='btn btn-cancel'>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`grocery-item ${item.purchased ? "purchased" : ""}`}>
      <div className='item-content'>
        <div className='item-main'>
          <span className='item-name'>{item.name}</span>
          {item.description && <span className='item-description'>{item.description}</span>}
        </div>
        <div className='item-quantity'>
          <span>
            {item.quantity} {item.unit}
          </span>
        </div>
      </div>
      <div className='item-actions'>
        <button
          onClick={() => handleTogglePurchased(item.id, !item.purchased)}
          className={`btn ${item.purchased ? "btn-unpurchase" : "btn-purchase"}`}
        >
          {item.purchased ? "Unpurchase" : "Purchased"}
        </button>
        <button onClick={() => setIsEditing(true)} className='btn btn-edit' disabled={item.purchased}>
          Edit
        </button>
        <button onClick={() => handleDelete(item.id)} className='btn btn-delete'>
          Delete
        </button>
      </div>
    </div>
  );
};

export default GroceryItemRow;
