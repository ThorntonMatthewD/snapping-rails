import { Box, Typography } from "@mui/material";

const About = () => {

    return (
        <Box className="Content-body" maxWidth="sm">
            <Typography variant="h2">About Snapping Rails</Typography>
            <Box id="article" sx={{textAlign: "left", mt: 5}}>
                Snapping Rails exists to provide a platform for those who love the history of the world's many railroads, and who are excited for their futures.
                <br/><br/>
                In the United States, the railroads catalyzed the expansion of our nation and the placements and layouts of our towns and cities are largely
                a result of their presence. Learning about the railroads is a way to learn about our own histories, and to build a sense of place in our hometowns.
                <br/><br/>
                As time moves forward I believe rail-based transportation and logistics will become ever more critical, and I cannot wait to see railways
                be expanded and popularized-- especially for passenger traffic once more. 
                <br/><br/>
                I want this platform to serve the railfanning community in cataloging
                their exploits out on the high iron as they snap coveted shops of various locomotives and equipment. This will be an attempt to drive
                enthusiasm for what I personally deem to be a most worthwhile hobby, and to act as a place to connect with others that share our passion
                for trains.
                <br/><br/>
                I am honored to have you here as a guest, and I hope that you enjoy Snapping Rails!
                <br/><br/>
                God Bless,
                <br/><br/>
                Matt
            </Box>
       </Box>
    );
}

export default About;