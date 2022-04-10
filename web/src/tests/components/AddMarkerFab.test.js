import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { STRINGS } from "../../constants";
import Railmap from "../../components/map/Railmap";
import { ThemeProvider } from "@mui/material/styles";
import { Theme } from "../../configs/theme";
import { AuthProvider } from "../../contexts/AuthProvider";

window.scrollTo = jest.fn();

const renderRailmap = (user) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <AuthProvider initialUser={user}>
          <Railmap />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

test("Ensure login alert shows on press if not logged in", async () => {
  renderRailmap(null);

  const fab = screen.getByLabelText("add-marker");

  userEvent.click(fab);

  const failureMsg = screen.getByText(
    /you need to login or create an account in order to add a marker./i
  );

  expect(
    failureMsg
      .closest(".MuiCollapse-root")
      .className.includes("MuiCollapse-hidden")
  ).toBe(false);

  const successMsg = screen.getByText(
    /Edit Mode: Drag the train to where you'd like to place a marker./i
  );

  expect(
    successMsg
      .closest(".MuiCollapse-root")
      .className.includes("MuiCollapse-hidden")
  ).toBe(true);
});

test("Ensure draggable markers appears on press if logged in", async () => {
  renderRailmap(STRINGS.TEST_USER);

  const fab = screen.getByLabelText("add-marker");

  userEvent.click(fab);

  const successMsg = screen.getByText(
    /edit mode: drag the train to where you'd like to place a marker./i
  );

  expect(
    successMsg
      .closest(".MuiCollapse-root")
      .className.includes("MuiCollapse-hidden")
  ).toBe(false);

  const failureMsg = screen.getByText(
    /you need to login or create an account in order to add a marker./i
  );

  expect(
    failureMsg
      .closest(".MuiCollapse-root")
      .className.includes("MuiCollapse-hidden")
  ).toBe(true);
});
