import { useCallback, useMemo, useRef, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import * as L from 'leaflet'

const DraggableMarker = ({ center }) => {
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
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])

    const LeafIcon = L.Icon.extend({
        options: {}
      });

    const draggableIcon = new LeafIcon({
        iconUrl:
        "https://icon-library.com/images/steam-locomotive-icon/steam-locomotive-icon-4.jpg"
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
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'Choo choo!'
              : 'Click here to make marker draggable'}
          </span>
        </Popup>
      </Marker>
    )
}

export default DraggableMarker;