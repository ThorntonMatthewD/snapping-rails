//Icons
import Email from '@mui/icons-material/Email'
import Lock from '@mui/icons-material/Lock';

import {Grid, CssBaseline, InputAdornment, Typography, Container} from '@mui/material';
import LoginForm from '../Components/Forms/LoginForm'


const Login = () => {
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
                  style={{ minHeight: '90vh' }}
              >
              <Typography component="h1" variant="h3">
                  All Aboard!
              </Typography>

              <LoginForm />

              </Grid>
          </Container>
        </div>
    );
}

export default Login;
