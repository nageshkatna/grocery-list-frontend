import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders Grocery List", () => {
  render(<App />);
  expect(screen.getByText(/Grocery List/i)).toBeInTheDocument();
});
