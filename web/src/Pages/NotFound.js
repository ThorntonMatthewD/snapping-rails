import { Container, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Container className="Content-body">
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '80vh' }}
            >
                <Typography variant="h1">404</Typography>
                <h2>Looks like you're lost.</h2>
                <h4>I hope you can find your way back okay.</h4>
                <Link to="/">If you click me I might be able to help.</Link>

                <img src="https://c.tenor.com/2hyJ9UpLshQAAAAC/train-wreck-accident.gif" alt="Train falling into a ravine and exploding." />
            </Grid>
            
        </Container>
    );
}

export default NotFound;