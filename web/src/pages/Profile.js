import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@mui/material";
import useAuth from "../hooks/useAuth";

import Posts from "../components/profile/Posts";

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
    <Container>
      <Posts username={profile_name.current} />
    </Container>
  );
};

export default Profile;
