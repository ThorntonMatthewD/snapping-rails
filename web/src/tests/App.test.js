import { render, screen, cleanup } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  fetch.resetMocks();
});

afterEach(() => {
  fetch.resetMocks();
  cleanup();
});

test("renders learn react link", async () => {
  render(<App />);
  const title = await screen.findByText(/snapping rails/i);
  expect(title).toBeInTheDocument();
});
