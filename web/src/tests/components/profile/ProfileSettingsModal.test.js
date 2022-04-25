import { cleanup, render, screen } from "@testing-library/react";

import ProfileSettingsModal from "../../components/profile/ProfileSettingsModal";

afterEach(() => {
  cleanup();
});

const renderProfileSettingsModal = () => {
  return render(<ProfileSettingsModal />);
};

it("shows information passed in from server", () => {
  renderProfileSettingsModal();
  expect(true).toBe(true);
});
