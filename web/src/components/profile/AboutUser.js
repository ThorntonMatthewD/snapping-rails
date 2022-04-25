import { useState } from "react";
import { Avatar, Container, Typography } from "@mui/material";
import { EditIcon } from "@mui/icons-material/Edit";

import ProfileSettingsModal from "./ProfileSettingsModal";

const AboutUser = ({ userInfo, showEdit }) => {
  const [modalOpen, setModalOpen] = useState(false);

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

      <Typography variant="h3">{userInfo?.username}</Typography>
      {showEdit && <EditIcon sx={{ fill: "white" }} />}

      <p>{userInfo?.profile_description}</p>

      <ProfileSettingsModal
        open={modalOpen}
        setModalOpen={setModalOpen}
        userInfo={userInfo}
      />
    </Container>
  );
};

export default AboutUser;
