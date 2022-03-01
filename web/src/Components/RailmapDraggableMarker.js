import { useCallback, useMemo, useRef, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import * as L from 'leaflet'
import { Button } from '@mui/material'

const DraggableMarker = ({ center, onFinalPlacement, updateLocation, setMarkerVisibility }) => {
    const [beenClicked, setBeenClicked] = useState(false);
    const [position, setPosition] = useState(center)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
    const finalizePlacement = () => {
      updateLocation(position);
      onFinalPlacement();
    }

    const onMarkerInteraction = useCallback(() => {
      setBeenClicked((d) => true)
    }, [])

    const disableMarker = () => {
      setMarkerVisibility(false);
    }

    const LeafIcon = L.Icon.extend({
        options: {}
      });

    const draggableIcon = new LeafIcon({
        iconUrl: "https://raw.githubusercontent.com/ThorntonMatthewD/snapping-rails/master/web/src/Assets/Images/sl-icon.png",
        shadowUrl: "https://raw.githubusercontent.com/ThorntonMatthewD/snapping-rails/master/web/src/Assets/Images/sl-icon-shadow.png",
        iconSize: [64, 64],
        shadowSize: [64, 64],
        iconAnchor: [22,58],
        shadowAnchor: [10, 45],
        popupAnchor: [10, -48]
    });
  
    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position.wrap()}
        icon={draggableIcon}
        onClick={onMarkerInteraction}
        ref={markerRef}
        >
          <Popup minWidth={90}>
            <span className="dragMarkContainer">
              {!beenClicked ? 
                  (
                    <div><h2>Is this where you want your marker?</h2><br/>
                    <h3>You can keep dragging the marker until you hit 'Confirm Placement'. Hit 'Remove Marker' to delete it.</h3><br/>
                      <Button className="dragMarkBtn" variant="contained" onClick={ finalizePlacement } color="success">Confirm Placement</Button>
                      <Button className="dragMarkBtn" variant="contained" onClick={ disableMarker } color="error">Remove Marker</Button>
                    </div>
                  ) : 
                  (
                    <div>
                      <h3>Drag this locomotive where you want to place a marker.</h3>
                    </div>
                  )
              }
            </span>
          </Popup>
      </Marker>
    )
}

export default DraggableMarker;