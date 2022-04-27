import { Box, Modal, Typography } from "@mui/material";

import ProfileSettingsForm from "../forms/ProfileSettingsForm";

const ProfileSettingsModal = ({
  userInfo,
  open,
  toggleModal,
  getProfileData,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    color: "white",
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={toggleModal}
      aria-labelledby="Update Profile Settings"
      aria-describedby="Adjust the values to customize your Snapping Rails profile."
    >
      <Box sx={style} id="profile-settings-modal">
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          color="primary"
        >
          Update Your Profile
        </Typography>

        <ProfileSettingsForm
          toggleModal={toggleModal}
          userInfo={userInfo}
          getProfileData={getProfileData}
        />
      </Box>
    </Modal>
  );
};

export default ProfileSettingsModal;
