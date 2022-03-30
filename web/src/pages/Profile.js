import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import useAuth from "../hooks/useAuth";

import Posts from "../components/profile/Posts";
import AboutUser from "../components/profile/AboutUser";
import SocialBar from "../components/profile/SocialBar";
import UserStats from "../components/profile/UserStats";

const Profile = () => {
  const profile_name = useRef(null);

  const { user } = useAuth();

  const [searchParams] = useSearchParams();

  const getProfileName = () => {
    const nameFromQuery = searchParams.get("username");
    if (nameFromQuery) {
      profile_name.current = nameFromQuery;
    } else if (user) {
      profile_name.current = user.username;
    }
  };

  useEffect(() => {
    getProfileName();
  }, []);

  return (
    <Container fixed sx={{ paddingTop: "10px" }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid container rowSpacing={1} columnSpacing={1}>
            <Grid item xs={8}>
              <AboutUser userInfo={{ username: "MattTBoy" }} />
              <br />
              <SocialBar />
            </Grid>
            <Grid item xs={8}>
              <UserStats />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Posts username={"MattTBoy"} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
