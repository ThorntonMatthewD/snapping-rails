import { cleanup, render, screen, wait } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { within } from "@testing-library/dom";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "../../contexts/AuthProvider";
import Profile from "../../pages/Profile";
import { STRINGS } from "../../constants";

const renderProfile = (loggedInUser, initialURL = "/profile") => {
  const history = createMemoryHistory({ initialEntries: [initialURL] });

  return render(
    <MemoryRouter history={history}>
      <AuthProvider initialUser={loggedInUser}>
        <Profile />
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

    expect(postsTitle).toBeTruthy();
  });
});
