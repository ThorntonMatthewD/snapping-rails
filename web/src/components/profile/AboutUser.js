import { Avatar, Container, Typography } from "@mui/material";

const AboutUser = ({ userInfo }) => {
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
        src="https://avatars.githubusercontent.com/u/44626690?v=4"
        sx={{ width: 120, height: 120, marginBottom: "0.5em" }}
      />

      <Typography variant="h3">{userInfo?.username}</Typography>
      <Typography variant="h5">Railfan</Typography>
    </Container>
  );
};

export default AboutUser;
