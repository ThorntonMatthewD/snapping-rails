import { useState } from "react";
import { Avatar, Container, Typography, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";

import ProfileSettingsModal from "./ProfileSettingsModal";

const AboutUser = ({ userInfo, showEdit, getProfileData }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Container
      sx={{
        color: "white",
        alignItems: "center",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <Avatar
        alt={userInfo?.username}
        src={userInfo?.profile_pic_url}
        sx={{
          width: { xs: 120, sm: 160, md: 200, lg: 240, xl: 280 },
          height: { xs: 120, sm: 160, md: 200, lg: 240, xl: 280 },
          marginBottom: "0.5em",
        }}
      />

      <div style={{ display: "flex" }}>
        <Typography variant="h3">{userInfo?.username}</Typography>
        {showEdit && (
          <Edit
            className="hover-cursor"
            onClick={toggleModal}
            sx={{ fill: "white", marginLeft: "10px" }}
          />
        )}
      </div>

      <p>{userInfo?.profile_description}</p>

      <ProfileSettingsModal
        open={modalOpen}
        toggleModal={toggleModal}
        userInfo={userInfo}
        getProfileData={getProfileData}
      />
    </Container>
  );
};

export default AboutUser;
