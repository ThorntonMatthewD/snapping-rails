import { useCallback, useMemo, useRef, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import * as L from 'leaflet'
import { Button } from '@mui/material'

const DraggableMarker = ({ center, onFinalPlacement, updateLocation }) => {
    const [draggable, setDraggable] = useState(true)
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
      disableDraggable()
      updateLocation(position)
      onFinalPlacement()
    }
    const disableDraggable = useCallback(() => {
      setDraggable((d) => false)
    }, [])

    const LeafIcon = L.Icon.extend({
        options: {}
      });

    const draggableIcon = new LeafIcon({
        iconUrl: "https://raw.githubusercontent.com/ThorntonMatthewD/snapping-rails/draggable-marker/web/src/Assets/Images/sl-icon.png",
        shadowUrl: "https://raw.githubusercontent.com/ThorntonMatthewD/snapping-rails/draggable-marker/web/src/Assets/Images/sl-icon-shadow.png",
        iconSize: [64, 64],
        shadowSize: [64, 64],
        iconAnchor: [22,58],
        shadowAnchor: [10, 45],
        popupAnchor: [10, -48]
    });
  
    return (
      <Marker
        iconUrl='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
        shadowUrl='https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png'
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={position}
        icon={draggableIcon}
        ref={markerRef}>
        { draggable &&<Popup minWidth={90}>
          <span>
            <div>Is this where you want your marker?<br/><Button variant="contained" onClick={finalizePlacement}>Confirm</Button></div>
          </span>
        </Popup> }
      </Marker>
    )
}

export default DraggableMarker;