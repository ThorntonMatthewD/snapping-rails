import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Grid, Paper, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useFetch from "use-http";

import Posts from "../components/profile/Posts";
import AboutUser from "../components/profile/AboutUser";
import SocialBar from "../components/profile/SocialBar";

const Profile = () => {
  const profile_name = useRef("");

  const [userInfo, setUserInfo] = useState(null);

  const { user } = useAuth();

  const [searchParams] = useSearchParams();

  const { response, get, error } = useFetch("http://localhost:8000/api", {
    cachePolicy: "no-cache",
  });

  const getProfileName = async () => {
    const nameFromQuery = searchParams.get("username");
    if (nameFromQuery) {
      profile_name.current = nameFromQuery;
    } else if (user) {
      profile_name.current = user.username;
    }
  };

  const getProfileData = async () => {
    await getProfileName();

    if (profile_name.current.length > 0) {
      const data = await get("/profile?username=" + profile_name.current);
      if (response.ok) setUserInfo(data);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [user]);

  return (
    <Container fixed maxWidth="xl" sx={{ paddingTop: "10px" }}>
      {userInfo ? (
        <Grid container wrap={"wrap"} spacing={2}>
          <Grid item xs={16} md={4}>
            <Paper sx={{ padding: 2 }}>
              <AboutUser
                userInfo={userInfo}
                showEdit={user?.username === profile_name.current}
              />
              <br />
              <SocialBar links={userInfo?.social_links} />
            </Paper>
          </Grid>
          <Grid item xs={16} md={8}>
            <Posts username={userInfo?.username} />
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ padding: 2, height: "100vh" }}>
          {error ? (
            <div>
              <Typography variant="h1" sx={{ color: "white" }}>
                An Error Has Occurred
              </Typography>
              <br />
              <Typography variant="h4" sx={{ color: "white" }}>
                Please ensure you are logged in and/or have specified a valid
                username.
              </Typography>
            </div>
          ) : (
            <Typography variant="h1" sx={{ color: "white" }}>
              Grabbing user info..
            </Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Profile;
