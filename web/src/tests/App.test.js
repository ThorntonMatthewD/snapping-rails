import { render, screen } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  fetch.resetMocks();
});

test("renders learn react link", async () => {
  render(<App />);
  const title = await screen.findByText(/snapping rails/i);
  expect(title).toBeInTheDocument();
});
