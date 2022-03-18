import { Box, Typography } from "@mui/material";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

const MapMarker = ({ marker }) => {
  const markerIconURLs = {
    1: require("../assets/images/marker-icons/photo.png"),
    2: require("../assets/images/marker-icons/video.png"),
    3: require("../assets/images/marker-icons/history.png"),
    4: require("../assets/images/marker-icons/calendar.png"),
    5: require("../assets/images/marker-icons/community.png"),
  };

  const LeafIcon = Icon.extend({
    options: {},
  });

  const markerIcon = new LeafIcon({
    iconUrl: markerIconURLs[marker["marker_type"]],
    iconSize: [40, 48],
    iconAnchor: [10, 48],
    popupAnchor: [10, -48],
  });

  return (
    <Marker position={[marker.lat, marker.long]} icon={markerIcon}>
      <Popup>
        <Typography>{marker.title}</Typography>
        <Typography>Description: {marker.description}</Typography>
        <Typography>
          Created At: {new Date(marker.created_at).toString()}
        </Typography>
        <div style={{ textAlign: "center" }}>
          <a href={marker.media_url} target="_blank" rel="noreferrer">
            <Box
              component="img"
              sx={{
                height: "auto",
                width: "100%",
                maxHeight: { xs: 120, md: 240 },
                maxWidth: { xs: 120, md: 240 },
                minHeight: { xs: 90, md: 180 },
                minWidth: { xs: 90, md: 180 },
                mr: 2,
                alignContent: "center",
              }}
              alt={marker.description}
              src={marker.img_url}
            />
          </a>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
