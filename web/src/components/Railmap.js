import "../assets/styles/Railmap.css";

import * as React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Alert, Collapse, Backdrop, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

import useFetch from "../hooks/useFetch";
import MapMarker from "./Marker";
import AddMarkerFab from "./AddMarkerFab";
import DraggableMarker from "./RailmapDraggableMarker";
import MarkerModal from "./MarkerModal";

const Railmap = () => {
  const [refetchData, setRefetchData] = useState(false);
  let {
    data: markers,
    error,
    isPending,
    performRequest,
  } = useFetch("/markers", refetchData, "GET", false, null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [draggableMarker, setDraggableMaker] = useState(false);
  const [draggableMarkerLocation, setDraggableMarkerLocation] = useState([]);

  const [map, setMap] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [addMarkerButNoLogin, setAddMarkerButNoLogin] = useState(false);

  useEffect(() => {
    performRequest();
  }, [refetchData, performRequest]);

  const getMapCenter = () => {
    return map.getCenter();
  };

  const finalizeNewMarker = () => {
    setDraggableMaker(false);
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
        open={isPending}
      >
        <h1 style={{ m: 3 }}>Loading the Rail Manifest...</h1>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Collapse
        in={error != null}
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
        in={draggableMarker === true}
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers &&
          markers.map((marker) => (
            <MapMarker key={marker.id} marker={marker}></MapMarker>
          ))}

        {draggableMarker && (
          <DraggableMarker
            center={getMapCenter()}
            onFinalPlacement={handleModalOpen}
            updateLocation={setDraggableMarkerLocation}
            setMarkerVisibility={setDraggableMaker}
          />
        )}

        <AddMarkerFab
          onFabClick={() => {
            setDraggableMaker(true);
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
