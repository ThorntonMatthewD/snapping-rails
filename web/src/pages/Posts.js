import { useState } from "react";
import { Backdrop, Container, CircularProgress, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useFetch from "../hooks/useFetch";
import useAuth from "../hooks/useAuth";

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

let markers = [];

const Posts = () => {
  const [refetchData, setRefetchData] = useState(false);
  const [urlParams, setUrlParams] = useState("");
  const { user } = useAuth();

  let {
    data: markers,
    error,
    isPending,
  } = useFetch("http://localhost:5000/markers", refetchData, "author_id=1");

  return (
    <Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isPending}
      >
        <h1 style={{ m: 3 }}>Loading yours posts...</h1>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "90vh", width: "100%" }}
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
    </Container>
  );
};

export default Posts;
