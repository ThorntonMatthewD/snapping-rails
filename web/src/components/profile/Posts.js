import {
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useFetch from "use-http";

const columns = [
  {
    field: "created_at",
    headerName: "Created At",
    flex: 1,
    editable: false,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    editable: false,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    editable: false,
  },
  {
    field: "lat",
    headerName: "Latitude",
    type: "number",
    flex: 1,
    editable: false,
  },
  {
    field: "long",
    headerName: "Longitude",
    type: "number",
    flex: 1,
    editable: false,
  },
  {
    field: "media_url",
    headerName: "URL",
    description: "This column has a value getter and is not sortable.",
    flex: 3,
    editable: false,
  },
];

const Posts = ({ username }) => {
  let { data: markers = [], loading } = useFetch(
    "http://localhost:8000/api/markers?author=" + username,
    { cachePolicy: "no-cache" },
    []
  );

  return (
    <Paper>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <h1 style={{ m: 3 }}>Loading yours posts...</h1>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h2" sx={{ color: "white" }}>
        {username}'s Posts
      </Typography>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "90vh", padding: 10 }}
      >
        <DataGrid
          sx={{ width: "100%", mt: 3 }}
          rows={markers || []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Grid>
    </Paper>
  );
};

export default Posts;
