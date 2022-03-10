import { useState } from "react";
import { Grid, CssBaseline, Typography, Container } from "@mui/material";
import LoginForm from "../components/forms/LoginForm";
import RegistrationForm from "../components/forms/RegistrationForm";

const Login = () => {
  const [loginActive, setLoginActive] = useState(true);

  const toggleLoginForm = () => {
    setLoginActive(!loginActive);
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "90vh" }}
        >
          <Typography component="h1" variant="h3">
            All Aboard! 🚂
          </Typography>

          {loginActive ? (
            <LoginForm toggleActiveForm={toggleLoginForm} />
          ) : (
            <RegistrationForm toggleActiveForm={toggleLoginForm} />
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
