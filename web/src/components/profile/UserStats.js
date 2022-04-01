import { Paper, Typography } from "@mui/material";

const UserStats = () => {
  return (
    <Paper sx={{ minHeight: "50vh" }}>
      <Typography variant="h2">I have seen at least 2 trains!</Typography>
      <Typography variant="h5">Maybe even 3</Typography>
    </Paper>
  );
};

export default UserStats;
