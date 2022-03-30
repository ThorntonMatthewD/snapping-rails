import { Avatar, Container, Typography } from "@mui/material";

const AboutUser = ({ userInfo }) => {
  return (
    <Container sx={{ textAlign: "center", color: "white" }}>
      <Avatar
        alt={userInfo?.username}
        src="https://avatars.githubusercontent.com/u/44626690?v=4"
        sx={{ width: 120, height: 120 }}
      />

      <Typography variant="h3">{userInfo?.username}</Typography>
    </Container>
  );
};

export default AboutUser;
