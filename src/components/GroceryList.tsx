import { useContext } from "react";
import { GroceryListContext } from "../context/AllContexts";
import GroceryItemRow from "./GroceryItemRow";
import AddGroceryForm from "./AddGroceryForm";
import "../styles/GroceryList.css";

const GroceryList = () => {
  const { items, error, setError, setPage } = useContext(GroceryListContext);

  const currentPage = items?.current_page || 1;
  const total = items?.count || 0;
  const totalPages = items?.total_pages || 1;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  return (
    <div className='grocery-list-container'>
      <h1>Grocery List</h1>
      {error && (
        <div className='error-message' data-testid='error-message'>
          <span className='error-text'>{error}</span>
          <button className='error-close' onClick={() => setError(null)} aria-label='Dismiss error'>
            &times;
          </button>
        </div>
      )}
      <AddGroceryForm />

      <div className='grocery-items'>
        {items.results.length === 0 ? (
          <p data-testid='empty-massage' className='empty-message'>
            Your grocery list is empty. Add some items to get started!
          </p>
        ) : (
          items.results.map((item) => <GroceryItemRow key={item.id} item={item} />)
        )}
      </div>

      <div className='pagination'>
        <button
          data-testid='previous-btn'
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className='btn btn-pagination'
        >
          Previous
        </button>

        <div className='pagination-pages'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              data-testid={`number-btn-${page}`}
              onClick={() => handlePageChange(page)}
              className={`btn btn-page ${currentPage === page ? "active" : ""}`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          data-testid='next-btn'
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className='btn btn-pagination'
        >
          Next
        </button>

        <div data-testid='page-info' className='pagination-info'>
          Page {currentPage} of {totalPages} ({total} total items)
        </div>
      </div>
    </div>
  );
};

export default GroceryList;
