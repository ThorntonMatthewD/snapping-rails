import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";

import Railmap from "../../../components/map/Railmap";
import { ThemeProvider } from "@mui/material/styles";
import { Theme } from "../../../configs/theme";
import { AuthProvider } from "../../../contexts/AuthProvider";

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

beforeEach(() => {
  fetch.resetMocks();
});

afterEach(() => {
  fetch.resetMocks();
  cleanup();
});

test("When I run this test then Jest stops complaining at me", () => {
  expect(true).toBe(true);
});
