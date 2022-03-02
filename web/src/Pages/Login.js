

//Icons
import Email from '@mui/icons-material/Email'
import Lock from '@mui/icons-material/Lock';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Collapse, Container } from '@mui/material';

import LoginForm from '../Components/Forms/LoginForm'

const theme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#6200EE',
        dark: '#002884',
        contrastText: '#fff',
      }
    }
  });

const Login = () => {


    return (
        <div>
            <ThemeProvider theme={theme}>
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
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1, mb: 0 }}
                    >
                        CREATE ACCOUNT
                    </Button>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default Login;
