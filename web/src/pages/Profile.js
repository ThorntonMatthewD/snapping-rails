import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Grid, Paper, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useFetch from "use-http";

import Posts from "../components/profile/Posts";
import AboutUser from "../components/profile/AboutUser";
import SocialBar from "../components/profile/SocialBar";

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

  let { data: userInfo = null, error } = useFetch(
    "http://localhost:8000/api/profile?username=" + profile_name.current,
    { cachePolicy: "no-cache" },
    [profile_name.current]
  );

  useEffect(() => {
    getProfileName();
  }, [user]);

  return (
    <Container fixed maxWidth="xl" sx={{ paddingTop: "10px" }}>
      {(userInfo !== null && (
        <Grid container wrap={"wrap"} spacing={2}>
          <Grid item xs={4}>
            <Paper sx={{ padding: 2 }}>
              <AboutUser userInfo={userInfo} />
              <br />
              <SocialBar links={userInfo?.social_links} />
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Posts username={userInfo?.username} />
          </Grid>
        </Grid>
      )) || (
        <Paper sx={{ padding: 2, height: "100vh" }}>
          <Typography variant="h1" sx={{ color: "white" }}>
            Grabbing user info..
          </Typography>
          <br />
          <Typography variant="h4" sx={{ color: "white" }}>
            If you aren't logged in or didn't provide a username to view then
            this is just going to sit here.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Profile;
