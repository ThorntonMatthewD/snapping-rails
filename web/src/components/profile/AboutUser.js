import { useState } from "react";
import { Avatar, Container, Typography, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";

import ProfileSettingsModal from "./ProfileSettingsModal";

const AboutUser = ({ userInfo, showEdit }) => {
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
        sx={{ width: 120, height: 120, marginBottom: "0.5em" }}
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
      />
    </Container>
  );
};

export default AboutUser;
