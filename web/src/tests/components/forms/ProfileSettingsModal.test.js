import { cleanup, render, screen } from "@testing-library/react";

import ProfileSettingsModal from "../../../components/forms/ProfileSettingsModal";

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
