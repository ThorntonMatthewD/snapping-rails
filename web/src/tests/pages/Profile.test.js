import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../../contexts/AuthProvider";
import Profile from "../../pages/Profile";
import { STRINGS } from "../../constants";

const renderProfile = (loggedInUser, initialURL = "/profile") => {
  return render(
    <MemoryRouter initialEntries={[initialURL]}>
      <AuthProvider initialUser={loggedInUser}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

beforeEach(() => {
  fetch.resetMocks();
});

afterEach(() => {
  fetch.resetMocks();
  cleanup();
});

describe("Whenever loading a profile page", () => {
  it("the page shows the information for a signed in user without having to supply URL params", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ username: "Bob", profile_description: "Hi, I'm Bob" }),
      { status: 200 }
    );

    renderProfile(STRINGS.TEST_USER);

    const postsTitle = await screen.findByText(/bob's posts/i);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(postsTitle).toBeTruthy();
  });

  it("the page shows the information for a user given a username URL query parameter", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        username: "George",
        profile_description: "Hi, I'm not Bob.",
      }),
      { status: 200 }
    );

    renderProfile(null, "/profile?username=George");

    const postsTitle = await screen.findByText(/george's posts/i);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(postsTitle).toBeTruthy();
  });

  it("the page stays on the loading screen if no user is logged in and no valid username is provided", async () => {
    renderProfile(null);

    const loadingTitle = await screen.findByText(/Grabbing user info../i);

    expect(fetch).toHaveBeenCalledTimes(0);
    expect(loadingTitle).toBeTruthy();
  });

  it("the page shows an error message if the server gives an error response", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        detail: "Bob is no longer with us.. ",
      }),
      { status: 404 }
    );

    renderProfile(null, "/profile?username=Bob");

    const errorTitle = await screen.findByText(/An Error Has Occurred/i);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(errorTitle).toBeTruthy();
  });
});
