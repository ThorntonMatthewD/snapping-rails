import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MapLegend = () => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const legend = L.control({ position: "bottomleft" });

      const markersTypes = [
        {
          label: "Photo",
          img: require("../../assets/images/marker-icons/photo.png"),
        },
        {
          label: "Video",
          img: require("../../assets/images/marker-icons/video.png"),
        },
        {
          label: "History",
          img: require("../../assets/images/marker-icons/history.png"),
        },
        {
          label: "Event",
          img: require("../../assets/images/marker-icons/calendar.png"),
        },
        {
          label: "Venue",
          img: require("../../assets/images/marker-icons/community.png"),
        },
      ];

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");

        let labels = [];

        for (let i = 0; i < markersTypes.length; i++) {
          labels.push(
            '<img src="' +
              markersTypes[i].img +
              '"> <h4>' +
              markersTypes[i].label +
              "</h4>"
          );
        }

        div.innerHTML = labels.join("<br>");
        return div;
      };

      legend.addTo(map);
    }
  }, []);
  return null;
};

export default MapLegend;
