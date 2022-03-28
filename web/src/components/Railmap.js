import "../assets/styles/Railmap.css";

import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import { Alert, Collapse, Backdrop, CircularProgress } from "@mui/material";
import { isEmpty } from "lodash";
import useFetch from "use-http";

import MapMarker from "./MapMarker";
import AddMarkerFab from "./AddMarkerFab";
import DraggableMarker from "./RailmapDraggableMarker";
import MarkerModal from "./MarkerModal";
import useAuth from "../hooks/useAuth";

const Railmap = () => {
  const { user } = useAuth();

  const [refetchData, setRefetchData] = useState(false);
  let {
    data: markers = [],
    error,
    loading,
  } = useFetch("http://localhost:8000/api/markers", {}, [refetchData]);

  const [searchParams] = useSearchParams();

  const [draggableMarkerLocation, setDraggableMarkerLocation] = useState([]);
  const [map, setMap] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [addMarkerButNoLogin, setAddMarkerButNoLogin] = useState(false);

  const getMapCenter = () => {
    return map.getCenter();
  };

  const finalizeNewMarker = () => {
    setDraggableMarkerLocation([]);
    setRefetchData(!refetchData);
  };

  const goToParamsLocation = (railmap) => {
    let lastLocation = [searchParams.get("lat"), searchParams.get("lng")];
    lastLocation = lastLocation.map(parseFloat);

    if (lastLocation.includes(null) || lastLocation.includes(NaN)) {
      return;
    }

    if (lastLocation.length === 2) {
      railmap.flyTo(lastLocation);
    }

    return;
  };

  return (
    <div className="map-wrapper">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <h1 style={{ m: 3 }}>Loading the Rail Ledger...</h1>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Collapse
        in={error}
        style={{
          position: "absolute",
          zIndex: 100,
          marginTop: 10,
          bottom: "12%",
          maxWidth: "80vw",
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          Map markers could not be loaded. Please refresh to try again, or come
          back later.
        </Alert>
      </Collapse>

      <Collapse
        in={addMarkerButNoLogin}
        style={{
          position: "absolute",
          zIndex: 100,
          marginTop: 10,
          bottom: "12%",
          maxWidth: "80vw",
        }}
      >
        <Alert severity="error" sx={{ mb: 2, color: "white" }}>
          You need to login or create an account in order to add a marker.{" "}
          <Link to="/login">Click here to do so.</Link>
        </Alert>
      </Collapse>

      <Collapse
        in={!isEmpty(draggableMarkerLocation)}
        style={{
          position: "absolute",
          zIndex: 100,
          bottom: "12%",
          maxWidth: "80vw",
        }}
      >
        <Alert severity="success" sx={{ mb: 2 }}>
          Edit Mode: Drag the train to where you'd like to place a marker.
        </Alert>
      </Collapse>

      <MapContainer
        center={[34.858377, -82.413944]}
        zoom={13}
        whenCreated={(e) => setMap(e)}
        whenReady={(e) => goToParamsLocation(e.target)}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
      >
        <TileLayer
          noWrap={true}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer
          noWrap={true}
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; 
            <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
        />

        {markers &&
          markers?.map((marker) => (
            <MapMarker key={marker.id} marker={marker}></MapMarker>
          ))}

        {!isEmpty(draggableMarkerLocation) && user && (
          <DraggableMarker
            center={getMapCenter()}
            onFinalPlacement={handleModalOpen}
            updateLocation={setDraggableMarkerLocation}
          />
        )}

        <AddMarkerFab
          onFabClick={() => {
            setDraggableMarkerLocation(getMapCenter());
          }}
          onFabClickNoLogin={() => {
            setAddMarkerButNoLogin(true);
          }}
        />
      </MapContainer>

      <MarkerModal
        open={modalOpen}
        handleClose={handleModalClose}
        markerLocation={draggableMarkerLocation}
        refreshMap={finalizeNewMarker}
      />
    </div>
  );
};

export default Railmap;
