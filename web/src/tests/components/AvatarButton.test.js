import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/dom";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { AuthProvider } from "../../contexts/AuthProvider";
import AvatarButton from "../../components/AvatarButton";
import { STRINGS } from "../../constants";

const renderAvatarButton = (user) => {
  return render(
    <BrowserRouter>
      <AuthProvider initialUser={user}>
        <AvatarButton />
      </AuthProvider>
    </BrowserRouter>
  );
};

beforeEach(() => {
  fetch.resetMocks();
});

describe("The button responds to the auth context", () => {
  test("by display the user's first initial if they are logged in", async () => {
    renderAvatarButton(STRINGS.TEST_USER);

    expect(screen.getByAltText("Bob")).toBeTruthy();
  });

  test("by displaying the default icon if no user is logged in", async () => {
    renderAvatarButton(null);

    const avatarButton = screen.getByRole("button", {
      name: /account settings/i,
    });

    expect(within(avatarButton).getByAltText("")).toBeTruthy();
  });
});

test("Whenever 'Sign Out' is pressed then the avatar button goes back to having the default icon", async () => {
  fetch.mockResponse(
    JSON.stringify({ detail: "Bob was signed out successfully." }),
    { status: 200 }
  );

  renderAvatarButton(STRINGS.TEST_USER);

  //Make sure we are signed in
  expect(screen.getByAltText("Bob")).toBeTruthy();

  const avatarButton = screen.getByRole("button", {
    name: /account settings/i,
  });

  userEvent.click(avatarButton);

  const signOutLink = screen.getByText(/sign out/i);

  //TODO: get auth context to actually update here
  userEvent.click(signOutLink);

  expect(await within(avatarButton).findByAltText("")).toBeTruthy();
});
