import React from "react";
import { createMemoryHistory } from "history";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

window.scrollTo = jest.fn();

test("Ensure login in alert shows on press if not logged in", () => {
  render(<App />);

  const fab = screen.getByLabelText("add-marker");

  userEvent.click(fab);

  screen.getByText(
    /you need to login or create an account in order to add a marker./i
  );
});
